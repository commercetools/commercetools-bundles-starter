import PropTypes from 'prop-types';
import React from 'react';
import styles from './view.mod.css';

const View = ({ children, ...rest }) => (
  <div className={styles.view} {...rest}>
    {children}
  </div>
);

View.displayName = 'View';
View.propTypes = {
  children: PropTypes.node,
};

export default View;
