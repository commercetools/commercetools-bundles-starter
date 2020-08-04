# Static Bundles

## Overview

The static bundles solution handles the concept of putting together multiple
related products for a total-sum price. An example static bundle is selling a
camera, bag, and SD card for a single bundled price. The customer purchases a
single bundle and then receives two or more distinct inventory items as selected
by merchandising.

This process is achieved by creating a new product with a specific
[type](https://docs.commercetools.com/http-api-projects-productTypes) that
references all the items within the bundle. On adding this new item to the cart,
an
[API extension](https://github.com/commercetools/platform-extension-static-bundles)
is executed for cart requests to manage the child items during checkout. The
final order includes the bundle items with pricing and a list of child line
items for fulfillment.

The Merchant Center
[custom application](https://docs.commercetools.com/custom-applications/) in
this solution assists merchandisers in creating and managing static bundles.
