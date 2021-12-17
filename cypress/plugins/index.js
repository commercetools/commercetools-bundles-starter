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

const customApplications = require('@commercetools-frontend/cypress/task');
const failedLog = require('cypress-failed-log/src/failed');


function initialiseRunState() {
    return [];
}

module.exports = (on, cypressConfig) => {

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

    const runState = initialiseRunState();

    return { runState };
};
