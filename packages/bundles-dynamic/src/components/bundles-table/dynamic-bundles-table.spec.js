import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { minBy, omit, find } from 'lodash';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  BundlesTable,
  COLUMN_KEYS,
  PRODUCT_STATUS,
} from '@commercetools-us-ps/bundles-core/components/index';
import { localize } from '@commercetools-us-ps/bundles-core/components/util';
import { generateProduct } from '../../test-util';
import DynamicBundlesTable from './dynamic-bundles-table';
import messages from './messages';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
};
const dataLocale = project.languages[0];

const mocks = {
  match: {
    path: '/',
    url: '/',
    params: {
      projectKey: 'test-project',
    },
  },
  history: {
    push: jest.fn(),
  },
};

const PRICE_TYPE_FILTER = 'price-type-filter';
const CATEGORY_FILTER = 'category';

const mockFilter = jest.fn();

const transformProduct = (product) => ({
  ...product,
  ...product.masterData,
  masterVariant: product.masterData.current.masterVariant,
});
const generateProducts = (count = 1) =>
  Array.from({ length: count }, () =>
    transformProduct(generateProduct(project.languages))
  );

function loadBundlesTable() {
  return shallow(<DynamicBundlesTable {...mocks} />);
}

describe('dynamic bundles table', () => {
  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
  });

  describe('table columns', () => {
    it('should render fallback for default column', () => {
      const results = generateProducts();
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0 });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render localized bundle name for name column', () => {
      const { languages } = project;
      const results = generateProducts();
      const bundle = results[0];
      const wrapper = loadBundlesTable();
      const expected = localize({
        obj: bundle,
        key: 'name',
        language: dataLocale,
        fallbackOrder: languages,
      });
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.NAME);
      expect(actual).toEqual(expected);
    });

    it('when bundle published, should render published status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, true, false)
      );
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.STATUS);
      expect(actual.props.code).toEqual(PRODUCT_STATUS.PUBLISHED);
    });

    it('when bundle modified, should render modified status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, true, true)
      );
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.STATUS);
      expect(actual.props.code).toEqual(PRODUCT_STATUS.MODIFIED);
    });

    it('when bundle unpublished, should render unpublished status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, false, true)
      );
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.STATUS);
      expect(actual.props.code).toEqual(PRODUCT_STATUS.UNPUBLISHED);
    });

    it('when bundle has a dynamic price, should render dynamic label for price column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, false, true, true)
      );
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.PRICE);
      expect(actual.props.id).toEqual(messages.dynamicValue.id);
    });

    it('when fixed price bundle has at least one price, should render lowest price for price column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, false, true, false)
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const lowestPrice = minBy(
        results[0].masterVariant.prices,
        'value.centAmount'
      );
      const expected = lowestPrice.value.centAmount / 100;
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.PRICE);
      expect(actual.props.value).toEqual(expected);
    });

    it('when fixed price bundle has no price, should render fallback for price column', () => {
      const bundle = omit(
        transformProduct(
          generateProduct(project.languages, false, true, false)
        ),
        'masterVariant.prices'
      );
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.PRICE);
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render formatted date for last modified column', () => {
      const results = generateProducts();
      const bundle = results[0];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(bundle, COLUMN_KEYS.MODIFIED);
      expect(actual.props.value).toEqual(bundle.lastModifiedAt);
    });
  });

  describe('price type filter', () => {
    it('should contain filter options', () => {
      const wrapper = loadBundlesTable();

      const filters = wrapper.find(BundlesTable).props().filterInputs()
        .props.children;

      const priceTypeFilterOptions = find(filters, {
        props: { name: PRICE_TYPE_FILTER },
      }).props.options;

      expect(priceTypeFilterOptions).toEqual([
        { value: 'true', label: messages.dynamicValue.id },
        { value: 'false', label: messages.staticValue.id },
      ]);
    });

    describe('when option is selected', () => {
      const value = 'true';
      const priceType = 'dynamicPrice';
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlesTable();

        generateProduct(project.languages, false, true, true);

        const filters = wrapper
          .find(BundlesTable)
          .props()
          .filterInputs(mockFilter).props.children;

        const priceTypeFilter = find(filters, {
          props: { name: PRICE_TYPE_FILTER },
        });

        priceTypeFilter.props.onChange({ target: { value } });
      });

      afterEach(() => {
        mockFilter.mockClear();
      });

      it('should filter results', () => {
        expect(mockFilter).toHaveBeenCalledWith(
          value,
          priceType,
          expect.any(Function)
        );
      });

      it('should filter results with price type query parameter', () => {
        const filterParam = mockFilter.mock.calls[0][2];
        expect(filterParam()).toEqual(
          `variants.attributes.dynamic-price:"${value}"`
        );
      });
    });

    describe('when selection is cleared', () => {
      let wrapper;
      let priceTypeFilter;

      beforeEach(() => {
        wrapper = loadBundlesTable();
        generateProduct(project.languages, false, true, true);
        const filters = wrapper
          .find(BundlesTable)
          .props()
          .filterInputs(mockFilter).props.children;

        priceTypeFilter = find(filters, { props: { name: PRICE_TYPE_FILTER } });
      });

      it('filter input should have no value', () => {
        priceTypeFilter.props.onChange({ target: { value: null } });

        const filters = wrapper.find(BundlesTable).props().filterInputs()
          .props.children;

        const priceTypeFilterValue = find(filters, {
          props: { name: PRICE_TYPE_FILTER },
        }).props.value;

        expect(priceTypeFilterValue).toBe(null);
      });
    });
  });

  describe('category filter', () => {
    describe('when option is selected', () => {
      const value = { value: 'shoes' };
      const filterType = 'category';
      let wrapper;

      beforeEach(() => {
        wrapper = loadBundlesTable();

        generateProduct(project.languages, false, true, true);

        const filters = wrapper
          .find(BundlesTable)
          .props()
          .filterInputs(mockFilter).props.children;

        const categoryFilter = find(filters, {
          props: { name: CATEGORY_FILTER },
        });

        categoryFilter.props.onChange({ target: { value } });
      });

      afterEach(() => {
        mockFilter.mockClear();
      });

      it('should filter results', () => {
        expect(mockFilter).toHaveBeenCalledWith(
          value,
          filterType,
          expect.any(Function)
        );
      });

      it('should filter results with category search query parameter', () => {
        const filterParam = mockFilter.mock.calls[0][2];
        expect(filterParam()).toEqual(
          `variants.attributes.category-search: "${value.value}"`
        );
      });
    });
  });
});
