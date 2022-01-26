import assert from 'assert';
import {
  createCTClient, ensureResourcesExist, fetchResourceByKey, updateResource
} from '../../test-utils.mjs';
import { bundle1Pants1Shirts2Belts } from '../../shared-fixtures/bundles/bundle1Pants1Shirts2Belts.mjs';
import * as Carts from '../../shared-fixtures/carts/index.mjs';

describe('Test the cart checkout flow', () => {
  it('ensure bundle exist in the CT project', async function () {
    this.timeout(50000);
    const ctClient = createCTClient();
    const bundles = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts.key, 'products');
    assert.notDeepStrictEqual(bundles, null);
  });

  it('Add and validate bundle bundle1Pants1Shirts2Belts as lineItem in the cart', async function () {
    this.timeout(50000);
    const ctClient = createCTClient();

    const cartToCreate = Carts.defaultCart;

    let createdCart;
    createdCart = await ensureResourcesExist(ctClient, cartToCreate, 'carts');
    const bundle1Pants1Shirts2BeltsProduct = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts.key, 'products');

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

    assert.strictEqual(createdCart.lineItems.length, 1);
  });
});
