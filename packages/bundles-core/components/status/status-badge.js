import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Spacings from '@commercetools-uikit/spacings';
import styles from './status-badge.mod.css';
import messages from './messages';

export const PRODUCT_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  MODIFIED: 'modified',
};

export const PRODUCT_ACTIONS = {
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish',
};

const StatusBadge = ({ className, code }) => (
  <div
    data-testid="status-badge"
    className={classNames(styles.container, className)}
  >
    <Spacings.Inline scale="s" alignItems="center">
      <div data-testid="status-indicator" className={styles[code]} />
      <span>
        <FormattedMessage data-testid="status-message" {...messages[code]} />
      </span>
    </Spacings.Inline>
  </div>
);
StatusBadge.displayName = 'StatusBadge';
StatusBadge.propTypes = {
  className: PropTypes.string,
  code: PropTypes.oneOf([
    PRODUCT_STATUS.PUBLISHED,
    PRODUCT_STATUS.UNPUBLISHED,
    PRODUCT_STATUS.MODIFIED,
    PRODUCT_ACTIONS.PUBLISH,
    PRODUCT_ACTIONS.UNPUBLISH,
  ]).isRequired,
};
StatusBadge.getCode = (published, hasStagedChanges) => {
  let code;
  if (published && hasStagedChanges) {
    code = PRODUCT_STATUS.MODIFIED;
  } else if (published) {
    code = PRODUCT_STATUS.PUBLISHED;
  } else {
    code = PRODUCT_STATUS.UNPUBLISHED;
  }
  return code;
};

export default StatusBadge;
