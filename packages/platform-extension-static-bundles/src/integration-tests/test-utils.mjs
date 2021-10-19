/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import fetch from "node-fetch";
import { createClient } from "@commercetools/sdk-client";
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-middleware-auth";
import { createRequestBuilder } from "@commercetools/api-request-builder";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createQueueMiddleware } from "@commercetools/sdk-middleware-queue";
import { isArray, cloneDeep, uniq, flatten, intersection } from "lodash";
import {
  DEFAULT_CONCURRENCY,
  ApiExtensionTimeoutError,
  ConcurrentModificationError,
  handleError,
} from "../../platform-extension-core/src/commercetools.mjs";

export const TEST_TIMEOUT = 10000;

/**
 * Creates a commercetools client configured (via env vars) for client credentials flow whose execute method is wrapped in an error handler.
 * @returns {Object} - Object containing {client, projectKey, requestBuilder()}.
 */
export const createCTClient = () => {
  const projectKey = process.env.PROJECT_KEY || process.env.CT_PROJECT_KEY;
  const scopeStr = process.env.CLIENT_SCOPES || process.env.CT_CLIENT_SCOPES;
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: "https://auth.us-central1.gcp.commercetools.com",
    projectKey,
    credentials: {
      clientId: process.env.CLIENT_ID || process.env.CT_CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET || process.env.CT_CLIENT_SECRET,
    },
    scopes: [scopeStr],
    enableRetry: true,
    fetch,
  });

  const httpMiddleware = createHttpMiddleware({
    host:
      process.env.CT_API_URL || "https://api.us-central1.gcp.commercetools.com",
    fetch,
  });
  const queueMiddleware = createQueueMiddleware({
    concurrency: DEFAULT_CONCURRENCY,
  });
  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware, queueMiddleware],
  });

  client.unwrappedExecute = client.execute;

  // wrap execute to provide nicer error handling
  client.execute = async (...params) => {
    let response;
    try {
      response = await client.unwrappedExecute(...params);
    } catch (error) {
      handleError(error);
    }
    return response;
  };

  const ct = {
    client,
    projectKey,
    requestBuilder: () => createRequestBuilder({ projectKey }),
  };
  return ct;
};

export const fetchResource = async (id, resourceTypeId) => {
  const { ct } = global;
  const request = {
    uri: ct.requestBuilder()[resourceTypeId].parse({ id }).build(),
    method: "GET",
  };
  const { body } = await ct.client.execute(request);
  return body;
};

export const fetchAllResources = async (id, resourceTypeId) => {
  const { ct } = global;
  const request = {
    uri: ct.requestBuilder()[resourceTypeId].build(),
    method: "GET",
  };
  const { body } = await ct.client.execute(request);
  return body;
};

/**
 * Ensurces resources exist on ct, creating them if they do not.
 * @param {Object|Object[]} draftOrDrafts - A resource draft or set of resource drafts to create or ensure exist.
 * @param {string} resourceTypeId - The resource type id of the resource(s) to delete.
 * @param {boolean} [retried=false] - If this update request has been retried already.
 * @returns {Promise[]} Array of resources from get/post requests to fetch them from ct.
 */
export const ensureResourcesExist = async (
  draftOrDrafts,
  resourceTypeId,
  retried = false,
  expand = [],
) => {
  let drafts = draftOrDrafts;
  if (!isArray(draftOrDrafts)) {
    drafts = [draftOrDrafts];
  }
  const { ct, ctresources } = global;
  const resources = await Promise.all(
    drafts.map(async (draft) => {
      let resource;
      try {
        let { key } = draft;
        if (resourceTypeId === "discountCodes") {
          ({ code: key } = draft);
        }
        const fetchRequest = {
          uri: ct
            .requestBuilder()
            [resourceTypeId].parse({ key, expand })
            .build(),
          method: "GET",
        };
        const existingResponse = await ct.client.execute(fetchRequest);
        resource = existingResponse.body;
        if (!ctresources[resourceTypeId]) {
          ctresources[resourceTypeId] = {};
        }
        ctresources[resourceTypeId][resource.id] = resource;
      } catch (err) {
        const request = {
          uri: ct.requestBuilder()[resourceTypeId].build(),
          method: "POST",
          body: draft,
        };
        try {
          const response = await ct.client.execute(request);
          resource = response.body;
          if (!ctresources[resourceTypeId]) {
            ctresources[resourceTypeId] = {};
          }
          ctresources[resourceTypeId][resource.id] = resource;
        } catch (creationError) {
          if (creationError instanceof ApiExtensionTimeoutError && !retried) {
            return ensureResourcesExist(draft, resourceTypeId, true);
          }
          throw creationError;
        }
      }

      return resource;
    }),
  );
  if (!isArray(draftOrDrafts)) {
    return resources[0];
  }
  return resources;
};

