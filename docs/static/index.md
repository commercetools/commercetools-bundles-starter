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

## Technology

- [ReactJS](https://reactjs.org/)
- [Apollo](https://www.apollographql.com/docs/react/) &
  [GraphQL](https://graphql.org/learn/)
- [Merchant Center Application Kit](https://docs.commercetools.com/custom-applications/)
- [UI Kit](https://uikit.commercetools.com/?path=/story/introduction--getting-started) -
  Merchant Center component library
- [Yarn](https://classic.yarnpkg.com/en/docs/getting-started) - Package manager
- [Jest](https://jestjs.io/docs/en/getting-started) - Test runner
- [Enzyme](https://enzymejs.github.io/enzyme/) - React testing utility
- [Prettier](https://prettier.io/docs/en/index.html) - Code formatter
- [ESLint](https://eslint.org/docs/user-guide/getting-started) - JS, CSS, and
  GraphQL linter

## Configuration

A
[terraform script](https://github.com/commercetools/platform-extension-static-bundles#terraform)
initializes the commercetools project for using static bundles. Prior to using
static bundles, this terraform script must be executed against the commercetools
project and will deploy:

- [Static Bundle Product Type](https://github.com/commercetools/platform-extension-static-bundles/blob/master/resourceDefinitions/productTypes/static-bundle-parent.json)
  – For creating new bundles
- [Nested Product Type](https://github.com/commercetools/platform-extension-static-bundles/blob/master/resourceDefinitions/productTypes/static-bundle-child-variant.json)
  – For managing 1...n variant references from a static bundle
- [Custom Line Item Type](https://github.com/commercetools/platform-extension-static-bundles/blob/master/resourceDefinitions/types/static-bundle-parent-child-link.json)
  – For managing cart process
