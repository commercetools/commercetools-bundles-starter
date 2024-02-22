import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { getQuery, setQuery } from '@apollo/client';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { AsyncSelectInput } from '@commercetools-frontend/ui-kit';
import ProductSearchInput from './product-search-input';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
};
const dataLocale = project.languages[0];

const mocks = {
  name: faker.random.word(),
  title: faker.random.words(),
  onBlur: jest.fn(),
  onChange: jest.fn(),
  value: null,
};

const generateVariant = (isMatchingVariant) => ({
  isMatchingVariant,
  id: faker.datatype.uuid(),
  sku: faker.lorem.slug(),
});

const generateProduct = (isMatchingVariant) => ({
  id: faker.datatype.uuid(),
  name: project.languages.reduce(
    (names, value) => ({ ...names, [value]: faker.random.words() }),
    {}
  ),
  key: faker.lorem.slug(),
  masterVariant: generateVariant(isMatchingVariant),
  variants: Array.from({ length: faker.datatype.number(5) }).map(() =>
    generateVariant(false)
  ),
});

const generateProducts = (count, percentOfMatchingVariants) => {
  const numMatching = Math.round(count * percentOfMatchingVariants);
  const numNotMatching = count - numMatching;
  return Array.from({ length: numMatching }, () =>
    generateProduct(true)
  ).concat(
    Array.from({ length: numNotMatching }, () => generateProduct(false))
  );
};

const loadProductSearchInput = () => shallow(<ProductSearchInput {...mocks} />);

describe('product search input', () => {
  let wrapper;
  const total = 7;
  const percentMatch = 0.75;
  const results = generateProducts(total, percentMatch);

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
  });

  describe('when input text entered', () => {
    const searchText = 'test';
    let actual;

    beforeEach(async () => {
      setQuery({
        data: { data: { products: { results } } },
      });
      wrapper = loadProductSearchInput();
      actual = await wrapper
        .find(AsyncSelectInput)
        .props()
        .loadOptions(searchText);
    });

    it('should fetch product variants', () => {
      const query = getQuery();
      expect(query.refetch).toHaveBeenCalledWith({
        text: searchText,
      });
    });

    it('should map matching variants to available options', () => {
      expect(actual.length).toEqual(Math.round(total * percentMatch));
    });
  });
});
