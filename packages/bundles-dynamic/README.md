# Dynamic Bundle Custom Application

This custom application allows users to manage dynamic product bundles. 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Usage](#usage)
- [Development Server](#development-server)
  - [Tests](#tests)
  - [Production Build](#production-build)
  - [Deployment](#deployment)
- [Linting, formatting, and so on](#linting-formatting-and-so-on)
  - [Formatting Code](#formatting-code)
  - [Git Hooks](#git-hooks)
  - [Linting GraphQL Queries](#linting-graphql-queries)
  - [Generating GraphQL Schema](#generating-graphql-schema)
- [Development](#development)
  - [Retrieving Bundle Information](#retrieving-bundle-information)
    - [GraphQL](#graphql)
      - [Parameters](#parameters)
    - [HTTP Request](#http-request)
      - [Parameters](#parameters-1)
    - [Examples](#examples)
  - [Retrieving Product Variants for Bundle Categories](#retrieving-product-variants-for-bundle-categories)
    - [Endpoint](#endpoint)
    - [Parameters](#parameters-2)
    - [Examples](#examples-1)
  - [Creating a Cart with a Bundle](#creating-a-cart-with-a-bundle)
    - [Cart Draft](#cart-draft)
    - [Parameters](#parameters-3)
    - [Examples](#examples-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

## Development Server

Run the following command to start the development server and launch the application:

```bash
$ yarn start
```

### Tests

Run the following command to run the tests:

```bash
$ yarn test
$ yarn test:watch
```

### Production Build

Run the following command to build the production bundles with webpack:

```bash
$ yarn build
```

### Deployment

The production deployments can be built with `mc-script compile-html`. 

Please check for deployment examples documentation [here](https://docs.commercetools.com/custom-applications/deployment-examples).
 
 NOTE: Be sure to set the env vars for the placeholders in [custom-application-config.mjs](https://github.com/commercetools/commercetools-bundles-starter/tree/master/packages/bundles-dynamic/custom-application-config.mjs).
- Example: For AWS deployment, env variables can be set using the file [env.aws](.env.aws). For other deployments, duplicate the file and set values accordingly.

For more information on how to use .env files, check [official documentation](https://docs.commercetools.com/custom-applications/api-reference/cli#using-dotenv-files).

## Linting, formatting, and so on

### Formatting Code

Run the following command to format JS, CSS, JSON and GraphQL files

```bash
$ yarn format
```

### Git Hooks

Git hooks are configured using [Husky](https://github.com/typicode/husky/blob/master/DOCS.md). The root workspace
runs all workspace hooks using Lerna ([example repository](https://github.com/sudo-suhas/lint-staged-multi-pkg)). The
hooks are configured as follows:

* **Pre-commit**: JS, CSS, and GraphQL files are linted (ESLint/Stylelint) and formatted (Prettier). Fixes are 
automatically added to Git.
* **Commit Message**: Commit messages are linted against the [conventional commit format](https://www.conventionalcommits.org) 
using commitlint

### Linting GraphQL Queries

A pre-requisite for linting GraphQL queries is generating a `schema.graphql` file, which contains the Types exposed by CTP API. 
Every time that the API introduces new Types, Queries or Mutations, the local `schema.graphql` must be updated.

### Generating GraphQL Schema

1. If you haven't done so already, create an API client under `Settings -> Developer Settings` in Merchant Center for your project
2. Generate an access token using the [Client Credentials flow](https://docs.commercetools.com/http-api-authorization#client-credentials-flow)
3. Export both your Merchant Center project key and generated access token as environment variables
4. Retrieve schema with `graphql-cli`

```bash
$ export PROJECT_KEY={project_key}
$ export AUTH_TOKEN={access_token}
$ npx graphql-cli get-schema
 ```

## Development

### Retrieving Bundle Information

To retrieve a bundle's information, either the commercetools GraphQL API or HTTP API can be utilized.

#### GraphQL

[Product Query](https://docs.commercetools.com/graphql-api.html#supported-entities)

```graphql
query GetBundle(
  $id: String!
  $currency: Currency!
  $country: Country
  $customerGroup: String
  $channel: String
  $date: DateTime
) {
  product(id: $id) {
    id
    key
    version
    masterData {
      published
      hasStagedChanges
      current {
        nameAllLocales {
          locale
          value
        }
        descriptionAllLocales {
          locale
          value
        }
        masterVariant {
          sku
          attributesRaw {
            name
            value
          }
          images {
            url
            label
          }
          price(
            currency: $currency
            country: $country
            customerGroupId: $customerGroup
            channelId: $channel
            date: $date
          ) {
            value {
              type
              currencyCode
              centAmount
              fractionDigits
            }
          }
        }
      }
    }
  }
}
```

Results can be transformed for easier display purposes. See `transformResults` method in the 
[Dynamic Bundle Details](src/components/bundle-details/dynamic-bundle-details.js) component.

##### Parameters

- `id` - Bundle ID
- [Price Selection](https://docs.commercetools.com/http-api-projects-products.html#price-selection)
    - `currency` - Required
    - `country`
    - `customerGroup`
    - `channel`
    - `date`
    
#### HTTP Request

[Get Product Projection by ID](https://docs.commercetools.com/http-api-projects-productProjections#get-productprojection-by-id)

```http request
GET /{{projectKey}}/product-projections/{{id}}?priceCurrency={{priceCurrency}}&priceCountry={{priceCountry}}&priceCustomerGroup={{priceCustomerGroup}}&priceChannel={{priceChannel}}&priceDate={{priceDate}}
```

##### Parameters

- `id` - Bundle ID
- [Price Selection](https://docs.commercetools.com/http-api-projects-products.html#price-selection): Include only those 
with non-null values
    - `priceCurrency` - Required
    - `priceCountry`
    - `priceCustomerGroup`
    - `priceChannel`
    - `priceDate`

#### Examples

[Bundle Details](../bundles-core/components/bundle-details/bundle-details.js) - Retrieves bundle information.

[Dynamic Bundle Details](src/components/bundle-details/dynamic-bundle-details.js) - Transforms bundle results.

[Bundle Preview](src/components/bundle-preview/bundle-preview.js) - Sample bundle detail page. 

**Pricing Assumptions**

In the above [example]((src/components/bundle-preview/bundle-preview.js)), for statically priced bundles, bundle 
categories flagged with the additional charge attribute have their selected variant's scoped priced (multiplied by the
corresponding quantity) added to the bundle's base price for the bundle's total price. For dynamically priced bundles, 
selected variants' scoped prices (multiplied by corresponding quantities) are summed to obtain the bundle's total price.

### Retrieving Product Variants for Bundle Categories

The following endpoint can be used to populate an asynchronous, searchable select input that displays product variants 
for a specific category subtree.

#### Endpoint

[Product Projection Search](https://docs.commercetools.com/http-api-projects-products-search#search-productprojections)

```http request
GET /product-projections/search?text.{{language}}={{text}}&filter=categories.id: subtree("{{categoryId}}")&priceCurrency={{priceCurrency}}&priceCountry={{priceCountry}}&priceCustomerGroup={{priceCustomerGroup}}&priceChannel={{priceChannel}}&priceDate={{priceDate}}
```

#### Parameters

- Search
    - `language` - Current browser or site language 
    - `text` - Text entered by user
- `categoryId` - A bundle category ID populated in `DynamicBundleChildCategory` product type's `category-ref` attribute
- [Price Selection](https://docs.commercetools.com/http-api-projects-products.html#price-selection): Include only those 
with non-null values
    - `priceCurrency` - Required
    - `priceCountry`
    - `priceCustomerGroup`
    - `priceChannel`
    - `priceDate`
    
#### Examples
[Category Product Field](src/components/bundle-preview/category-product-field.js) - Form field with product variant 
select input and quantity input.

[Product Search Input](../core/components/product-search-input/product-search-input.js) - Product variant select input 
populated by endpoint above. Displays scoped price when price filters are used.

### Creating a Cart with a Bundle

Creating a cart with a bundle can be accomplished using either the commercetools GraphQL API or HTTP API.

#### Cart Draft
```
{
  "currency": {{currency}},
  "lineItems": [
    {
      "productId": {{id}},
      "quantity": 1
    },
    {
      productId: {{selection.productId}},
      variantId: {{selection.variantId}},
      quantity: {{selection.quantity}},
      custom: {
        type: {
          key: "dynamic-bundle-parent-child-link"
        }
      }
    }
    ...
  ]
}
```

#### Parameters

- `currency` - Current customer currency
- `id` - The ID of the bundle
- Category Selections: Each selection is added to the cart draft as a line item with the following parameters:
    - `productId` - Required
    - `variantId` - Required
    - `quantity`

#### Examples
[Bundle Preview](src/components/bundle-preview/bundle-preview.js) - Cart creation on form submission
