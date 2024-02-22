import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { ErrorMessage } from '@commercetools-uikit/messages';
import NumberInput from '@commercetools-uikit/number-input';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import FieldLabel from '@commercetools-uikit/field-label';
import { BundleForm } from '@commercetools-us-ps/bundles-core/components/bundle-form';
import { CategoryField } from '../category-field';
import messages from './messages';

const FIELDS = {
  CATEGORIES: 'categories',
  DYNAMIC_PRICE: 'dynamicPrice',
  QUANTITY: 'quantity',
  MIN_QUANTITY: 'minQuantity',
  MAX_QUANTITY: 'maxQuantity',
};

const DynamicForm = (props) => {
  const { values, touched, errors, handleBlur, handleChange } = props;
  const { dynamicPrice } = values;

  return (
    <BundleForm
      {...props}
      fields={[
        <Spacings.Stack
          scale="xs"
          name={FIELDS.DYNAMIC_PRICE}
          key={FIELDS.DYNAMIC_PRICE}
        >
          <FieldLabel
            title={<FormattedMessage {...messages.bundlePricingTitle} />}
          />
          <CheckboxInput
            name={FIELDS.DYNAMIC_PRICE}
            value={JSON.stringify(dynamicPrice)}
            isChecked={JSON.parse(dynamicPrice)}
            touched={touched.dynamicPrice}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <FormattedMessage {...messages.bundleDynamicPriceTitle} />
          </CheckboxInput>
        </Spacings.Stack>,
        <Spacings.Stack scale="xs" name={FIELDS.QUANTITY} key={FIELDS.QUANTITY}>
          <FieldLabel
            title={<FormattedMessage {...messages.bundleQuantityTitle} />}
          />
          <Spacings.Inline scale="m">
            <Spacings.Inline alignItems="center">
              <Text.Body intlMessage={messages.bundleMinQuantityPlaceholder} />
              <NumberInput
                name={FIELDS.MIN_QUANTITY}
                min={1}
                step={1}
                value={values.minQuantity}
                touched={touched.minQuantity}
                errors={errors.minQuantity}
                hasError={!!errors.minQuantity}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Spacings.Inline>
            <Spacings.Inline alignItems="center">
              <Text.Body intlMessage={messages.bundleMaxQuantityPlaceholder} />
              <NumberInput
                name={FIELDS.MAX_QUANTITY}
                min={1}
                step={1}
                value={values.maxQuantity}
                touched={touched.maxQuantity}
                errors={errors.maxQuantity}
                hasError={!!errors.maxQuantity}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Spacings.Inline>
          </Spacings.Inline>
          {errors.minQuantity && (
            <ErrorMessage>{errors.minQuantity}</ErrorMessage>
          )}
          {errors.maxQuantity && (
            <ErrorMessage>{errors.maxQuantity}</ErrorMessage>
          )}
        </Spacings.Stack>,
      ]}
      component={{
        name: FIELDS.CATEGORIES,
        field: (push, remove) => (
          <CategoryField
            name={FIELDS.CATEGORIES}
            value={values.categories}
            title={<FormattedMessage {...messages.bundleCategoriesTitle} />}
            hint={
              <FormattedMessage {...messages.bundleCategoriesDescription} />
            }
            showAdditionalCharge={!dynamicPrice}
            isRequired={true}
            touched={touched.categories}
            errors={errors.categories}
            onBlur={handleBlur}
            onChange={handleChange}
            push={push}
            remove={remove}
          />
        ),
      }}
    />
  );
};
DynamicForm.displayName = 'Form';
DynamicForm.propTypes = {
  dataLocale: PropTypes.string.isRequired,
  initialValidation: PropTypes.shape({
    slugDefined: PropTypes.bool,
  }).isRequired,
  values: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    description: PropTypes.objectOf(PropTypes.string),
    key: PropTypes.string.isRequired,
    slug: PropTypes.objectOf(PropTypes.string).isRequired,
    dynamicPrice: PropTypes.bool,
    minQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      })
    ).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.shape({
      missing: PropTypes.bool,
    }),
    minQuantity: PropTypes.string,
    maxQuantity: PropTypes.string,
    categories: PropTypes.array,
    slug: PropTypes.shape({
      missing: PropTypes.bool,
    }),
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.bool),
    description: PropTypes.objectOf(PropTypes.bool),
    key: PropTypes.bool,
    slug: PropTypes.objectOf(PropTypes.bool),
    dynamicPrice: PropTypes.bool,
    minQuantity: PropTypes.bool,
    maxQuantity: PropTypes.bool,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.oneOfType([
          PropTypes.bool,
          PropTypes.shape({ label: PropTypes.bool, value: PropTypes.bool }),
        ]),
      })
    ),
  }),
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default DynamicForm;
