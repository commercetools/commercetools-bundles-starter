import { defineMessages } from 'react-intl';

export default defineMessages({
  configureCustomerTitle: {
    id: 'BundlePreview.title.configureCustomer',
    description: 'Title for configure customer section',
    defaultMessage: 'Configure Customer',
  },
  startingAt: {
    id: 'BundlePreview.text.startingUp',
    description: 'Text for starting at label',
    defaultMessage: 'Starting at',
  },
  upTo: {
    id: 'BundlePreview.text.upTo',
    description: 'Text for up to label',
    defaultMessage: 'Up to',
  },
  projection: {
    id: 'BundlePreview.title.projection',
    description: 'Title for projection selection',
    defaultMessage: 'Projection:',
  },
  current: {
    id: 'BundlePreview.label.current',
    description: 'Label for current projection',
    defaultMessage: 'Current',
  },
  staged: {
    id: 'BundlePreview.label.staged',
    description: 'Label for staged projection',
    defaultMessage: 'Staged',
  },
  noDescription: {
    id: 'BundlePreview.text.noDescription',
    description: 'Text for no description',
    defaultMessage: 'No description provided',
  },
  additionalCharge: {
    id: 'BundlePreview.form.label.additionalCharge',
    description: 'Label for additional charge',
    defaultMessage: 'Additional Charge',
  },
  basePrice: {
    id: 'BundlePreview.form.label.basePrice',
    description: 'Label for base price',
    defaultMessage: 'Base Price',
  },
  totalPrice: {
    id: 'BundlePreview.form.label.totalPrice',
    description: 'Label for total price',
    defaultMessage: 'Total Price',
  },
  categoryPlaceholder: {
    id: 'BundlePreview.form.placeholder.category',
    description: 'Placeholder for category field',
    defaultMessage: 'Search by name, description, slug, or sku.',
  },
  quantityPlaceholder: {
    id: 'BundlePreview.form.placeholder.quantity',
    description: 'Placeholder for quantity field',
    defaultMessage: 'Quantity',
  },
  productRequiredError: {
    id: 'BundlePreview.form.errors.product.required',
    description: 'Error message for required product',
    defaultMessage: 'Product selection required.',
  },
  quantityRequiredError: {
    id: 'BundlePreview.form.errors.quantity.required',
    description: 'Error message for required product',
    defaultMessage: 'Quantity required.',
  },
  minQuantityError: {
    id: 'BundlePreview.form.errors.quantity.min',
    description: 'Error message for quantity minimum',
    defaultMessage: 'Quantity must greater than or equal to {min}.',
  },
  maxQuantityError: {
    id: 'BundlePreview.form.errors.quantity.one',
    description: 'Error message for quantity maximum',
    defaultMessage: 'Quantity must less than or equal to {max}.',
  },
  integerError: {
    id: 'BundlePreview.form.errors.integer',
    description: 'Error message for quantity as an integer',
    defaultMessage: 'Quantity must be an integer.',
  },
  addToCart: {
    id: 'BundlePreview.form.button.submit',
    description: 'Label for the add to cart button',
    defaultMessage: 'Preview Add to Cart',
  },
  addToCartError: {
    id: 'BundlePreview.form.error.submit',
    description: 'Error message for add to cart',
    defaultMessage: 'Unable to add bundle to cart. {error}',
  },
  cartDraft: {
    id: 'BundlePreview.form.label.cartDraft',
    description: 'Label for cart draft',
    defaultMessage: 'Cart Draft',
  },
  cartCreated: {
    id: 'BundlePreview.form.label.cartCreated',
    description: 'Label for cart created',
    defaultMessage: 'Created Cart',
  },
});
