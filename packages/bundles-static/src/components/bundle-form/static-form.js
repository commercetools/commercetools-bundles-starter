import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Form from '@commercetools-us-ps/mc-app-bundles-core/components/bundle-form';
import ProductField from '../product-field';
import messages from './messages';

const PRODUCTS = 'products';

const StaticForm = props => {
  const { values, touched, errors, handleBlur, handleChange } = props;

  useEffect(() => {
    props.setFieldValue('productSearch', props.values.products);
  }, [props.values.products]);

  return (
    <Form
      {...props}
      component={{
        name: PRODUCTS,
        field: (push, remove) => (
          <ProductField
            name={PRODUCTS}
            value={values.products}
            title={<FormattedMessage {...messages.bundleProductsTitle} />}
            hint={<FormattedMessage {...messages.bundleProductsDescription} />}
            isRequired={true}
            touched={touched.products}
            errors={errors.products}
            onBlur={handleBlur}
            onChange={handleChange}
            push={push}
            remove={remove}
          />
        )
      }}
    />
  );
};
StaticForm.displayName = 'Form';
StaticForm.propTypes = {
  dataLocale: PropTypes.string.isRequired,
  initialValidation: PropTypes.shape({
    slugDefined: PropTypes.bool
  }).isRequired,
  values: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    description: PropTypes.objectOf(PropTypes.string),
    key: PropTypes.string.isRequired,
    sku: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        }),
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ).isRequired,
    productSearch: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        }),
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ),
    slug: PropTypes.objectOf(PropTypes.string).isRequired
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.shape({
      missing: PropTypes.bool
    }),
    products: PropTypes.array,
    slug: PropTypes.shape({
      missing: PropTypes.bool
    })
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.bool),
    description: PropTypes.objectOf(PropTypes.bool),
    key: PropTypes.bool,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.shape({ label: PropTypes.bool, value: PropTypes.bool })
        ]),
        quantity: PropTypes.bool
      })
    ),
    slug: PropTypes.objectOf(PropTypes.bool)
  }),
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default StaticForm;
