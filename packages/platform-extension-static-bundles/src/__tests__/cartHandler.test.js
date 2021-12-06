import { v4 as uuid } from 'uuid';
import { noop } from 'lodash';
import NodeCache from 'node-cache';
import Commercetools from '../commercetools';
import Helper from '../helper';
import CartHandler from '../cartHandler';
import {
  DEFAULT_UUID,
  bundleProductTypeId,
  customTypeId,
  emptyCart,
  buildStaticBundleChildVariant,
  buildFlatStaticBundleChildVariant,
  buildCart,
  buildStaticBundleParentLineItem,
  buildAddLineItemActionResults,
  buildParentChildAssociation,
  buildSetLineItemCustomTypeActionResults,
  buildRemoveLineItemActionResults,
} from '../__fixtures__/cartHandler.fixtures';
import { ACTION_TYPE, UPDATE_ACTION_TYPE, TYPE_KEY } from '../constants';

// Disable console logging during tests
console.log = noop;
console.error = noop;

const clientId = 'client1';
const clientSecret = 'secret1';
const projectKey = 'projectKey1';
const host = 'https://api.commercetools.co';
const oauthHost = 'https://auth.commercetools.co';

const commercetools = Commercetools({
  clientId,
  clientSecret,
  projectKey,
  host,
  oauthHost,
});

const cache = new NodeCache();
const helper = Helper({
  commercetools,
  cache,
  bundleProductTypeKey: TYPE_KEY.STATIC_BUNDLE_PARENT,
  customTypeKey: TYPE_KEY.STATIC_BUNDLE_PARENT_CHILD_LINK,
});

const cartHandler = CartHandler({ helper, cache });

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(helper, 'uuid').mockImplementation(() => DEFAULT_UUID);
});

describe('cartHandler.createCartHandler', () => {
  it('should return an empty array for an empty cart', () => {
    expect.assertions(1);
    const res = cartHandler.createCartHandler(emptyCart, bundleProductTypeId);
    expect(res).toEqual([]);
  });

  it('should return a valid array of update actions for a populated cart', () => {
    expect.assertions(2);
    const handleNewStaticBundleParentSpy = jest.spyOn(cartHandler, 'handleNewStaticBundleParent');
    const res = cartHandler.createCartHandler(buildCart(), bundleProductTypeId);
    const expected = [buildAddLineItemActionResults(), buildSetLineItemCustomTypeActionResults()];
    expect(res).toEqual(expected);
    expect(handleNewStaticBundleParentSpy).toHaveBeenCalledWith(buildStaticBundleParentLineItem());
  });
});

describe('cartHandler.buildAddLineItemAction', () => {
  it('should return a valid addLineItem update action', () => {
    expect.assertions(1);
    const res = cartHandler.buildAddLineItemAction(
      buildStaticBundleParentLineItem(),
      buildStaticBundleChildVariant(),
      DEFAULT_UUID,
      DEFAULT_UUID
    );
    expect(res).toEqual(buildAddLineItemActionResults());
  });

  it('should throw when StaticBundleChildVariant is missing required values', () => {
    expect.assertions(1);
    const fn = () =>
      cartHandler.buildAddLineItemAction(
        buildStaticBundleParentLineItem(),
        [],
        DEFAULT_UUID,
        DEFAULT_UUID
      );
    expect(fn).toThrow();
  });
});

describe('cartHandler.buildSetLineItemCustomTypeAction', () => {
  it('should return a valid setLineItemCustomType update action', () => {
    expect.assertions(1);
    const res = cartHandler.buildSetLineItemCustomTypeAction(DEFAULT_UUID, DEFAULT_UUID);
    expect(res).toEqual(buildSetLineItemCustomTypeActionResults(DEFAULT_UUID));
  });
});