/**
 * Attempts to delete resource(s), retrying one time.
 * @param {{ id: string, version: number} |{ id: string, version: number }[]} resourceOrResourcesToDelete - A resource or set of resources to delete.
 * @param {string} resourceTypeId - The resource type id of the resource(s) to delete.
 * @param {boolean} [retried=false] - If this update request has been retried already.
 * @returns {Promise[]} Array of delete requests.
 */
export const deleteResources = async (
  resourceOrResourcesToDelete,
  resourceTypeId,
  retried = false,
) => {
  let resourcesToDelete = resourceOrResourcesToDelete;
  if (!isArray(resourceOrResourcesToDelete)) {
    resourcesToDelete = [resourceOrResourcesToDelete];
  }
  const { ct, ctresources } = global;
  const resources = await Promise.all(
    resourcesToDelete.filter(Boolean).map(async (resourceToDelete) => {
      let resourceToFetch = resourceToDelete;
      if (resourceToFetch.customer) {
        resourceToFetch = resourceToFetch.customer;
      }
      let { id, version } = resourceToFetch;
      if (!(id && version)) {
        let { key } = resourceToFetch;
        if (resourceTypeId === "discountCodes") {
          ({ code: key } = resourceToFetch);
        }
        const request = {
          uri: ct.requestBuilder()[resourceTypeId].parse({ key }).build(),
          method: "GET",
        };
        const currentResourceResponse = await ct.client.execute(request);
        const currentResource = currentResourceResponse.body;
        ({ id, version } = currentResource);
      }
      if (
        resourceTypeId === "products" &&
        resourceToFetch.masterData &&
        resourceToFetch.masterData.published
      ) {
        const { key } = resourceToFetch;
        const unpublishRequest = {
          uri: ct.requestBuilder()[resourceTypeId].parse({ key }).build(),
          method: "POST",
          body: {
            version,
            actions: [
              {
                action: "unpublish",
              },
            ],
          },
        };
        const currentResourceResponse = await ct.client.execute(
          unpublishRequest,
        );
        const currentResource = currentResourceResponse.body;
        ({ id, version } = currentResource);
        if (!ctresources[resourceTypeId]) {
          ctresources[resourceTypeId] = {};
        }
        ctresources[resourceTypeId][currentResource.id] = currentResource;
      }
      const deleteRequest = {
        uri: `${ct
          .requestBuilder()
          [resourceTypeId].parse({ id })
          .build()}?version=${version}`,
        method: "DELETE",
      };
      try {
        const response = await ct.client.execute(deleteRequest);
        if (!ctresources[resourceTypeId]) {
          ctresources[resourceTypeId] = {};
        }
        delete ctresources[resourceTypeId][id];
        return response;
      } catch (err) {
        if (err instanceof ConcurrentModificationError && !retried) {
          const newResource = cloneDeep(resourceToFetch);
          newResource.version = err.expectedVersion;
          return deleteResources(newResource, resourceTypeId, true);
        }
        if (!retried) {
          const retryResource = { ...resourceToFetch };
          delete retryResource.version;
          // retry resource deletion.
          return deleteResources(retryResource, resourceTypeId, true);
        }
        throw err;
      }
    }),
  );
  if (!isArray(resourceOrResourcesToDelete)) {
    return resources[0];
  }
  return resources;
};

export const deleteKnownResources = async (resourceTypeId) =>
  deleteResources(
    Object.values(global.ctresources[resourceTypeId]),
    resourceTypeId,
  );

