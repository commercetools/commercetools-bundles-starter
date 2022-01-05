export const integrationTestProduct = {
  key: 'exclude-promos-integration-test-product',
  name: 'Exclude Promos Integration Test Product',
  description: "Products used in exclude promos's integration tests",
  attributes: [
    {
      name: 'department',
      label: {
        en: 'Department',
      },
      type: { name: 'text' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
    },
    {
      name: 'class',
      label: {
        en: 'Class',
      },
      type: { name: 'text' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
    },

    {
      name: 'color',
      label: {
        en: 'Color',
      },
      type: { name: 'text' },
      isRequired: false,
      attributeConstraint: 'None',
      inputHint: 'SingleLine',
      isSearchable: false,
    },
  ],
};

export default integrationTestProduct;
