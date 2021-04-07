import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { FlatButton, Spacings } from '@commercetools-frontend/ui-kit';
import messages from './messages';

export const Pagination = ({ previous, next, offset, rowCount, total }) => {
  const disabled = {
    next: offset + rowCount === total,
    previous: offset === 0,
  };
  const intl = useIntl();

  return (
    <Spacings.Inline
      data-testid="pagination"
      scale="m"
      justifyContent="flex-end"
    >
      <FlatButton
        data-testid="previous-button"
        label={intl.formatMessage(messages.previousButton)}
        isDisabled={disabled.previous}
        onClick={previous}
      />
      <FlatButton
        data-testid="next-button"
        label={intl.formatMessage(messages.nextButton)}
        isDisabled={disabled.next}
        onClick={next}
      />
    </Spacings.Inline>
  );
};
Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default Pagination;
