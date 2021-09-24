# Simple Bundles API Extension

This extension provides API-level support for simple bundle products. It includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

Full documentation can be found at [https://commercetools.github.io/platform-extension-static-bundles/](https://commercetools.github.io/platform-extension-static-bundles/).

To build: Ensure you have first built platform-extension-bundles and platform-extension-core. To do this run yarn and then yarn build from platform-extension-dynamic-bundles/platform-extension-bundles and platform-extension-dynamic-bundles/platform-extension-core.

Then: yarn run "build:prod" from the dynamic bundle root folder. Deploy the build from the dist/ folder.
