import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectField from '@commercetools-uikit/select-field';
import DateField from '@commercetools-uikit/date-field';
import GetPriceFilters from './get-price-filters.graphql';
import messages from './messages';
import styles from './price-filters.mod.css';

const mapOptions = (options) =>
  options.map((option) => ({
    label: option,
    value: option,
  }));

const mapResultOptions = (options) =>
  options.results.map((option) => ({
    label: option.name,
    value: JSON.stringify(option),
  }));

const PriceFilters = ({
  currency,
  country,
  customerGroup,
  channel,
  date,
  setCurrency,
  setCountry,
  setCustomerGroup,
  setChannel,
  setDate,
}) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { currencies, countries } = project;
  const { data, loading, error } = useQuery(GetPriceFilters, {
    variables: {
      locale: dataLocale,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  if (error)
    return (
      <Text.Body
        data-testid="error-message"
        intlMessage={messages.errorLoading}
      />
    );
  if (loading) return null;

  const { channels, customerGroups } = data;
  const currencyOptions = mapOptions(currencies);
  const countryOptions = mapOptions(countries);
  const channelOptions = mapResultOptions(channels);
  const customerGroupOptions = mapResultOptions(customerGroups);

  return (
    <div className={styles.filters}>
      <Spacings.Inline>
        <SelectField
          data-testid="filter-currency"
          title={intl.formatMessage(messages.currency)}
          options={currencyOptions}
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        />
        <SelectField
          data-testid="filter-country"
          title={intl.formatMessage(messages.country)}
          isClearable
          options={countryOptions}
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        />
        <SelectField
          data-testid="filter-customer-group"
          title={intl.formatMessage(messages.customerGroup)}
          isClearable
          options={customerGroupOptions}
          value={customerGroup}
          onChange={(event) => setCustomerGroup(event.target.value)}
        />
        <SelectField
          data-testid="filter-channel"
          title={intl.formatMessage(messages.channel)}
          isClearable
          options={channelOptions}
          value={channel}
          onChange={(event) => setChannel(event.target.value)}
        />
        <DateField
          data-testid="filter-date"
          title={intl.formatMessage(messages.date)}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </Spacings.Inline>
    </div>
  );
};
PriceFilters.displayName = 'PriceFilters';
PriceFilters.propTypes = {
  currency: PropTypes.string.isRequired,
  country: PropTypes.string,
  customerGroup: PropTypes.string,
  channel: PropTypes.string,
  date: PropTypes.string,
  setCurrency: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  setCustomerGroup: PropTypes.func.isRequired,
  setChannel: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
};

export default PriceFilters;
