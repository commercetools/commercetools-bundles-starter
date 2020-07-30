import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const COLUMN_KEYS = {
  CATEGORY: 'category',
  MIN_PRICE: 'minPrice',
  MAX_PRICE: 'maxPrice',
};

export const columnDefinitions = [
  {
    key: COLUMN_KEYS.CATEGORY,
    label: <FormattedMessage {...messages.categoryColumn} />,
  },
  {
    key: COLUMN_KEYS.MIN_PRICE,
    label: <FormattedMessage {...messages.minPriceColumn} />,
  },
  {
    key: COLUMN_KEYS.MAX_PRICE,
    label: <FormattedMessage {...messages.maxPriceColumn} />,
  },
];
