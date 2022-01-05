import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';
import { createRequestBuilder } from '@commercetools/api-request-builder';
import fetch from 'node-fetch';

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

export default ({
  clientId,
  clientSecret,
  projectKey,
  host,
  oauthHost,
  scopes,
  concurrency = 10,
}) => {
  const commercetools = {};

  commercetools.client = createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({
        host: oauthHost,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
        },
        scopes,
        fetch,
      }),
      createQueueMiddleware({ concurrency }),
      createHttpMiddleware({ host, fetch }),
    ],
  });

  commercetools.client.get = uri => commercetools.client.execute({ uri, method: 'GET' });

  commercetools.getRequestBuilder = () => createRequestBuilder({ projectKey });

  return commercetools;
};
