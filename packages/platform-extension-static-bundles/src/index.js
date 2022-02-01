import * as util from 'util';
import noop from 'lodash';
import NodeCache from 'node-cache';
import Commercetools from './commercetools.js';
import { buildErrorResponse, buildSuccessResponse } from './api-extension.js';
import Helper from './helper.js';
import { CONFIG_KEYS, TYPE_KEY } from './constants.js';
import CartHandler from './cartHandler.js';

// Disable verbose logging if not in development env
if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
}

const commercetools = Commercetools({
  // we need to *explicitly* reference the process.env variable for dotenv-webpack to replace them.
  oauthHost: process.env.commercetools_token_url || 'https://auth.us-central1.gcp.commercetools.com',
  host: process.env.commercetools_api_url || 'https://api.us-central1.gcp.commercetools.com',
  concurrency: process.env[CONFIG_KEYS.CT_CONCURRENCY] || process.env.commercetools_api_concurrency,
  clientId: process.env[CONFIG_KEYS.CT_CLIENT_ID] || process.env.commercetools_client_id,
  clientSecret: process.env[CONFIG_KEYS.CT_SECRET] || process.env.commercetools_client_secret,
  projectKey: process.env[CONFIG_KEYS.CT_PROJECT_KEY] || process.env.commercetools_project_key,
  scopes: process.env[CONFIG_KEYS.CT_SCOPES] ? process.env[CONFIG_KEYS.CT_SCOPES].split(',') : process.env.commercetools_scopes.split(','),
});
const cache = new NodeCache({ stdTTL: process.env[CONFIG_KEYS.CACHE_TTL] });
const helper = Helper({
  commercetools,
  cache,
  bundleProductTypeKey: TYPE_KEY.STATIC_BUNDLE_PARENT,
  customTypeKey: TYPE_KEY.STATIC_BUNDLE_PARENT_CHILD_LINK,
});
const cartHandler = CartHandler({ helper });

export const handler = async event => {
  console.log(util.inspect(event, { depth: null }));
  try {
    const [bundleProductTypeId, customTypeId] = await Promise.all([
      helper.getBundleProductTypeId(),
      helper.getParentChildAssociationTypeId(),
    ]);
    console.log(`Using bundle product type ID: ${bundleProductTypeId}`);
    console.log(`Using parent/child association type ID: ${customTypeId}`);
    const actions = cartHandler.handleCartInput(
      event.resource.obj,
      event.action,
      bundleProductTypeId,
      customTypeId
    );
    console.log(util.inspect(actions, { depth: null }));
    return buildSuccessResponse(actions);
  } catch (error) {
    console.error(error);
    return buildErrorResponse(error);
  }
};

export default handler;
