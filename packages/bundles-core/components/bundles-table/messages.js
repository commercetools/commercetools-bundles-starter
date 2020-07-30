import { defineMessages } from 'react-intl';

export default defineMessages({
  errorLoadingTitle: {
    id: 'BundlesTable.Error.loading.title',
    description:
      'Error title when querying for products of bundle productType fails',
    defaultMessage: 'Something went wrong loading the product bundles.',
  },
  errorNoResultsTitle: {
    id: 'BundlesTable.Error.noResults.title',
    description: 'Error title when no results are returned',
    defaultMessage: 'No bundles found on this project.',
  },
  errorNoSearchResultsTitle: {
    id: 'BundlesTable.Error.noSearchResults.title',
    description: 'Error title when no search results are returned',
    defaultMessage: 'No bundles found matching the search term and/or filters.',
  },
  linkToCreateBundleTitle: {
    id: 'BundlesTable.button.createBundle',
    description: 'The label for the link to the bundle creation view',
    defaultMessage: 'Create a bundle',
  },
  searchPlaceholder: {
    id: 'BundlesTable.Search.input.placeholder',
    description: 'Placeholder for search input',
    defaultMessage: 'Search by bundle name, description, slug, or sku.',
  },
  filter: {
    id: 'BundlesTable.Filter.title',
    description: 'Title for filter',
    defaultMessage: 'Filter:',
  },
});