/**
 * Attempts to delete resources of a type that are found in a where clause.
 * @param {Object} params - An object of named params.
 * @param {string} params.resourceTypeId - The resource type id of the resources to delete.
 * @param {string|string[]} params.where - The where clause to use to find resources to delete.
 * @returns {Promise[]} Array of delete requests.
 */
export const deleteResourcesWhere = async ({ resourceTypeId, where }) => {
  let arrayWhere = where;
  if (!isArray(arrayWhere)) {
    arrayWhere = [arrayWhere];
  }
  const { ct } = global;
  let resourcesToDelete = [];
  let page = 1;
  const allRequests = [];
  do {
    const fetchRequest = {
      uri: ct
        .requestBuilder()
        [resourceTypeId].parse({ where: arrayWhere, perPage: 200, page })
        .build(),
      method: "GET",
    };
    // eslint-disable-next-line no-await-in-loop
    const resourcesResponse = await ct.client.execute(fetchRequest);
    resourcesToDelete = resourcesResponse.body.results;
    if (resourcesToDelete.length) {
      allRequests.push(deleteResources(resourcesToDelete, resourceTypeId));
      page += 1;
    }
  } while (resourcesToDelete.length);
  return allRequests;
};

export const taxIsSetOnCart = (cart) => cart.taxedPrice;

export const RESET_ACTIONS = [
  "setCustomerEmail",
  "setShippingAddress",
  "setBillingAddress",
  "setCountry",
  "recalculate",
  "setShippingMethod",
  "setCustomShippingMethod",
  "addDiscountCode",
  "removeDiscountCode",
  "setCustomerId",
  "setCustomerGroup",
  "setCustomType",
  "setCustomField",
  "setLocale",
  "setShippingRateInput",
  "addShoppingList",
  "setDeleteDaysAfterLastModification",
  "addItemShippingAddress",
  "removeItemShippingAddress",
  "updateItemShippingAddress",
  "setShippingAddressAndShippingMethod",
  "setShippingAddressAndCustomShippingMethod",
  "setDeleteDaysAfterLastModification",
  "addItemShippingAddress",
  "removeItemShippingAddress",
  "updateItemShippingAddress",
  "setShippingAddressAndShippingMethod",
  "setShippingAddressAndCustomShippingMethod",
  "setLineItemTotalPrice",
  "setLineItemPrice",
  "applyDeltaToCustomLineItemShippingDetailsTargets",
  "setCustomLineItemShippingDetails",
  "addCustomLineItem",
  "removeCustomLineItem",
  "setCustomLineItemCustomType",
  "setCustomLineItemCustomField",
  "changeCustomLineItemQuantity",
  "changeCustomLineItemMoney",
  "setLineItemShippingDetails",
  "addLineItem",
  "removeLineItem",
  "changeLineItemQuantity",
  "setLineItemCustomType",
  "setLineItemCustomField",
  "setLineItemTotalPrice",
  "setLineItemPrice",
];

export const hasAnyResetActions = (actions) =>
  intersection(actions, RESET_ACTIONS).length;

/**
 * Given a cart resource and an array of update actions to apply, returns the update actions to also reset line items to platform mode.
 * @param {*} cart
 * @param {*} existingActions
 */
export const resetToPlatformPricingActions = (cart, existingActions = []) => {
  const taxIsSet = taxIsSetOnCart(cart);
  const hasResetActions = hasAnyResetActions(
    existingActions.map((actions) => actions.action),
  );

  // if tax is set and there's no update actions that need to trigger a reset, dont reset the line items price modes
  if (taxIsSet && !hasResetActions) {
    // dont reset the line items price mode
    return existingActions;
  }

  // get a set of actions to reset all line items to platform mode
  const resetActions = cart.lineItems
    ? cart.lineItems
        .filter((li) => li.priceMode !== "Platform")
        .map((li) => ({ action: "setLineItemTotalPrice", lineItemId: li.id }))
    : undefined;

  // remove any setLineItemTotalPrices
  const filteredExistingActions = existingActions.filter(
    (action) => action.action !== "setLineItemTotalPrice",
  );
  const allActions = [...resetActions, ...filteredExistingActions];

  return allActions;
};

