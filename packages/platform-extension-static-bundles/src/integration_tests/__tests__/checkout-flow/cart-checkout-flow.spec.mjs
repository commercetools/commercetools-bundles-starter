import { createCTClient, ensureResourcesExist } from '../../test-utils.mjs';
import { ProductTypes } from '../../shared-fixtures/index.mjs';
import staticBundleParentProductType from '../../../../resourceDefinitions/productTypes/static-bundle-parent.json';
import staticBundleChildVariantProductType
  from '../../../../resourceDefinitions/productTypes/static-bundle-child-variant.json';

describe('Test the cart checkout flow', () => {
  it('ensure product types exist in the CT project', (done) => {
    const ctClient = createCTClient();
    ensureResourcesExist(ctClient, Object.values(ProductTypes), 'productTypes');
    ensureResourcesExist(ctClient, staticBundleParentProductType, 'productTypes');
    ensureResourcesExist(ctClient, staticBundleChildVariantProductType, 'productTypes');
    done();
  });
});
