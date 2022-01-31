export const staticBundleChildVariant = {
  key: 'static-bundle-child-variant',
  name: 'StaticBundleChildVariant',
  description: 'The product variant included in a static bundle',
  classifier: 'Complex',
  attributes: [
    {
      name: 'quantity',
      label: {
        en: 'Quantity',
      },
      type: { name: 'number' },
      isRequired: true,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
      displayGroup: 'Other'
    },
    {
      name: 'sku',
      label: {
        en: 'SKU',
      },
      type: { name: 'text' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
      displayGroup: 'Other'
    },
    {
      name: 'variant-id',
      label: {
        en: 'Variant ID',
      },
      type: { name: 'number' },
      isRequired: true,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
      displayGroup: 'Other'
    },
    {
      name: 'product-ref',
      label: {
        en: 'Product',
      },
      type: { name: 'reference', referenceTypeId: 'product' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
      displayGroup: 'Other'
    },
    {
      name: 'product-name',
      label: {
        en: 'Product Name',
      },
      type: { name: 'ltext' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
      displayGroup: 'Other'
    },
  ],
};

export default staticBundleChildVariant;
