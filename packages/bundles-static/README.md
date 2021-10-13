# Bundles Custom Application

This extension allows users to manage product bundles.  

## Prerequisites

Make sure your CTP project contains bundles [product types](../platform-extension-static-bundles/resourceDefinitions/productTypes) and [types](../platform-extension-static-bundles/resourceDefinitions/types). 

Make sure your CTP project has [product search indexing enabled](https://docs.commercetools.com/api/projects/project#change-product-search-indexing-enabled). If not, use the following update action to do it:
```json
{
  "version": 1,
  "actions": [
    {
      "action": "changeProductSearchIndexingEnabled",
      "enabled": true
    }
  ]
}
```

## Start the development server

Run the following command to start the development server and launch the application:

```bash
$ yarn start
```

## Run tests

Run the following command to run the tests:

```bash
$ yarn test
$ yarn test:watch
```

## Build the production bundles

Run the following command to build the production bundles with webpack:

```bash
$ yarn build
```

## Deployment

The skeleton includes configuration for both AWS (S3 & CloudFront) and Firebase serverless deployments built with 
`mc-script compile-html`. 

- [Firebase](https://docs.commercetools.com/custom-applications/deployment/example-deployment-firebase)
- [AWS - S3 & CloudFront](https://appkit.commercetools.com/deployment/example-aws-s3-cloudfront)
 
 NOTE: Be sure to set the env vars in custom-application-config.json. Update the value for your Merchant Center URL in that config: "mcURL":"..."


## Linting, formatting, and so on

### Formatting code

Run the following command to format JS, CSS, JSON and GraphQL files

```bash
$ yarn format
```

### Git Hooks

Git hooks are configured using [Husky](https://github.com/typicode/husky/blob/master/DOCS.md). The root workspace
runs all workspace hooks using Lerna ([example repository](https://github.com/sudo-suhas/lint-staged-multi-pkg)). The
hooks are configured as follows:

* **Pre-commit**: JS, CSS, and GraphQL files are linted (ESLint/Stylelint) and formatted (Prettier). Fixes are 
automatically added to Git.
* **Commit Message**: Commit messages are linted against the [conventional commit format](https://www.conventionalcommits.org) 
using commitlint

### Linting GraphQL Queries

A pre-requisite for linting GraphQL queries is generating a `schema.graphql` file, which contains the Types exposed by CTP API. 
Every time that the API introduces new Types, Queries or Mutations, the local `schema.graphql` must be updated.

### Generating GraphQL schema

1. If you haven't done so already, create an API client under `Settings -> Developer Settings` in Merchant Center for your project
2. Generate an access token using the [Client Credentials flow](https://docs.commercetools.com/http-api-authorization#client-credentials-flow)
3. Export both your Merchant Center project key and generated access token as environment variables
4. Retrieve schema with `graphql-cli`

```bash
$ export PROJECT_KEY={project_key}
$ export AUTH_TOKEN={access_token}
$ npx graphql-cli get-schema
```


