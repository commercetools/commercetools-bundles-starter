import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { useIntl } from 'react-intl';
import { find } from 'lodash';
import BundleDetails from '@commercetools-us-ps/mc-app-bundles-core/components/bundle-details';
import { TabHeader } from '@commercetools-us-ps/mc-app-core/components';
import { transformLocalizedFieldToString } from '@commercetools-us-ps/mc-app-core/util';
import { ROOT_PATH } from '../../constants';
import EditBundleForm from '../edit-bundle-form';
import StaticBundleImages from '../bundle-images';
import BundlePrices from '../bundle-prices';
import messages from './messages';

export const transformResults = results => ({
  variantId: results.masterVariant.id,
  name: transformLocalizedFieldToString(results.nameAllLocales),
  description: transformLocalizedFieldToString(results.descriptionAllLocales),
  sku: results.masterVariant.sku,
  products: find(results.masterVariant.attributesRaw, { name: 'products' })
    .value,
  slug: results.slug,
  images: results.masterVariant.images
});

const StaticBundleDetails = ({ match }) => {
  const intl = useIntl();
  return (
    <BundleDetails
      match={match}
      transformResults={transformResults}
      headers={
        <>
          <TabHeader
            to={`/${match.params.projectKey}/${ROOT_PATH}/${match.params.bundleId}/general`}
            key={intl.formatMessage(messages.generalTab)}
            name={intl.formatMessage(messages.generalTab)}
          >
            {intl.formatMessage(messages.generalTab)}
          </TabHeader>
          <TabHeader
            to={`/${match.params.projectKey}/${ROOT_PATH}/${match.params.bundleId}/images`}
            key={intl.formatMessage(messages.imagesTab)}
            name={intl.formatMessage(messages.imagesTab)}
          >
            {intl.formatMessage(messages.imagesTab)}
          </TabHeader>
          <TabHeader
            to={`/${match.params.projectKey}/${ROOT_PATH}/${match.params.bundleId}/prices`}
            key={intl.formatMessage(messages.pricesTab)}
            name={intl.formatMessage(messages.pricesTab)}
          >
            {intl.formatMessage(messages.pricesTab)}
          </TabHeader>
        </>
      }
      container={(bundle, onComplete) => (
        <Switch>
          <Route
            exact
            path={`${match.url}/general`}
            render={() => (
              <EditBundleForm bundle={bundle} onComplete={onComplete} />
            )}
          />
          <Route
            path={`${match.url}/images`}
            render={() => (
              <StaticBundleImages
                match={match}
                {...bundle}
                onComplete={onComplete}
              />
            )}
          />
          <Route
            path={`${match.url}/prices`}
            render={() => <BundlePrices match={match} bundle={bundle} />}
          />
        </Switch>
      )}
    />
  );
};

StaticBundleDetails.displayName = 'BundleDetails';
StaticBundleDetails.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
      bundleId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default StaticBundleDetails;
