import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const Loading = () => (
  <Spacings.Inline alignItems="center" justifyContent="center">
    <LoadingSpinner data-testid="loading" size="s" />
  </Spacings.Inline>
);
Loading.displayName = 'LoadingState';

export default Loading;
