import React from 'react';
import PropTypes from 'prop-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

export default function Error({ title, message }) {
  return (
    <Spacings.Inline scale="m" alignItems="center" justifyContent="center">
      <Spacings.Stack scale="m" alignItems="center">
        <Text.Headline data-testid="error-message" as="h2">
          {title}
        </Text.Headline>
        {message && <Text.Body>{message}</Text.Body>}
      </Spacings.Stack>
    </Spacings.Inline>
  );
}
Error.displayName = 'ErrorState';
Error.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};
