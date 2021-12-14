/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import fetch from 'node-fetch';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import {
  DEFAULT_CONCURRENCY,
  ApiExtensionTimeoutError,
  handleError,
} from '../commercetools';

export const TEST_TIMEOUT = 10000;

/**
 * Creates a commercetools client configured (via env vars) for client credentials flow
 * whose execute method is wrapped in an error handler.
 * @returns {Object} - Object containing {client, projectKey, requestBuilder()}.
 */
export const createCTClient = () => {
  const projectKey = process.env.PROJECT_KEY || process.env.CT_PROJECT_KEY;
  const scopeStr = process.env.CLIENT_SCOPES || process.env.CT_CLIENT_SCOPES;
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: 'https://auth.us-central1.gcp.commercetools.com',
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

/**
 * Ensurces resources exist on ct, creating them if they do not.
 * @param {Object|Object[]} draftOrDrafts -
 * A resource draft or set of resource drafts to create or ensure exist.
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
  if (!Array.isArray(draftOrDrafts)) {
    drafts = [draftOrDrafts];
  }
  const { ct, ctresources } = global;
  const resources = await Promise.all(
    drafts.map(async (draft) => {
      let resource;
      try {
        let { key } = draft;
        if (resourceTypeId === 'discountCodes') {
          ({ code: key } = draft);
        }
        const fetchRequest = {
          uri: ct.requestBuilder()[resourceTypeId].parse({ key, expand })
            .build(),
          method: 'GET',
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
          method: 'POST',
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
          if (!retried) {
            return ensureResourcesExist(draft, resourceTypeId, true);
          }
          throw creationError;
        }
      }

      return resource;
    }),
  );
  if (!Array.isArray(draftOrDrafts)) {
    return resources[0];
  }
  return resources;
};
