import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'tie';

export const tie = {
  key: name,
  name: {
    en: name,
  },
  productType: { typeId: 'product-type', key: integrationTestProduct.key },
  slug: {
    en: name,
  },
  variants: [
    {
      sku: `${name}-black`,
      prices: [
        {
          value: {
            centAmount: 3000,
            currencyCode: 'USD',
          },
        },
      ],
      attributes: [
        { name: 'class', value: 'Cotton Ties' },
        { name: 'department', value: 'mens' },
        { name: 'color', value: 'black' },
      ],
    },
    {
      sku: `${name}-red`,
      prices: [
        {
          value: {
            centAmount: 6000,
            currencyCode: 'USD',
          },
        },
      ],
      attributes: [
        { name: 'class', value: 'Cotton Ties' },
        { name: 'department', value: 'mens' },
        { name: 'color', value: 'red' },
      ],
    },
  ],
  publish: true,
};
export default tie;
