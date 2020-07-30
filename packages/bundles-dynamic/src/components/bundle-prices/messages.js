import { defineMessages } from 'react-intl';

export default defineMessages({
  staticTitle: {
    id: 'DynamicBundlePrices.title.static',
    description: 'Static bundle prices title',
    defaultMessage: 'Add prices for this bundle.',
  },
  dynamicTitle: {
    id: 'DynamicBundlePrices.title.dynamic',
    description: 'Dynamic bundle prices title',
    defaultMessage: 'View category price ranges for this bundle.',
  },
  dynamicSubtitle: {
    id: 'DynamicBundlePrices.subtitle.dynamic',
    description: 'Dynamic bundle prices title',
    defaultMessage:
      'Note: Dynamically priced bundles require a price defined for add to cart.',
  },
  viewPricesButton: {
    id: 'DynamicBundlePrices.buttons.viewPrices',
    description: 'Label for view prices button',
    defaultMessage: 'View Prices',
  },
  addPriceButton: {
    id: 'DynamicBundlePrices.buttons.addPrice',
    description: 'Label for add price button',
    defaultMessage: 'Add Price',
  },
  categoryColumn: {
    id: 'DynamicBundlePrices.table.categoryColumn',
    description: 'The label for the category column',
    defaultMessage: 'Category',
  },
  minPriceColumn: {
    id: 'DynamicBundlePrices.table.minPriceColumn',
    description: 'The label for the min price column',
    defaultMessage: 'Minimum Price',
  },
  maxPriceColumn: {
    id: 'DynamicBundlePrices.table.maxPriceColumn',
    description: 'The label for the max price column',
    defaultMessage: 'Maximum Price',
  },
});
