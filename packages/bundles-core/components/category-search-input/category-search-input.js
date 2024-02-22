import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { getPathName, transformLocalizedFieldsForCategory } from '../util';
import CategorySearch from './category-search.graphql';

const transformResults = (results) =>
  results.map((category) =>
    transformLocalizedFieldsForCategory(category, [
      { from: 'nameAllLocales', to: 'name' },
    ])
  );

const CategorySearchInput = ({
  name,
  value,
  horizontalConstraint,
  placeholder,
  showProductCount = false,
  isRequired,
  hasError,
  touched,
  errors,
  onBlur,
  onChange,
}) => {
  const { dataLocale, project } = useApplicationContext();
  const { refetch } = useQuery(CategorySearch, {
    skip: true,
    variables: {
      limit: 20,
      offset: 0,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  const { languages } = project;

  const loadOptions = (text) =>
    refetch({ fullText: { locale: dataLocale, text } }).then((response) => {
      const categories = transformResults(response.data.categories.results);
      return categories.map((category) => ({
        label: `${getPathName(category, dataLocale, languages)} ${
          showProductCount ? `(${category.stagedProductCount})` : ''
        }`,
        value: category.id,
      }));
    });

  return (
    <AsyncSelectInput
      name={name}
      value={value}
      horizontalConstraint={horizontalConstraint}
      placeholder={placeholder}
      isRequired={isRequired}
      isClearable
      isSearchable
      cacheOptions={20}
      loadOptions={loadOptions}
      hasError={hasError}
      touched={touched}
      errors={errors}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};
CategorySearchInput.displayName = 'CategorySearchInput';
CategorySearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  horizontalConstraint: PropTypes.string,
  placeholder: PropTypes.string,
  showProductCount: PropTypes.bool,
  isRequired: PropTypes.bool,
  touched: PropTypes.arrayOf(PropTypes.bool),
  errors: PropTypes.shape({
    missing: PropTypes.bool,
  }),
  hasError: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default CategorySearchInput;
