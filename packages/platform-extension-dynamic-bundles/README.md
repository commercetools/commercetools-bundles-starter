# Dynamic Bundles API Extension Starter Sample Code

NOTE: Dynamic Bundles requires building a custom frontend shop UI to handle the selection of products from the categories selected by the customer of the shop. The dynamic bundles checkout flow can then proceed through adding line items to the cart from the items selected by the customer. A custom backend should also be built based on customer requirements.  The custom built backend solution for dynamic bundles is not included in this repo and should be developed for the custom solution. See https://github.com/commercetools/commercetools-bundles-starter/tree/master/packages/bundles-dynamic#development and the information under docs/dynamic/index.md heading "Complete the Solution: Your Implementation Responsibilities".

We have included this package 'platform-extension-dynamic-bundles' as basic example starter code for an extension if the customer requires an extension in their custom backend flow.  The code examples in this package are similar to the extension for static bundles to add line items, but the extension may not be required for dynamic in the same format. This starter sample extension provides sample API-level support for checking dynamic bundle product types and should be extended for a backend dynamic solution.  It is meant to be a starter for dynamic cart flows and should require further implementation for custom dynamic bundle cart flow.  The dynamic bundles solution requires a custom UI and cart flow backend for addition of the user chosen line items to the cart.  Note that this sample extension (or any extension) may not be needed in a custom cart flow for Dynamic bundles.  It can be extended and integrated into an extension solution for carts checking types to add/modify line items.

This sample code includes definitions for types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle with attribute references to products are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

### Running locally
1. Create a config file similar to `example.env` and name it `default.env` or `development.env`. This can be [done also with terraform](./dynamic-bundles-definitions/terraform).
1. Create dynamic bundles [product types](./dynamic-bundles-definitions/resourceDefinitions/productTypes) and [types](./dynamic-bundles-definitions/resourceDefinitions/types) in the CTP project. This can be [done also with terraform](./dynamic-bundles-definitions/terraform).
1. Build platform-extension-bundles and platform-extension-core. To do this run `yarn` and then `yarn build` from platform-extension-dynamic-bundles/platform-extension-bundles and platform-extension-dynamic-bundles/platform-extension-core.
1. Build platform-extension-dynamic-bundles using `yarn` and then `yarn build`.
1. Run the app with `yarn start`.

### Deployment
`yarn run "build:prod"` from the dynamic bundle root folder. Deploy the build from the dist/ folder. Deploying to AWS lambda is the recommended option.
https://docs.commercetools.com/api/projects/api-extensions
