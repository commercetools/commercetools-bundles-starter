import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import {
  PathProvider,
  BundleProvider,
  GetBundleProductType,
} from '@commercetools-us-ps/bundles-core/context';
import { Error } from '@commercetools-us-ps/bundles-core/components';
import { BUNDLE_PRODUCT_TYPE, ROOT_PATH } from './constants';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { FormattedMessage } from 'react-intl';
import { messages } from './messages';
import { StaticBundlesTable } from './components/bundles-table';
import { StaticBundleDetails } from './components/bundle-details';
import { CreateBundleForm } from './components/create-bundle-form';

const ApplicationRoutes = () => {
  const match = useRouteMatch();

  const { data, loading, error } = useMcQuery(GetBundleProductType, {
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

  return (
    <Spacings.Inset scale="l">
      <PathProvider value={ROOT_PATH}>
        <BundleProvider value={productType.id}>
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
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
