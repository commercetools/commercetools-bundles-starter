import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { Spacings } from '@commercetools-frontend/ui-kit';
import {
  BackToList,
  TabContainer,
  View,
  ViewHeader
} from '@commercetools-us-ps/mc-app-core/components';
import { useShowSideNotification } from '@commercetools-us-ps/mc-app-core/hooks';
import { BUNDLE_PRODUCT_TYPE, ROOT_PATH } from '../../constants';
import BundleForm from '../bundle-form';
import CreateBundle from './create-bundle.graphql';
import messages from './messages';

const CreateBundleForm = ({ match }) => {
  const intl = useIntl();
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}`;
  const showSuccessNotification = useShowSideNotification(
    'success',
    messages.createSuccess
  );
  const showErrorNotification = useShowSideNotification(
    'error',
    messages.createError
  );
  const [createBundle, { data, loading }] = useMutation(CreateBundle, {
    onCompleted: showSuccessNotification,
    onError: showErrorNotification
  });

  function onSubmit(values) {
    const variables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      productTypeKey: BUNDLE_PRODUCT_TYPE,
      ...values
    };
    return createBundle({ variables });
  }

  return (
    <View>
      <ViewHeader
        title={<FormattedMessage {...messages.title} />}
        backToList={
          <BackToList
            href={mainRoute}
            label={intl.formatMessage(messages.backButton)}
          />
        }
      />
      <TabContainer>
        <Spacings.Stack scale="m">
          <BundleForm
            onSubmit={onSubmit}
            data={data}
            loading={loading}
            redirect={mainRoute}
          />
        </Spacings.Stack>
      </TabContainer>
    </View>
  );
};
CreateBundleForm.displayName = 'CreateBundleForm';
CreateBundleForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default CreateBundleForm;
