import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { useQuery, setQuery } from '@apollo/client';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import PriceFilters from './price-filters';
import GetPriceFilters from './get-price-filters.graphql';
import messages from './messages';

const project = {
  countries: Array.from({ length: 3 }, () => faker.address.countryCode()),
  currencies: Array.from({ length: 3 }, () => faker.finance.currencyCode()),
};

const dataLocale = faker.random.locale();
const results = Array.from({ length: 3 }, () => ({
  id: faker.datatype.uuid(),
  name: faker.random.words(),
}));
const mocks = {
  currency: faker.finance.currencyCode(),
  country: faker.address.countryCode(),
  customerGroup: JSON.stringify({ id: faker.datatype.uuid() }),
  channel: JSON.stringify({ id: faker.datatype.uuid() }),
  date: faker.date.recent(10).toISOString(),
  setCurrency: jest.fn(),
  setCountry: jest.fn(),
  setCustomerGroup: jest.fn(),
  setChannel: jest.fn(),
  setDate: jest.fn(),
};

const currencyFilter = "[data-testid='filter-currency']";
const countryFilter = "[data-testid='filter-country']";
const customerGroupFilter = "[data-testid='filter-customer-group']";
const channelFilter = "[data-testid='filter-channel']";
const dateFilter = "[data-testid='filter-date']";

const loadPriceFilters = () => shallow(<PriceFilters {...mocks} />);

describe('price filters', () => {
  let wrapper;

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));
  });

  it('should retrieve filters', () => {
    setQuery({ loading: true });
    loadPriceFilters();
    expect(useQuery).toHaveBeenCalledWith(GetPriceFilters, {
      variables: {
        locale: dataLocale,
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });
  });

  it('should render error when query returns error', () => {
    setQuery({ error: { message: 'error' } });
    wrapper = loadPriceFilters();
    const error = wrapper.find('[data-testid="error-message"]');
    expect(error.prop('intlMessage')).toEqual(messages.errorLoading);
  });

  describe('when query returns data', () => {
    beforeEach(() => {
      setQuery({
        data: { channels: { results }, customerGroups: { results } },
      });
      wrapper = loadPriceFilters();
    });

    it('should render currency filter with options', () => {
      expect(wrapper.find(currencyFilter).prop('options')).toHaveLength(
        project.currencies.length
      );
    });

    it('should render country filter with options', () => {
      expect(wrapper.find(countryFilter).prop('options')).toHaveLength(
        project.countries.length
      );
    });

    it('should render customer group filter with options', () => {
      expect(wrapper.find(customerGroupFilter).prop('options')).toHaveLength(
        results.length
      );
    });

    it('should render channel filter with options', () => {
      expect(wrapper.find(channelFilter).prop('options')).toHaveLength(
        results.length
      );
    });

    it('when currency selection changes, should update filter value', () => {
      const value = project.currencies[project.currencies.length - 1];
      wrapper.find(currencyFilter).props().onChange({ target: { value } });
      expect(mocks.setCurrency).toHaveBeenCalledWith(value);
    });

    it('when country selection changes, should update filter value', () => {
      const value = project.countries[project.countries.length - 1];
      wrapper.find(countryFilter).props().onChange({ target: { value } });
      expect(mocks.setCountry).toHaveBeenCalledWith(value);
    });

    it('when customer group selection changes, should update filter value', () => {
      const value = JSON.stringify(results[0]);
      wrapper.find(customerGroupFilter).props().onChange({ target: { value } });
      expect(mocks.setCustomerGroup).toHaveBeenCalledWith(value);
    });

    it('when channel changes, should update filter value', () => {
      const value = JSON.stringify(results[0]);
      wrapper.find(channelFilter).props().onChange({ target: { value } });
      expect(mocks.setChannel).toHaveBeenCalledWith(value);
    });

    it('when date selection changes, should update filter value', () => {
      const value = new Date().toISOString();
      wrapper.find(dateFilter).props().onChange({ target: { value } });
      expect(mocks.setDate).toHaveBeenCalledWith(value);
    });
  });
});
