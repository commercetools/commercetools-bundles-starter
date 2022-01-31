import { expect } from 'chai';
import localtunnel from 'localtunnel';
import { server } from '../../../server.mjs';
import {
  createCTClient, fetchResourceByKey, updateResource
} from '../../test-utils.mjs';
import { bundle1Pants1Shirts2Belts } from '../../shared-fixtures/bundles/bundle1Pants1Shirts2Belts.mjs';
import * as Carts from '../../shared-fixtures/carts/index.mjs';
import * as products from '../../shared-fixtures/products/index.mjs';
import { bundle1Pants1Jackets } from '../../shared-fixtures/bundles/bundle1Pants1Jackets.mjs';

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

describe('Test the cart checkout flow', () => {
  before(async function () {
    this.timeout(TIMEOUT);
    await initTunnel();
  });

  after(async () => {
    server.close();
    await tunnel.close();
  });

  it('Ensure bundle exist in the CT project', async function () {
    this.timeout(TIMEOUT);
    const ctClient = createCTClient();
    const bundleWith1Pant1Shirt2Belts = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts, 'products');
    const bundlesAttributes = bundleWith1Pant1Shirt2Belts
      .masterData.current.masterVariant.attributes;
    expect(bundleWith1Pant1Shirt2Belts).to.not.equal(undefined);
    expect(bundlesAttributes.length).to.equal(2);
    expect(
      bundlesAttributes.map((attribute) => attribute.name)
    ).to.include.members(['products', 'productSearch']);
  });

  it('Add and validate bundle bundle1Pants1Shirts2Belts as lineItem in the cart', async function () {
    this.timeout(TIMEOUT);
    const ctClient = createCTClient();

    let createdCart;
    createdCart = await fetchResourceByKey(ctClient, Carts.cart1pants1shirt2belts.key, 'carts');
    const bundle1Pants1Shirts2BeltsProduct = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts, 'products');

    const actions = [
      {
        action: 'addLineItem',
        productId: bundle1Pants1Shirts2BeltsProduct.id,
        quantity: 1
      }
    ];

    createdCart = await updateResource({
      ctClient,
      resource: createdCart,
      actions,
      resourceTypeId: 'carts'
    });

    const fetchedPantsProduct = await fetchResourceByKey(ctClient, products.pants.key, 'products');
    const fetchedShirtsProduct = await fetchResourceByKey(ctClient, products.shirt.key, 'products');
    const fetchedBeltsProduct = await fetchResourceByKey(ctClient, products.belt.key, 'products');

    // assertions
    expect(createdCart.lineItems.length).to.equal(4);

    const bundlesPrice = bundle1Pants1Shirts2BeltsProduct
      .masterData.current.masterVariant.prices[0].value.centAmount;
    expect(
      createdCart.lineItems.map((lineItem) => lineItem.price.value.centAmount)
    ).to.include.ordered.members([bundlesPrice, 0, 0, 0]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.productKey)
    ).to.include.members([
      bundle1Pants1Shirts2Belts,
      fetchedPantsProduct.key,
      fetchedShirtsProduct.key,
      fetchedBeltsProduct.key
    ]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.quantity)
    ).to.include.ordered.members([1, 1, 1, 2]);
  });

  it('Add and validate bundle bundle1Pants1Jackets as lineItem in the cart', async function () {
    this.timeout(TIMEOUT);
    const ctClient = createCTClient();

    let createdCart;
    createdCart = await fetchResourceByKey(ctClient, Carts.cart1pants1jacket.key, 'carts');
    const bundle1Pants1JacketsProduct = await fetchResourceByKey(ctClient, bundle1Pants1Jackets, 'products');

    const actions = [
      {
        action: 'addLineItem',
        productId: bundle1Pants1JacketsProduct.id,
        quantity: 1
      }
    ];

    createdCart = await updateResource({
      ctClient,
      resource: createdCart,
      actions,
      resourceTypeId: 'carts'
    });

    const fetchedPantsProduct = await fetchResourceByKey(ctClient, products.pants.key, 'products');
    const fetchedJacketsProduct = await fetchResourceByKey(ctClient, products.jacket.key, 'products');

    // assertions
    expect(createdCart.lineItems.length).to.equal(3);

    const bundlesPrice = bundle1Pants1JacketsProduct
      .masterData.current.masterVariant.prices[0].value.centAmount;
    expect(
      createdCart.lineItems.map((lineItem) => lineItem.price.value.centAmount)
    ).to.include.ordered.members([bundlesPrice, 0, 0]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.productKey)
    ).to.include.members([
      bundle1Pants1Jackets,
      fetchedPantsProduct.key,
      fetchedJacketsProduct.key
    ]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.quantity)
    ).to.include.ordered.members([1, 1, 1]);
  });
});
