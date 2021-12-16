# Simple Bundles API Extension

This extension provides API-level support for simple bundle products. It includes definitions for a custom type and product types using the commercetools Terraform provider. On cart creation or update API calls, the component products of a bundle added to the cart are added as line items linked to the parent bundle, with appropriate quantity. Quantity is updated and line items are added/removed in subsequent calls if the parent bundles in the cart change.

For more info check the [full documentation](./docs/index.md).

## Contribution Guide

Follow the [Contribution Guide](docs/ContributionGuide.md) if you would like to run and develop the app locally.

### Deployment
`yarn run "build:prod"` from the static bundle root folder. Deploy the build from the dist/ folder. Deploying to AWS lambda is the recommended option.
https://docs.commercetools.com/api/projects/api-extensions
