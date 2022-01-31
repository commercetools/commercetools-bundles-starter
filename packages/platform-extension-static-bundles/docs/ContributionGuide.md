<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  

- [Contribution Guide](#contribution-guide)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
    - [Running locally](#running-locally)
    - [Tests](#tests)
      - [Integration tests](#integration-tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Contribution Guide

## Prerequisites

Minimum requirements are:
 - **Node.js** version 14.
 
You can install all dependencies using `yarn` with following command:

```
yarn (or) yarn install
```

## Local Development

### Running locally
1. Create a config file similar to `example.env` and name it `default.env` or `development.env`. This can be [done also with terraform](./terraform).
1. Create static bundles [product types](./resourceDefinitions/productTypes) and [types](./resourceDefinitions/types) in the CTP project. This can be [done also with terraform](./terraform).
1. Build platform-extension-static-bundles using `yarn` and then `yarn build`.
1. Run platform-extension-static-bundles with `yarn start`.

You will need to [add the extension](https://docs.commercetools.com/http-api-projects-api-extensions) to your commercetools project.  This requires the outside internet (at least commercetools) to access the local server.  We recommend using a tool like [ngrok](https://ngrok.com/) to do so.  Additionally, you could use a tool like [Postman](https://www.postman.com/) to send requests to the local server.

### Tests

This application uses [Jest](https://jestjs.io) for its testing framework.  You may run the following command to run the tests:

To run the unit tests

```shell
yarn test:unit
```

To run the tests in watch mode:

```shell
yarn test:watch
```

To run the tests with coverage:

```shell
yarn test:coverage
```

#### Integration tests
Following additional environment variables must be provided in order to run the Integration tests.

| Name                           | Content                                                      | Required | Default                                        |
| ------------------------------ | ------------------------------------------------------------ | -------- | ---------------------------------------------  |
| `CT_PROJECT_KEY`               | The unique `key` of the commercetools project.               | YES      |                                                |
| `COMMERCETOOLS_CLIENT_ID`      | OAuth 2.0 `client_id` and can be used to obtain a token.     | YES      |                                                |
| `COMMERCETOOLS_CLIENT_SECRET`  | OAuth 2.0 `client_secret` and can be used to obtain a token. | YES      |                                                |
| `COMMERCETOOLS_SCOPES`         | The scopes used by the commercetools client.                 | YES      |                                                |
| `COMMERCETOOLS_API_URL`        | The commercetools HTTP API is hosted at that URL.            | NO       | https://api.us-central1.gcp.commercetools.com  |
| `COMMERCETOOLS_TOKEN_URL`      | The commercetools’ OAuth 2.0 service is hosted at that URL.  | NO       | https://auth.us-central1.gcp.commercetools.com |
| `PORT`                         | The port number for server.                                  | NO       | 3000                                           |

- Execute `yarn test:integration` to run Integration tests.
