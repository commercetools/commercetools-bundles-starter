import assert from 'assert';
import { createCTClient, fetchResourceByKey } from '../../test-utils.mjs';
import { bundle1Pants1Shirts2Belts } from '../../shared-fixtures/bundles/bundle1Pants1Shirts2Belts.mjs';

describe('Test the cart checkout flow', () => {
  it('ensure bundle exist in the CT project', async function () {
    this.timeout(50000);
    const ctClient = createCTClient();
    const bundles = await fetchResourceByKey(ctClient, bundle1Pants1Shirts2Belts.key, 'products');
    assert.notDeepStrictEqual(bundles, null);
  });
});
