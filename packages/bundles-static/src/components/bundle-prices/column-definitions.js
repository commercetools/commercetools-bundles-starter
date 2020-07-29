import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const COLUMN_KEYS = {
  NAME: 'masterData.current.name',
  CURRENCY: 'currency',
  PRICE: 'price',
  COUNTRY: 'country',
  CUSTOMER_GROUP: 'customerGroup',
  CHANNEL: 'channel',
  VALID_DATES: 'validDates'
};

export const columnDefinitions = [
  {
    key: COLUMN_KEYS.NAME,
    flexGrow: 1,
    label: <FormattedMessage {...messages.nameColumn} />
  },
  {
    key: COLUMN_KEYS.CURRENCY,
    label: <FormattedMessage {...messages.currencyColumn} />
  },
  {
    key: COLUMN_KEYS.PRICE,
    label: <FormattedMessage {...messages.priceColumn} />
  },
  {
    key: COLUMN_KEYS.COUNTRY,
    label: <FormattedMessage {...messages.countryColumn} />
  },
  {
    key: COLUMN_KEYS.CUSTOMER_GROUP,
    label: <FormattedMessage {...messages.customerGroupColumn} />
  },
  {
    key: COLUMN_KEYS.CHANNEL,
    flexGrow: 1,
    label: <FormattedMessage {...messages.channelColumn} />
  },
  {
    key: COLUMN_KEYS.VALID_DATES,
    flexGrow: 1,
    label: <FormattedMessage {...messages.validDatesColumn} />
  }
];
