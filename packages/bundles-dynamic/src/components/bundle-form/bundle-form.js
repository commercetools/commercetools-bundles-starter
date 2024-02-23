import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Redirect } from 'react-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';
import omitEmpty from 'omit-empty';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedStringToField } from '@commercetools-us-ps/bundles-core/components/util';
import { CategoryField } from '../category-field';
import DynamicForm from './dynamic-form';
import messages from './messages';

const BundleForm = ({ bundle, onSubmit, data, loading, redirect }) => {
  const intl = useIntl();
  const { dataLocale, project } = useApplicationContext();
  const { languages } = project;

  const initialBundleValues = () => ({
    id: bundle.id,
    version: bundle.version,
    name: LocalizedTextInput.createLocalizedString(languages, bundle.name),
    description: LocalizedTextInput.createLocalizedString(
      languages,
      bundle.description
    ),
    key: bundle.key || '',
    sku: bundle.sku || '',
    categories: CategoryField.parseCategoryValue(bundle.categories),
    dynamicPrice: bundle.dynamicPrice || false,
    minQuantity: bundle.minQuantity || '',
    maxQuantity: bundle.maxQuantity || '',
    slug: LocalizedTextInput.createLocalizedString(languages, {
      [dataLocale]: bundle.slug,
    }),
  });

  const initialEmptyValues = () => ({
    name: LocalizedTextInput.createLocalizedString(languages),
    description: LocalizedTextInput.createLocalizedString(languages),
    key: '',
    sku: '',
    dynamicPrice: false,
    minQuantity: '',
    maxQuantity: '',
    categories: [
      {
        category: null,
        minQuantity: '',
        maxQuantity: '',
        additionalCharge: false,
      },
    ],
    slug: LocalizedTextInput.createLocalizedString(languages),
  });

  const initialValues = bundle ? initialBundleValues() : initialEmptyValues();
  const initialValidation = {
    slugDefined: !!(bundle && bundle.slug),
  };

  const validationSchema = yup.object({
    minQuantity: yup
      .number()
      .min(1, intl.formatMessage(messages.quantityError))
      .integer(intl.formatMessage(messages.integerError)),
    maxQuantity: yup
      .number()
      .min(1, intl.formatMessage(messages.quantityError))
      .integer(intl.formatMessage(messages.integerError))
      .when('minQuantity', {
        is: (val) => !!val,
        then: yup
          .number()
          .moreThan(
            yup.ref('minQuantity'),
            intl.formatMessage(messages.maxGreaterThanMinError)
          ),
      }),
    categories: yup.array(
      yup.object({
        category: yup
          .object({
            value: yup.string(),
            label: yup.string(),
          })
          .nullable()
          .required(intl.formatMessage(messages.missingRequiredField)),
        minQuantity: yup.lazy((value) =>
          typeof value === 'number'
            ? yup
                .number()
                .min(0, intl.formatMessage(messages.zeroQuantityError))
                .integer(intl.formatMessage(messages.integerError))
            : yup.string()
        ),
        maxQuantity: yup.lazy((value) =>
          typeof value === 'number'
            ? yup
                .number()
                .min(0, intl.formatMessage(messages.zeroQuantityError))
                .integer(intl.formatMessage(messages.integerError))
                .when('minQuantity', {
                  is: (val) => !!val,
                  then: yup
                    .number()
                    .moreThan(
                      yup.ref('minQuantity'),
                      intl.formatMessage(messages.maxGreaterThanMinError)
                    ),
                })
            : yup.string()
        ),
        additionalCharge: yup.bool(),
      })
    ),
  });

  const submitValues = (values) => {
    const {
      id,
      version,
      name,
      description,
      key,
      sku,
      dynamicPrice,
      minQuantity,
      maxQuantity,
      categories,
      slug,
    } = values;
    const submit = omitEmpty({
      name: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(name)
      ),
      description: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(description)
      ),
      key,
      sku,
      dynamicPrice: JSON.stringify(dynamicPrice),
      categories: JSON.stringify(
        CategoryField.convertToCategoryValue(categories, !dynamicPrice)
      ),
      categorySearch: JSON.stringify(
        CategoryField.convertToCategorySearchValue(categories)
      ),
      slug: transformLocalizedStringToField(
        LocalizedTextInput.omitEmptyTranslations(slug)
      ),
    });

    return {
      id,
      version,
      ...pickBy(
        {
          ...submit,
          minQuantity: minQuantity ? JSON.stringify(minQuantity) : '',
          maxQuantity: maxQuantity ? JSON.stringify(maxQuantity) : '',
        },
        (item, itemKey) => !isEqual(initialValues[itemKey], item)
      ),
    };
  };

  const validate = (values) => {
    const errors = {
      name: {},
      slug: {},
    };

    if (LocalizedTextInput.isEmpty(values.name)) {
      errors.name.missing = true;
    }

    if (LocalizedTextInput.isEmpty(values.slug)) {
      errors.slug.missing = true;
    }

    return omitEmpty(errors);
  };

  const handleSubmit = (values) => {
    onSubmit(submitValues(values));
  };

  if (!loading && data && redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <DynamicForm
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
    dynamicPrice: PropTypes.bool,
    minQuantity: PropTypes.number,
    maxQuantity: PropTypes.number,
    categories: PropTypes.arrayOf(PropTypes.array).isRequired,
    slug: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  redirect: PropTypes.string,
};

export default BundleForm;
