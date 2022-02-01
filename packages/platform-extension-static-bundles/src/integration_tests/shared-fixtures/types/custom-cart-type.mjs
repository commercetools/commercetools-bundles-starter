export const customCartType = {
  key: 'exclude-promotions-integration-test-cart',
  name: {
    en: 'Exclude Promotions cart Type for integration tests',
  },
  description: {
    en: 'Custom fields for carts intended to be used in exclude-promotions',
  },
  resourceTypeIds: ['order'],
  fieldDefinitions: [
    {
      name: 'cartDiscountHash',
      type: {
        name: 'String',
      },
      label: {
        en: 'cartDiscountHash',
      },
      required: false,
      inputHint: 'SingleLine',
    },
    {
      name: 'childCart',
      label: {
        en: 'child cart',
      },
      required: false,
      type: {
        name: 'Reference',
        referenceTypeId: 'cart',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'parentCart',
      label: {
        en: 'parent cart',
      },
      required: false,
      type: {
        name: 'Reference',
        referenceTypeId: 'cart',
      },
      inputHint: 'SingleLine',
    },
    {
      name: 'applyCartDiscount',
      type: {
        name: 'Set',
        elementType: {
          name: 'String',
        },
      },
      label: {
        en: 'Apply to cart discount',
      },
      required: false,
      inputHint: 'SingleLine',
    },
  ],
};
export default customCartType;
