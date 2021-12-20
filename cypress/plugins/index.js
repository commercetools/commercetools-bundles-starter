const customApplications = require('@commercetools-frontend/cypress/task');
const failedLog = require('cypress-failed-log/src/failed');

// plugins file
module.exports = (on, cypressConfig) => {

    on('task', {
        failed: failedLog(),
        ...customApplications,
    });

    return {
        env: {
            LOGIN_USER: 'praveen.kumar@commercetools.com',
            LOGIN_PASSWORD: '',
            PROJECT_KEY: 'bundles-test',
        },
    };
};
