import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { omit } from 'lodash';
import { FormattedDate } from 'react-intl';
import { setQuery, useQuery } from '@apollo/react-hooks';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { Table } from '@commercetools-frontend/ui-kit';
import { SORT_OPTIONS } from '@commercetools-us-ps/mc-app-core/constants';
import { generateProduct } from '../../test-util';
import { getSkus } from '../../util';
import PricesTable, { DateField } from './prices-table';
import GetProductPrices from './get-product-prices.graphql';
import { DEFAULT_VARIABLES } from './constants';
import messages from './messages';
import { COLUMN_KEYS } from './column-definitions';

const dataLocale = faker.random.locale();
const customerGroup = {
  id: faker.random.uuid(),
  name: faker.random.words()
};
const channel = {
  id: faker.random.uuid(),
  name: faker.random.words()
};
const filters = {
  currency: faker.finance.currencyCode(),
  country: faker.address.countryCode(),
  customerGroup: JSON.stringify(customerGroup),
  channel: JSON.stringify(channel),
  date: faker.date.recent(2).toISOString()
};
const bundle = generateProduct();
const mocks = {
  variants: bundle.products,
  getMcPriceUrl: jest.fn()
};
const variables = {
  ...DEFAULT_VARIABLES,
  sort: [`${COLUMN_KEYS.NAME}.${dataLocale} ${SORT_OPTIONS.ASC}`],
  locale: dataLocale,
  skus: getSkus(mocks.variants),
  currency: filters.currency,
  country: filters.country,
  customerGroup: customerGroup.id,
  channel: channel.id,
  date: filters.date
};
const variant = {
  id: faker.random.uuid(),
  price: {
    country: filters.country,
    customerGroup: customerGroup.id,
    channel: channel.id,
    validFrom: faker.date.past(2).toISOString(),
    validUntil: faker.date.future(2).toISOString(),
    value: {
      currencyCode: faker.finance.currencyCode(),
      centAmount: faker.random.number(2000)
    }
  }
};
const generateResults = (item = variant) => [
  {
    id: faker.random.uuid(),
    masterData: {
      current: {
        name: faker.random.words(),
        allVariants: [item]
      }
    }
  }
];

global.open = jest.fn();

const loadPricesTable = (selectedFilters = filters) =>
  shallow(<PricesTable {...mocks} {...selectedFilters} />);

