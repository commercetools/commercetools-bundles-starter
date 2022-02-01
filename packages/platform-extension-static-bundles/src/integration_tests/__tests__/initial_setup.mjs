import localtunnel from 'localtunnel';
import {
  createCTClient, ensureResourcesExist, deleteKnownResources,
  deleteResourcesWhere, fetchResourceByKey
} from '../test-utils.mjs';
import {
  Types as IntegrationTestTypes,
  TaxCategories,
  ShippingZones,
  ShippingMethods,
  CustomerGroups,
  Customers,
  ProductTypes,
  Products
} from '../shared-fixtures/index.mjs';
import * as products from '../shared-fixtures/products/index.mjs';
import { staticBundleChildVariant } from '../shared-fixtures/product-types/static-bundle-child-variant.mjs';
import { getStaticBundleParent } from '../shared-fixtures/product-types/static-bundle-parent.mjs';
import { StaticBundleParentChildLinkType } from '../shared-fixtures/types/static-bundle-parent-child-link.mjs';
import { extensionForCartTriggers } from '../shared-fixtures/extension/extensionForCartTriggers.mjs';
import * as Carts from '../shared-fixtures/carts/index.mjs';
import * as bundles from '../shared-fixtures/bundles/index.mjs';
import { server } from '../../server.mjs';

const TIMEOUT = 50000;

let tunnel;
const port = process.env.PORT || 3000;
const tunnelDomain = 'ctp-bundles-starter-integration-tests';

async function initTunnel() {
  let repeaterCounter = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      tunnel = await localtunnel({
        port,
        subdomain: tunnelDomain,
      });
      break;
    } catch (e) {
      if (repeaterCounter === 10) throw e;
      repeaterCounter += 1;
    }
  }
}

/**
 * Global before() hook to setup project for integration tests
 */
before('Integration test setup suite', async function () {
  this.timeout(TIMEOUT);
  await initTunnel();

  console.info('Beginning setup prior to test suites running...');
  const ctClient = createCTClient();

  await ensureResourcesExist(ctClient, Object.values(IntegrationTestTypes), 'types');

  await ensureResourcesExist(ctClient, StaticBundleParentChildLinkType, 'types');

  let staticBundleChildVariantProductType = await ensureResourcesExist(ctClient, staticBundleChildVariant, 'productTypes');

  if (!staticBundleChildVariantProductType) {
    staticBundleChildVariantProductType = await fetchResourceByKey(ctClient, staticBundleChildVariant.key, 'productTypes');
  }

  await ensureResourcesExist(ctClient, getStaticBundleParent(staticBundleChildVariantProductType), 'productTypes');

  await ensureResourcesExist(ctClient, Object.values(ProductTypes), 'productTypes');

  await ensureResourcesExist(ctClient, Object.values(ShippingZones), 'zones');

  await ensureResourcesExist(ctClient, Object.values(TaxCategories), 'taxCategories');

  await ensureResourcesExist(ctClient, Object.values(Products), 'products');

  await ensureResourcesExist(ctClient, Object.values(ShippingMethods), 'shippingMethods');

  await ensureResourcesExist(ctClient, Object.values(CustomerGroups), 'customerGroups');

  await ensureResourcesExist(ctClient, Object.values(Customers), 'customers');

  const fetchedPantsProduct = await fetchResourceByKey(ctClient, products.pants.key, 'products');
  const fetchedShirtsProduct = await fetchResourceByKey(ctClient, products.shirt.key, 'products');
  const fetchedBeltsProduct = await fetchResourceByKey(ctClient, products.belt.key, 'products');
  const fetchedJacketsProduct = await fetchResourceByKey(ctClient, products.jacket.key, 'products');

  const bundle1Pants1Shirts2Belts = bundles.getBundle1Pants1Shirts2Belts({
    fetchedPantsProduct, fetchedShirtsProduct, fetchedBeltsProduct
  });

  const bundle1Pants1Jacket = bundles.getBundle1Pants1Jackets({
    fetchedPantsProduct, fetchedJacketsProduct
  });

  const bundle2Pants3Jackets2Belts = bundles.getBundle2Pants3Jackets2Belts({
    fetchedPantsProduct, fetchedJacketsProduct, fetchedBeltsProduct
  });

  await ensureResourcesExist(ctClient, [bundle1Pants1Shirts2Belts, bundle1Pants1Jacket, bundle2Pants3Jackets2Belts], 'products');

  await ensureResourcesExist(ctClient, Object.values(Carts), 'carts');

  await ensureResourcesExist(ctClient, extensionForCartTriggers, 'extensions');

  console.info('Setup complete!  Test suites will now run.');
});

/**
 * Global after() hook to teardown project after integration tests
 */
after(async function () {
  this.timeout(TIMEOUT);
  console.info('Test suites finished, beginning teardown...');

  const ctClient = createCTClient();
  // remove all of our payments
  await deleteKnownResources(ctClient, 'payments');
  // remove all of our orders
  await deleteKnownResources(ctClient, 'orders');
  await deleteResourcesWhere({
    ctClient,
    resourceTypeId: 'orders',
    where: 'custom(fields(applyCartDiscount is defined) or fields(applyCartDiscount is not defined))',
  });

  // remove all of our carts
  console.info('Removing test carts');
  await deleteKnownResources(ctClient, 'carts');
  await deleteResourcesWhere({
    ctClient,
    resourceTypeId: 'carts',
    where: 'custom(fields(applyCartDiscount is defined) or fields(applyCartDiscount is not defined))',
  });

  console.info('Removing test products and other test resources');
  await deleteKnownResources(ctClient, 'products');
  await deleteKnownResources(ctClient, 'customers');
  await deleteKnownResources(ctClient, 'customerGroups');
  await deleteKnownResources(ctClient, 'shippingMethods');
  await deleteKnownResources(ctClient, 'taxCategories');

  // delete all product types but the referenced product type.
  await deleteResourcesWhere({
    ctClient,
    resourceTypeId: 'productTypes',
    where: 'key != "static-bundle-child-variant"',
  });

  // The reference is removed now delete the child variant productType.
  await deleteResourcesWhere({
    ctClient,
    resourceTypeId: 'productTypes',
    where: 'key = "static-bundle-child-variant"',
  });

  await deleteKnownResources(ctClient, 'types');
  await deleteKnownResources(ctClient, 'zones');

  server.close();
  await tunnel.close();
  console.info('Teardown complete!');
});
