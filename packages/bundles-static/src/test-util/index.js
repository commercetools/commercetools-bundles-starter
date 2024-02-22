import faker from 'faker';
import { transformLocalizedFieldToString } from '@commercetools-us-ps/bundles-core/components/util';
import {
  PRODUCT,
  PRODUCT_NAME,
  PRODUCT_REF,
  QUANTITY,
  SKU,
  VARIANT_ID,
} from '../components/product-field/constants';

export const generateProduct = (
  languages = [],
  published = faker.datatype.boolean(),
  hasStagedChanges = faker.datatype.boolean()
) => {
  const nameAllLocales = Array.from(
    { length: languages.length || faker.datatype.number(4) },
    (item, index) => ({
      locale: languages ? languages[index] : faker.random.locale(),
      value: faker.commerce.productName(),
    })
  );
  const descriptionAllLocales = Array.from(
    { length: languages.length || faker.datatype.number(4) },
    (item, index) => ({
      locale: languages ? languages[index] : faker.random.locale(),
      value: faker.random.word(),
    })
  );
  const products = {
    name: 'products',
    value: Array.from({ length: faker.datatype.number(5) }, () => [
      {
        name: VARIANT_ID,
        value: faker.datatype.number(12),
      },
      {
        name: SKU,
        value: faker.datatype.number(),
      },
      {
        name: PRODUCT_NAME,
        value: faker.commerce.productName(),
      },
      {
        name: PRODUCT_REF,
        value: {
          typeId: PRODUCT,
          id: faker.datatype.uuid(),
        },
      },
      {
        name: QUANTITY,
        value: faker.datatype.number(10),
      },
    ]),
  };
  const generateDetails = () => ({
    nameAllLocales,
    descriptionAllLocales,
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    masterVariant: {
      id: 1,
      attributes: [products],
      attributesRaw: [products],
      images: Array.from({
        length: faker.datatype.number({ min: 1, max: 3 }),
      }).map(() => ({
        label: faker.random.word(),
        url: faker.image.imageUrl(640, 480, faker.random.word()),
      })),
      prices: Array.from({
        length: faker.datatype.number({ min: 1, max: 3 }),
      }).map(() => ({
        value: {
          centAmount: faker.datatype.number({ min: 1, max: 20000 }),
          currencyCode: faker.finance.currencyCode(),
          fractionsDigits: faker.datatype.number(2),
        },
      })),
    },
    allVariants: [
      {
        images: Array.from({
          length: faker.datatype.number({ min: 1, max: 3 }),
        }).map(() => ({
          label: faker.random.word(),
          url: faker.image.imageUrl(640, 480, faker.random.word()),
        })),
      },
    ],
  });
  return {
    id: faker.datatype.uuid(),
    lastModifiedAt: faker.date.recent(100),
    version: faker.datatype.number(10),
    name: transformLocalizedFieldToString(nameAllLocales),
    description: transformLocalizedFieldToString(descriptionAllLocales),
    masterData: {
      published,
      hasStagedChanges,
      current: generateDetails(),
      staged: generateDetails(),
    },
  };
};

const products = Array.from({ length: 2 }).map(() => ({
  product: {
    label: faker.random.word(),
    value: JSON.stringify({
      productId: faker.datatype.uuid(),
      name: faker.random.words(),
      id: faker.datatype.number(5),
      sku: faker.lorem.slug(),
    }),
  },
  quantity: faker.datatype.number(5),
}));

export const generateFormValues = () => ({
  id: faker.datatype.uuid(),
  version: faker.datatype.number(6),
  name: {
    [faker.random.locale()]: faker.random.word(),
  },
  description: {
    [faker.random.locale()]: faker.random.word(),
  },
  sku: faker.datatype.number({ min: 10000, max: 20000 }).toString(),
  products,
  productSearch: products,
  slug: {
    [faker.random.locale()]: faker.random.word(),
  },
  price: {
    currencyCode: faker.finance.currencyCode(),
    amount: faker.finance.amount(),
  },
});

export const generateSubmittedFormValues = () => ({
  id: faker.datatype.uuid(),
  version: faker.datatype.number(6),
  name: [
    {
      locale: faker.random.locale(),
      value: faker.random.word(),
    },
  ],
  description: [
    {
      locale: faker.random.locale(),
      value: faker.random.word(),
    },
  ],
  key: faker.lorem.slug(),
  sku: faker.datatype.number({ min: 10000, max: 20000 }).toString(),
  products: JSON.stringify(
    Array.from({ length: 2 }).map(() => [
      {
        name: VARIANT_ID,
        value: faker.datatype.number(5),
      },
      { name: SKU, value: faker.lorem.slug() },
      {
        name: PRODUCT_REF,
        value: {
          typeId: PRODUCT,
          id: faker.datatype.uuid(),
        },
      },
      {
        name: PRODUCT_NAME,
        value: faker.commerce.productName(),
      },
      { name: QUANTITY, value: faker.datatype.number(2) },
    ])
  ),
  productSearch: JSON.stringify(
    Array.from({ length: 2 }).map(
      () => `${faker.datatype.uuid()}/${faker.datatype.number(5)}`
    )
  ),
  slug: [
    {
      locale: faker.random.locale(),
      value: faker.random.word(),
    },
  ],
  price: {
    centPrecision: {
      currencyCode: faker.finance.currencyCode(),
      centAmount: faker.finance.amount(),
    },
  },
});
