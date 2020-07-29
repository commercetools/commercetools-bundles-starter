import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { compact, get, isNil, some, uniq } from 'lodash';
import {
  CloseBoldIcon,
  ErrorMessage,
  FieldLabel,
  IconButton,
  NumberInput,
  PlusBoldIcon,
  SecondaryButton,
  Spacings
} from '@commercetools-frontend/ui-kit';
import { ProductSearchInput } from '@commercetools-us-ps/mc-app-core/components';
import { localize } from '@commercetools-us-ps/mc-app-core/util';
import { getAttribute } from '@commercetools-us-ps/mc-app-bundles-core/util';
import {
  PRODUCT,
  PRODUCT_NAME,
  PRODUCT_REF,
  QUANTITY,
  SKU,
  VARIANT_ID
} from './constants';
import messages from './messages';
import styles from './product-field.mod.css';

const hasError = (touched, errors, index, field) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

/*
 * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
 * value in the field based on the currently touched inputs.
 *
 * Example: The field contains two product inputs without values. The product inputs
 * are required. If both have been touched, only one "required" error message
 * will be shown.
 */
const getErrors = (touched, errors) =>
  touched &&
  errors &&
  touched.reduce((errs, item, index) => {
    const getError = field =>
      item && item[field] ? get(errors, `[${index}].${field}`) : null;

    return uniq([...errs, ...compact([getError(PRODUCT), getError(QUANTITY)])]);
  }, []);

const ProductField = ({
  name,
  hint,
  title,
  value,
  isRequired,
  touched,
  errors,
  onChange,
  onFocus,
  onBlur,
  push,
  remove
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
          data-testid={`add-product`}
          iconLeft={<PlusBoldIcon />}
          label={intl.formatMessage(messages.addProductLabel)}
          onClick={() => push({ product: null, quantity: '' })}
        />
      </Spacings.Inline>
      <Spacings.Stack scale="s">
        {value.map(({ product, quantity }, index) => (
          <Spacings.Inline key={index} alignItems="center">
            <div className={styles['product-search']}>
              <ProductSearchInput
                name={`${name}.${index}.${PRODUCT}`}
                value={product}
                placeholder={intl.formatMessage(messages.productPlaceholder)}
                hasError={hasError(touched, errors, index, PRODUCT)}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <div className={styles['product-quantity']}>
              <NumberInput
                name={`${name}.${index}.${QUANTITY}`}
                value={quantity}
                placeholder={intl.formatMessage(messages.quantityPlaceholder)}
                hasError={hasError(touched, errors, index, QUANTITY)}
                min={1}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <IconButton
              data-testid={`remove-product.${index}`}
              icon={<CloseBoldIcon />}
              label={intl.formatMessage(messages.addProductLabel)}
              isDisabled={value.length === 1}
              onClick={() => remove(index)}
            />
          </Spacings.Inline>
        ))}
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

ProductField.isEmpty = formValue =>
  !formValue ||
  some(
    formValue,
    value =>
      isNil(value.product) ||
      isNil(value.quantity) ||
      value.product.value.trim() === '' ||
      value.quantity.toString().trim() === ''
  );

ProductField.parseProductValue = (products, locale, languages) =>
  products.map(item => {
    const sku = getAttribute(item, SKU);
    const value = {
      id: getAttribute(item, VARIANT_ID),
      name: getAttribute(item, PRODUCT_NAME),
      ...(sku && { sku }),
      productId: getAttribute(item, PRODUCT_REF).id
    };

    return {
      product: {
        label: localize({
          obj: value,
          key: 'name',
          language: locale,
          fallback: value.id,
          fallbackOrder: languages
        }),
        value: JSON.stringify(value)
      },
      quantity: getAttribute(item, QUANTITY)
    };
  });
ProductField.parseSearchProductValue = products =>
  products.map(item => {
    return `${getAttribute(item, PRODUCT_REF).id}/${getAttribute(
      item,
      VARIANT_ID
    )}`;
  });

ProductField.convertToProductValue = products =>
  products.map(item => {
    const { product, quantity } = item;
    const { id, name, sku, productId } = JSON.parse(product.value);
    return [
      { name: VARIANT_ID, value: id },
      { name: SKU, value: sku },
      { name: QUANTITY, value: quantity },
      { name: PRODUCT_REF, value: { typeId: PRODUCT, id: productId } },
      { name: PRODUCT_NAME, value: name }
    ].filter(prop => !(prop.name === SKU && !sku));
  });
ProductField.convertToSearchProductValue = products =>
  products.map(item => {
    const { product } = item;
    const { id, productId } = JSON.parse(product.value);
    return `${productId}/${id}`;
  });

ProductField.displayName = 'ProductField';
ProductField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      }),
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired
  ),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  touched: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({ label: PropTypes.bool, value: PropTypes.bool })
      ]),
      quantity: PropTypes.bool
    })
  ),
  errors: PropTypes.array,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  push: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
};

export default ProductField;
