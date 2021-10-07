# Dynamic Bundles API Extension Starter

This starter sample extension provides API-level support for dynamic bundle products.  It is meant to be a starter for dynamic cart flows and should require further implementation for custom dynamic bundle cart flow.  The dynamic bundles solution requires a custom UI and cart flow backend for addition of the user chosen line items to the cart.  Note that this sample extension may not be needed in a custom cart flow for Dynamic bundles.  This sample includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

### Running locally
1. Create a config file similar to `example.env` and name it `default.env` or `development.env`. This can be [done also with terraform](./dynamic-bundles-definitions/terraform).
1. Create dynamic bundles [product types](./dynamic-bundles-definitions/resourceDefinitions/productTypes) and [types](./dynamic-bundles-definitions/resourceDefinitions/types) in the CTP project. This can be [done also with terraform](./dynamic-bundles-definitions/terraform).
1. Build platform-extension-bundles and platform-extension-core. To do this run `yarn` and then `yarn build` from platform-extension-dynamic-bundles/platform-extension-bundles and platform-extension-dynamic-bundles/platform-extension-core.
1. Build platform-extension-dynamic-bundles using `yarn` and then `yarn build`.
1. Run the app with `yarn start`.

### Deployment
`yarn run "build:prod"` from the dynamic bundle root folder. Deploy the build from the dist/ folder. Deploying to AWS lambda is the recommended option.
https://docs.commercetools.com/api/projects/api-extensions
