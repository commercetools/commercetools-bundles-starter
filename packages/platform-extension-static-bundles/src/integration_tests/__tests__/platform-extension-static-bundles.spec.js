// eslint-disable-next-line import/no-extraneous-dependencies
// import localtunnel from 'localtunnel';
// import { app } from '../server';
import { createCTClient, ensureResourcesExist } from '../test-utils';
import * as ProductTypes from '../shared-fixtures/product-types';
import staticBundleParentProductType
  from '../../../resourceDefinitions/productTypes/static-bundle-parent.json';
import staticBundleChildVariantProductType
  from '../../../resourceDefinitions/productTypes/static-bundle-child-variant.json';

describe('Integration test - platform extension static bundle', () => {
  // let server;
  // let tunnel;

  // eslint-disable-next-line no-undef
  beforeEach(async () => {
    // Use server and tunnel for api extension and cart checkout flow tests.
    // server = app.listen(3001, () => {
    //   console.log('Local development server listening on port 3000!\n');
    // });
    //
    // tunnel = await localtunnel({
    //   port: 3001, subdomain: 'ctp-bundles-starter-integration-tests'
    // });

  });

  // eslint-disable-next-line no-undef
  afterEach(async () => {
    // server.close();
    // await tunnel.close();
  });

  it('ensure product types exist in the CT project', async () => {
    const ctClient = createCTClient();
    await ensureResourcesExist(ctClient, Object.values(ProductTypes), 'productTypes');
    await ensureResourcesExist(ctClient, staticBundleParentProductType, 'productTypes');
    await ensureResourcesExist(ctClient, staticBundleChildVariantProductType, 'productTypes');
  });
});
