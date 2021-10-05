# Dynamic Bundles API Extension Starter

NOTE: Dynamic Bundles requires building a custom frontend shop UI to handle the selection of products from the categories by the customer. This checkout flow then proceeds through adding line items to the cart from the items selected by the customer. A custom backend may also be built based on customer requirements.

We have included this package 'platform-extension-dynamic-bundles' as a simple example starter of an extension if the customer requires an extension in their custom backend flow. This starter sample extension provides sample API-level support for dynamic bundle products and may need to be extended for a backend dynamic solution.  It is meant to be a starter for dynamic cart flows and should require further implementation for custom dynamic bundle cart flow.  The dynamic bundles solution requires a custom UI and cart flow backend for addition of the user chosen line items to the cart.  Note that this sample extension may not be needed in a custom cart flow for Dynamic bundles.  This sample includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

To build: Ensure you have first built platform-extension-bundles and platform-extension-core. To do this run `yarn` and then `yarn build` from platform-extension-dynamic-bundles/platform-extension-bundles and platform-extension-dynamic-bundles/platform-extension-core.

Then: `yarn run "build:prod"` from the dynamic bundle root folder. Deploy the build from the dist/ folder. Deploying to AWS lambda is the recommended option.
https://docs.commercetools.com/api/projects/api-extensions