describe('cartHandler.updateCartHandler', () => {
  it('should return an empty array for an empty cart', () => {
    expect.assertions(1);
    const res = cartHandler.updateCartHandler(emptyCart, bundleProductTypeId, customTypeId);
    expect(res).toEqual([]);
  });

  it('should return a valid array of update actions for a populated cart', () => {
    expect.assertions(6);
    const handleNewStaticBundleParentSpy = jest.spyOn(cartHandler, 'handleNewStaticBundleParent');
    const handleExistingStaticBundleParentSpy = jest.spyOn(
      cartHandler,
      'handleExistingStaticBundleParent'
    );
    const newChildProductRef = uuid();
    const existingBundleExtId = uuid();
    const existingChildExtId = uuid();
    const existingChildProductRef = uuid();
    const missingChildProductRef = uuid();

    const newBundle = buildStaticBundleParentLineItem(uuid(), [
      buildStaticBundleChildVariant(newChildProductRef),
    ]);
    const existingBundle = {
      ...buildStaticBundleParentLineItem(uuid(), [
        buildStaticBundleChildVariant(existingChildProductRef),
        buildStaticBundleChildVariant(missingChildProductRef),
      ]),
      custom: {
        ...buildParentChildAssociation(existingBundleExtId),
      },
    };
    const existingChildLineItem = {
      id: uuid(),
      productId: existingChildProductRef,
      productType: {
        id: uuid(),
      },
      quantity: 12,
      custom: {
        ...buildParentChildAssociation(existingChildExtId, existingBundleExtId),
      },
    };
    const unlinkedChildLineItem = {
      id: uuid(),
      productId: uuid(),
      productType: {
        id: uuid(),
      },
      quantity: 3,
      custom: {
        ...buildParentChildAssociation(uuid(), existingBundleExtId),
      },
    };
    const lineItems = [newBundle, existingBundle, existingChildLineItem, unlinkedChildLineItem];
    const cart = buildCart(lineItems);
    const res = cartHandler.updateCartHandler(cart, bundleProductTypeId, customTypeId);
    expect(res.filter(a => a.action === UPDATE_ACTION_TYPE.ADD_LINE_ITEM)).toHaveLength(2);
    expect(res.filter(a => a.action === UPDATE_ACTION_TYPE.SET_LINE_ITEM_CUSTOM_TYPE)).toHaveLength(
      1
    );
    expect(res.filter(a => a.action === UPDATE_ACTION_TYPE.CHANGE_LINE_ITEM_QUANTITY)).toHaveLength(
      1
    );
    expect(res.filter(a => a.action === UPDATE_ACTION_TYPE.REMOVE_LINE_ITEM)).toHaveLength(1);
    expect(handleNewStaticBundleParentSpy).toHaveBeenCalledWith(newBundle);
    expect(handleExistingStaticBundleParentSpy).toHaveBeenCalledWith(existingBundle, [
      existingChildLineItem,
      unlinkedChildLineItem,
    ]);
  });
});

describe('cartHandler.flattenStaticBundleChildVariant', () => {
  it('should return a simple object mapping attribute name to value', () => {
    expect.assertions(1);
    const flatLink = cartHandler.flattenStaticBundleChildVariant(
      uuid(),
      buildStaticBundleChildVariant()
    );
    expect(flatLink).toEqual(buildFlatStaticBundleChildVariant());
  });

  it('should throw on invalid input', () => {
    expect.assertions(1);
    const fn = () => cartHandler.flattenStaticBundleChildVariant(uuid(), {});
    expect(fn).toThrow();
  });
});

describe('cartHandler.handleCartInput', () => {
  let createCartHandlerSpy;
  let updateCartHandler;

  beforeEach(() => {
    createCartHandlerSpy = jest
      .spyOn(cartHandler, 'createCartHandler')
      .mockImplementation(() => []);
    updateCartHandler = jest.spyOn(cartHandler, 'updateCartHandler').mockImplementation(() => []);
  });

  it('should call createCartHandler for Create action', () => {
    expect.assertions(2);
    cartHandler.handleCartInput(buildCart(), ACTION_TYPE.CREATE, bundleProductTypeId);
    expect(createCartHandlerSpy).toHaveBeenCalledWith(buildCart(), bundleProductTypeId);
    expect(updateCartHandler).not.toHaveBeenCalled();
  });

  it('should call updateCartHandler for Update action', () => {
    expect.assertions(2);
    cartHandler.handleCartInput(buildCart(), ACTION_TYPE.UPDATE, bundleProductTypeId, customTypeId);
    expect(updateCartHandler).toHaveBeenCalledWith(buildCart(), bundleProductTypeId, customTypeId);
    expect(createCartHandlerSpy).not.toHaveBeenCalled();
  });

  it('should throw on an invalid action type', () => {
    expect.assertions(1);
    const fn = () =>
      cartHandler.handleCartInput(emptyCart, 'not a real action type', bundleProductTypeId);
    expect(fn).toThrow();
  });
});

