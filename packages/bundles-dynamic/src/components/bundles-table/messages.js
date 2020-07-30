import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'DynamicBundlesTable.title',
    description: 'The page title of the bundles table view',
    defaultMessage: 'Dynamic Bundle Manager',
  },
  titleResults: {
    id: 'DynamicBundlesTable.title.results',
    description: 'Dynamic bundles title result total',
    defaultMessage: '{total} results',
  },
  nameColumn: {
    id: 'DynamicBundlesTable.nameColumn',
    description: 'The label for the name column',
    defaultMessage: 'Name',
  },
  statusColumn: {
    id: 'DynamicBundlesTable.statusColumn',
    description: 'The label for the status column',
    defaultMessage: 'Status',
  },
  priceColumn: {
    id: 'DynamicBundlesTable.labelPriceColumn',
    description: 'The label for the price column',
    defaultMessage: 'Price (lowest)',
  },
  lastModifiedAtColumn: {
    id: 'DynamicBundlesTable.lastModifiedAtColumn',
    description: 'The label for the last modified at column',
    defaultMessage: 'Last Modified',
  },
  dynamicValue: {
    id: 'DynamicBundlesTable.price.dynamic.label',
    description: 'The label for the dynamic price value',
    defaultMessage: 'Dynamic',
  },
  staticValue: {
    id: 'DynamicBundlesTable.price.static.label',
    description: 'The label for the static price value',
    defaultMessage: 'Static',
  },
  priceFilterPlaceholder: {
    id: 'DynamicBundlesTable.price.filter.placeholder',
    description: 'The placeholder for the price filter placeholder',
    defaultMessage: 'Price type',
  },
  categoryFilterPlaceholder: {
    id: 'DynamicBundlesTable.Filter.category.placeholder',
    description: 'Placeholder for category filter',
    defaultMessage: 'Category in bundle',
  },
});
