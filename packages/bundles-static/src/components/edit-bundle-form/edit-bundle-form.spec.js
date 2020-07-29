import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { FormattedMessage } from 'react-intl';
import { mockMutation, setMutation } from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { generateProduct, generateSubmittedFormValues } from '../../test-util';
import { MASTER_VARIANT_ID } from '../../constants';
import { transformResults } from '../bundle-details/static-bundle-details';
import EditBundleForm from './edit-bundle-form';
import BundleForm from '../bundle-form';
import messages from './messages';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()]
};
const dataLocale = project.languages[0];
const product = generateProduct(project.languages);
const bundle = { ...product, ...transformResults(product.masterData.current) };
const formValues = generateSubmittedFormValues();
const { id, version } = formValues;
const variables = {
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  id,
  version
};

const mocks = {
  bundle,
  onComplete: jest.fn()
};

const loadEditBundleForm = () => shallow(<EditBundleForm {...mocks} />);

describe('edit bundle form', () => {
  let wrapper;

  const submitForm = value =>
    wrapper
      .find(BundleForm)
      .props()
      .onSubmit({ id, version, ...value });

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, dataLocale }));

    mocks.onComplete.mockClear();
    mockShowNotification.mockClear();
  });

  describe('when form submitted', () => {
    beforeEach(() => {
      setMutation({ data: { updateProduct: bundle } });
      wrapper = loadEditBundleForm();
    });

    it('with updated name, should modify bundle name', () => {
      const { name } = formValues;
      submitForm({ name });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [{ changeName: { name } }]
        }
      });
    });

    it('with updated description, should modify bundle description', () => {
      const { description } = formValues;
      submitForm({ description });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              setDescription: { description }
            }
          ]
        }
      });
    });

    it('with updated key, should set bundle key', () => {
      const { key } = formValues;
      submitForm({ key });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              setKey: { key }
            }
          ]
        }
      });
    });

    it('with updated sku, should set bundle sku', () => {
      const { sku } = formValues;
      submitForm({ sku });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              setSku: { variantId: MASTER_VARIANT_ID, sku }
            }
          ]
        }
      });
    });

    it('with updated products, should update bundle products', () => {
      const { products } = formValues;
      submitForm({ products });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              setAttributeInAllVariants: {
                name: 'products',
                value: products
              }
            }
          ]
        }
      });
    });

    it('with updated search products, should update bundle search products', () => {
      const { productSearch } = formValues;
      submitForm({ productSearch });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              setAttributeInAllVariants: {
                name: 'productSearch',
                value: productSearch
              }
            }
          ]
        }
      });
    });

    it('with updated slug, should update bundle slug', () => {
      const { slug } = formValues;
      submitForm({ slug });
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [
            {
              changeSlug: { slug }
            }
          ]
        }
      });
    });
  });

  describe('when form submission completes', () => {
    const data = { updateProduct: bundle };
    beforeEach(async () => {
      setMutation({ data });
      wrapper = loadEditBundleForm();
      const { name } = formValues;
      await submitForm({ name });
    });

    it('should invoke on complete', () => {
      expect(mocks.onComplete).toHaveBeenCalled();
    });

    it('should show success notification', () => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        {
          text: <FormattedMessage {...messages.editSuccess} />
        },
        data
      );
    });
  });

  describe('when form submission fails', () => {
    const error = {};
    const { name } = formValues;

    beforeEach(() => {
      setMutation({ error });
      wrapper = loadEditBundleForm();
    });

    it('should not invoke on complete', async () => {
      try {
        await submitForm({ name });
      } catch (err) {
        // eslint-disable-next-line jest/no-try-expect
        expect(mocks.onComplete).not.toHaveBeenCalled();
      }
    });

    it('should show error notification', async () => {
      try {
        await submitForm({ name });
      } catch (err) {
        // eslint-disable-next-line jest/no-try-expect
        expect(mockShowNotification).toHaveBeenCalledWith(
          {
            text: <FormattedMessage {...messages.editError} />
          },
          error
        );
      }
    });
  });
});
