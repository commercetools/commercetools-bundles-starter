# Dynamic Bundles API Extension Starter

This starter sample extension provides API-level support for dynamic bundle products.  It is meant to be a starter for dynamic cart flows and should require further implementation for custom dynamic bundle cart flow.  The dynamic bundles solution requires a custom UI and cart flow backend for addition of the user chosen line items to the cart.  This sample includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

To build: Ensure you have first built platform-extension-bundles and platform-extension-core. To do this run `yarn` and then `yarn build` from platform-extension-dynamic-bundles/platform-extension-bundles and platform-extension-dynamic-bundles/platform-extension-core.

Then: `yarn run "build:prod"` from the dynamic bundle root folder. Deploy the build from the dist/ folder.
