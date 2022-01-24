const name = 'bundle1Pants1Shirts2Belts';

export const bundle1Pants1Shirts2Belts = {
  key: name,
  name: {
    en: name
  },
  productType: { typeId: 'product-type', key: 'static-bundle-parent' },
  slug: {
    en: name
  },
  taxCategory: {
    typeId: 'tax-category',
    key: 'integration-no-tax-usa',
  },
  masterVariant: {
    id: 1,
    sku: name,
    prices: [{
      value: {
        currencyCode: 'USD',
        centAmount: 900000
      }
    }],
    images: [],
    attributes: [],
    assets: [],
  },
  lastVariantId: 1,
  publish: true
};

export default bundle1Pants1Shirts2Belts;
