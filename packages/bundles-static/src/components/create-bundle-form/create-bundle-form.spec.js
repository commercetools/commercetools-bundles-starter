import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { mockMutation, setMutation } from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { generateSubmittedFormValues } from '../../test-util';
import { BUNDLE_PRODUCT_TYPE } from '../../constants';
import CreateBundleForm from './create-bundle-form';
import BundleForm from '../bundle-form';
import messages from './messages';

const mocks = {
  match: {
    params: {
      projectKey: 'test-project'
    }
  }
};

const formValues = generateSubmittedFormValues();
const loadCreateBundleForm = () => shallow(<CreateBundleForm {...mocks} />);

describe('create bundle form', () => {
  let wrapper;

  const submitForm = () =>
    wrapper
      .find(BundleForm)
      .props()
      .onSubmit(formValues);

  beforeEach(() => {
    mockShowNotification.mockClear();
  });

  it('when form submitted, should create bundle', () => {
    setMutation({ loading: true });
    wrapper = loadCreateBundleForm();
    submitForm();
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        productTypeKey: BUNDLE_PRODUCT_TYPE,
        ...formValues
      }
    });
  });

  it('when form submission completes successfully, should show success notification', async () => {
    const data = {};
    setMutation({ data });
    wrapper = loadCreateBundleForm();
    await submitForm();
    expect(mockShowNotification).toHaveBeenCalledWith(
      {
        text: <FormattedMessage {...messages.createSuccess} />
      },
      data
    );
  });

  it('when form submission fails, should show error notification', async () => {
    const error = {};
    setMutation({ error });
    wrapper = loadCreateBundleForm();
    try {
      await submitForm();
    } catch (err) {
      // eslint-disable-next-line jest/no-try-expect
      expect(mockShowNotification).toHaveBeenCalledWith(
        {
          text: <FormattedMessage {...messages.createError} />
        },
        error
      );
    }
  });
});