describe('cartHandler.sortBundleLineItems', () => {
  it('should return an object containing arrays for new, existing, and orphaned bundle items', () => {
    expect.assertions(4);
    const newBundle = { ...buildStaticBundleParentLineItem() };
    const existingBundleExtId = uuid();
    const childExtId = uuid();
    const orphanExtId = uuid();
    const existingBundle = {
      ...buildStaticBundleParentLineItem(),
      id: uuid(),
      custom: {
        ...buildParentChildAssociation(existingBundleExtId),
      },
    };
    const existingChild = {
      ...buildStaticBundleParentLineItem(),
      id: uuid(),
      productType: {
        id: uuid(),
      },
      custom: {
        ...buildParentChildAssociation(childExtId, existingBundleExtId),
      },
    };
    const orphan = {
      ...buildStaticBundleParentLineItem(),
      id: uuid(),
      productType: {
        id: uuid(),
      },
      custom: {
        ...buildParentChildAssociation(orphanExtId, uuid()),
      },
    };
    const lineItems = [newBundle, existingBundle, existingChild, orphan];
    const res = cartHandler.sortBundleLineItems(lineItems, bundleProductTypeId, customTypeId);
    expect(res.newBundles[0].id).toEqual(newBundle.id);
    expect(res.existingBundles[0].id).toEqual(existingBundle.id);
    expect(res.existingChildren[0].id).toEqual(existingChild.id);
    expect(res.orphans[0].id).toEqual(orphan.id);
  });
});

describe('cartHandler.buildRemoveLineItemAction', () => {
  it('should return a valid removeLineItem update action', () => {
    expect.assertions(1);
    const id = uuid();
    const res = cartHandler.buildRemoveLineItemAction(id);
    expect(res).toEqual(buildRemoveLineItemActionResults(id));
  });
});

describe('cartHandler.handleNewStaticBundleParent', () => {
  it('should return update actions adding child line items and updating the parent custom type', () => {
    expect.assertions(1);
    const res = cartHandler.handleNewStaticBundleParent(buildStaticBundleParentLineItem());
    expect(res).toEqual([
      buildAddLineItemActionResults(),
      buildSetLineItemCustomTypeActionResults(),
    ]);
  });
});

describe('cartHandler.handleExistingStaticBundleParent', () => {
  it('should return update actions adding/removing/updating child line items based on the supplied bundle parent', () => {
    expect.assertions(5);
    const existingBundleExtId = uuid();
    const existingChildExtId = uuid();
    const existingChildProductRef = uuid();
    const missingChildProductRef = uuid();
    const existingBundle = {
      ...buildStaticBundleParentLineItem(uuid(), [
        buildStaticBundleChildVariant(existingChildProductRef),
        buildStaticBundleChildVariant(missingChildProductRef),
      ]),
      custom: {
        ...buildParentChildAssociation(existingBundleExtId),
      },
    };
    const existingChildLineItem = {
      id: uuid(),
      productId: existingChildProductRef,
      productType: {
        id: uuid(),
      },
      quantity: 3,
      custom: {
        ...buildParentChildAssociation(existingChildExtId, existingBundleExtId),
      },
    };
    const unlinkedChildLineItem = {
      id: uuid(),
      productId: uuid(),
      productType: {
        id: uuid(),
      },
      quantity: 3,
      custom: {
        ...buildParentChildAssociation(uuid(), existingBundleExtId),
      },
    };
    const existingChildLineItems = [existingChildLineItem, unlinkedChildLineItem];
    const res = cartHandler.handleExistingStaticBundleParent(
      existingBundle,
      existingChildLineItems
    );
    expect(res.length).toEqual(3);
    const changeAction = res.find(a => a.lineItemId === existingChildLineItem.id);
    expect(changeAction.action).toEqual(UPDATE_ACTION_TYPE.CHANGE_LINE_ITEM_QUANTITY);
    expect(changeAction.externalTotalPrice.totalPrice.centAmount).toBe(0);
    expect(res.find(a => a.lineItemId === unlinkedChildLineItem.id).action).toEqual(
      UPDATE_ACTION_TYPE.REMOVE_LINE_ITEM
    );
    expect(res.find(a => a.productId === missingChildProductRef).action).toEqual(
      UPDATE_ACTION_TYPE.ADD_LINE_ITEM
    );
  });
});
