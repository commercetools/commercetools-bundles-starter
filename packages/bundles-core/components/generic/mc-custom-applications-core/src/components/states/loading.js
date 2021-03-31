import React from 'react';
import { LoadingSpinner, Spacings } from '@commercetools-frontend/ui-kit';

const Loading = () => (
  <Spacings.Inline alignItems="center" justifyContent="center">
    <LoadingSpinner data-testid="loading" size="s" />
  </Spacings.Inline>
);
Loading.displayName = 'LoadingState';

export default Loading;
