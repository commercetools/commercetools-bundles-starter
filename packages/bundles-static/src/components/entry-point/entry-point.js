import React from 'react';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import {
  ApplicationShell,
  createApolloClient,
  setupGlobalErrorListener,
  selectProjectKeyFromUrl,
} from '@commercetools-frontend/application-shell';
import { Sdk } from '@commercetools-frontend/sdk';
import * as globalActions from '@commercetools-frontend/actions-global';

import loadMessages from '../../load-messages';

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = React.lazy(() =>
  import('../../routes' /* webpackChunkName: "starter-routes" */)
);

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

// TODO: Refactor this code in a better way to fetch mcApiUrl and projectKey.
const { mcApiUrl } = window.app;
const projectKey = selectProjectKeyFromUrl();

let headers = {
  Accept: 'application/json',
};

if (window.app.env === 'development')
  headers.Authorization = `Bearer ${window.sessionStorage.getItem(
    'sessionToken'
  )}`;

const restLink = new RestLink({
  uri: `${mcApiUrl}/proxy/ctp/${projectKey}`,
  headers: headers,
  credentials: 'include',
});

const apolloClient = createApolloClient({
  cache: {
    // Your custom configuration, according to the Apollo cache documentation.
    // https://www.apollographql.com/docs/react/caching/cache-configuration/
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([restLink, apolloClient.link]),
  cache: new InMemoryCache(),
});

const EntryPoint = () => (
  <ApplicationShell
    environment={window.app}
    applicationMessages={loadMessages}
    apolloClient={client}
    onRegisterErrorListeners={({ dispatch }) => {
      Sdk.Get.errorHandler = (error) =>
        globalActions.handleActionError(error, 'sdk')(dispatch);
    }}
  >
    <AsyncApplicationRoutes />
  </ApplicationShell>
);
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
