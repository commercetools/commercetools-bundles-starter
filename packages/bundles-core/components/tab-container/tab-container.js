import PropTypes from 'prop-types';
import React from 'react';
import styles from './tab-container.mod.css';

const TabContainer = ({ color, children, ...rest }) => (
  <div className={styles[`container-color-${color}`]} {...rest}>
    {children}
  </div>
);

TabContainer.displayName = 'TabContainer';
TabContainer.propTypes = {
  color: PropTypes.oneOf(['surface', 'neutral']),
  children: PropTypes.node,
};
TabContainer.defaultProps = {
  color: 'surface',
};

export default TabContainer;
