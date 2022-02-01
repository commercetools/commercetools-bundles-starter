import { integrationTestProduct } from '../product-types/index.mjs';

const name = 'dressPants';

export const dressPants = {
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
          centAmount: 7500,
          currencyCode: 'USD'
        }
      }
    ],
    attributes: [
      { name: 'class', value: 'Dress Pants' },
      { name: 'department', value: 'mens' }
    ]
  },
  publish: true
};
export default dressPants;
