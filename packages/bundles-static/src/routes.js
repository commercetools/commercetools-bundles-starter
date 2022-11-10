import { useQuery } from '@apollo/client';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  BundleProvider,
  PathProvider,
  GetBundleProductType,
} from '../../bundles-core/context';
import { Error } from '../../bundles-core/components/index';
import StaticBundlesTable from './components/bundles-table';
import CreateBundleForm from './components/create-bundle-form';
import StaticBundleDetails from './components/bundle-details';
import { BUNDLE_PRODUCT_TYPE, ROOT_PATH } from './constants';
import { messages } from './messages';

const ApplicationRoutes = () => {
  const match = useRouteMatch();
  const { data, loading, error } = useQuery(GetBundleProductType, {
    variables: {
      key: BUNDLE_PRODUCT_TYPE,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  if (loading) {
    return null;
  }

  const { productType } = data;

  if (error || !productType) {
    return (
      <Error
        title={<FormattedMessage {...messages.missingBundleTitle} />}
        message={<FormattedMessage {...messages.missingBundleMessage} />}
      />
    );
  }

  const { id } = productType;

  return (
    <PathProvider value={ROOT_PATH}>
      <BundleProvider value={id}>
        <Switch>
          <Route
            path={`${match.path}/new`}
            render={(props) => <CreateBundleForm {...props} />}
          />
          <Route
            path={`${match.path}/:bundleId`}
            render={(props) => <StaticBundleDetails {...props} />}
          />
          <Route render={(props) => <StaticBundlesTable {...props} />} />
        </Switch>
      </BundleProvider>
    </PathProvider>
  );
};

ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
