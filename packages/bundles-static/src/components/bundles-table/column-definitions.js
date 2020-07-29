import React from 'react';
import { FormattedMessage } from 'react-intl';
import { COLUMN_KEYS } from '@commercetools-us-ps/mc-app-bundles-core/components/bundles-table';
import messages from './messages';

const columnDefinitions = [
  {
    key: COLUMN_KEYS.NAME,
    isSortable: true,
    flexGrow: 1,
    label: <FormattedMessage {...messages.nameColumn} />
  },
  {
    key: COLUMN_KEYS.PRODUCTS,
    flexGrow: 1,
    label: <FormattedMessage {...messages.productCountColumn} />
  },
  {
    key: COLUMN_KEYS.STATUS,
    flexGrow: 1,
    label: <FormattedMessage {...messages.statusColumn} />
  },
  {
    key: COLUMN_KEYS.PRICE,
    isSortable: true,
    flexGrow: 1,
    label: <FormattedMessage {...messages.priceColumn} />
  },
  {
    key: COLUMN_KEYS.MODIFIED,
    isSortable: true,
    flexGrow: 1,
    label: <FormattedMessage {...messages.lastModifiedAtColumn} />
  }
];

export default columnDefinitions;
