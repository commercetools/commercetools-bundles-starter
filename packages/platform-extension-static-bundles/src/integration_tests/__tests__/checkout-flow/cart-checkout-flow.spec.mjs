import { expect } from 'chai';
import {
  createCTClient, fetchResourceByKey, updateResource
} from '../../test-utils.mjs';
import * as Carts from '../../shared-fixtures/carts/index.mjs';
import * as products from '../../shared-fixtures/products/index.mjs';
import * as bundles from '../../shared-fixtures/bundles/index.mjs';

const TIMEOUT = 50000;

describe('Test the cart checkout flow', () => {

  it('Ensure bundle exist in the CT project', async function () {
    this.timeout(TIMEOUT);
    const ctClient = createCTClient();
    const bundleWith1Pant1Shirt2Belts = await fetchResourceByKey(ctClient, bundles.bundle1Pants1Shirts2Belts, 'products');
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
    const bundle1Pants1Shirts2BeltsProduct = await fetchResourceByKey(ctClient, bundles.bundle1Pants1Shirts2Belts, 'products');

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
      bundles.bundle1Pants1Shirts2Belts,
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
    const bundle1Pants1JacketsProduct = await fetchResourceByKey(ctClient, bundles.bundle1Pants1Jackets, 'products');

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
      bundles.bundle1Pants1Jackets,
      fetchedPantsProduct.key,
      fetchedJacketsProduct.key
    ]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.quantity)
    ).to.include.ordered.members([1, 1, 1]);
  });

  it('Update the cart and validate bundle bundle2Pants3Jackets2Belts with quantity 2 in the cart', async function () {
    this.timeout(TIMEOUT);
    const ctClient = createCTClient();

    let createdCart;
    createdCart = await fetchResourceByKey(ctClient, Carts.cart2pants3jackets2belts.key, 'carts');
    const bundle2Pants3Jackets2BeltsProduct = await fetchResourceByKey(ctClient, bundles.bundle2Pants3Jackets2Belts, 'products');

    const actions = [
      {
        action: 'addLineItem',
        productId: bundle2Pants3Jackets2BeltsProduct.id,
        quantity: 2
      }
    ];

    createdCart = await updateResource({
      ctClient,
      resource: createdCart,
      actions,
      resourceTypeId: 'carts'
    });

    const fetchedBeltsProduct = await fetchResourceByKey(ctClient, products.belt.key, 'products');
    const fetchedPantsProduct = await fetchResourceByKey(ctClient, products.pants.key, 'products');
    const fetchedJacketsProduct = await fetchResourceByKey(ctClient, products.jacket.key, 'products');

    // assertions
    expect(createdCart.lineItems.length).to.equal(4);

    const bundlesPrice = bundle2Pants3Jackets2BeltsProduct
      .masterData.current.masterVariant.prices[0].value.centAmount;
    expect(
      createdCart.lineItems.map((lineItem) => lineItem.price.value.centAmount)
    ).to.include.ordered.members([bundlesPrice, 0, 0, 0]);

    expect(createdCart.lineItems[0].totalPrice.centAmount).to.equal((bundlesPrice * 2));
    expect(
      createdCart.lineItems.map((lineItem) => lineItem.productKey)
    ).to.include.members([
      bundles.bundle2Pants3Jackets2Belts,
      fetchedPantsProduct.key,
      fetchedJacketsProduct.key,
      fetchedBeltsProduct.key
    ]);

    expect(
      createdCart.lineItems.map((lineItem) => lineItem.quantity)
    ).to.include.ordered.members([2, 4, 6, 4]);
  });
});
