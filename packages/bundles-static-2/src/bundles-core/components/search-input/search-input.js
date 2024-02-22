import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import TextInput from '@commercetools-uikit/text-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Spacings from '@commercetools-uikit/spacings';
import { CloseIcon, SearchIcon } from '@commercetools-uikit/icons';
import messages from './messages';
import styles from './search-input.mod.css';

const SearchInput = ({ value, onChange, onSubmit, placeholder }) => {
  const intl = useIntl();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const enter = 'Enter';

  function clear() {
    onChange('');
    onSubmit('');
    setSearchPerformed(false);
  }

  function search(searchTerm) {
    onChange(searchTerm);
    onSubmit(searchTerm);
  }

  function onQueryChanged(event) {
    onChange(event.target.value);
    setSearchPerformed(true);
  }

  function onKeyPress(event) {
    if (event.key === enter) {
      onSubmit(value);
    }
  }

  return (
    <div>
      <Spacings.Inline scale="m" justifyContent="space-between">
        <div
          data-testid="search-wrapper"
          className={styles['search-wrapper']}
          onKeyPress={onKeyPress}
        >
          <TextInput
            data-testid="search-input"
            style="primary"
            name="search-text"
            placeholder={placeholder}
            value={value}
            isAutofocussed={!!value}
            onChange={onQueryChanged}
          />
          {(value || searchPerformed) && (
            <div className={styles['icon-container']}>
              <SecondaryIconButton
                data-testid="clear-button"
                tone="primary"
                type="reset"
                icon={<CloseIcon size="medium" />}
                label={intl.formatMessage(messages.clearButton)}
                onClick={clear}
              />
            </div>
          )}
        </div>
        <PrimaryButton
          data-testid="search-button"
          iconLeft={<SearchIcon />}
          label={intl.formatMessage(messages.searchButton)}
          onClick={() => search(value)}
          isDisabled={!value}
        />
      </Spacings.Inline>
    </div>
  );
};

SearchInput.displayName = 'SearchInput';
SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
