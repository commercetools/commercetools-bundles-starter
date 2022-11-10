import React from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { useIntl, FormattedNumber } from 'react-intl';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  Constraints,
  ErrorMessage,
  FieldLabel,
  NumberInput,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import { getAttribute } from '../../../../bundles-core/util';
import { ProductSearchInput } from '../../../../bundles-core/components/index';
import {
  ADDITIONAL_CHARGE,
  CATEGORY_PATH,
  CATEGORY_REF,
  MAX_QUANTITY,
  MIN_QUANTITY,
} from '../category-field/constants';
import { getScopedPriceParameters } from '../../util';
import GetVariantPrice from './get-variant-price.graphql';
import messages from './messages';

const PRODUCT = 'product';
const QUANTITY = 'quantity';
export const PRICE = 'price';

export const getCategoryAttributes = (category) => {
  const id = getAttribute(category, CATEGORY_REF).id;
  const path = getAttribute(category, CATEGORY_PATH);
  const additionalCharge = getAttribute(category, ADDITIONAL_CHARGE);
  const minQuantity = getAttribute(category, MIN_QUANTITY);
  const maxQuantity = getAttribute(category, MAX_QUANTITY);

  return { id, path, additionalCharge, minQuantity, maxQuantity };
};

const CategoryProductField = ({
  name,
  category,
  priceFilters,
  dynamicPrice,
  value,
  touched,
  errors,
  onChange,
  onBlur,
}) => {
  const intl = useIntl();

  const hasError = (field) => touched[field] && !!errors[field];
  const updatePrice = (price) => {
    const quantity = value.quantity ? parseInt(value.quantity, 10) : 0;
    const total = price.centAmount * quantity;
    onChange({
      target: {
        name: `${name}.${PRICE}`,
        value: {
          centAmount: total,
          currencyCode: price.currencyCode,
        },
      },
    });
  };

  const [getVariantPrice] = useLazyQuery(GetVariantPrice, {
    variables: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
    onCompleted(data) {
      const { price } = data.product.masterData.current.allVariants[0];
      if (price) {
        updatePrice(price.value);
      }
    },
  });
  const { id, path, additionalCharge, minQuantity, maxQuantity } =
    getCategoryAttributes(category);
  const showPrices = additionalCharge || dynamicPrice;
  const scopedPrice = showPrices ? getScopedPriceParameters(priceFilters) : '';
  const filter = `filter=categories.id: subtree("${id}")${scopedPrice}`;

  React.useEffect(() => {
    if (showPrices && value.product && !errors.quantity) {
      const product = JSON.parse(value.product.value);
      const { price } = product;
      if (price) {
        updatePrice(price.value);
      }
    } else {
      onChange({ target: { name: `${name}.${PRICE}`, value: null } });
    }
  }, [value.quantity, value.product, errors.quantity]);

  React.useEffect(() => {
    if (showPrices && priceFilters && value.product) {
      const product = JSON.parse(value.product.value);
      const { productId, sku } = product;
      getVariantPrice({
        variables: { id: productId, skus: [sku], ...priceFilters },
      });
    }
  }, [priceFilters]);

  return (
    <Spacings.Stack scale="xs">
      <FieldLabel
        title={path}
        hasRequiredIndicator={!!minQuantity}
        hint={
          additionalCharge ? intl.formatMessage(messages.additionalCharge) : ''
        }
      />
      <Spacings.Inline
        scale="s"
        alignItems={
          hasError(PRODUCT) || hasError(QUANTITY) ? 'flex-start' : 'center'
        }
      >
        <Constraints.Horizontal constraint="m">
          <Spacings.Stack scale="xs">
            <ProductSearchInput
              name={`${name}.${PRODUCT}`}
              value={value.product}
              placeholder={intl.formatMessage(messages.categoryPlaceholder)}
              filter={filter}
              cacheItems={false}
              onChange={onChange}
              onBlur={onBlur}
              hasError={hasError(PRODUCT)}
            />
            {hasError(PRODUCT) && <ErrorMessage>{errors.product}</ErrorMessage>}
          </Spacings.Stack>
        </Constraints.Horizontal>
        <Constraints.Horizontal constraint="s">
          <Spacings.Stack scale="xs">
            <NumberInput
              name={`${name}.${QUANTITY}`}
              value={value.quantity}
              placeholder={intl.formatMessage(messages.quantityPlaceholder)}
              min={minQuantity || 0}
              max={maxQuantity}
              step={1}
              onChange={onChange}
              onBlur={onBlur}
              hasError={hasError(QUANTITY)}
            />
            {hasError(QUANTITY) && (
              <ErrorMessage>{errors.quantity}</ErrorMessage>
            )}
          </Spacings.Stack>
        </Constraints.Horizontal>
        {value.price && (
          <Constraints.Horizontal constraint="s">
            <FormattedNumber
              value={value.price.centAmount / 100}
              style="currency"
              currency={value.price.currencyCode}
            />
          </Constraints.Horizontal>
        )}
      </Spacings.Inline>
    </Spacings.Stack>
  );
};
CategoryProductField.displayName = 'CategoryProductField';
CategoryProductField.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.array.isRequired,
  priceFilters: PropTypes.object,
  dynamicPrice: PropTypes.bool,
  value: PropTypes.shape({
    product: PropTypes.object,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.shape({
      centAmount: PropTypes.number,
      currencyCode: PropTypes.string,
    }),
  }).isRequired,
  touched: PropTypes.shape({
    product: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    quantity: PropTypes.bool,
  }),
  errors: PropTypes.shape({
    product: PropTypes.string,
    quantity: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

export default CategoryProductField;
