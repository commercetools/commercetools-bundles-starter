import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { find, minBy, omit } from 'lodash';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import BundlesTable, {
  COLUMN_KEYS
} from '@commercetools-us-ps/mc-app-bundles-core/components/bundles-table';
import { PRODUCT_STATUS } from '@commercetools-us-ps/mc-app-core/components/status';
import { localize } from '@commercetools-us-ps/mc-app-core/util';
import { generateProduct } from '../../test-util';
import StaticBundlesTable from './static-bundles-table';
import { PRODUCTS_ATTRIBUTE } from './constants';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()]
};
const dataLocale = project.languages[0];

const mocks = {
  match: {
    path: '/',
    url: '/',
    params: {
      projectKey: 'test-project'
    }
  },
  history: {
    push: jest.fn()
  }
};

const transformProduct = product => ({
  ...product,
  ...product.masterData,
  masterVariant: product.masterData.current.masterVariant
});
const generateProducts = (count = 1) =>
  Array.from({ length: count }, () =>
    transformProduct(generateProduct(project.languages))
  );

function loadBundlesTable() {
  return shallow(<StaticBundlesTable {...mocks} />);
}

describe('static bundles table', () => {
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
        fallbackOrder: languages
      });
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.NAME });
      expect(actual).toEqual(expected);
    });

    it('when bundle has products, should render number of products for products column', () => {
      const results = generateProducts();
      const bundle = results[0];
      const wrapper = loadBundlesTable();
      const expected = find(bundle.masterVariant.attributes, {
        name: PRODUCTS_ATTRIBUTE
      }).value.length;
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.PRODUCTS });
      expect(actual).toEqual(expected);
    });

    it('when bundle has no products, should render fallback for products column', () => {
      const bundle = omit(
        transformProduct(generateProduct()),
        'masterVariant.attributes'
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.PRODUCTS });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('when bundle published, should render published status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, true, false)
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.STATUS });
      expect(actual.props.code).toEqual(PRODUCT_STATUS.PUBLISHED);
    });

    it('when bundle modified, should render modified status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, true, true)
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.STATUS });
      expect(actual.props.code).toEqual(PRODUCT_STATUS.MODIFIED);
    });

    it('when bundle unpublished, should render unpublished status badge for status column', () => {
      const bundle = transformProduct(
        generateProduct(project.languages, false, true)
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.STATUS });
      expect(actual.props.code).toEqual(PRODUCT_STATUS.UNPUBLISHED);
    });

    it('when bundle has at least one price, should render lowest price for price column', () => {
      const results = generateProducts();
      const bundle = results[0];
      const wrapper = loadBundlesTable();
      const lowestPrice = minBy(
        bundle.masterVariant.prices,
        'value.centAmount'
      );
      const expected = lowestPrice.value.centAmount / 100;
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.PRICE });
      expect(actual.props.value).toEqual(expected);
    });

    it('when bundle has no price, should render fallback for price column', () => {
      const bundle = omit(
        transformProduct(generateProduct()),
        'masterVariant.prices'
      );
      const results = [bundle];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.PRICE });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render formatted date for last modified column', () => {
      const results = generateProducts();
      const bundle = results[0];
      const wrapper = loadBundlesTable();
      const actual = wrapper
        .find(BundlesTable)
        .props()
        .renderItem(results, { rowIndex: 0, columnKey: COLUMN_KEYS.MODIFIED });
      expect(actual.props.value).toEqual(bundle.lastModifiedAt);
    });
  });
});
