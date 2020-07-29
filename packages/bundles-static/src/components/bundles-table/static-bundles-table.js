import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedNumber, useIntl } from 'react-intl';
import { find, minBy } from 'lodash';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { localize } from '@commercetools-us-ps/mc-app-core/util';
import BundlesTable, {
  COLUMN_KEYS
} from '@commercetools-us-ps/mc-app-bundles-core/components/bundles-table';
import {
  CategorySearchInput,
  ProductSearchInput,
  StatusBadge
} from '@commercetools-us-ps/mc-app-core/components';
import { DATE_FORMAT_OPTIONS, PRODUCTS_ATTRIBUTE } from './constants';
import columnDefinitions from './column-definitions';
import messages from './messages';

const StaticBundlesTable = ({ match, history }) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);

  function filterByCategory(event, setFilter) {
    const targetValue = event.target.value;
    setCategory(targetValue);
    const getCategoryFilter = () => `categories.id:"${targetValue.value}"`;
    setFilter(targetValue, 'category', getCategoryFilter);
  }

  function filterByProduct(event, setFilter) {
    const targetValue = event.target.value;
    setProduct(targetValue);
    const getProductFilter = () => {
      const { productId, id } = JSON.parse(targetValue.value);
      return `variants.attributes.productSearch:"${productId}/${id}"`;
    };
    setFilter(targetValue, 'product', getProductFilter);
  }

  function renderItem(results, { rowIndex, columnKey }) {
    const bundle = results[rowIndex];
    const { masterVariant } = bundle;

    switch (columnKey) {
      case COLUMN_KEYS.NAME:
        return localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallbackOrder: languages
        });
      case COLUMN_KEYS.PRODUCTS: {
        const products = find(masterVariant.attributes, {
          name: PRODUCTS_ATTRIBUTE
        });
        return products ? products.value.length : NO_VALUE_FALLBACK;
      }
      case COLUMN_KEYS.STATUS: {
        const { published, hasStagedChanges } = bundle;
        const code = StatusBadge.getCode(published, hasStagedChanges);
        return <StatusBadge code={code} />;
      }
      case COLUMN_KEYS.PRICE: {
        const price = minBy(masterVariant.prices, 'value.centAmount');
        return price ? (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style="currency"
            currency={price.value.currencyCode}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      }
      case COLUMN_KEYS.MODIFIED:
        return (
          <FormattedDate
            value={bundle.lastModifiedAt}
            {...DATE_FORMAT_OPTIONS}
          />
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  return (
    <BundlesTable
      match={match}
      history={history}
      columnDefinitions={columnDefinitions}
      renderItem={renderItem}
      title={messages.title}
      subtitle={messages.titleResults}
      filterInputs={filter => (
        <>
          <CategorySearchInput
            name="category"
            placeholder={intl.formatMessage(messages.categoryFilterPlaceholder)}
            horizontalConstraint="m"
            value={category}
            onChange={event => filterByCategory(event, filter)}
          />
          <ProductSearchInput
            name="product"
            placeholder={intl.formatMessage(messages.productFilterPlaceholder)}
            horizontalConstraint="m"
            value={product}
            onChange={event => filterByProduct(event, filter)}
          />
        </>
      )}
    />
  );
};

StaticBundlesTable.displayName = 'StaticBundlesTable';
StaticBundlesTable.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default StaticBundlesTable;
