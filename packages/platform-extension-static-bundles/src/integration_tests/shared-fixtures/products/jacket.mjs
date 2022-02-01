import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'jacket';

export const jacket = {
  key: name,
  name: {
    en: name,
  },
  productType: { typeId: 'product-type', key: integrationTestProduct.key },
  slug: {
    en: name,
  },
  masterVariant: {
    sku: name,
    prices: [
      {
        value: {
          centAmount: 5000,
          currencyCode: 'USD',
        },
      },
    ],
    attributes: [
      { name: 'class', value: 'Cotton Blend Jackets' },
      { name: 'department', value: 'mens' },
    ],
  },
  publish: true,
};
export default jacket;
