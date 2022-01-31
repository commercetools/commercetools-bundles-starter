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
import { getBundle1Pants1Shirts2Belts } from '../shared-fixtures/bundles/bundle1Pants1Shirts2Belts.mjs';
import { pants } from '../shared-fixtures/products/pants.mjs';
import { shirt } from '../shared-fixtures/products/shirt.mjs';
import { belt } from '../shared-fixtures/products/belt.mjs';
import { staticBundleChildVariant } from '../shared-fixtures/product-types/static-bundle-child-variant.mjs';
import { getStaticBundleParent } from '../shared-fixtures/product-types/static-bundle-parent.mjs';
import { StaticBundleParentChildLinkType } from '../shared-fixtures/types/static-bundle-parent-child-link.mjs';
import { awsLambdaExtension } from '../shared-fixtures/extension/extensionForAwsLambdaFunction.mjs';
import * as Carts from '../shared-fixtures/carts/index.mjs';

const TIMEOUT = 50000;

/**
 * Global before() hook to setup project for integration tests
 */
before('Integration test setup suite', async function () {
  this.timeout(TIMEOUT);

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

  const fetchedPantsProduct = await fetchResourceByKey(ctClient, pants.key, 'products');
  const fetchedShirtsProduct = await fetchResourceByKey(ctClient, shirt.key, 'products');
  const fetchedBeltsProduct = await fetchResourceByKey(ctClient, belt.key, 'products');

  const bundle1Pants1Shirts2Belts = getBundle1Pants1Shirts2Belts({
    fetchedPantsProduct, fetchedShirtsProduct, fetchedBeltsProduct
  });

  await ensureResourcesExist(ctClient, bundle1Pants1Shirts2Belts, 'products');

  await ensureResourcesExist(ctClient, Carts.defaultCart, 'carts');

  await ensureResourcesExist(ctClient, awsLambdaExtension, 'extensions');

  console.info('Setup complete!  Test suites will now run.');
});

/**
 * Global after() hook to teardown project after integration tests
 */
// after(async function () {
//   this.timeout(TIMEOUT);
//   console.info('Test suites finished, beginning teardown...');
//
//   const ctClient = createCTClient();
//   // remove all of our payments
//   await deleteKnownResources(ctClient, 'payments');
//   // remove all of our orders
//   await deleteKnownResources(ctClient, 'orders');
//   await deleteResourcesWhere({
//     ctClient,
//     resourceTypeId: 'orders',
//     where: 'custom(fields(applyCartDiscount is defined) or fields(applyCartDiscount is not defined))',
//   });
//
//   // remove all of our carts
//   console.info('Removing test carts');
//   await deleteKnownResources(ctClient, 'carts');
//   await deleteResourcesWhere({
//     ctClient,
//     resourceTypeId: 'carts',
//     where: 'custom(fields(applyCartDiscount is defined) or fields(applyCartDiscount is not defined))',
//   });
//
//   console.info('Removing test products and other test resources');
//   await deleteKnownResources(ctClient, 'products');
//   await deleteKnownResources(ctClient, 'customers');
//   await deleteKnownResources(ctClient, 'customerGroups');
//   await deleteKnownResources(ctClient, 'shippingMethods');
//   await deleteKnownResources(ctClient, 'taxCategories');
//
//   // delete all product types but the referenced product type.
//   await deleteResourcesWhere({
//     ctClient,
//     resourceTypeId: 'productTypes',
//     where: 'key != "static-bundle-child-variant"',
//   });
//
//   // The reference is removed now delete the child variant productType.
//   await deleteResourcesWhere({
//     ctClient,
//     resourceTypeId: 'productTypes',
//     where: 'key = "static-bundle-child-variant"',
//   });
//
//   await deleteKnownResources(ctClient, 'types');
//   await deleteKnownResources(ctClient, 'zones');
//
//   await deleteKnownResources(ctClient, 'extensions');
//
//   console.info('Teardown complete!');
// });
