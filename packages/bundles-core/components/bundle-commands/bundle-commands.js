import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import { StatusSelect } from '../index';
import { usePathContext } from '../../context';
import EditBundle from './edit-bundle.graphql';
import DeleteBundle from './delete-bundle.graphql';
import messages from './messages';
import styles from './bundle-commands.mod.css';

const BundleCommands = ({
  match,
  id,
  version,
  published,
  hasStagedChanges,
  onComplete,
}) => {
  const intl = useIntl();
  const rootPath = usePathContext();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const showSuccessNotification = useShowNotification({
    kind: 'success',
    domain: DOMAINS.SIDE,
  });
  const showErrorNotification = useShowNotification({
    kind: 'error',
    domain: DOMAINS.SIDE,
  });

  const variables = {
    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    id,
    version,
  };

  const [deleteBundle, { data, loading }] = useMutation(DeleteBundle, {
    variables,
    onCompleted() {
      showSuccessNotification({
        text: intl.formatMessage(messages.deleteSuccess),
      });
    },
    onError() {
      showErrorNotification({
        text: intl.formatMessage(messages.deleteError),
      });
    },
  });
  const [editBundle] = useMutation(EditBundle, {
    onCompleted() {
      showSuccessNotification({
        text: intl.formatMessage(messages.editSuccess),
      });
    },
    onError() {
      showErrorNotification({
        text: intl.formatMessage(messages.editError),
      });
    },
  });

  async function onStatusChange(value) {
    const actions = [];

    if (value) {
      actions.push({ publish: { scope: 'All' } });
    } else {
      actions.push({ unpublish: {} });
    }

    await editBundle({ variables: { ...variables, actions } });
    onComplete();
  }

  if (!loading && data) {
    return <Redirect to={`/${match.params.projectKey}/${rootPath}`} />;
  }

  return (
    <div className={styles.commands}>
      <Spacings.Inline alignItems="center">
        <Text.Body intlMessage={messages.status} />
        <StatusSelect
          className={styles['status-select']}
          published={published}
          hasStagedChanges={hasStagedChanges}
          onChange={onStatusChange}
        />
        {!published && (
          <IconButton
            icon={<BinLinearIcon />}
            label={intl.formatMessage(messages.deleteBundle)}
            onClick={() => setConfirmingDelete(true)}
          />
        )}
        <ConfirmationDialog
          title={intl.formatMessage(messages.deleteBundle)}
          isOpen={confirmingDelete}
          onClose={() => setConfirmingDelete(false)}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={deleteBundle}
        >
          <Text.Body intlMessage={messages.deleteBundleConfirmation} />
        </ConfirmationDialog>
      </Spacings.Inline>
    </div>
  );
};
BundleCommands.displayName = 'BundleCommands';
BundleCommands.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired,
  published: PropTypes.bool.isRequired,
  hasStagedChanges: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default BundleCommands;
