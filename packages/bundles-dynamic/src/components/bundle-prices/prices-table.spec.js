import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { getQuery, setQuery } from '@apollo/client';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { DataTable } from '@commercetools-frontend/ui-kit';
import { useEffectMock } from '@commercetools-us-ps/bundles-core/components/test-util';
import { generateCategoryAttributes } from '../../test-util';
import { getCategoryAttributes } from '../bundle-preview/category-product-field';
import PricesTable from './prices-table';
import { COLUMN_KEYS } from './column-definitions';

const customerGroup = {
  id: faker.datatype.uuid(),
  name: faker.random.words(),
};
const channel = {
  id: faker.datatype.uuid(),
  name: faker.random.words(),
};
const filters = {
  currency: faker.finance.currencyCode(),
  country: faker.address.countryCode(),
  customerGroup: JSON.stringify(customerGroup),
  channel: JSON.stringify(channel),
  date: faker.date.recent(2).toISOString(),
};
const mocks = {
  mcUrl: faker.internet.url(),
  categories: Array.from({ length: 3 }).map(generateCategoryAttributes),
};

const generatePriceRangeResults = (
  min = faker.datatype.number({ min: 1000, max: 2000 }),
  max = faker.datatype.number({ min: 2000, max: 4000 })
) => ({
  products: {
    facets: {
      'variants.scopedPrice.currentValue.centAmount': {
        ranges: [
          {
            min,
            max,
          },
        ],
      },
    },
  },
});

global.open = jest.fn();

const loadPricesTable = async (selectedFilters = filters) => {
  const wrapper = shallow(<PricesTable {...mocks} {...selectedFilters} />);
  return Promise.resolve(wrapper);
};

describe('prices table', () => {
  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
  });

  it('should retrieve price ranges for categories', () => {
    setQuery({ data: generatePriceRangeResults() });
    loadPricesTable();
    const query = getQuery();
    expect(query.refetch).toHaveBeenCalledTimes(mocks.categories.length);
  });

  it('when query returns data, should render category table', async () => {
    setQuery({ data: generatePriceRangeResults() });
    const wrapper = await loadPricesTable();
    expect(wrapper.find(DataTable).exists()).toEqual(true);
  });

  it('when row clicked, should open MC category products page', async () => {
    setQuery({ data: generatePriceRangeResults() });
    const wrapper = await loadPricesTable();
    const index = 0;
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const item = results[index];
    table.props().onRowClick({}, index);
    expect(global.open).toHaveBeenCalledWith(
      `${mocks.mcUrl}/categories/${item.id}/products`
    );
  });

  it('should render fallback for default column', async () => {
    const results = generatePriceRangeResults();
    setQuery({ data: results });
    const wrapper = await loadPricesTable();
    const actual = wrapper
      .find(DataTable)
      .props()
      .itemRenderer(results.products, { key: 'not-exists' });
    expect(actual).toEqual(NO_VALUE_FALLBACK);
  });

  it('should render category path for category column', async () => {
    setQuery({ data: generatePriceRangeResults() });
    const wrapper = await loadPricesTable();
    const index = 0;
    const { path } = getCategoryAttributes(mocks.categories[index]);
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const actual = table
      .props()
      .itemRenderer(results[index], { key: COLUMN_KEYS.CATEGORY });
    expect(actual).toEqual(path);
  });

  it('when minimum price missing, should render fallback for min price column', async () => {
    setQuery({ data: generatePriceRangeResults(null) });
    const wrapper = await loadPricesTable();
    const index = 0;
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const actual = table
      .props()
      .itemRenderer(results[index], { key: COLUMN_KEYS.MIN_PRICE });
    expect(actual).toEqual(NO_VALUE_FALLBACK);
  });

  it('when minimum price exists, should render price for min price column', async () => {
    setQuery({ data: generatePriceRangeResults() });
    const wrapper = await loadPricesTable();
    const index = 0;
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const { min } = results[index];
    const actual = table
      .props()
      .itemRenderer(results[index], { key: COLUMN_KEYS.MIN_PRICE });
    expect(actual.props.value).toEqual(min / 100);
  });

  it('when maximum price missing, should render fallback for max price column', async () => {
    setQuery({
      data: generatePriceRangeResults(
        faker.datatype.number({ min: 1000, max: 2000 }),
        null
      ),
    });
    const wrapper = await loadPricesTable();
    const index = 0;
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const actual = wrapper
      .find(DataTable)
      .props()
      .itemRenderer(results[index], { key: COLUMN_KEYS.MAX_PRICE });
    expect(actual).toEqual(NO_VALUE_FALLBACK);
  });

  it('when maximum price exists, should render price for max price column', async () => {
    setQuery({ data: generatePriceRangeResults() });
    const wrapper = await loadPricesTable();
    const index = 0;
    const table = wrapper.find(DataTable);
    const results = table.prop('rows');
    const { max } = results[index];
    const actual = table
      .props()
      .itemRenderer(results[index], { key: COLUMN_KEYS.MAX_PRICE });
    expect(actual.props.value).toEqual(max / 100);
  });
});
