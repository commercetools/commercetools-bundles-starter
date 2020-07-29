import React from 'react';
import PropTypes from 'prop-types';
import { identity, pickBy } from 'lodash';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { Spacings, Table, Text } from '@commercetools-frontend/ui-kit';
import { SORT_OPTIONS } from '@commercetools-us-ps/mc-app-core/constants';
import { getSkus } from '../../util';
import GetProductPrices from './get-product-prices.graphql';
import { COLUMN_KEYS, columnDefinitions } from './column-definitions';
import { DATE_FORMAT_OPTIONS, DEFAULT_VARIABLES } from './constants';
import messages from './messages';
import styles from './prices-table.mod.css';

export const DateField = ({ date, message }) => (
  <Spacings.Inline>
    <div className={styles['date-field']}>
      <Text.Body intlMessage={message} />
    </div>
    <Text.Body data-testid="date-field-value">
      {date ? (
        <FormattedDate value={new Date(date)} {...DATE_FORMAT_OPTIONS} />
      ) : (
        NO_VALUE_FALLBACK
      )}
    </Text.Body>
  </Spacings.Inline>
);
DateField.displayName = 'DateField';
DateField.propTypes = {
  date: PropTypes.string,
  message: PropTypes.object.isRequired
};

const PricesTable = ({
  variants,
  currency,
  country,
  customerGroup,
  channel,
  date,
  getMcPriceUrl
}) => {
  const skus = getSkus(variants);
  const { dataLocale } = useApplicationContext();

  const variables = {
    ...DEFAULT_VARIABLES,
    sort: [`${COLUMN_KEYS.NAME}.${dataLocale} ${SORT_OPTIONS.ASC}`],
    locale: dataLocale,
    skus,
    currency,
    ...pickBy(
      {
        country,
        date,
        channel: channel ? JSON.parse(channel).id : null,
        customerGroup: customerGroup ? JSON.parse(customerGroup).id : null
      },
      identity
    )
  };

  const { data, loading, error } = useQuery(GetProductPrices, {
    variables,
    fetchPolicy: 'no-cache'
  });

  function renderItem(results, { rowIndex, columnKey }) {
    const product = results[rowIndex];
    const { name, allVariants } = product.masterData.current;
    const { price } = allVariants[0];
    const value = price ? price.value : null;

    switch (columnKey) {
      case COLUMN_KEYS.NAME:
        return name;
      case COLUMN_KEYS.CURRENCY:
        return value ? value.currencyCode : NO_VALUE_FALLBACK;
      case COLUMN_KEYS.PRICE:
        return value ? (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style="currency"
            currency={price.value.currencyCode}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      case COLUMN_KEYS.COUNTRY:
        if (!price) {
          return NO_VALUE_FALLBACK;
        }
        return price.country ? (
          price.country
        ) : (
          <FormattedMessage {...messages.anyValue} />
        );
      case COLUMN_KEYS.CUSTOMER_GROUP:
        if (!price) {
          return NO_VALUE_FALLBACK;
        }
        return price.customerGroup ? (
          JSON.parse(customerGroup).name
        ) : (
          <FormattedMessage {...messages.anyValue} />
        );
      case COLUMN_KEYS.CHANNEL:
        return price && price.channel
          ? JSON.parse(channel).name
          : NO_VALUE_FALLBACK;
      case COLUMN_KEYS.VALID_DATES:
        return price && (price.validFrom || price.validUntil) ? (
          <Spacings.Stack>
            <DateField date={price.validFrom} message={messages.validFrom} />
            <DateField date={price.validUntil} message={messages.validTo} />
          </Spacings.Stack>
        ) : (
          NO_VALUE_FALLBACK
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  function handleRowClick(item) {
    window.open(
      getMcPriceUrl(item.id, item.masterData.current.allVariants[0].id)
    );
  }

  if (loading) return null;
  if (error)
    return (
      <Text.Body
        data-testid="error-message"
        intlMessage={messages.errorLoading}
      />
    );

  const { results, total } = data.products;

  return (
    <Table
      columns={columnDefinitions}
      items={results}
      itemRenderer={item => renderItem(results, item)}
      rowCount={total}
      onRowClick={(event, rowIndex) => handleRowClick(results[rowIndex])}
    />
  );
};
PricesTable.displayName = 'BundlesTable';
PricesTable.propTypes = {
  variants: PropTypes.array,
  currency: PropTypes.string.isRequired,
  country: PropTypes.string,
  customerGroup: PropTypes.string,
  channel: PropTypes.string,
  date: PropTypes.string,
  getMcPriceUrl: PropTypes.func.isRequired
};

export default PricesTable;