describe('prices table', () => {
  let wrapper;

  const getValueForColumn = (item, columnKey) => {
    setQuery({
      data: { products: { results: generateResults(item), total: 1 } }
    });
    wrapper = loadPricesTable();
    return wrapper
      .find(Table)
      .props()
      .itemRenderer({ rowIndex: 0, columnKey });
  };

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ dataLocale }));
  });

  it('should retrieve prices for variants', () => {
    setQuery({ loading: true });
    loadPricesTable();
    expect(useQuery).toHaveBeenCalledWith(GetProductPrices, {
      variables,
      fetchPolicy: 'no-cache'
    });
  });

  it('should render nothing when loading', () => {
    setQuery({ loading: true });
    wrapper = loadPricesTable();
    expect(wrapper.find(Table).exists()).toEqual(false);
  });

  it('should render error when query returns error', () => {
    setQuery({ error: { message: 'error' } });
    wrapper = loadPricesTable();
    expect(
      wrapper.find("[data-testid='error-message']").prop('intlMessage')
    ).toEqual(messages.errorLoading);
  });

  it('should render products table when query returns data', () => {
    setQuery({
      data: { products: { results: generateResults(), total: 1 } }
    });
    wrapper = loadPricesTable();
    expect(wrapper.find(Table).exists()).toEqual(true);
  });

  it('when country not selected, it should not be included in query variables', () => {
    setQuery({ loading: true });
    loadPricesTable(omit(filters, 'country'));
    expect(useQuery).toHaveBeenCalledWith(GetProductPrices, {
      variables: omit(variables, 'country'),
      fetchPolicy: 'no-cache'
    });
  });

  it('when customer group not selected, it should not be included in query variables', () => {
    setQuery({ loading: true });
    loadPricesTable(omit(filters, 'customerGroup'));
    expect(useQuery).toHaveBeenCalledWith(GetProductPrices, {
      variables: omit(variables, 'customerGroup'),
      fetchPolicy: 'no-cache'
    });
  });

  it('when channel not selected, it should not be included in query variables', () => {
    setQuery({ loading: true });
    loadPricesTable(omit(filters, 'channel'));
    expect(useQuery).toHaveBeenCalledWith(GetProductPrices, {
      variables: omit(variables, 'channel'),
      fetchPolicy: 'no-cache'
    });
  });

  it('when date not selected, it should not be included in query variables', () => {
    setQuery({ loading: true });
    loadPricesTable(omit(filters, 'date'));
    expect(useQuery).toHaveBeenCalledWith(GetProductPrices, {
      variables: omit(variables, 'date'),
      fetchPolicy: 'no-cache'
    });
  });

  it('when row clicked, should open MC new product variant price modal', () => {
    const results = generateResults();
    const item = results[0];
    setQuery({
      data: { products: { results, total: 1 } }
    });
    wrapper = loadPricesTable();
    wrapper
      .find(Table)
      .props()
      .onRowClick({}, 0);
    expect(global.open).toHaveBeenCalled();
    expect(mocks.getMcPriceUrl).toHaveBeenCalledWith(item.id, variant.id);
  });

  it('should render fallback for default column', () => {
    setQuery({
      data: { products: { results: generateResults(), total: 1 } }
    });
    wrapper = loadPricesTable();
    const actual = wrapper
      .find(Table)
      .props()
      .itemRenderer({ rowIndex: 0 });
    expect(actual).toEqual(NO_VALUE_FALLBACK);
  });

  it('should render current name for name column', () => {
    const results = generateResults();
    setQuery({
      data: { products: { results, total: 1 } }
    });
    wrapper = loadPricesTable();
    const actual = wrapper
      .find(Table)
      .props()
      .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.NAME });
    expect(actual).toEqual(results[0].masterData.current.name);
  });

  describe('when price empty', () => {
    const item = omit(variant, 'price');
    beforeEach(() => {
      setQuery({
        data: { products: { results: generateResults(item), total: 1 } }
      });
      wrapper = loadPricesTable();
    });

    it('should render fallback for currency column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CURRENCY });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render fallback for price column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.PRICE });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render fallback for country column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.COUNTRY });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render fallback for customer group column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CUSTOMER_GROUP });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render fallback for channel column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CHANNEL });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render fallback for valid dates column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALID_DATES });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });
  });

  describe('when price provided', () => {
    beforeEach(() => {
      setQuery({
        data: { products: { results: generateResults(), total: 1 } }
      });
      wrapper = loadPricesTable();
    });

    it('should render currency code for currency column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CURRENCY });
      expect(actual).toEqual(variant.price.value.currencyCode);
    });

    it('should render formatted price for price column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.PRICE });
      expect(actual.props.value).toEqual(variant.price.value.centAmount / 100);
    });

    it('should render country code for country column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.COUNTRY });
      expect(actual).toEqual(variant.price.country);
    });

    it('should render customer group name for customer group column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CUSTOMER_GROUP });
      expect(actual).toEqual(customerGroup.name);
    });

    it('should render channel name for channel column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CHANNEL });
      expect(actual).toEqual(channel.name);
    });

    it('should render valid from date for date column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALID_DATES });
      const dateValue = shallow(actual)
        .find(DateField)
        .first()
        .shallow()
        .find(FormattedDate);
      expect(dateValue.prop('value')).toEqual(
        new Date(variant.price.validFrom)
      );
    });

    it('should render valid until date for date column', () => {
      const actual = wrapper
        .find(Table)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALID_DATES });
      const dateValue = shallow(actual)
        .find(DateField)
        .last()
        .shallow()
        .find(FormattedDate);
      expect(dateValue.prop('value')).toEqual(
        new Date(variant.price.validUntil)
      );
    });
  });

  it('when price provided without county, should render any value for country column', () => {
    const item = omit(variant, 'price.country');
    const actual = getValueForColumn(item, COLUMN_KEYS.COUNTRY);
    expect(actual.props.id).toEqual(messages.anyValue.id);
  });

  it('when price provided without customer group, should render any value for country column', () => {
    const item = omit(variant, 'price.customerGroup');
    const actual = getValueForColumn(item, COLUMN_KEYS.CUSTOMER_GROUP);
    expect(actual.props.id).toEqual(messages.anyValue.id);
  });

  it('when price provided without valid from field, should render fallback for date column', () => {
    const item = omit(variant, 'price.validFrom');
    const actual = getValueForColumn(item, COLUMN_KEYS.VALID_DATES);
    const dateValue = shallow(actual)
      .find(DateField)
      .first()
      .shallow()
      .find("[data-testid='date-field-value']");
    expect(dateValue.html()).toContain(NO_VALUE_FALLBACK);
  });

  it('when price provided without valid until field, should render fallback for date column', () => {
    const item = omit(variant, 'price.validUntil');
    const actual = getValueForColumn(item, COLUMN_KEYS.VALID_DATES);
    const dateValue = shallow(actual)
      .find(DateField)
      .last()
      .shallow()
      .find("[data-testid='date-field-value']");
    expect(dateValue.html()).toContain(NO_VALUE_FALLBACK);
  });
});
