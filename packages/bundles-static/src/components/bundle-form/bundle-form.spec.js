import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router';
import { Formik } from 'formik';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { generateFormValues } from '../../test-util';
import BundleForm from './bundle-form';

const locale = 'en';
const languages = ['en', 'de'];
const currencies = ['EUR', 'USD'];

const mocks = {
  onSubmit: jest.fn(),
  match: {
    params: {
      projectKey: 'test-project'
    }
  }
};

const formValues = generateFormValues();

const baseMutation = {
  loading: false,
  error: null,
  data: null
};

function loadBundleForm(mutation, redirect) {
  const mockMutation = { ...baseMutation, ...mutation };

  return shallow(
    <BundleForm
      {...mocks}
      data={mockMutation.data}
      loading={mockMutation.loading}
      redirect={redirect}
    />
  );
}

const submitForm = wrapper =>
  wrapper
    .find(Formik)
    .props()
    .onSubmit(formValues);

describe('bundle form', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      dataLocale: locale,
      project: { languages, currencies }
    }));
    mockShowNotification.mockClear();
  });

  describe('when form submit button clicked', () => {
    beforeEach(() => {
      wrapper = loadBundleForm({ loading: true });
      submitForm(wrapper);
      wrapper.update();
    });

    it('should submit form', () => {
      expect(mocks.onSubmit).toHaveBeenCalled();
    });
  });

  describe('when form submission completes successfully', () => {
    it('and redirect set, should redirect to path', () => {
      const redirect = '/';
      wrapper = loadBundleForm({ data: {} }, redirect);
      expect(wrapper.find(Redirect).prop('to')).toEqual(redirect);
    });

    it('and redirect not set, should not redirect to path', () => {
      wrapper = loadBundleForm({ data: {} });
      expect(wrapper.find(Redirect).exists()).toEqual(false);
    });
  });
});
