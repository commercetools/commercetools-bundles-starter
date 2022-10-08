import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  BackToList,
  Error,
  Loading,
  TabContainer,
  View,
  ViewHeader,
} from '../index';
import { localize } from '../util';
import { usePathContext } from '../../context';
import { BundleCommands } from '../bundle-commands';
import GetBundle from './get-bundle.graphql';
import messages from './messages';

const BundleDetails = ({ match, transformResults, headers, container }) => {
  const intl = useIntl();
  const rootPath = usePathContext();
  const { dataLocale, project } = useApplicationContext();

  const { data, error, loading, refetch } = useQuery(GetBundle, {
    variables: {
      id: match.params.bundleId,
      locale: dataLocale,
      currency: project.currencies[0],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'no-cache',
  });

  const { languages } = project;

  if (loading) return <Loading />;
  if (error)
    return (
      <Error
        title={intl.formatMessage(messages.errorLoadingTitle)}
        message={error.message}
      />
    );

  const { product } = data;
  const { id, version, key, sku, slug, masterData } = product;
  const { current, hasStagedChanges, published, staged } = masterData;

  const transformed = {
    current: transformResults(current),
    staged: transformResults(staged),
  };

  const bundle = {
    id,
    version,
    key,
    sku,
    slug,
    ...(hasStagedChanges ? transformed.staged : transformed.current),
    current: transformed.current,
    staged: transformed.staged,
  };

  return (
    <View>
      <ViewHeader
        title={localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallback: id,
          fallbackOrder: languages,
        })}
        backToList={
          <BackToList
            href={`/${match.params.projectKey}/${rootPath}`}
            label={intl.formatMessage(messages.backButton)}
          />
        }
        commands={
          <BundleCommands
            match={match}
            id={id}
            version={version}
            published={published}
            hasStagedChanges={hasStagedChanges}
            onComplete={refetch}
          />
        }
      >
        {headers}
      </ViewHeader>
      <TabContainer>{container(bundle, refetch)}</TabContainer>
    </View>
  );
};

BundleDetails.displayName = 'BundleDetails';
BundleDetails.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
      bundleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  transformResults: PropTypes.func.isRequired,
  headers: PropTypes.node.isRequired,
  container: PropTypes.func.isRequired,
};

export default BundleDetails;
