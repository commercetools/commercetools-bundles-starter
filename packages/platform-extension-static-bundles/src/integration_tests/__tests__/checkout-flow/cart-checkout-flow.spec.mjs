import assert from 'assert';
import localtunnel from 'localtunnel';
import { server } from '../../../server.mjs';
import {
  createCTClient, ensureResourcesExist, fetchResourceByKey, updateResource
} from '../../test-utils.mjs';
import { bundle1Pants1Shirts2Belts } from '../../shared-fixtures/bundles/bundle1Pants1Shirts2Belts.mjs';
import * as Carts from '../../shared-fixtures/carts/index.mjs';

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
  // eslint-disable-next-line no-undef
  before(async function () {
    this.timeout(5000);
    await initTunnel();
  });

  // eslint-disable-next-line no-undef
  after(async () => {
    server.close();
    await tunnel.close();
  });

  it('ensure bundle exist in the CT project', async function () {
    this.timeout(50000);
    const ctClient = createCTClient();
    const bundles = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts, 'products');
    assert.notDeepStrictEqual(bundles, null);
  });

  it('Add and validate bundle bundle1Pants1Shirts2Belts as lineItem in the cart', async function () {
    this.timeout(50000);
    const ctClient = createCTClient();

    let createdCart;
    createdCart = await fetchResourceByKey(ctClient, Carts.defaultCart.key, 'carts');
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

    assert.strictEqual(createdCart.lineItems.length, 4);
  });
});
