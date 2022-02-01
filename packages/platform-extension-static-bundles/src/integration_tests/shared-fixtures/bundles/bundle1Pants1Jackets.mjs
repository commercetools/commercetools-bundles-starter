import { pants } from '../products/pants.mjs';
import { jacket } from '../products/jacket.mjs';

export const bundle1Pants1Jackets = 'bundle1Pants1Jackets';

export const getBundle1Pants1Jackets = function ({
  fetchedPantsProduct,
  fetchedJacketsProduct
}) {
  return {
    key: bundle1Pants1Jackets,
    name: {
      en: bundle1Pants1Jackets
    },
    productType: { typeId: 'product-type', key: 'static-bundle-parent' },
    slug: {
      en: bundle1Pants1Jackets
    },
    taxCategory: {
      typeId: 'tax-category',
      key: 'integration-no-tax-usa',
    },
    masterVariant: {
      id: 1,
      sku: bundle1Pants1Jackets,
      prices: [{
        value: {
          currencyCode: 'USD',
          centAmount: 10500
        }
      }],
      images: [],
      attributes: [
        {
          variantId: 1,
          name: 'products',
          value: [
            [
              {
                name: 'variant-id',
                value: 1
              },
              {
                name: 'sku',
                value: 'pant'
              },
              {
                name: 'quantity',
                value: 1
              },
              {
                name: 'product-ref',
                value: {
                  typeId: 'product',
                  id: fetchedPantsProduct.id
                }
              },
              {
                name: 'product-name',
                value: {
                  en: pants.name.en
                }
              }
            ],
            [
              {
                name: 'variant-id',
                value: 1
              },
              {
                name: 'sku',
                value: 'jacket'
              },
              {
                name: 'quantity',
                value: 1
              },
              {
                name: 'product-ref',
                value: {
                  typeId: 'product',
                  id: fetchedJacketsProduct.id
                }
              },
              {
                name: 'product-name',
                value: {
                  en: jacket.name.en
                }
              }
            ]
          ]
        },
        {
          variantId: 1,
          name: 'productSearch',
          value: [
            `${fetchedPantsProduct.id}/1`,
            `${fetchedJacketsProduct.id}/1`
          ]
        }
      ],
      assets: [],
    },
    lastVariantId: 1,
    publish: true
  };
};

export default getBundle1Pants1Jackets;
