/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import fetch from 'node-fetch';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import lodashPkg from 'lodash';

const { cloneDeep } = lodashPkg;

export const TEST_TIMEOUT = 10000;
export const DEFAULT_CONCURRENCY = 10;

/**
 * Creates a commercetools client configured (via env vars) for client credentials flow
 * whose execute method is wrapped in an error handler.
 * @returns {Object} - Object containing {client, projectKey, requestBuilder()}.
 */
export const createCTClient = () => {
  const projectKey = process.env.PROJECT_KEY || process.env.commercetools_project_key;
  const scopeStr = process.env.CT_SCOPES || process.env.commercetools_scopes;
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: process.env.commercetools_token_url || 'https://auth.us-central1.gcp.commercetools.com',
    projectKey,
    credentials: {
      clientId: process.env.CLIENT_ID || process.env.commercetools_client_id,
      clientSecret: process.env.CT_SECRET || process.env.commercetools_client_secret,
    },
    scopes: [scopeStr],
    enableRetry: true,
    fetch,
  });

  const httpMiddleware = createHttpMiddleware({
    host:
            process.env.CT_API_URL || 'https://api.us-central1.gcp.commercetools.com',
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
      console.log(error);
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

export const fetchResource = async (ctClient, id, resourceTypeId) => {
  const request = {
    uri: ctClient.requestBuilder()[resourceTypeId].parse({ id }).build(),
    method: 'GET',
  };
  const { body } = await ctClient.client.execute(request);
  return body;
};

export const fetchResourceByKey = async (ctClient, key, resourceTypeId) => {
  const request = {
    uri: ctClient.requestBuilder()[resourceTypeId].parse({ key }).build(),
    method: 'GET',
  };
  const response = await ctClient.client.execute(request);
  return (response) ? response.body : response;
};

/**
 * Attempts to update a resource with a set of update actions.
 * @param {Object} params - An object of named params.
 * @param {Object} params.ctClient - commercetools client.
 * @param {Object} params.resource - The current version of the resource to apply updates to.
 * @param {Object[]} params.actions - The array of update actions to apply to the resource.
 * @param {string} params.resourceTypeId -  The resource type id of the resources to update.
 * @param {boolean} [params.retried=false] - If this update request has been retried already.
 * @returns {Promise} The update request to ct.
 */
export const updateResource = async ({
  ctClient,
  resource,
  actions,
  resourceTypeId,
  retried = false
}) => {
  let updatedResource = {};
  const request = {
    uri: ctClient
      .requestBuilder()[resourceTypeId].parse({ id: resource.id })
      .build(),
    method: 'POST',
    body: {
      version: resource.version,
      actions
    }
  };
  try {
    const response = await ctClient.client.execute(request);
    updatedResource = response.body;
  } catch (err) {
    if (!retried) {
      const newResource = cloneDeep(resource);
      newResource.version = err.expectedVersion;
      return updateResource({
        ctClient,
        resource: newResource,
        actions,
        resourceTypeId,
        retried: true,
      });
    }
    if (!retried) {
      return updateResource({
        ctClient,
        resource,
        actions,
        resourceTypeId,
        retried: true,
      });
    }
    console.error(
      'Error during update',
      JSON.stringify(
        {
          error: err,
          retried,
          actions,
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
 * Ensures resources exist on ct, creating them if they do not.
 * @param {Object} ctClient - commercetools client.
 * @param {Object|Object[]} draftOrDrafts -
 * A resource draft or set of resource drafts to create or ensure exist.
 * @param {string} resourceTypeId - The resource type id of the resource(s) to delete.
 * @param {boolean} [retried=false] - If this update request has been retried already.
 * @returns {Promise[]} Array of resources from get/post requests to fetch them from ct.
 */
export const ensureResourcesExist = async (
  ctClient,
  draftOrDrafts,
  resourceTypeId,
  retried = false,
  expand = [],
) => {
  let drafts = draftOrDrafts;
  if (!Array.isArray(draftOrDrafts)) {
    drafts = [draftOrDrafts];
  }
  const resources = await Promise.all(
    drafts.map(async (draft) => {
      let resource;
      let { key } = draft;
      if (resourceTypeId === 'discountCodes') {
        ({ code: key } = draft);
      }

      const request = {
        uri: ctClient.requestBuilder()[resourceTypeId].build(),
        method: 'POST',
        body: draft,
      };
      try {
        const response = await ctClient.client.execute(request);
        resource = (response) ? response.body : response;
      } catch (creationError) {
        if (!retried) {
          return ensureResourcesExist(ctClient, draft, resourceTypeId, true);
        }
        throw creationError;
      }

      return resource;
    }),
  );
  if (!Array.isArray(draftOrDrafts)) {
    return resources[0];
  }
  return resources;
};

/**
 * Attempts to delete resource(s), retrying one time.
 * @param {ctClient} commercetools client.
 * @param {{ id: string, version: number} |{ id: string, version: number }[]}
 * resourceOrResourcesToDelete - A resource or set of resources to delete.
 * @param {string} resourceTypeId - The resource type id of the resource(s) to delete.
 * @param {boolean} [retried=false] - If this update request has been retried already.
 * @returns {Promise[]} Array of delete requests.
 */
export const deleteResources = async (
  ctClient,
  resourceOrResourcesToDelete,
  resourceTypeId,
  retried = false,
) => {
  let resourcesToDelete = resourceOrResourcesToDelete;
  if (!Array.isArray(resourceOrResourcesToDelete)) {
    resourcesToDelete = [resourceOrResourcesToDelete];
  }
  const resources = await Promise.all(
    resourcesToDelete.filter(Boolean).map(async (resourceToDelete) => {
      let resourceToFetch = resourceToDelete;
      if (resourceToFetch.customer) {
        resourceToFetch = resourceToFetch.customer;
      }
      let { id, version } = resourceToFetch;
      if (!(id && version)) {
        let { key } = resourceToFetch;
        if (resourceTypeId === 'discountCodes') {
          ({ code: key } = resourceToFetch);
        }
        const request = {
          uri: ctClient.requestBuilder()[resourceTypeId].parse({ key }).build(),
          method: 'GET',
        };
        const currentResourceResponse = await ctClient.client.execute(request);
        const currentResource = currentResourceResponse.body;
        ({ id, version } = currentResource);
      }
      if (
        resourceTypeId === 'products'
            && resourceToFetch.masterData
            && resourceToFetch.masterData.published
      ) {
        const { key } = resourceToFetch;
        const unpublishRequest = {
          uri: ctClient.requestBuilder()[resourceTypeId].parse({ key }).build(),
          method: 'POST',
          body: {
            version,
            actions: [
              {
                action: 'unpublish',
              },
            ],
          },
        };
        const currentResourceResponse = await ctClient.client.execute(
          unpublishRequest,
        );
        const currentResource = currentResourceResponse.body;
        ({ id, version } = currentResource);
      }
      const deleteRequest = {
        uri: `${ctClient
          .requestBuilder()[resourceTypeId].parse({ id })
          .build()}?version=${version}`,
        method: 'DELETE',
      };
      try {
        const response = await ctClient.client.execute(deleteRequest);
        return response;
      } catch (err) {
        if (!retried) {
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
  if (!Array.isArray(resourceOrResourcesToDelete)) {
    return resources[0];
  }
  return resources;
};

export const deleteKnownResources = async (ctClient, resourceTypeId) => {
  let resourcesToDelete = [];
  let page = 1;
  const allRequests = [];
  do {
    const fetchRequest = {
      uri: ctClient
        .requestBuilder()[resourceTypeId].parse({ perPage: 200, page })
        .build(),
      method: 'GET',
    };
    // eslint-disable-next-line no-await-in-loop
    const resourcesResponse = await ctClient.client.execute(fetchRequest);
    resourcesToDelete = resourcesResponse.body.results;
    if (resourcesToDelete.length) {
      allRequests.push(deleteResources(ctClient, resourcesToDelete, resourceTypeId));
      page += 1;
    }
  } while (resourcesToDelete.length);
  return allRequests;
};

/**
 * Attempts to delete resources of a type that are found in a where clause.
 * @param {Client} commercetools client.
 * @param {Object} params - An object of named params.
 * @param {string} params.resourceTypeId - The resource type id of the resources to delete.
 * @param {string|string[]} params.where - The where clause to use to find resources to delete.
 * @returns {Promise[]} Array of delete requests.
 */
export const deleteResourcesWhere = async ({ ctClient, resourceTypeId, where }) => {
  let arrayWhere = where;
  if (!Array.isArray(arrayWhere)) {
    arrayWhere = [arrayWhere];
  }
  let resourcesToDelete = [];
  let page = 1;
  const allRequests = [];
  do {
    const fetchRequest = {
      uri: ctClient
        .requestBuilder()[resourceTypeId].parse({ where: arrayWhere, perPage: 200, page })
        .build(),
      method: 'GET',
    };
    // eslint-disable-next-line no-await-in-loop
    const resourcesResponse = await ctClient.client.execute(fetchRequest);
    resourcesToDelete = resourcesResponse.body.results;
    if (resourcesToDelete.length) {
      allRequests.push(deleteResources(ctClient, resourcesToDelete, resourceTypeId));
      page += 1;
    }
  } while (resourcesToDelete.length);
  return allRequests;
};
