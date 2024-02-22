import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { stringify } from 'qs';
import { map } from 'lodash';
import { useQuery, setQuery } from '@apollo/client';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { FlatButton } from '@commercetools-frontend/ui-kit';
import { Error, Loading, PaginatedTable, SearchInput } from '../index';
import * as BundleContext from '../../context/bundle-context';
import BundlesTable from './bundles-table';
import BundleProductSearch from './bundle-search.rest.graphql';
import messages from './messages';
import { DEFAULT_VARIABLES, PAGE_SIZE } from './constants';
import { COLUMN_KEYS } from './column-definitions';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
};
const dataLocale = project.languages[0];
const where = `productType.id:"${faker.datatype.uuid()}"`;

const QUERY_VARIABLES = { ...DEFAULT_VARIABLES, filter: [where] };

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
  title: {
    id: faker.datatype.uuid(),
    description: faker.random.words(),
    defaultMessage: faker.random.words(),
  },
  subtitle: {
    id: faker.datatype.uuid(),
    description: faker.random.words(),
    defaultMessage: faker.random.words(),
  },
  columnDefinitions: map(COLUMN_KEYS, (key) => ({
    key,
    label: faker.random.words(),
  })),
  renderItem: jest.fn(),
};

function generateResults(total) {
  const count = total < PAGE_SIZE ? total : PAGE_SIZE;
  return {
    products: {
      count,
      total,
      results: Array.from({ length: count }, () => ({
        id: faker.datatype.uuid(),
      })),
    },
  };
}

function loadBundlesTable() {
  return shallow(<BundlesTable {...mocks} />);
}

describe('bundles table', () => {
  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
    jest.spyOn(BundleContext, 'useBundleContext').mockImplementation(() => ({
      where,
    }));
  });

  it('should retrieve products', () => {
    setQuery({ loading: true });
    const wrapper = loadBundlesTable();
    wrapper.update();
    expect(useQuery).toHaveBeenCalledWith(BundleProductSearch, {
      variables: {
        queryString: '',
      },
    });
  });

  it('should initially render loading message', () => {
    setQuery({ loading: true });
    const wrapper = loadBundlesTable();
    expect(wrapper.find(Loading).exists()).toEqual(true);
  });

  it('should render error when query returns error', () => {
    setQuery({ error: { message: 'error' } });
    const wrapper = loadBundlesTable();
    const error = wrapper.find(Error);
    expect(error.props().title).toEqual(messages.errorLoadingTitle.id);
  });

  it('should render products table when query returns data', () => {
    setQuery({ data: generateResults(1) });
    const wrapper = loadBundlesTable();
    expect(wrapper.find(PaginatedTable).exists()).toEqual(true);
  });

  describe('when query returns empty results', () => {
    let wrapper;
    beforeEach(async () => {
      setQuery({ data: generateResults(0) });
      wrapper = loadBundlesTable();
    });

    it('should not render products table', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(false);
    });

    it('should render no results error message', () => {
      const error = wrapper.find('[data-testid="no-results-error"]');
      expect(error.props().intlMessage).toEqual(messages.errorNoResultsTitle);
    });

    it('should render bundle create link button', () => {
      expect(wrapper.find(FlatButton).exists()).toEqual(true);
    });
  });

  // The useEffect is not currently firing with shallow mounting
  // TODO: enable test when https://github.com/facebook/react/issues/15275 is resolved
  it.skip('when search term entered, should update query string with search term', () => {
    setQuery({ data: generateResults(0) });
    const wrapper = loadBundlesTable();
    const search = 'search';
    wrapper.find(SearchInput).props().onSubmit(search);
    expect(useQuery).toHaveBeenCalledWith(BundleProductSearch, {
      variables: {
        queryString: stringify({
          ...QUERY_VARIABLES,
          [`text.${dataLocale}`]: search,
        }),
      },
    });
  });

  it('when row clicked, should open bundle details', () => {
    const data = generateResults(1);
    const bundle = data.products.results[0];
    setQuery({ data });
    const wrapper = loadBundlesTable();
    wrapper.find(PaginatedTable).props().onRowClick({}, 0);
    expect(mocks.history.push).toHaveBeenCalledWith(
      `${mocks.match.url}/${bundle.id}/general`
    );
  });
});
