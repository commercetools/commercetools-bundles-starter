import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from 'react-intl';
import minBy from 'lodash/minBy';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { getAttribute } from '../../../../bundles-core/util';
import { localize } from '../../../../bundles-core/components/util';
import {
  BundlesTable,
  COLUMN_KEYS,
  StatusBadge,
  CategorySearchInput,
} from '../../../../bundles-core/components/index';
import { ATTRIBUTES } from '../../constants';
import { DATE_FORMAT_OPTIONS } from './constants';
import columnDefinitions from './column-definitions';
import messages from './messages';

const DynamicBundlesTable = ({ match, history }) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;
  const [priceType, setPriceType] = useState(null);
  const [category, setCategory] = useState(null);

  function filterByCategory(event, setFilter) {
    const targetValue = event.target.value;
    setCategory(targetValue);
    const getCategoryFilter = () =>
      `variants.attributes.category-search: "${targetValue.value}"`;
    setFilter(targetValue, 'category', getCategoryFilter);
  }

  function filterByPriceType(event, setFilter) {
    const value = event.target.value;
    setPriceType(value);
    const getBundleByPrice = () =>
      `variants.attributes.dynamic-price:"${value}"`;
    setFilter(value, 'dynamicPrice', getBundleByPrice);
  }

  function renderItem(row, columnKey) {
    const bundle = row;
    const masterVariant = bundle.masterVariant;
    switch (columnKey) {
      case COLUMN_KEYS.NAME:
        return localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallbackOrder: languages,
        });
      case COLUMN_KEYS.STATUS: {
        const { published, hasStagedChanges } = bundle;
        const code = StatusBadge.getCode(published, hasStagedChanges);
        return <StatusBadge code={code} />;
      }
      case COLUMN_KEYS.PRICE: {
        const dynamicPrice = getAttribute(
          masterVariant.attributes,
          ATTRIBUTES.DYNAMIC_PRICE
        );
        if (dynamicPrice) {
          return <FormattedMessage {...messages.dynamicValue} />;
        }

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
      filterInputs={(filter) => (
        <>
          <SelectInput
            name="price-type-filter"
            placeholder={intl.formatMessage(messages.priceFilterPlaceholder)}
            horizontalConstraint="scale"
            isClearable
            onChange={(event) => filterByPriceType(event, filter)}
            value={priceType}
            options={[
              {
                value: 'true',
                label: intl.formatMessage(messages.dynamicValue),
              },
              {
                value: 'false',
                label: intl.formatMessage(messages.staticValue),
              },
            ]}
          />
          <CategorySearchInput
            name="category"
            placeholder={intl.formatMessage(messages.categoryFilterPlaceholder)}
            horizontalConstraint="scale"
            value={category}
            onChange={(event) => filterByCategory(event, filter)}
          />
        </>
      )}
    />
  );
};

DynamicBundlesTable.displayName = 'DynamicBundlesTable';
DynamicBundlesTable.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default DynamicBundlesTable;
