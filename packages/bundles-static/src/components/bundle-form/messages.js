import { defineMessages } from 'react-intl';

export default defineMessages({
  bundleProductsTitle: {
    id: 'StaticBundle.form.products.title',
    description: 'Title for bundle products field',
    defaultMessage: 'Product Variants'
  },
  bundleProductsDescription: {
    id: 'StaticBundle.form.products.description',
    description: 'Description for bundle products field',
    defaultMessage: 'Select variants with quantity to include in bundle.'
  },
  missingRequiredField: {
    id: 'StaticBundle.form.errors.missingRequiredField',
    description: 'Error message for missing required value',
    defaultMessage: 'This field is required. Provide a value.'
  },
  quantityError: {
    id: 'StaticBundle.form.errors.quantity',
    description: 'Error message for quantity',
    defaultMessage: 'Quantity must be greater than 1.'
  }
});
