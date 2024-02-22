import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import Spacings from '@commercetools-uikit/spacings';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { localize } from '../util';
import ProductSearch from './product-search.rest.graphql';
import messages from './messages';

const ItemCache = (initialItems) => ({
  items: { ...initialItems },
  set(id, item) {
    this.items[id] = item;
  },
});

const cache = ItemCache();

const ProductSearchOption = (props) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;
  const variant = JSON.parse(props.data.value);
  const { id, sku, price } = variant;

  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Inline justifyContent="space-between">
        <strong>
          {localize({
            obj: variant,
            key: 'name',
            language: dataLocale,
            fallback: id,
            fallbackOrder: languages,
          })}
        </strong>
        {price && (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style="currency"
            currency={price.value.currencyCode}
          />
        )}
      </Spacings.Inline>

      {id && <div>{`${intl.formatMessage(messages.id)}: ${id}`}</div>}
      {sku && <div>{`${intl.formatMessage(messages.sku)}: ${sku}`}</div>}
    </AsyncSelectInput.Option>
  );
};
ProductSearchOption.displayName = 'ProductSearchOption';
ProductSearchOption.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }),
};

const ProductSearchInput = ({
  name,
  value,
  filter = '',
  cacheItems = true,
  horizontalConstraint,
  placeholder,
  isRequired,
  touched,
  errors,
  hasError,
  onBlur,
  onChange,
  renderError,
}) => {
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;
  const { refetch } = useQuery(ProductSearch, {
    fetchPolicy: 'no-cache',
    skip: true,
    variables: {
      locale: dataLocale,
      text: '',
      filter,
    },
  });

  const mapOptions = (items) =>
    items.map((item) => ({
      value: JSON.stringify(item),
      label: localize({
        obj: item,
        key: 'name',
        language: dataLocale,
        fallback: item.id,
        fallbackOrder: languages,
      }),
    }));

  const getMatchingVariants = (result, product) => {
    const base = {
      productId: product.id,
      name: product.name,
    };

    const addMatchingVariant = (variant) => {
      const { id, sku, price, isMatchingVariant } = variant;
      if (isMatchingVariant) {
        const item = {
          ...base,
          id,
          sku,
          price,
        };
        result.push(item);
        cache.set(id, item);
      }
    };

    addMatchingVariant(product.masterVariant);

    product.variants.forEach((variant) => {
      addMatchingVariant(variant);
    });

    return result;
  };

  const loadOptions = (text) =>
    refetch({ text }).then((response) =>
      mapOptions(response.data.products.results.reduce(getMatchingVariants, []))
    );

  return (
    <AsyncSelectInput
      name={name}
      value={value}
      horizontalConstraint={horizontalConstraint}
      placeholder={placeholder}
      isRequired={isRequired}
      isClearable
      isSearchable
      defaultOptions={cacheItems ? mapOptions(Object.values(cache.items)) : []}
      cacheOptions={cacheItems ? 20 : 0}
      loadOptions={loadOptions}
      components={{
        Option: ProductSearchOption,
      }}
      hasError={hasError}
      touched={touched}
      errors={errors}
      onBlur={onBlur}
      onChange={onChange}
      renderError={renderError}
    />
  );
};
ProductSearchInput.displayName = 'ProductSearchInput';
ProductSearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
  filter: PropTypes.string,
  cacheItems: PropTypes.bool,
  horizontalConstraint: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.object,
  hasError: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  renderError: PropTypes.func,
};

export default ProductSearchInput;
