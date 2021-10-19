export const CONFIG_KEYS = Object.freeze({
  CT_TOKEN_URL: 'commercetools_token_url',
  CT_API_URL: 'commercetools_api_url',
  CT_CONCURRENCY: 'commercetools_api_concurrency',
  CT_CLIENT_ID: 'commercetools_client_id',
  CT_SECRET: 'commercetools_client_secret',
  CT_PROJECT_KEY: 'commercetools_project_key',
  CT_SCOPES: 'commercetools_scopes',
  CACHE_TTL: 'cache_ttl',
});

export const TYPE_KEY = Object.freeze({
  STATIC_BUNDLE_PARENT: 'static-bundle-parent',
  STATIC_BUNDLE_CHILD_VARIANT: 'static-bundle-child-variant',
  STATIC_BUNDLE_PARENT_CHILD_LINK: 'static-bundle-parent-child-link',
});

export const ACTION_TYPE = Object.freeze({
  CREATE: 'Create',
  UPDATE: 'Update',
});

export const COPIED_LINE_ITEM_FIELDS = Object.freeze(['supplyChannel', 'shippingDeatils']);

export const UPDATE_ACTION_TYPE = Object.freeze({
  ADD_LINE_ITEM: 'addLineItem',
  REMOVE_LINE_ITEM: 'removeLineItem',
  CHANGE_LINE_ITEM_QUANTITY: 'changeLineItemQuantity',
  SET_LINE_ITEM_CUSTOM_TYPE: 'setLineItemCustomType',
});
