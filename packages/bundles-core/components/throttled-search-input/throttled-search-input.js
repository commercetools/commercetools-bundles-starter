import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  CloseBoldIcon,
  SearchIcon,
  SecondaryIconButton,
  TextInput,
} from '@commercetools-frontend/ui-kit';
//import debounce from 'lodash/debounce';
var debounce = require('lodash.debounce');
import messages from './messages';
import styles from './throttled-search-input.mod.css';

const ThrottledSearchInput = ({
  handleSearch,
  debounceInterval,
  query,
  setQuery,
}) => {
  const intl = useIntl();
  const debouncedSearch = useCallback(
    debounce(handleSearch, debounceInterval),
    []
  );

  function clear() {
    setQuery('');
    handleSearch('');
  }

  function onQueryChanged(event) {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  }

  return (
    <div>
      <TextInput
        style="primary"
        name="search-text"
        data-testid="search-input"
        placeholder={intl.formatMessage(messages.searchPlaceholder)}
        value={query}
        isAutofocussed={!!query}
        onChange={onQueryChanged}
      />
      <div className={styles['icon-container']}>
        {query ? (
          <SecondaryIconButton
            data-testid="clear-button"
            icon={<CloseBoldIcon />}
            label="Clear"
            onClick={clear}
          />
        ) : (
          <SearchIcon />
        )}
      </div>
    </div>
  );
};

ThrottledSearchInput.displayName = 'ThrottledSearchInput';
ThrottledSearchInput.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  debounceInterval: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
};
export {debounce};
export default ThrottledSearchInput;
