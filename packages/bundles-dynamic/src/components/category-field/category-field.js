import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import camelCase from 'lodash/camelCase';
import compact from 'lodash/compact';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import some from 'lodash/some';
import uniq from 'lodash/uniq';
import {
  CheckboxInput,
  CloseBoldIcon,
  ErrorMessage,
  FieldLabel,
  IconButton,
  NumberInput,
  PlusBoldIcon,
  SecondaryButton,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import { getAttribute } from '../../../../bundles-core/util';
import { CategorySearchInput } from '../../../../bundles-core/components/index';
import {
  ADDITIONAL_CHARGE,
  CATEGORY,
  CATEGORY_PATH,
  CATEGORY_REF,
  MIN_QUANTITY,
  MAX_QUANTITY,
} from './constants';
import messages from './messages';
import styles from './category-field.mod.css';

export const FIELD_ADDITIONAL_CHARGE = camelCase(ADDITIONAL_CHARGE);
export const FIELD_MIN_QUANTITY = camelCase(MIN_QUANTITY);
export const FIELD_MAX_QUANTITY = camelCase(MAX_QUANTITY);

const hasError = (touched, errors, index, field) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

/*
 * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
 * value in the field based on the currently touched inputs.
 *
 * Example: The field contains two categories inputs without values. The category
 * inputs are required. If both have been touched, only one "required" error message
 * will be shown.
 */
const getErrors = (touched, errors) =>
  touched &&
  errors &&
  touched.reduce((errs, item, index) => {
    const getError = (field) =>
      item && item[field] ? get(errors, `[${index}].${field}`) : null;

    return uniq([
      ...errs,
      ...compact([
        getError(CATEGORY),
        getError(FIELD_MIN_QUANTITY),
        getError(FIELD_MAX_QUANTITY),
      ]),
    ]);
  }, []);

const CategoryField = ({
  name,
  hint,
  title,
  value,
  showAdditionalCharge,
  isRequired,
  touched,
  errors,
  onChange,
  onFocus,
  onBlur,
  push,
  remove,
}) => {
  const intl = useIntl();
  const fieldErrors = getErrors(touched, errors);

  return (
    <Spacings.Stack scale="s">
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <FieldLabel
          title={title}
          hint={hint}
          hasRequiredIndicator={isRequired}
        />
        <SecondaryButton
          data-testid={`add-category`}
          iconLeft={<PlusBoldIcon />}
          label={intl.formatMessage(messages.addCategoryLabel)}
          onClick={() =>
            push({
              category: null,
              minQuantity: '',
              maxQuantity: '',
              additionalCharge: false,
            })
          }
        />
      </Spacings.Inline>
      <Spacings.Stack scale="s">
        {value.map(
          ({ category, minQuantity, maxQuantity, additionalCharge }, index) => (
            <Spacings.Inline key={index} alignItems="center">
              <div className={styles['category-search']}>
                <CategorySearchInput
                  name={`${name}.${index}.${CATEGORY}`}
                  value={category}
                  placeholder={intl.formatMessage(messages.categoryPlaceholder)}
                  showProductCount
                  hasError={hasError(touched, errors, index, CATEGORY)}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div className={styles['category-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${FIELD_MIN_QUANTITY}`}
                  value={minQuantity}
                  placeholder={intl.formatMessage(
                    messages.minQuantityPlaceholder
                  )}
                  hasError={hasError(
                    touched,
                    errors,
                    index,
                    FIELD_MIN_QUANTITY
                  )}
                  min={0}
                  step={1}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div className={styles['category-quantity']}>
                <NumberInput
                  name={`${name}.${index}.${FIELD_MAX_QUANTITY}`}
                  value={maxQuantity}
                  placeholder={intl.formatMessage(
                    messages.maxQuantityPlaceholder
                  )}
                  hasError={hasError(
                    touched,
                    errors,
                    index,
                    FIELD_MAX_QUANTITY
                  )}
                  min={0}
                  step={1}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              {showAdditionalCharge && (
                <div className={styles['category-quantity']}>
                  <CheckboxInput
                    name={`${name}.${index}.${FIELD_ADDITIONAL_CHARGE}`}
                    value={JSON.stringify(additionalCharge)}
                    isChecked={JSON.parse(additionalCharge)}
                    onBlur={onBlur}
                    onChange={onChange}
                  >
                    <FormattedMessage {...messages.additionalChargeLabel} />
                  </CheckboxInput>
                </div>
              )}
              <IconButton
                data-testid={`remove-category.${index}`}
                icon={<CloseBoldIcon />}
                label={intl.formatMessage(messages.addCategoryLabel)}
                isDisabled={value.length === 1}
                onClick={() => remove(index)}
              />
            </Spacings.Inline>
          )
        )}
        {fieldErrors && (
          <>
            {fieldErrors.map((error, index) => (
              <ErrorMessage key={index}>{error}</ErrorMessage>
            ))}
          </>
        )}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

CategoryField.isEmpty = (formValue) =>
  !formValue ||
  some(
    formValue,
    (value) =>
      isNil(value.category) ||
      isNil(value.minQuantity) ||
      isNil(value.maxQuantity) ||
      value.category.value.trim() === '' ||
      value.minQuantity.toString().trim() === '' ||
      value.maxQuantity.toString().trim() === ''
  );

CategoryField.parseCategoryValue = (categories) =>
  categories.map((item) => {
    const id = getAttribute(item, CATEGORY_REF).id;
    const path = getAttribute(item, CATEGORY_PATH);

    return {
      category: {
        label: path,
        value: id,
      },
      minQuantity: getAttribute(item, MIN_QUANTITY) || '',
      maxQuantity: getAttribute(item, MAX_QUANTITY) || '',
      additionalCharge: getAttribute(item, ADDITIONAL_CHARGE) || false,
    };
  });

CategoryField.convertToCategorySearchValue = (categories) =>
  categories.map(({ category }) => category.value);

CategoryField.convertToCategoryValue = (categories, allowAdditionalCharge) =>
  categories.map((item) => {
    const { category, minQuantity, maxQuantity, additionalCharge } = item;
    const { label, value } = category;
    const attributes = [
      { name: CATEGORY_REF, value: { typeId: CATEGORY, id: value } },
      { name: CATEGORY_PATH, value: label },
    ];
    if (minQuantity !== '') {
      attributes.push({ name: MIN_QUANTITY, value: minQuantity });
    }
    if (maxQuantity !== '') {
      attributes.push({ name: MAX_QUANTITY, value: maxQuantity });
    }
    if (allowAdditionalCharge) {
      attributes.push({ name: ADDITIONAL_CHARGE, value: additionalCharge });
    }
    return attributes;
  });

CategoryField.displayName = 'CategoryField';
CategoryField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      minQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      additionalCharge: PropTypes.bool,
    }).isRequired
  ),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  showAdditionalCharge: PropTypes.bool.isRequired,
  touched: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({ label: PropTypes.bool, value: PropTypes.bool }),
      ]),
      minQuantity: PropTypes.bool,
      maxQuantity: PropTypes.bool,
    })
  ),
  errors: PropTypes.array,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  push: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default CategoryField;
