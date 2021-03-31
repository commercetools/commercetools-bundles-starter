# Bundles Development Accelerator (Custom Applications)

## Installation

Simply run `yarn` from the repository root to install the application's
dependencies.

The application has a dependency on the private package
`@commercetools-us-ps/mc-app-core`, which requires an
[npm auth token](https://docs.npmjs.com/about-authentication-tokens). To acquire
an auth token, request access to the `@commercetools-us-ps` scope from the US
Professional Services team.
[Create](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) the
auth token then run the following commands to configure npm. This will allow the
installation of the private package.

```shell
export NPM_TOKEN=xxxx-xxxx-xxxx-xxxx
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
```
Run `yarn` from the root folder after insuring you are using the latest version of node.

### Running the Application

At the root of the repository, run `yarn`. To run an application locally, navigate to the application directory and `yarn run start`.
Be sure to deploy the cloud function 'platform-extension-static-bundles'. Please see the README found under the extension package which covers the "Simple Bundles API Extension".

### Troubleshooting

#### `graphql_error.invalid_token` error
Log out of [Merchant Center](https://mc.us-central1.gcp.commercetools.com). Log back in, then return to the custom application and reload.

### Do's and Don'ts

* **Don't** use the application login to authenticate. **Do** make sure you are logged in to Merchant Center before developing or running a custom application.
