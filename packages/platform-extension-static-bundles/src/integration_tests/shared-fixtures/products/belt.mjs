import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'belt';

export const belt = {
  key: name,
  name: {
    en: name
  },
  productType: { typeId: 'product-type', key: integrationTestProduct.key },
  slug: {
    en: name
  },
  masterVariant: {
    sku: name,
    prices: [
      {
        value: {
          centAmount: 1000,
          currencyCode: 'USD'
        }
      }
    ],
    attributes: [
      { name: 'class', value: 'Belts' },
      { name: 'department', value: 'mens' }
    ]
  },
  publish: true
};
export default belt;
