import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import { isEqual, pickBy } from 'lodash';
import omitEmpty from 'omit-empty';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { LocalizedTextInput } from '@commercetools-frontend/ui-kit';
import { transformLocalizedStringToField } from '@commercetools-us-ps/mc-app-core/util';
import StaticForm from './static-form';
import ProductField from '../product-field';
import messages from './messages';

const BundleForm = ({ bundle, onSubmit, data, loading, redirect }) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;

  const initialBundleValues = () => {
    const products = ProductField.parseProductValue(
      bundle.products,
      dataLocale,
      languages
    );
    return {
      id: bundle.id,
      version: bundle.version,
      name: LocalizedTextInput.createLocalizedString(languages, bundle.name),
      description: LocalizedTextInput.createLocalizedString(
        languages,
        bundle.description
      ),
      key: bundle.key || '',
      sku: bundle.sku || '',
      products,
      productSearch: products,
      slug: LocalizedTextInput.createLocalizedString(languages, {
        [dataLocale]: bundle.slug
      })
    };
  };

  const initialEmptyValues = () => ({
    name: LocalizedTextInput.createLocalizedString(languages),
    description: LocalizedTextInput.createLocalizedString(languages),
    key: '',
    sku: '',
    products: [
      {
        product: null,
        quantity: ''
      }
    ],
    productSearch: null,
    slug: LocalizedTextInput.createLocalizedString(languages)
  });

  const initialValues = bundle ? initialBundleValues() : initialEmptyValues();
  const initialValidation = {
    slugDefined: !!(bundle && bundle.slug)
  };

  const assetSchema = yup.object({
    key: yup.string(),
    products: yup
      .array(
        yup.object({
          product: yup
            .object({
              value: yup.string(),
              label: yup.string()
            })
            .nullable()
            .required(intl.formatMessage(messages.missingRequiredField)),
          quantity: yup.lazy(value =>
            typeof value === 'number'
              ? yup
                  .number()
                  .min(1, intl.formatMessage(messages.quantityError))
                  .required(intl.formatMessage(messages.missingRequiredField))
              : yup
                  .string()
                  .required(intl.formatMessage(messages.missingRequiredField))
          )
        })
      )
      .compact()
  });

  const submitValues = values => {
    const submit = omitEmpty({
      name: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(values.name)
      ),
      description: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(values.description)
      ),
      key: values.key,
      sku: values.sku,
      products: JSON.stringify(
        ProductField.convertToProductValue(values.products)
      ),
      productSearch: JSON.stringify(
        ProductField.convertToSearchProductValue(values.products)
      ),
      slug: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(values.slug)
      )
    });

    return {
      id: values.id,
      version: values.version,
      ...pickBy(
        submit,
        (value, key) => !isEqual(initialValues[key], values[key])
      )
    };
  };

  const validate = values => {
    const errors = {
      name: {},
      slug: {}
    };

    if (LocalizedTextInput.isEmpty(values.name)) {
      errors.name.missing = true;
    }

    if (LocalizedTextInput.isEmpty(values.slug)) {
      errors.slug.missing = true;
    }

    return omitEmpty(errors);
  };

  const handleSubmit = async values => {
    onSubmit(submitValues(values));
  };

  if (!loading && data && redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={assetSchema}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {props => (
        <StaticForm
          dataLocale={dataLocale}
          initialValidation={initialValidation}
          {...props}
        />
      )}
    </Formik>
  );
};
BundleForm.displayName = 'BundleForm';
BundleForm.propTypes = {
  bundle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    key: PropTypes.string,
    name: PropTypes.object.isRequired,
    description: PropTypes.object,
    sku: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.array).isRequired,
    slug: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  redirect: PropTypes.string
};

export default BundleForm;
