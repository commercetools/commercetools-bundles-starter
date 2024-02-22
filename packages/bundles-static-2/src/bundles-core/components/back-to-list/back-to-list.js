import PropTypes from 'prop-types';
import React from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import { ListIcon, BackIcon } from '@commercetools-uikit/icons';

export const BackToList = ({ iconType, ...props }) => {
  const icon =
    iconType === 'list' ? (
      <ListIcon size="medium" color="primary" />
    ) : (
      <BackIcon size="medium" color="primary" />
    );
  return <FlatButton as="a" {...props} icon={icon} />;
};

BackToList.displayName = 'BackToList';
BackToList.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  iconType: PropTypes.oneOf(['list', 'arrow']),
};
BackToList.defaultProps = {
  iconType: 'list',
};

export default BackToList;
