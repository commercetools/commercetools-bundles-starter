import React from 'react';
import { FormattedMessage } from 'react-intl';
import partial from 'lodash/partial';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';

// eslint-disable-next-line import/prefer-default-export
export const useShowSideNotification = (kind, intlMessage) =>
  partial(
    useShowNotification({
      kind,
      domain: DOMAINS.SIDE,
    }),
    { text: <FormattedMessage {...intlMessage} /> }
  );
