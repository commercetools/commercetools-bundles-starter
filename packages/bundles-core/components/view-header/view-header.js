import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { Text } from '@commercetools-frontend/ui-kit';
import styles from './view-header.mod.css';

const ViewHeader = (props) => (
  <div
    className={classnames(styles[`header-color-${props.color}`], {
      [styles['header-color-with-bottom-line']]: props.withBottomLine,
    })}
  >
    <div className={styles.details}>
      <div className={styles.info}>
        {props.backToList || null}
        <div className={styles['title-container']}>
          <Text.Headline as="h2">{props.title}</Text.Headline>
        </div>
        {Boolean(props.subtitle) && (
          <div className={styles['subtitle-container']}>{props.subtitle}</div>
        )}
        <div className={styles.tabs}>
          <ul className={styles['tabs-list']}>{props.children}</ul>
        </div>
      </div>
      <div className={styles.commands}>{props.commands || null}</div>
    </div>
  </div>
);

ViewHeader.displayName = 'ViewHeader';
ViewHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  backToList: PropTypes.node,
  withBottomLine: PropTypes.bool,
  color: PropTypes.oneOf(['surface', 'neutral']),
  commands: PropTypes.node,
  children: PropTypes.node,
};

ViewHeader.defaultProps = {
  color: 'neutral',
  withBottomLine: true,
};

export default ViewHeader;
