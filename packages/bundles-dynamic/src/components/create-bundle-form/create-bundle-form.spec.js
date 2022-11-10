import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { mockMutation, setMutation } from '@apollo/client';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { generateSubmittedFormValues } from '../../test-util';
import { ATTRIBUTES, BUNDLE_PRODUCT_TYPE } from '../../constants';
import BundleForm from '../bundle-form';
import CreateBundleForm from './create-bundle-form';
import messages from './messages';

const mocks = {
  match: {
    params: {
      projectKey: 'test-project',
    },
  },
};

const formValues = generateSubmittedFormValues();
const {
  categories,
  categorySearch,
  dynamicPrice,
  minQuantity,
  maxQuantity,
  ...values
} = formValues;
const loadCreateBundleForm = () => shallow(<CreateBundleForm {...mocks} />);

describe('create bundle form', () => {
  let wrapper;

  const submitForm = (form = formValues) =>
    wrapper.find(BundleForm).props().onSubmit(form);

  beforeEach(() => {
    mockShowNotification.mockClear();
  });

  it('when form submitted with only categories, should create bundle', () => {
    setMutation({ loading: true });
    wrapper = loadCreateBundleForm();

    submitForm({ ...values, categories, categorySearch });
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        productTypeKey: BUNDLE_PRODUCT_TYPE,
        ...values,
        attributes: [
          { name: ATTRIBUTES.CATEGORIES, value: categories },
          { name: ATTRIBUTES.CATEGORY_SEARCH, value: categorySearch },
        ],
      },
    });
  });

  it('when form submitted with dynamic price, should create bundle', () => {
    setMutation({ loading: true });
    wrapper = loadCreateBundleForm();

    submitForm({ ...values, categories, categorySearch, dynamicPrice });
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        productTypeKey: BUNDLE_PRODUCT_TYPE,
        ...values,
        attributes: [
          { name: ATTRIBUTES.CATEGORIES, value: categories },
          { name: ATTRIBUTES.CATEGORY_SEARCH, value: categorySearch },
          { name: ATTRIBUTES.DYNAMIC_PRICE, value: dynamicPrice },
        ],
      },
    });
  });

  it('when form submitted with min quantity, should create bundle', () => {
    setMutation({ loading: true });
    wrapper = loadCreateBundleForm();

    submitForm({ ...values, categories, categorySearch, minQuantity });
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        productTypeKey: BUNDLE_PRODUCT_TYPE,
        ...values,
        attributes: [
          { name: ATTRIBUTES.CATEGORIES, value: categories },
          { name: ATTRIBUTES.CATEGORY_SEARCH, value: categorySearch },
          { name: ATTRIBUTES.MIN_QUANTITY, value: minQuantity },
        ],
      },
    });
  });

  it('when form submitted with max quantity, should create bundle', () => {
    setMutation({ loading: true });
    wrapper = loadCreateBundleForm();

    submitForm({ ...values, categories, categorySearch, maxQuantity });
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        productTypeKey: BUNDLE_PRODUCT_TYPE,
        ...values,
        attributes: [
          { name: ATTRIBUTES.CATEGORIES, value: categories },
          { name: ATTRIBUTES.CATEGORY_SEARCH, value: categorySearch },
          { name: ATTRIBUTES.MAX_QUANTITY, value: maxQuantity },
        ],
      },
    });
  });

  it('when form submission completes successfully, should show success notification', async () => {
    const data = {};
    setMutation({ data });
    wrapper = loadCreateBundleForm();
    await submitForm();
    expect(mockShowNotification).toHaveBeenCalledWith(
      {
        text: <FormattedMessage {...messages.createSuccess} />,
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
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockShowNotification).toHaveBeenCalledWith(
        {
          text: <FormattedMessage {...messages.createError} />,
        },
        error
      );
    }
  });
});
