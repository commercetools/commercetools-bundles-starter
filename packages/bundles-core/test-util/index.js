import faker from 'faker';
import { transformLocalizedFieldToString } from '../components/util';

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
  const generateDetails = () => ({
    nameAllLocales,
    descriptionAllLocales,
    slug: faker.lorem.slug(),
    masterVariant: {
      id: 1,
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

export const transformResults = (results) => ({
  variantId: results.masterVariant.id,
  name: transformLocalizedFieldToString(results.nameAllLocales),
  description: transformLocalizedFieldToString(results.descriptionAllLocales),
  sku: results.masterVariant.sku,
  slug: results.slug,
  images: results.masterVariant.images,
});
