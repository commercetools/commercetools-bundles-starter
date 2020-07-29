import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'StaticBundlesTable.title',
    description: 'The page title of the bundles table view',
    defaultMessage: 'Product Bundle Manager'
  },
  titleResults: {
    id: 'StaticBundlesTable.title.results',
    description: 'Static bundles title result total',
    defaultMessage: '{total} results'
  },
  nameColumn: {
    id: 'StaticBundlesTable.nameColumn',
    description: 'The label for the name column',
    defaultMessage: 'Name'
  },
  productCountColumn: {
    id: 'StaticBundlesTable.productCountColumn',
    description: 'The label for the products column',
    defaultMessage: 'Number of Products'
  },
  statusColumn: {
    id: 'StaticBundlesTable.statusColumn',
    description: 'The label for the status column',
    defaultMessage: 'Status'
  },
  priceColumn: {
    id: 'StaticBundlesTable.labelPriceColumn',
    description: 'The label for the price column',
    defaultMessage: 'Price (lowest)'
  },
  lastModifiedAtColumn: {
    id: 'StaticBundlesTable.lastModifiedAtColumn',
    description: 'The label for the last modified at column',
    defaultMessage: 'Last Modified'
  },
  categoryFilterPlaceholder: {
    id: 'StaticBundlesTable.Filter.category.placeholder',
    description: 'Placeholder for category filter',
    defaultMessage: 'Category'
  },
  productFilterPlaceholder: {
    id: 'StaticBundlesTable.Filter.product.placeholder',
    description: 'Placeholder for product filter',
    defaultMessage: 'Product variants in bundle'
  }
});
