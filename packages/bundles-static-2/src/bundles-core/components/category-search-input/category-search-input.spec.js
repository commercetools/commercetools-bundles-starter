import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { getQuery, setQuery } from '@apollo/client';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { AsyncSelectInput } from '@commercetools-frontend/ui-kit';
import { getPathName } from '../util';
import CategorySearchInput from './category-search-input';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
};
const dataLocale = project.languages[0];

const mocks = {
  name: faker.random.word(),
  onChange: jest.fn(),
  value: null,
};

function generateCategories(count) {
  return Array.from({ length: count }, () => ({
    id: faker.datatype.uuid(),
    childCount: faker.datatype.number(100),
    stagedProductCount: faker.datatype.number(100),
    nameAllLocales: [
      { locale: faker.random.locale(), value: faker.random.word() },
      { locale: faker.random.locale(), value: faker.random.word() },
    ],
    ancestors: [],
    lastModifiedAt: faker.date.recent(100),
  }));
}

const loadCategorySearchInput = (showProductCount = false) =>
  shallow(
    <CategorySearchInput {...mocks} showProductCount={showProductCount} />
  );

describe('category search input', () => {
  let wrapper;
  const expected = generateCategories(3);

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
  });

  describe('when input text entered', () => {
    const searchText = 'test';
    let actual;

    const whenInputEntered = async (showProductCount = false) => {
      setQuery({
        data: { data: { categories: { results: expected } } },
      });
      wrapper = loadCategorySearchInput(showProductCount);
      actual = await wrapper
        .find(AsyncSelectInput)
        .props()
        .loadOptions(searchText);
    };

    it('should fetch categories', async () => {
      await whenInputEntered();
      const query = getQuery();
      expect(query.refetch).toHaveBeenCalledWith({
        fullText: { locale: dataLocale, text: searchText },
      });
    });

    it('should map categories to available options', async () => {
      await whenInputEntered();
      expect(actual.length).toEqual(expected.length);
    });

    it('should map category id to value', async () => {
      await whenInputEntered();
      actual.forEach((category, index) => {
        expect(category.value).toEqual(expected[index].id);
      });
    });

    it('should map category path name to label', async () => {
      await whenInputEntered();
      actual.forEach((category, index) => {
        expect(category.label).toContain(
          getPathName(expected[index], dataLocale, project.languages)
        );
      });
    });

    it('when show product count false, should not map category product count to label', async () => {
      await whenInputEntered();
      actual.forEach((category, index) => {
        expect(category.label).not.toContain(
          String(expected[index].stagedProductCount)
        );
      });
    });

    it('when show product count true, should map category product count to label', async () => {
      await whenInputEntered(true);
      actual.forEach((category, index) => {
        expect(category.label).toContain(
          String(expected[index].stagedProductCount)
        );
      });
    });
  });
});
