import * as products from '../products/index.mjs';

export const bundle2Pants3Jackets2Belts = 'bundle2Pants3Jackets2Belts';

export const getBundle2Pants3Jackets2Belts = function ({
  fetchedPantsProduct,
  fetchedJacketsProduct,
  fetchedBeltsProduct
}) {
  return {
    key: bundle2Pants3Jackets2Belts,
    name: {
      en: bundle2Pants3Jackets2Belts
    },
    productType: { typeId: 'product-type', key: 'static-bundle-parent' },
    slug: {
      en: bundle2Pants3Jackets2Belts
    },
    taxCategory: {
      typeId: 'tax-category',
      key: 'integration-no-tax-usa',
    },
    masterVariant: {
      id: 1,
      sku: bundle2Pants3Jackets2Belts,
      prices: [{
        value: {
          currencyCode: 'USD',
          centAmount: 28000
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
                value: 2
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
                  en: products.pants.name.en
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
                value: 3
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
                  en: products.jacket.name.en
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
                value: 'belt'
              },
              {
                name: 'quantity',
                value: 2
              },
              {
                name: 'product-ref',
                value: {
                  typeId: 'product',
                  id: fetchedBeltsProduct.id
                }
              },
              {
                name: 'product-name',
                value: {
                  en: products.belt.name.en
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
            `${fetchedJacketsProduct.id}/1`,
            `${fetchedBeltsProduct.id}/1`
          ]
        }
      ],
      assets: [],
    },
    lastVariantId: 1,
    publish: true
  };
};

export default getBundle2Pants3Jackets2Belts;
