import { pantsTax } from '../products/pants-tax.mjs';
import { shirt } from '../products/shirt.mjs';
import { beltTax } from '../products/belt-tax.mjs';

export const getBundle1VariantAttributes = function ({
  fetchedPantsProduct,
  fetchedShirtsProduct,
  fetchedBeltsProduct
}) {
  return [
    {
      action: 'setAttribute',
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
              en: pantsTax.name.en
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
              en: shirt.name.en
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
              en: beltTax.name.en
            }
          }
        ]
      ]
    },
    {
      action: 'setAttribute',
      variantId: 1,
      name: 'productSearch',
      value: [
        `${fetchedPantsProduct.id}/1`,
        `${fetchedShirtsProduct.id}/1`,
        `${fetchedBeltsProduct.id}/1`
      ]
    }
  ];
};

export default getBundle1VariantAttributes;