/**
 * Attempts to update a resource with a set of update actions.
 * @param {Object} params - An object of named params.
 * @param {string} params.resourceTypeId -  The resource type id of the resources to update.
 * @param {Object[]} params.actions - The array of update actions to apply to the resource.
 * @param {Object} params.resource - The current version of the resource to apply updates to.
 * @param {boolean} [params.retried=false] - If this update request has been retried already.
 * @returns {Promise} The update request to ct.
 */
export const updateResource = async ({
  resource,
  actions,
  resourceTypeId,
  retried = false,
  expand = [],
  maintainCartActions = false,
}) => {
  let updatedResource = {};
  const wrappedActions =
    resourceTypeId === "carts" && !maintainCartActions
      ? resetToPlatformPricingActions(resource, actions)
      : actions;
  const { ct, ctresources } = global;
  const request = {
    uri: ct
      .requestBuilder()
      [resourceTypeId].parse({ id: resource.id, expand })
      .build(),
    method: "POST",
    body: {
      version: resource.version,
      actions: wrappedActions,
    },
  };
  try {
    const response = await ct.client.execute(request);
    updatedResource = response.body;
    if (!ctresources[resourceTypeId]) {
      ctresources[resourceTypeId] = {};
    }
    ctresources[resourceTypeId][updatedResource.id] = updatedResource;
  } catch (err) {
    if (err instanceof ConcurrentModificationError && !retried) {
      const newResource = cloneDeep(resource);
      newResource.version = err.expectedVersion;
      return updateResource({
        resource: newResource,
        actions: wrappedActions,
        resourceTypeId,
        retried: true,
      });
    }
    if (err instanceof ApiExtensionTimeoutError && !retried) {
      return updateResource({
        resource,
        actions: wrappedActions,
        resourceTypeId,
        retried: true,
      });
    }
    console.error(
      "Error during update",
      JSON.stringify(
        {
          error: err,
          retried,
          actions: wrappedActions,
          resourceTypeId,
          resource,
        },
        null,
        2,
      ),
    );
    throw err;
  }
  return updatedResource;
};

/**
 * Given a cart and sku, find the first line item that matches the sku
 * @param {*} cart
 * @param {*} sku
 */
export const getLineItemBySku = (cart, sku) =>
  cart.lineItems && cart.lineItems.find((li) => li.variant.sku === sku);

/**
 * Given a lineItem, returns the cart discounts affecting it.
 * Searches custom.fields.cartDiscountsAffecting adn discountedPrice.includedDiscounts.
 * @param {Object} lineItem lineItem to gather discounts on.
 * @returns {string[]} unique set of cart discount ids affecting the line item.
 */
export const getLineItemAffectedDiscounts = (lineItem) => {
  let discounts = [];
  if (
    lineItem &&
    lineItem.custom &&
    lineItem.custom.fields.cartDiscountsAffecting
  ) {
    discounts = lineItem.custom.fields.cartDiscountsAffecting;
  }
  if (lineItem && lineItem.discountedPrice) {
    const discountIds = lineItem.discountedPrice.includedDiscounts.map(
      ({ discount: { id } }) => id,
    );
    discounts = [...discounts, ...discountIds];
  }
  return uniq(discounts);
};

/**
 * Given an array of lineItems, returns the cart discounts affecting them all.
 * Searches custom.fields.cartDiscountsAffecting adn discountedPrice.includedDiscounts.
 * @param {Object} lineItem lineItem to gather discounts on.
 * @returns {string[]} unique set of cart discount ids affecting the line item.
 */
export const getAllAffectedDiscounts = (lineItems) =>
  uniq(flatten(lineItems.map(getLineItemAffectedDiscounts)));

/**
 * Given a map of resources by type (see example) ensures the removal of those resources.
 * @param {*} resourcesByType
 */
export const removeRemainingResourcesByType = async (resourcesByType) => {
  const copiedResources = cloneDeep(resourcesByType);
  await Promise.all(
    Object.entries(resourcesByType).map(async ([key, resourcesById]) => {
      const toRemove = Object.values(resourcesById);
      if (toRemove.length <= 0) {
        return [];
      }
      console.info(`Removing ${toRemove.length} ${key} from ct project.`);
      await deleteResources(toRemove, key);
      copiedResources[key] = {};
      console.info(`Done Removing ${toRemove.length} ${key} from ct project.`);
      return toRemove;
    }),
  );
  return copiedResources;
};
