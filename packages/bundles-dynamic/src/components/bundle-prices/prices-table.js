import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import compact from 'lodash/compact';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { useQuery } from '@apollo/client';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import DataTable from '@commercetools-uikit/data-table';
import { getPriceFilters, getScopedPriceParameters } from '../../util';
import { getCategoryAttributes } from '../bundle-preview/category-product-field';
import GetPriceRange from '../get-price-range.rest.graphql';
import { COLUMN_KEYS, columnDefinitions } from './column-definitions';

const PricesTable = ({
  mcUrl,
  categories,
  currency,
  country,
  customerGroup,
  channel,
  date,
}) => {
  const [results, setResults] = useState(null);
  const { refetch: getPriceRange } = useQuery(GetPriceRange, {
    fetchPolicy: 'no-cache',
    skip: true,
  });

  React.useEffect(() => {
    const getPriceRangePromises = () =>
      reduce(
        categories,
        (result, category) => {
          const { id } = getCategoryAttributes(category);
          const scopedPrice = getScopedPriceParameters(
            getPriceFilters(currency, country, date, channel, customerGroup)
          );
          return [...result, getPriceRange({ category: id, scopedPrice })];
        },
        []
      );
    const getTableResults = (ranges) =>
      compact(
        map(ranges, (result, index) => {
          const { data } = result;
          if (data) {
            const { min, max } =
              data.products.facets[
                'variants.scopedPrice.currentValue.centAmount'
              ].ranges[0];
            const category = categories[index];
            const { id, path } = getCategoryAttributes(category);
            return {
              id,
              path,
              min,
              max,
            };
          }

          return null;
        })
      );

    const getRanges = async () => {
      const promises = getPriceRangePromises();
      const ranges = await Promise.all(promises);
      setResults(getTableResults(ranges));
    };

    getRanges();
  }, [currency, country, customerGroup, channel, date]);

  function renderItem(data, columnKey) {
    const row = data;
    const { path, min, max } = row;

    switch (columnKey) {
      case COLUMN_KEYS.CATEGORY:
        return path;
      case COLUMN_KEYS.MIN_PRICE:
        return min ? (
          <FormattedNumber
            value={min / 100}
            style="currency"
            currency={currency}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      case COLUMN_KEYS.MAX_PRICE:
        return max ? (
          <FormattedNumber
            value={max / 100}
            style="currency"
            currency={currency}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  function handleRowClick(item) {
    window.open(`${mcUrl}/categories/${item.id}/products`);
  }

  if (!results) return null;

  return (
    <DataTable
      columns={columnDefinitions}
      rows={results}
      itemRenderer={(row, column) => renderItem(row, column['key'])}
      rowCount={categories.length}
      onRowClick={(event, rowIndex) => handleRowClick(results[rowIndex])}
    />
  );
};
PricesTable.displayName = 'PricesTable';
PricesTable.propTypes = {
  mcUrl: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  currency: PropTypes.string.isRequired,
  country: PropTypes.string,
  customerGroup: PropTypes.string,
  channel: PropTypes.string,
  date: PropTypes.string,
};

export default PricesTable;
