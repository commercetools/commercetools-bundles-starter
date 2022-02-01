export const getStaticBundleParent = function (staticBundleChildVariant) {
  return {
    key: 'static-bundle-parent',
    name: 'StaticBundleParent',
    description: 'A static bundle of product variants',
    classifier: 'Complex',
    attributes: [
      {
        name: 'products',
        label: {
          en: 'Products',
        },
        type: {
          name: 'set',
          elementType: {
            name: 'nested',
            typeReference: {
              typeId: 'product-type',
              id: staticBundleChildVariant.id
            }
          }
        },
        isRequired: false,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
        displayGroup: 'Other'
      },
      {
        name: 'productSearch',
        label: {
          en: 'Products (Search)',
        },
        type: {
          name: 'set',
          elementType: {
            name: 'text'
          }
        },
        isRequired: false,
        attributeConstraint: 'None',
        inputHint: 'SingleLine',
        isSearchable: true,
        displayGroup: 'Other'
      }
    ],
  };
};

export default getStaticBundleParent;
