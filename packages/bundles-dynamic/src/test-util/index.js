import faker from 'faker';
import { transformLocalizedFieldToString } from '@commercetools-us-ps/mc-app-core/util';
import {
  CATEGORY,
  CATEGORY_PATH,
  CATEGORY_REF,
  MAX_QUANTITY,
  MIN_QUANTITY,
  ADDITIONAL_CHARGE,
} from '../components/category-field/constants';
import { ATTRIBUTES } from '../constants';

export const generateCategoryAttributes = (
  additionalCharge = faker.random.boolean(),
  minQuantity = faker.random.number({ min: 1, max: 10 }),
  maxQuantity = faker.random.number({ min: 1, max: 10 })
) => [
  {
    name: CATEGORY_REF,
    value: {
      typeId: CATEGORY,
      id: faker.random.uuid(),
    },
  },
  {
    name: CATEGORY_PATH,
    value: faker.commerce.productName(),
  },
  {
    name: MIN_QUANTITY,
    value: minQuantity,
  },
  {
    name: MAX_QUANTITY,
    value: maxQuantity,
  },
  {
    name: ADDITIONAL_CHARGE,
    value: additionalCharge,
  },
];

export const generateProduct = (
  languages = [],
  published = faker.random.boolean(),
  hasStagedChanges = faker.random.boolean(),
  dynamic = faker.random.boolean()
) => {
  const nameAllLocales = Array.from(
    { length: languages.length || faker.random.number(4) },
    (item, index) => ({
      locale: languages ? languages[index] : faker.random.locale(),
      value: faker.commerce.productName(),
    })
  );
  const descriptionAllLocales = Array.from(
    { length: languages.length || faker.random.number(4) },
    (item, index) => ({
      locale: languages ? languages[index] : faker.random.locale(),
      value: faker.random.word(),
    })
  );
  const categories = {
    name: ATTRIBUTES.CATEGORIES,
    value: Array.from(
      { length: faker.random.number({ min: 1, max: 5 }) },
      generateCategoryAttributes
    ),
  };
  const dynamicPrice = {
    name: ATTRIBUTES.DYNAMIC_PRICE,
    value: dynamic,
  };

  const generatePrice = () => ({
    value: {
      centAmount: faker.random.number({ min: 1, max: 20000 }),
      currencyCode: faker.finance.currencyCode(),
      fractionsDigits: faker.random.number(2),
    },
  });
  const generateDetails = () => ({
    nameAllLocales,
    descriptionAllLocales,
    name: faker.commerce.productName(),
    slug: faker.lorem.slug(),
    masterVariant: {
      id: 1,
      attributes: [categories, dynamicPrice],
      attributesRaw: [categories, dynamicPrice],
      images: Array.from({
        length: faker.random.number({ min: 1, max: 3 }),
      }).map(() => ({
        label: faker.random.word(),
        url: faker.image.imageUrl(640, 480, faker.random.word()),
      })),
      price: generatePrice(),
      prices: Array.from({
        length: faker.random.number({ min: 1, max: 3 }),
      }).map(generatePrice),
    },
    allVariants: [
      {
        images: Array.from({
          length: faker.random.number({ min: 1, max: 3 }),
        }).map(() => ({
          label: faker.random.word(),
          url: faker.image.imageUrl(640, 480, faker.random.word()),
        })),
      },
    ],
  });
  return {
    id: faker.random.uuid(),
    lastModifiedAt: faker.date.recent(100),
    version: faker.random.number(10),
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

export const generateCategoryFormValues = () => ({
  category: {
    label: faker.commerce.productName(),
    value: faker.random.uuid(),
  },
  minQuantity: faker.random.number({ min: 1, max: 10 }),
  maxQuantity: faker.random.number({ min: 1, max: 10 }),
  additionalCharge: faker.random.boolean(),
});

export const generateFormValues = () => ({
  id: faker.random.uuid(),
  version: faker.random.number(6),
  name: {
    [faker.random.locale()]: faker.random.word(),
  },
  description: {
    [faker.random.locale()]: faker.random.word(),
  },
  key: faker.lorem.slug(),
  sku: faker.random.number({ min: 10000, max: 20000 }).toString(),
  categories: Array.from({ length: 2 }).map(generateCategoryFormValues),
  dynamicPrice: faker.random.boolean(),
  minQuantity: faker.random.number({ min: 1, max: 5 }),
  maxQuantity: faker.random.number({ min: 1, max: 5 }),
  slug: {
    [faker.random.locale()]: faker.lorem.slug(),
  },
});

export const generateSubmittedFormValues = () => ({
  id: faker.random.uuid(),
  version: faker.random.number(6),
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
  sku: faker.random.number({ min: 10000, max: 20000 }).toString(),
  dynamicPrice: JSON.stringify(faker.random.boolean()),
  minQuantity: JSON.stringify(faker.random.number({ min: 1, max: 5 })),
  maxQuantity: JSON.stringify(faker.random.number({ min: 1, max: 5 })),
  categories: JSON.stringify(
    Array.from({ length: 2 }).map(generateCategoryAttributes)
  ),
  categorySearch: [faker.random.uuid(), faker.random.uuid()],
  slug: [
    {
      locale: faker.random.locale(),
      value: faker.lorem.slug(),
    },
  ],
});
