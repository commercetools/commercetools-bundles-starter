import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { RestLink } from 'apollo-link-rest';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  ApplicationShell,
  apolloClient,
  setupGlobalErrorListener,
  RouteCatchAll
} from '@commercetools-frontend/application-shell';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { Sdk } from '@commercetools-frontend/sdk';
import * as globalActions from '@commercetools-frontend/actions-global';

import { ROOT_PATH } from '../../constants';
import loadMessages from '../../messages';

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = React.lazy(() =>
  import('../../routes' /* webpackChunkName: "starter-routes" */)
);

export const ApplicationBundleManager = () => {
  const { environment, project } = useApplicationContext();
  const { mcApiUrl } = environment;

  const restLink = new RestLink({
    uri: `${mcApiUrl}/proxy/ctp/${project.key}`,
    headers: {
      Accept: 'application/json'
    },
    credentials: 'include'
  });

  const client = new ApolloClient({
    link: ApolloLink.from([restLink, apolloClient.link]),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <Switch>
        {/* For development, it's useful to redirect to the actual
          application routes when you open the browser at http://localhost:3001 */
        process.env.NODE_ENV === 'production' ? null : (
          <Redirect
            exact={true}
            from="/:projectKey"
            to={`/:projectKey/${ROOT_PATH}`}
          />
        )}
        <Route
          path={`/:projectKey/${ROOT_PATH}`}
          component={AsyncApplicationRoutes}
        />
        {/* Catch-all route */}
        <RouteCatchAll />
      </Switch>
    </ApolloProvider>
  );
};
ApplicationBundleManager.displayName = 'ApplicationBundleManager';

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

class EntryPoint extends React.Component {
  static displayName = 'EntryPoint';
  render() {
    return (
      <ApplicationShell
        environment={window.app}
        onRegisterErrorListeners={({ dispatch }) => {
          Sdk.Get.errorHandler = error =>
            globalActions.handleActionError(error, 'sdk')(dispatch);
        }}
        applicationMessages={loadMessages}
        DEV_ONLY__loadNavbarMenuConfig={() =>
          import('../../../menu.json').then(data => data.default || data)
        }
        render={() => <ApplicationBundleManager />}
      />
    );
  }
}

export default EntryPoint;
