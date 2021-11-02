import Utils from './utils.js';

export default ({
  commercetools, cache, bundleProductTypeKey, customTypeKey
}) => {
  const utils = Utils({ cache });

  const helper = {
    utils,
    uuid: utils.uuid,

    // Memoize request URIs built
    uri: {
      bundleProductTypeByKey: commercetools
        .getRequestBuilder()
        .productTypes.byKey(bundleProductTypeKey)
        .build(),
      customTypeByKey: commercetools
        .getRequestBuilder()
        .types.byKey(customTypeKey)
        .build(),
    },
  };

  /**
   * @returns {string} UUID of StaticBundleParent product type from the CT API
   */
  helper.getBundleProductTypeId = async () =>
    utils.asyncMemoize('bundle_product_type_id', async () => {
      const uri = helper.uri.bundleProductTypeByKey;
      const res = await commercetools.client.get(uri);
      const value = res?.body?.id;
      if (!value) {
        throw new Error(`No valid product type ID returned from ${uri}`);
      }
      return value;
    });

  /**
   * @returns {string} UUID of StaticBundleParentChildLink type from the CT API
   */
  helper.getParentChildAssociationTypeId = async () =>
    utils.asyncMemoize('parent_child_association_type_id', async () => {
      const uri = helper.uri.customTypeByKey;
      const res = await commercetools.client.get(uri);
      const value = res?.body?.id;
      if (!value) {
        throw new Error(`No valid type ID returned from ${uri}`);
      }
      return value;
    });

  /**
   * Returns a valid Static- or DynamicBundleParentChildLink custom type object.
   */
  helper.buildParentChildAssociationCustomType = ({ externalId, parent }) => {
    const custom = {
      type: {
        key: customTypeKey,
      },
      fields: {
        'external-id': externalId,
      },
    };
    if (parent) custom.fields.parent = parent;
    return custom;
  };

  return helper;
};
