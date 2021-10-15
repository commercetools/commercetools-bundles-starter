# Simple Bundles API Extension

This extension provides API-level support for simple bundle products. It includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

For more info check the [full documentation](./docs/index.md).

### Running locally
1. Create a config file similar to `example.env` and name it `default.env` or `development.env`. This can be [done also with terraform](./terraform).
1. Create dynamic bundles [product types](./resourceDefinitions/productTypes) and [types](./resourceDefinitions/types) in the CTP project. This can be [done also with terraform](./terraform).
1. Build platform-extension-bundles and platform-extension-core. To do this run `yarn` and then `yarn build`
   first from platform-extension-static-bundles/platform-extension-core and then from platform-extension-static-bundles/platform-extension-bundles.
1. Build platform-extension-static-bundles using `yarn` and then `yarn build`.
1. Run platform-extension-static-bundles with `yarn start`.

### Deployment
`yarn run "build:prod"` from the static bundle root folder. Deploy the build from the dist/ folder. Deploying to AWS lambda is the recommended option.
https://docs.commercetools.com/api/projects/api-extensions
