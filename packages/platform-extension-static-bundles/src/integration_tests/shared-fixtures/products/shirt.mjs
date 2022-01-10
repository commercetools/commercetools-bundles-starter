import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'shirt';

export const shirt = {
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
          centAmount: 2000,
          currencyCode: 'USD',
        },
      },
    ],
    attributes: [
      { name: 'class', value: 'LS Solid Dress Shirts' },
      { name: 'department', value: 'womens' },
    ],
  },
  publish: true,
};
export default shirt;
