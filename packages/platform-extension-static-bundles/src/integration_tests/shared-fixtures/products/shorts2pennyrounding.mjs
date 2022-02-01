import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'shorts2pennyrounding';

export const shorts2pennyrounding = {
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
          centAmount: 2999,
          currencyCode: 'USD'
        }
      }
    ],
    attributes: [
      { name: 'class', value: 'Cotton Blend Pants' },
      { name: 'department', value: 'mens' }
    ]
  },
  publish: true
};
export default shorts2pennyrounding;
