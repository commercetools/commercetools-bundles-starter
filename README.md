# Bundles Development Accelerator (Custom Applications)
The Bundles Development Accelerator project contains two Merchant Center custom applications for managing product bundles. 
Product bundles are several goods or services that are sold to customers as a single combined package. Bundles are presented as distinct items during the shopping experienc. They generally have a unique product display page and are offered through product listing pages or search results.  Product bundles allow for increased customer value, shopping convenience, and increased profit through larger average order value and opportunities for better inventory management.

The static bundles solution handles the concept of putting together multiple related products for a total-sum price. An example static bundle is selling a camera, bag, and SD card for a single bundled price. The customer purchases a single bundle and then receives two or more distinct inventory items as selected by merchandising.  The bundles-static package contains the static bundles Merchant Center custom application and the platform-extension-static-bundles folder contains its backend extension.

Dynamic bundles allow for more complex bundling scenarios. Dynamic bundles specify a group of products where the user can select one product variant. Common use-cases include mix-&-match offers, where a user can select six craft beers to build a six-pack or build an entire outfit choosing a shirt, jacket, pants, and tie. Another common use-case is composite products, where the user can configure the final product, for example building a computer by choosing a CPU, GPU, RAM, and HDD.
Where a static bundle points to specific SKUs, a dynamic bundle points to specific categories and stores business rules around each category. Pricing for the dynamic bundle can be a fixed amount or change based on the bundle selections. The bundles-dynamic package contains the dynamic bundles Merchant Center custom application and the backend-starter-dynamic-bundles contains starter resources for a dynamic backend.


## Installation

Simply run `yarn` from the repository root to install the application's
dependencies.

It is recommended to use the latest version of node.

### Running the Application

At the root of the repository, run `yarn`. To run an application locally, navigate to the application directory and `yarn run start`.
Be sure to deploy the cloud function 'platform-extension-static-bundles'. Please see the README found under the extension package which covers the "Simple Bundles API Extension".
Run terraform against the terraform folder in 'platform-extension-static-bundles' to setup static bundles type definitions and see the sub folder 'dynamic-bundles-definitions' for 
dynamic bundle's terraform folder and type definitions.

### Troubleshooting

#### `graphql_error.invalid_token` error
Log out of [Merchant Center](https://mc.us-central1.gcp.commercetools.com). Log back in, then return to the custom application and reload.

### Do's and Don'ts

* **Don't** use the application login to authenticate. **Do** make sure you are logged in to Merchant Center before developing or running a custom application.
