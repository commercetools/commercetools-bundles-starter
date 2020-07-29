import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LockedDiamondSVG from '@commercetools-frontend/assets/images/locked-diamond.svg';
import { MaintenancePageLayout } from '@commercetools-frontend/application-components';
import {
  BundleProvider,
  PathProvider,
  GetBundleProductType
} from '@commercetools-us-ps/mc-app-bundles-core/context';
import Error from '@commercetools-us-ps/mc-app-core/components/states/error';
import StaticBundlesTable from './components/bundles-table';
import CreateBundleForm from './components/create-bundle-form';
import StaticBundleDetails from './components/bundle-details';
import { BUNDLE_PRODUCT_TYPE, PERMISSIONS, ROOT_PATH } from './constants';
import { messages } from './messages';

const PageUnauthorized = () => (
  <MaintenancePageLayout
    imageSrc={LockedDiamondSVG}
    title={<FormattedMessage {...messages.accessDeniedTitle} />}
    paragraph1={<FormattedMessage {...messages.accessDeniedMessage} />}
  />
);
PageUnauthorized.displayName = 'PageUnauthorized';

const ApplicationRoutes = ({ match }) => {
  const canViewProducts = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ViewProducts, PERMISSIONS.ManageProducts],
    shouldMatchSomePermissions: true
  });

  const { data, loading, error } = useQuery(GetBundleProductType, {
    variables: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      key: BUNDLE_PRODUCT_TYPE
    }
  });

  if (!canViewProducts) {
    return <PageUnauthorized />;
  }

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
            render={props => <CreateBundleForm {...props} />}
          />
          <Route
            path={`${match.path}/:bundleId`}
            render={props => <StaticBundleDetails {...props} />}
          />
          <Route render={props => <StaticBundlesTable {...props} />} />
        </Switch>
      </BundleProvider>
    </PathProvider>
  );
};

ApplicationRoutes.displayName = 'ApplicationRoutes';
ApplicationRoutes.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default ApplicationRoutes;
