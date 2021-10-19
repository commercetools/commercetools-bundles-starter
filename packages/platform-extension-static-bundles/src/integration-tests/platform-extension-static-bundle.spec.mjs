// eslint-disable-next-line import/no-extraneous-dependencies
import localtunnel from 'localtunnel';
// eslint-disable-next-line import/extensions
import { app } from '../server.mjs';
import { ensureResourcesExist } from './test-utils.mjs';
import * as ProductTypes from './shared-fixtures/product-types/index.mjs';
import staticBundleParentProductType
  from '../../resourceDefinitions/productTypes/static-bundle-parent.json';
import staticBundleChildVariantProductType
  from '../../resourceDefinitions/productTypes/static-bundle-child-variant.json';

describe('Integration test - platform extension static bundle', () => {
  let server;
  let tunnel;

  // eslint-disable-next-line no-undef
  before(async () => {
    server = app.listen(3000, () => {
      console.log('Local development server listening on port 3000!\n');
    });

    tunnel = await localtunnel({
      port: 3000, subdomain: 'ctp-bundles-starter-integration-tests'
    });

    await ensureResourcesExist(Object.values(ProductTypes), 'productTypes');
    await ensureResourcesExist(staticBundleParentProductType, 'productTypes');
    await ensureResourcesExist(staticBundleChildVariantProductType, 'productTypes');
  });

  // eslint-disable-next-line no-undef
  after(async () => {
    server.close();
    await tunnel.close();
  });

  it('should create static bundles', async () => {
  });
});
