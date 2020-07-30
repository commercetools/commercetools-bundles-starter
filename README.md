# Bundles Custom Applications

## Installation

Prior to running `yarn`, ensure you have exported an auth token to npm in the NPM_TOKEN environment variable, e.g. `export NPM_TOKEN=xxxx-xxxx-xxxx-xxxx`  This will allow the installation of the private package (`@commercetools-us-ps/mc-app-core`).

### Running the Application

At the root of the repository, run `yarn`. To run an application locally, navigate to the application directory and `yarn run start`.

### Troubleshooting

#### `graphql_error.invalid_token` error
Log out of [Merchant Center](https://mc.commercetools.co/). Log back in, then return to the custom application and reload.

### Do's and Don'ts

* **Don't** use the application login to authenticate. **Do** make sure you are logged in to Merchant Center before developing or running a custom application.
