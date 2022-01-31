import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'jacket-sale';

export const jacketSale = {
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
      { name: 'class', value: 'Cotton Blend Jackets (on sale)' },
      { name: 'department', value: 'mens' },
    ],
  },
  publish: true,
};
export default jacketSale;
