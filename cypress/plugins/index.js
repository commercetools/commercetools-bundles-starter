// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/// <reference types="cypress" />

// Reference: https://docs.cypress.io/api/plugins/configuration-api.html#Promises

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const flopflipCypressPlugin = require('@flopflip/cypress-plugin');
const customApplications = require('@commercetools-frontend/cypress/task');
const failedLog = require('cypress-failed-log/src/failed');

const downloadDirectory = path.join(__dirname, '..', 'downloads');

const findDownload = (fileName) => {
    const hasFile = fs
        .readdirSync(downloadDirectory)
        .filter((file) => file.includes(fileName));
    return hasFile;
};

const hasDownload = (fileName, ms) => {
    const delay = 10;
    return new Promise((resolve, reject) => {
        if (ms < 0) {
            return reject(
                new Error(`Could not find PDF ${downloadDirectory}/${fileName}`)
            );
        }
        const found = findDownload(fileName);
        if (found) {
            return resolve(true);
        }
        setTimeout(() => {
            hasDownload(fileName, ms - delay).then(resolve, reject);
        }, 10);
    });
};

function getConfigurationByFile(environment) {
    const pathToConfigFile = path.resolve(
        'cypress',
        'config',
        environment,
        'values.json'
    );

    const rawConfigFile = fs.readFileSync(pathToConfigFile);
    const jsonConfigFile = JSON.parse(rawConfigFile);

    return jsonConfigFile;
}
const getConfigurationOverwrites = (cypressConfig) => ({
    ...(cypressConfig.env.mcApiUrl
        ? { mcApiUrl: cypressConfig.env.mcApiUrl }
        : {}),
});
const createCypressEnv = (config) => ({
    env: config,
});
function getSecretsFromEnvFile(environment) {
    const envFileName = process.env.CI ? '.env.ci' : '.env';

    const pathToEnvFile = path.resolve(
        'cypress',
        'config',
        environment,
        envFileName
    );
    const envFileContents = fs.readFileSync(pathToEnvFile, {
        encoding: 'utf8',
    });

    if (!envFileContents) {
        // eslint-disable-next-line no-console
        console.error(
            `A ${envFileName} file for the environment '${environment}' does not exist. Please make sure it is present so that Cypress can sign in with an E2E testing account.`
        );
    }

    const parsedEnvFile = dotenv.parse(envFileContents);

    return createCypressEnv(parsedEnvFile);
}

function getSecretsByEnv(environment) {
    return getSecretsFromEnvFile(environment);
}

function initialiseRunState() {
    return [];
}

/**
 * @param `on` is used to hook into various events Cypress emits
 * @param `cypressConfig` is the resolved Cypress config
 */
module.exports = (on, cypressConfig) => {
    // accept a configFile value or use development by default
    const environment = cypressConfig.env.environment || 'ctp-gcp-production-eu';

    on('task', {
        doesDownloadExist(fileName, ms = 4000) {
            return hasDownload(fileName, ms);
        },
    });

    // handling tasks
    on('task', {
        // Sends all console logs that occur in the browser to stdout.
        // Helpful on CI to see errors also in job logs and not only in artifacts.
        // When not on CI, do nothing.
        failed: process.env.CI
            ? failedLog()
            : () => {
                return null;
            },
        ...customApplications,
    });

    flopflipCypressPlugin.install(on);

    const config = getConfigurationByFile(environment);
    const configOverwrites = getConfigurationOverwrites(cypressConfig);
    const secrets = getSecretsByEnv(environment);
    const runState = initialiseRunState();

    return { ...config, ...configOverwrites, ...secrets, runState };
};
