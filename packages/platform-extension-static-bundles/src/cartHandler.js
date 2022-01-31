import * as util from 'util';
import pkg from 'lodash';
import { ACTION_TYPE, COPIED_LINE_ITEM_FIELDS, UPDATE_ACTION_TYPE } from './constants.js';

const { pickBy } = pkg;

const validActionType = actionType => Object.values(ACTION_TYPE).includes(actionType);
const byName = attrName => attr => attr.name === attrName;

export default ({ helper }) => {
  const handler = {};

  /**
   * Return an easier-to-use object from array of StaticBundleChildVariant attributes.
   */
  handler.flattenStaticBundleChildVariant = (staticBundleParentId, staticBundleChildVariant) => {
    try {
      return {
        productId: staticBundleChildVariant.find(byName('product-ref'))?.value?.id,
        variantId: staticBundleChildVariant.find(byName('variant-id'))?.value,
        quantity: staticBundleChildVariant.find(byName('quantity'))?.value,
      };
    } catch (error) {
      console.error(
        `Unable to flatten StaticBundleChildVariant data for StaticBundleParent ${staticBundleParentId}`
      );
      throw error;
    }
  };

  /**
   * Returns an addLineItem update action for a linked child product,
   * including the StaticBundleParentChildLink custom type.
   */
  handler.buildAddLineItemAction = (
    parentLineItem,
    staticBundleChildVariant,
    parentLineItemExternalId,
    childLineItemExternalId
  ) => {
    // Flatten the child product reference attributes for easier consumption
    const flatLink = handler.flattenStaticBundleChildVariant(
      parentLineItem.id,
      staticBundleChildVariant
    );

    if (!Object.values(flatLink).every(link => link !== undefined)) {
      throw new Error(
        `A StaticBundleChildVariant for parent StaticBundleParent ${parentLineItem.id} is missing required attribute values.`
      );
    }

    // Build an object of parent line item fields that should be included on children
    const copiedLineItemFields = pickBy(
      parentLineItem,
      (value, key) => COPIED_LINE_ITEM_FIELDS.includes(key) && value !== undefined
    );

    const { productId, variantId } = flatLink;

    // Build an addLineItem action object, including link to parent
    return {
      action: UPDATE_ACTION_TYPE.ADD_LINE_ITEM,
      // Duplicate channel and shipping information
      ...copiedLineItemFields,
      // Set product and variant reference
      productId,
      variantId,
      // Ensure child quantity matches parent bundle quantity
      quantity: flatLink.quantity * parentLineItem.quantity,
      // Ensure child prices are all 0––price should be set on parent bundle only
      externalTotalPrice: {
        price: {
          ...parentLineItem.price.value,
          centAmount: 0,
        },
        totalPrice: {
          ...parentLineItem.totalPrice,
          centAmount: 0,
        },
      },
      // Establish parent/child link
      custom: helper.buildParentChildAssociationCustomType({
        externalId: childLineItemExternalId,
        parent: parentLineItemExternalId,
      }),
    };
  };

  /**
   * Returns a setLineItemCustomType update action for the specified parent
   * StaticBundleParent line item, providing links to child products.
   */
  handler.buildSetLineItemCustomTypeAction = (lineItemId, parentLineItemExternalId) => ({
    action: UPDATE_ACTION_TYPE.SET_LINE_ITEM_CUSTOM_TYPE,
    lineItemId,
    ...helper.buildParentChildAssociationCustomType({
      externalId: parentLineItemExternalId,
    }),
  });

  /**
   * Returns a removeLineItem update action for the specified line item
   */
  handler.buildRemoveLineItemAction = lineItemId => ({
    action: UPDATE_ACTION_TYPE.REMOVE_LINE_ITEM,
    lineItemId,
  });

  /**
   * Returns a removeLineItem update action for the specified line item
   */
  handler.buildChangeLineItemQuantityAction = (lineItemId, quantity, parentLineItem) => ({
    action: UPDATE_ACTION_TYPE.CHANGE_LINE_ITEM_QUANTITY,
    lineItemId,
    quantity,
    externalTotalPrice: {
      price: {
        ...parentLineItem.price.value,
        centAmount: 0,
      },
      totalPrice: {
        ...parentLineItem.totalPrice,
        centAmount: 0,
      },
    },
  });

  /**
   * Returns an object composed line items sorted into four separate arrays of
   * new bundles, existing bundles, existing bundle children, and orphaned children
   */
  handler.sortBundleLineItems = (lineItems, productTypeId, customTypeId) => {
    const hasParentChildAssociation = li => li.custom?.type?.id === customTypeId;

    const bundles = lineItems.filter(li => li.productType.id === productTypeId);
    const existingBundles = bundles.filter(hasParentChildAssociation);
    const existingBundleIds = existingBundles.map(li => li.id);
    const existingBundleExternalIds = existingBundles.map(li => li.custom.fields['external-id']);
    const newBundles = bundles.filter(li => !existingBundleIds.includes(li.id));
    const notBundles = lineItems.filter(li => li.productType.id !== productTypeId);

    const hasParent = li => existingBundleExternalIds.includes(li.custom.fields.parent);
    const isOrphan = li => hasParentChildAssociation(li) && !hasParent(li);
    const isChild = li => hasParentChildAssociation(li) && hasParent(li);

    const existingChildren = notBundles.filter(isChild);
    const orphans = notBundles.filter(isOrphan);

    return {
      newBundles,
      existingBundles,
      existingChildren,
      orphans,
    };
  };

  /**
   * Returns cart update actions for a new StaticBundleParent parent line item
   */
  handler.handleNewStaticBundleParent = bundleLineItem => {
    console.log(`Found new StaticBundleParent line item ${bundleLineItem.id}`);

    const updateActions = [];

    // Establish external ID for parent bundle for later use in custom type
    const parentLineItemExternalId = helper.uuid();

    // Get value of StaticBundleParent:products attribtue;
    //  a set of references to child products variants + quantity
    const childProductLinks = bundleLineItem.variant.attributes.find(byName('products')).value;

    // Add an addLineItem update action for each linked child product
    childProductLinks.forEach(link => {
      // Establish external ID for child product for later use in custom type
      const childLineItemExternalId = helper.uuid();
      updateActions.push(
        handler.buildAddLineItemAction(
          bundleLineItem,
          link,
          parentLineItemExternalId,
          childLineItemExternalId
        )
      );
    });

    // Add a setCustomType update action to add child link to parent bundle
    updateActions.push(
      handler.buildSetLineItemCustomTypeAction(bundleLineItem.id, parentLineItemExternalId)
    );

    return updateActions;
  };

  /**
   * Returns any necessary cart update actions for an existing bundle parent line item
   * by comparing changes in quantity or underlying bundle structure to existing child
   * line items
   */
  handler.handleExistingStaticBundleParent = (bundleLineItem, existingChildLineItems) => {
    console.log(`Found existing StaticBundleParent line item ${bundleLineItem.id}`);

    const updateActions = [];

    const parentExtId = bundleLineItem.custom.fields['external-id'];

    // Get value of StaticBundleParent:products attribtue;
    //  a set of references to child products variants + quantity
    const childProductLinks = bundleLineItem.variant.attributes.find(byName('products')).value;

    // Verify each linked child product exists and has the correct quantity
    const matchedChildLineItemIds = [];
    childProductLinks.forEach(link => {
      // Check quantity if matching child line item is found
      const flatLink = handler.flattenStaticBundleChildVariant(bundleLineItem.id, link);

      const linkedChildLineItem = existingChildLineItems.find(
        li => li.productId === flatLink.productId && li.custom.fields.parent === parentExtId
      );
      if (linkedChildLineItem) {
        matchedChildLineItemIds.push(linkedChildLineItem.id);

        const expectedQuantity = flatLink.quantity * bundleLineItem.quantity;
        // Update quantity if child quantity doesn't match bundle quantity
        if (linkedChildLineItem.quantity !== expectedQuantity) {
          updateActions.push(
            handler.buildChangeLineItemQuantityAction(
              linkedChildLineItem.id,
              expectedQuantity,
              bundleLineItem
            )
          );
        }
      } else {
        // Add a new line item if it's missing
        updateActions.push(
          handler.buildAddLineItemAction(bundleLineItem, link, parentExtId, helper.uuid())
        );
      }
    });

    // Remove child products referencing this bundle that are no longer linked
    const unlinkedChildLineItems = existingChildLineItems.filter(
      li => !matchedChildLineItemIds.includes(li.id) && li.custom.fields.parent === parentExtId
    );
    unlinkedChildLineItems.forEach(li => {
      updateActions.push(handler.buildRemoveLineItemAction(li.id));
    });

    return updateActions;
  };

  /**
   * Handles cart object provided to API extension on cart Create and returns
   * an array of update actions based on StaticBundleParent line items in
   * the cart.
   *
   * For each product of type StaticBundleParent:
   *  - Adds line items for linked bundle child products
   *  - Sets child line item quantity by multiplying bundle qty * defined child qty
   *  - Sets child line item price to 0
   *  - Adds custom type defining parent/child links to each bundle line item (parent or child)
   */
  handler.createCartHandler = (cart, productTypeId) => {
    console.log(
      `Received action type Create for cart ${cart.id} with ${cart.lineItems.length} line items`
    );

    const updateActions = [];

    // Process each line item of type StaticBundleParent
    cart.lineItems
      .filter(li => li.productType.id === productTypeId)
      .forEach(li => updateActions.push(...handler.handleNewStaticBundleParent(li)));

    return updateActions;
  };

  /**
   * Handles cart object provided to API extension on cart update and returns
   * an array of update actions accounting for changes in StaticBundleParent
   * parent items by adjusting child line item quantity, or adding/removing
   * child line items as needed
   */
  handler.updateCartHandler = (cart, productTypeId, customTypeId) => {
    console.log(`Received action type Update for cart ${cart.id}`);

    const updateActions = [];

    const sortedLineItems = handler.sortBundleLineItems(
      cart.lineItems,
      productTypeId,
      customTypeId
    );

    console.log(util.inspect(sortedLineItems, { depth: null }));

    const {
      newBundles, existingBundles, existingChildren, orphans
    } = sortedLineItems;

    // Add new bundle child line items and update with custom type
    newBundles.forEach(li => {
      updateActions.push(...handler.handleNewStaticBundleParent(li));
    });

    // Update line items and quantities for existing bundles
    existingBundles.forEach(li =>
      updateActions.push(...handler.handleExistingStaticBundleParent(li, existingChildren))
    );

    // Remove orphaned child line items
    orphans.forEach(li => {
      updateActions.push(handler.buildRemoveLineItemAction(li.id));
    });

    return updateActions;
  };

  /**
   * Selects the appropriate cart handler function by provided action type
   * (Create or Update). Fetches the StaticBundleParent product type ID from
   * the API and provides to handler function.
   */
  handler.handleCartInput = (cart, actionType, bundleProductTypeId, customTypeId) => {
    if (!validActionType(actionType)) {
      throw new Error(`Handler received invalid action type: ${actionType}`);
    }

    // eslint-disable-next-line default-case
    switch (actionType) {
      case ACTION_TYPE.CREATE:
        return handler.createCartHandler(cart, bundleProductTypeId);
      case ACTION_TYPE.UPDATE:
        return handler.updateCartHandler(cart, bundleProductTypeId, customTypeId);
    }
  };

  return handler;
};
