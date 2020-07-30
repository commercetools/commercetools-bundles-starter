import { defineMessages } from 'react-intl';

export default defineMessages({
  bundlePricingTitle: {
    id: 'DynamicBundle.form.pricing.title',
    description: 'Title for bundle pricing field',
    defaultMessage: 'Pricing',
  },
  bundleDynamicPriceTitle: {
    id: 'DynamicBundle.form.dynamicPrice.title',
    description: 'Title for bundle dynamic price field',
    defaultMessage: 'Dynamic Price',
  },
  bundleQuantityTitle: {
    id: 'DynamicBundle.form.quantity.title',
    description: 'Title for bundle quantity fields',
    defaultMessage: 'Quantity',
  },
  bundleMinQuantityPlaceholder: {
    id: 'DynamicBundle.form.minQuantity.placeholder',
    description: 'Placeholder for bundle min quantity field',
    defaultMessage: 'Minimum',
  },
  bundleMaxQuantityPlaceholder: {
    id: 'DynamicBundle.form.maxQuantity.placeholder',
    description: 'Placeholder for bundle max quantity field',
    defaultMessage: 'Maximum',
  },
  bundleCategoriesTitle: {
    id: 'DynamicBundle.form.categories.title',
    description: 'Title for bundle products field',
    defaultMessage: 'Product Categories',
  },
  bundleCategoriesDescription: {
    id: 'DynamicBundle.form.categories.description',
    description: 'Description for bundle products field',
    defaultMessage: 'Select categories with quantity to include in bundle.',
  },
  quantityError: {
    id: 'DynamicBundle.form.errors.quantity.one',
    description: 'Error message for quantity',
    defaultMessage: 'Quantity must be 1 or greater.',
  },
  zeroQuantityError: {
    id: 'DynamicBundle.form.errors.quantity.zero',
    description: 'Error message for quantity',
    defaultMessage: 'Quantity must be 0 or greater.',
  },
  integerError: {
    id: 'DynamicBundle.form.errors.integer',
    description: 'Error message for quantity as an integer',
    defaultMessage: 'Quantity must be an integer.',
  },
  maxGreaterThanMinError: {
    id: 'DynamicBundle.form.errors.maxGreaterThanMin',
    description: 'Error message for maximum quantity',
    defaultMessage: 'Maximum quantity must exceed minimum quantity.',
  },
  missingRequiredField: {
    id: 'DynamicBundle.form.errors.missingRequiredField',
    description: 'Error message for missing required value',
    defaultMessage: 'This field is required. Provide a value.',
  },
});
