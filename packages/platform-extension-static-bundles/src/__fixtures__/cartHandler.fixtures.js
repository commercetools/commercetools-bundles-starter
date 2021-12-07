import { v4 as uuid } from 'uuid';
import { TYPE_KEY, UPDATE_ACTION_TYPE } from '../constants';

export const DEFAULT_UUID = uuid();
export const bundleProductTypeId = uuid();
export const customTypeId = uuid();

export const emptyCart = {
  lineItems: [],
};

export const buildStaticBundleChildVariant = (productRefUuid = DEFAULT_UUID) => [
  { name: 'variant-id', value: 1 },
  { name: 'sku', value: 'DUMMY-SKU' },
  { name: 'quantity', value: 3 },
  {
    name: 'product-ref',
    value: {
      typeId: 'product',
      id: productRefUuid,
    },
  },
];

export const buildFlatStaticBundleChildVariant = (productRefUuid = DEFAULT_UUID) => ({
  productId: productRefUuid,
  variantId: 1,
  quantity: 3,
});

export const buildStaticBundleParentLineItem = (
  id = DEFAULT_UUID,
  staticBundleChildVariants = [buildStaticBundleChildVariant()]
) => ({
  id,
  productType: {
    typeId: 'product-type',
    id: bundleProductTypeId,
  },
  variant: {
    id: 1,
    prices: [
      {
        value: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 25000,
          fractionDigits: 2,
        },
      },
    ],
    attributes: [
      {
        name: 'products',
        value: staticBundleChildVariants,
      },
    ],
  },
  price: {
    value: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 25000,
      fractionDigits: 2,
    },
  },
  quantity: 2,
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'USD',
    centAmount: 50000,
    fractionDigits: 2,
  },
});

export const buildCart = (lineItems = [buildStaticBundleParentLineItem()]) => ({
  lineItems,
});

export const buildParentChildAssociation = (extId, parent) => ({
  type: { id: customTypeId },
  fields: {
    'external-id': extId,
    parent,
  },
});

export const buildSetLineItemCustomTypeActionResults = (dummyUuid = DEFAULT_UUID) => ({
  action: UPDATE_ACTION_TYPE.SET_LINE_ITEM_CUSTOM_TYPE,
  lineItemId: dummyUuid,
  type: { key: TYPE_KEY.STATIC_BUNDLE_PARENT_CHILD_LINK },
  fields: {
    'external-id': dummyUuid,
  },
});

export const buildRemoveLineItemActionResults = (dummyUuid = DEFAULT_UUID) => ({
  action: UPDATE_ACTION_TYPE.REMOVE_LINE_ITEM,
  lineItemId: dummyUuid,
});

export const buildAddLineItemActionResults = (dummyUuid = DEFAULT_UUID) => ({
  action: UPDATE_ACTION_TYPE.ADD_LINE_ITEM,
  productId: DEFAULT_UUID,
  variantId: 1,
  quantity: 6,
  externalTotalPrice: {
    price: {
      centAmount: 0,
      currencyCode: 'USD',
      fractionDigits: 2,
      type: 'centPrecision',
    },
    totalPrice: {
      centAmount: 0,
      currencyCode: 'USD',
      fractionDigits: 2,
      type: 'centPrecision',
    },
  },
  custom: {
    type: { key: TYPE_KEY.STATIC_BUNDLE_PARENT_CHILD_LINK },
    fields: {
      'external-id': dummyUuid,
      parent: dummyUuid,
    },
  },
});
