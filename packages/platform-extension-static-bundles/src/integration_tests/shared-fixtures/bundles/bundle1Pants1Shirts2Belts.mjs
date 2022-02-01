import * as products from '../products/index.mjs';

export const bundle1Pants1Shirts2Belts = 'bundle1Pants1Shirts2Belts';

export const getBundle1Pants1Shirts2Belts = function ({
  fetchedPantsProduct,
  fetchedShirtsProduct,
  fetchedBeltsProduct
}) {
  return {
    key: bundle1Pants1Shirts2Belts,
    name: {
      en: bundle1Pants1Shirts2Belts
    },
    productType: { typeId: 'product-type', key: 'static-bundle-parent' },
    slug: {
      en: bundle1Pants1Shirts2Belts
    },
    taxCategory: {
      typeId: 'tax-category',
      key: 'integration-no-tax-usa',
    },
    masterVariant: {
      id: 1,
      sku: bundle1Pants1Shirts2Belts,
      prices: [{
        value: {
          currencyCode: 'USD',
          centAmount: 900000
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
                value: 'shirt'
              },
              {
                name: 'quantity',
                value: 1
              },
              {
                name: 'product-ref',
                value: {
                  typeId: 'product',
                  id: fetchedShirtsProduct.id
                }
              },
              {
                name: 'product-name',
                value: {
                  en: products.shirt.name.en
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
            `${fetchedShirtsProduct.id}/1`,
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

export default getBundle1Pants1Shirts2Belts;
