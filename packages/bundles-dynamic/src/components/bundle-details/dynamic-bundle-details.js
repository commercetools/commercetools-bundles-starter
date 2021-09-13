import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { getAttribute } from '../../../../bundles-core/util';
import {
  BundleDetails,
  BundleImages,
  TabHeader,
} from '../../../../bundles-core/components/index';
import { transformLocalizedFieldToString } from '../../../../bundles-core/components/util';
import { ATTRIBUTES, ROOT_PATH } from '../../constants';
import EditBundleForm from '../edit-bundle-form';
import BundlePreview from '../bundle-preview';
import BundlePrices from '../bundle-prices';
import messages from './messages';

export const transformResults = (results) => {
  const { masterVariant } = results;
  const { attributesRaw, images, sku, price } = masterVariant;

  return {
    name: transformLocalizedFieldToString(results.nameAllLocales),
    description: transformLocalizedFieldToString(results.descriptionAllLocales),
    sku,
    dynamicPrice: getAttribute(attributesRaw, ATTRIBUTES.DYNAMIC_PRICE),
    minQuantity: getAttribute(attributesRaw, ATTRIBUTES.MIN_QUANTITY),
    maxQuantity: getAttribute(attributesRaw, ATTRIBUTES.MAX_QUANTITY),
    categories: getAttribute(attributesRaw, ATTRIBUTES.CATEGORIES),
    slug: results.slug,
    images,
    price,
  };
};

const DynamicBundleDetails = ({ match }) => {
  const intl = useIntl();
  const DETAIL_ROUTE = `/${match.params.projectKey}/${ROOT_PATH}/${match.params.bundleId}`;
  return (
    <BundleDetails
      match={match}
      transformResults={transformResults}
      headers={
        <>
          <TabHeader
            to={`${DETAIL_ROUTE}/general`}
            key={intl.formatMessage(messages.generalTab)}
            name={intl.formatMessage(messages.generalTab)}
          >
            <FormattedMessage {...messages.generalTab} />
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/images`}
            key={intl.formatMessage(messages.imagesTab)}
            name={intl.formatMessage(messages.imagesTab)}
          >
            <FormattedMessage {...messages.imagesTab} />
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/prices`}
            key={intl.formatMessage(messages.pricesTab)}
            name={intl.formatMessage(messages.pricesTab)}
          >
            <FormattedMessage {...messages.pricesTab} />
          </TabHeader>
          <TabHeader
            to={`${DETAIL_ROUTE}/preview`}
            key={intl.formatMessage(messages.previewTab)}
            name={intl.formatMessage(messages.previewTab)}
          >
            <FormattedMessage {...messages.previewTab} />
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
              <BundleImages match={match} {...bundle} onComplete={onComplete} />
            )}
          />
          <Route
            path={`${match.url}/prices`}
            render={() => <BundlePrices match={match} {...bundle} />}
          />
          <Route
            path={`${match.url}/preview`}
            render={() => (
              <BundlePreview
                match={match}
                bundle={bundle}
                refetch={onComplete}
              />
            )}
          />
        </Switch>
      )}
    />
  );
};

DynamicBundleDetails.displayName = 'BundleDetails';
DynamicBundleDetails.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
      bundleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DynamicBundleDetails;
