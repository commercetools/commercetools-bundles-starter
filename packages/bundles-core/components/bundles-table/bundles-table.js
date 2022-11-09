import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import omit from 'lodash/omit';
import values from 'lodash/values';
import { stringify } from 'qs';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  Card,
  FlatButton,
  PlusBoldIcon,
  SecondaryButton,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';
import { Error, Loading, PaginatedTable, SearchInput } from '../index';
import { SORT_OPTIONS } from '../constants';
import { useBundleContext } from '../../context/bundle-context';
import { COLUMN_KEYS } from './column-definitions';
import { DEFAULT_VARIABLES } from './constants';
import BundleProductsSearch from './bundle-search.rest.graphql';
import messages from './messages';

const BundlesTable = ({
  match,
  history,
  title,
  subtitle,
  columnDefinitions,
  renderItem,
  filterInputs,
}) => {
  const intl = useIntl();
  const { dataLocale } = useApplicationContext();
  const { where } = useBundleContext();
  const [query, setQuery] = useState('');
  const [measurementCache, setMeasurementCache] = useState(null);
  const [sort, setSort] = useState(COLUMN_KEYS.MODIFIED);
  const [direction, setDirection] = useState(SORT_OPTIONS.DESC);
  const [filters, setFilters] = useState({ where });

  const QUERY_VARIABLES = {
    ...DEFAULT_VARIABLES,
    filter: [where],
  };

  const [queryString, setQueryString] = useState('');
  const [variables, setVariables] = useState(QUERY_VARIABLES);
  const { data, error, loading } = useQuery(BundleProductsSearch, {
    variables: { queryString },
  });

  useEffect(() => {
    setQueryString(stringify(variables, { arrayFormat: 'repeat' }));
  }, [variables]);

  function clearMeasurementCache() {
    if (measurementCache) {
      measurementCache.clearAll();
    }
  }

  function handleRowClick(id) {
    history.push(`${match.url}/${id}/general`);
  }

  function getProducts(key, value) {
    clearMeasurementCache();
    setVariables({ ...variables, ...{ [key]: value } });
  }

  function handleSortChange(column, sortDirection) {
    setSort(column);
    setDirection(sortDirection);
    getProducts(
      'sort',
      `${column}${
        column === COLUMN_KEYS.NAME ? `.${dataLocale}` : ''
      } ${sortDirection}`
    );
  }

  function next() {
    const nextOffset = variables.offset + variables.limit;
    getProducts('offset', nextOffset);
  }

  function previous() {
    const nextOffset = variables.offset - variables.limit;
    getProducts('offset', nextOffset);
  }

  function search(searchTerm) {
    if (searchTerm) {
      getProducts(`text.${dataLocale}`, searchTerm);
    } else {
      setVariables({ ...QUERY_VARIABLES, filter: values(filters) });
    }
  }

  function filter(value, type, getFilterValue) {
    if (value) {
      const newFilters = { ...filters, [type]: getFilterValue() };
      setFilters(newFilters);
      getProducts('filter', values(newFilters));
    } else {
      const newFilters = omit(filters, type);
      setFilters(newFilters);
      setVariables({
        ...QUERY_VARIABLES,
        filter: values(newFilters),
        ...(!!query && { [`text.${dataLocale}`]: query }),
      });
    }
  }

  const hasFilters = () => Object.keys(filters).length > 1;

  if (loading) return <Loading />;
  if (error)
    return (
      <Error
        title={intl.formatMessage(messages.errorLoadingTitle)}
        message={error.message}
      />
    );

  const { products } = data;
  const { results, count, total } = products;
  const { offset } = variables;

  return (
    <Spacings.Inset scale="m">
      <Spacings.Stack scale="m">
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline alignItems="baseline" scale="m">
            <Text.Headline as="h2" intlMessage={title} />
            <Text.Body tone="secondary">
              <FormattedMessage {...subtitle} values={{ total }} />
            </Text.Body>
          </Spacings.Inline>
          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            as="a"
            href={`${match.url}/new`}
            label={intl.formatMessage(messages.linkToCreateBundleTitle)}
          />
        </Spacings.Inline>
        <Card theme="dark" type="flat">
          <Spacings.Stack scale="m">
            <SearchInput
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              value={query}
              onChange={setQuery}
              onSubmit={search}
            />
            {filterInputs && (
              <Card theme="light" type="flat">
                <Spacings.Inline scale="m" alignItems="center">
                  <Text.Body intlMessage={messages.filter} />
                  {filterInputs(filter)}
                </Spacings.Inline>
              </Card>
            )}
          </Spacings.Stack>
        </Card>
        {count > 0 ? (
          <PaginatedTable
            columns={columnDefinitions}
            rows={results}
            itemRenderer={(row, column) => renderItem(row, column['key'])}
            rowCount={count}
            total={total}
            offset={offset}
            next={next}
            previous={previous}
            registerMeasurementCache={setMeasurementCache}
            onRowClick={(event, rowIndex) =>
              handleRowClick(results[rowIndex].id)
            }
            sortBy={sort}
            sortDirection={direction}
            onSortChange={handleSortChange}
          />
        ) : (
          <Spacings.Inline scale="xs">
            <Text.Body
              intlMessage={
                query || hasFilters()
                  ? messages.errorNoSearchResultsTitle
                  : messages.errorNoResultsTitle
              }
              data-testid="no-results-error"
            />
            {!query && !hasFilters() && (
              <FlatButton
                as="a"
                href={`${match.url}/new`}
                label={`${intl.formatMessage(
                  messages.linkToCreateBundleTitle
                )}.`}
                isDisabled={false}
              />
            )}
          </Spacings.Inline>
        )}
      </Spacings.Stack>
    </Spacings.Inset>
  );
};

BundlesTable.displayName = 'BundlesTable';
BundlesTable.propTypes = {
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
  title: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    defaultMessage: PropTypes.string.isRequired,
  }).isRequired,
  subtitle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    defaultMessage: PropTypes.string.isRequired,
  }).isRequired,
  columnDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      isSortable: PropTypes.bool,
      flexGrow: PropTypes.number,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
  renderItem: PropTypes.func.isRequired,
  filterInputs: PropTypes.func,
};

export default BundlesTable;
