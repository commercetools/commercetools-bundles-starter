# Commercetools Bundles Starter (Custom Applications)
The Commercetools Bundles starter project contains two Merchant Center custom applications for managing product bundles. 
Product bundles are several goods or services that are sold to customers as a single combined package. Bundles are presented as distinct items during the shopping experience. They generally have a unique product display page and are offered through product listing pages or search results. Product bundles allow for increased customer value, shopping convenience and increased profit through larger average order value and opportunities for better inventory management.

A traditional bundle involves removing the items from inventory, pre-packing the
items as a group, and receiving the package under a newly created SKU. The items
are no longer able to be purchased individually. This process creates a positive
customer experience and simplifies fulfillment.

An alternative option is to create a new virtual SKU that represents the bundle.
This new SKU points to all items in the bundle. After the customer purchases the
virtual SKU, the items are packaged and delivered. This solution targets these
virtual or post-pack bundles.

Check detailed documentation about static and dynamic bundles projects,

- [Bundles-static](docs/static/index.md)
- [Bundles-dynamic](docs/dynamic/index.md)

## Installation

Simply run `yarn` from the repository root to install the application's
dependencies.

It is recommended to use the latest version of node.

### Running the Application

To run an application locally, navigate to the specific application directory and follow the guide.

- [Bundles-static](packages/bundles-static/README.md)
- [Bundles-dynamic](packages/bundles-dynamic/README.md)
- [Platform-extension-static-bundles](packages/platform-extension-static-bundles/README.md)
- [Backend-starter-dynamic-bundles](packages/backend-starter-dynamic-bundles/README.md)

Be sure to deploy the cloud function 'platform-extension-static-bundles' for the static bundles solution.
Run terraform against the terraform folder in `platform-extension-static-bundles` to set up static bundles type definitions and see the sub folder 'dynamic-bundles-definitions' for 
dynamic bundle's terraform folder and type definitions.

### Troubleshooting

#### `graphql_error.invalid_token` error
Log out of [Merchant Center](https://mc.us-central1.gcp.commercetools.com). Log back in, then return to the custom application and reload.

### Do's and Don'ts

* **Don't** use the application login to authenticate. **Do** make sure you are logged in to Merchant Center before developing or running a custom application.
