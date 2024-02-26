import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Formik } from 'formik';
import * as yup from 'yup';
import compact from 'lodash/compact';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import without from 'lodash/without';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  DOMAINS,
  GRAPHQL_TARGETS,
  NO_VALUE_FALLBACK,
} from '@commercetools-frontend/constants';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Constraints from '@commercetools-uikit/constraints';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectInput from '@commercetools-uikit/select-input';
import { PriceFilters } from '@commercetools-us-ps/bundles-core/components';
import { localize } from '@commercetools-us-ps/bundles-core/components/util';
import { BUNDLE_CART_CUSTOM_TYPE } from '../../constants';
import {
  getScopedPriceParameters,
  getPriceFilters,
  omitDeep,
} from '../../util';
import CategoryProductField, {
  getCategoryAttributes,
} from './category-product-field';
import FormattedJSON from '../formatted-json';
import GetPriceRange from '../get-price-range.rest.graphql';
import CreateCartWithBundle from './create-cart-with-bundle.graphql';
import styles from './bundle-preview.mod.css';
import messages from './messages';

export const PROJECTION = {
  CURRENT: 'current',
  STAGED: 'staged',
};
export const getCartSelections = (values) =>
  compact(
    map(values, (category) => {
      const { quantity, product } = category;
      if (!product) return null;
      const { productId, id } = JSON.parse(product.value);
      return {
        productId,
        variantId: id,
        quantity,
        custom: {
          type: {
            key: BUNDLE_CART_CUSTOM_TYPE,
          },
        },
      };
    })
  );

const getInitialValues = (categories) =>
  categories.reduce((values, category, index) => {
    const { additionalCharge, minQuantity, maxQuantity } =
      getCategoryAttributes(category);
    return {
      ...values,
      [`category${index}`]: {
        additionalCharge,
        minQuantity,
        maxQuantity,
        product: null,
        quantity: '',
        price: null,
      },
    };
  }, {});

const getValidationSchema = (categories, intl) =>
  yup.object(
    categories.reduce((schema, category, index) => {
      const { minQuantity, maxQuantity } = getCategoryAttributes(category);
      return {
        ...schema,
        [`category${index}`]: yup.object({
          additionalCharge: yup.bool().nullable(),
          minQuantity: yup.number().nullable(),
          maxQuantity: yup.number().nullable(),
          product: yup
            .object({
              value: yup.string(),
              label: yup.string(),
            })
            .nullable()
            .when('minQuantity', {
              is: (val) => !!val,
              then: yup
                .object()
                .required(intl.formatMessage(messages.productRequiredError)),
            }),
          quantity: yup
            .number()
            .integer(intl.formatMessage(messages.integerError))
            .typeError(intl.formatMessage(messages.integerError))
            .when('minQuantity', {
              is: (val) => !!val,
              then: yup
                .number()
                .min(
                  minQuantity,
                  intl.formatMessage(messages.minQuantityError, {
                    min: minQuantity,
                  })
                )
                .required(intl.formatMessage(messages.quantityRequiredError)),
              otherwise: yup.number().min(
                0,
                intl.formatMessage(messages.minQuantityError, {
                  min: 0,
                })
              ),
            })
            .when('maxQuantity', {
              is: (val) => !!val,
              then: yup.number().max(
                maxQuantity,
                intl.formatMessage(messages.maxQuantityError, {
                  max: maxQuantity,
                })
              ),
            })
            .nullable()
            .transform((value, originalValue) =>
              originalValue.toString().trim() === '' ? null : value
            ),
          price: yup.object().nullable(),
        }),
      };
    }, {})
  );

const BundlePreview = ({ bundle, refetch }) => {
  const intl = useIntl();
  const showErrorNotification = useShowNotification({
    kind: 'error',
    domain: DOMAINS.SIDE,
  });
  const { dataLocale, project } = useApplicationContext();
  const cartPreview = React.useRef(null);
  const [projection, setProjection] = useState(PROJECTION.CURRENT);

  const { currencies, languages } = project;

  const display = bundle[projection];
  const [main, ...side] = display.images;
  const initialValues = getInitialValues(display.categories);
  const validationSchema = getValidationSchema(display.categories, intl);

  const [details, setDetails] = useState(display);
  const [mainImage, setMainImage] = useState(main);
  const [sideImages, setSideImages] = useState(side);
  const [lineItemPrices, setLineItemPrices] = useState(null);
  const [currency, setCurrency] = useState(currencies[0]);
  const [country, setCountry] = useState(null);
  const [customerGroup, setCustomerGroup] = useState(null);
  const [channel, setChannel] = useState(null);
  const [date, setDate] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [formValues, setFormValues] = useState(initialValues);
  const [cartDraft, setCartDraft] = useState({});

  const { description, dynamicPrice, categories, images, price } = details;

  const { refetch: getPriceRange } = useQuery(GetPriceRange, {
    fetchPolicy: 'no-cache',
    skip: true,
  });
  const [addBundleToCart, { data: cart }] = useMutation(CreateCartWithBundle, {
    variables: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    onCompleted() {
      cartPreview.current.scrollIntoView({ behavior: 'smooth' });
    },
    onError(error) {
      showErrorNotification({
        text: intl.formatMessage(messages.addToCartError, {
          error: error.message,
        }),
      });
    },
  });

  React.useEffect(() => {
    const displayBundle = bundle[projection];
    const [first, ...rest] = displayBundle.images;
    setDetails(displayBundle);
    setMainImage(first);
    setSideImages(rest);
    setFormValues(getInitialValues(displayBundle.categories));
  }, [bundle, projection]);

  React.useEffect(() => {
    refetch(getPriceFilters(currency, country, date, channel, customerGroup));
  }, [currency, country, customerGroup, channel, date]);

  React.useEffect(() => {
    const updatedPrices = reduce(
      formValues,
      (result, value) => {
        return value.price ? result + value.price.centAmount : result;
      },
      0
    );
    setLineItemPrices(updatedPrices);
  }, [formValues]);

  React.useEffect(() => {
    const getPriceRangePromises = () =>
      reduce(
        categories,
        (result, category) => {
          const { id } = getCategoryAttributes(category);
          const scopedPrice = getScopedPriceParameters(
            getPriceFilters(currency, country, date, channel, customerGroup)
          );
          return [...result, getPriceRange({ category: id, scopedPrice })];
        },
        []
      );
    const getTotalRange = (results) =>
      reduce(
        results,
        (range, result, index) => {
          const { data } = result;
          if (data) {
            const { min, max } =
              data.products.facets[
                'variants.scopedPrice.currentValue.centAmount'
              ].ranges[0];
            const category = categories[index];
            const { minQuantity, maxQuantity } =
              getCategoryAttributes(category);
            return {
              min: range.min + min * minQuantity,
              max: range.max + max * maxQuantity,
            };
          }

          return range;
        },
        { min: 0, max: 0 }
      );

    if (dynamicPrice) {
      const getRanges = async () => {
        const promises = getPriceRangePromises();
        const results = await Promise.all(promises);
        const { min, max } = getTotalRange(results);

        const minComponent = (
          <FormattedNumber
            data-testid="price-range-min"
            value={min / 100}
            style="currency"
            currency={currency}
          />
        );

        const maxComponent = (
          <FormattedNumber
            data-testid="price-range-max"
            value={max / 100}
            style="currency"
            currency={currency}
          />
        );

        if (min && max) {
          setPriceRange(
            <>
              {minComponent} - {maxComponent}
            </>
          );
        } else if (min && !max) {
          setPriceRange(
            <>
              <FormattedMessage {...messages.startingAt} /> {minComponent}
            </>
          );
        } else if (!min && max) {
          setPriceRange(
            <>
              <FormattedMessage {...messages.upTo} /> {maxComponent}
            </>
          );
        }
      };
      getRanges();
    }
  }, [dynamicPrice, currency, country, customerGroup, channel, date]);

  function selectImage(image) {
    setMainImage(image);
    setSideImages(without(images, image));
  }

  function onFormChange(event, handleChange) {
    const { name, value } = event.target;
    const [key, field] = name.split('.');
    const form = { ...formValues };
    form[key][field] = value;
    setFormValues(form);
    return handleChange(event);
  }

  function previewAddToCart(values) {
    const draft = {
      currency,
      lineItems: [
        {
          productId: bundle.id,
          quantity: 1,
        },
        ...getCartSelections(values),
      ],
    };

    return addBundleToCart({ variables: { cartDraft: draft } }).then(() =>
      setCartDraft(draft)
    );
  }

  return (
    <Spacings.Stack scale="m">
      <CollapsiblePanel
        header={
          <Text.Subheadline
            as="h4"
            isBold
            intlMessage={messages.configureCustomerTitle}
          />
        }
        isSticky
        isDefaultClosed
      >
        <PriceFilters
          currency={currency}
          country={country}
          customerGroup={customerGroup}
          channel={channel}
          date={date}
          setCurrency={setCurrency}
          setCountry={setCountry}
          setCustomerGroup={setCustomerGroup}
          setChannel={setChannel}
          setDate={setDate}
        />
      </CollapsiblePanel>
      <Spacings.Inline scale="m">
        {images && images.length > 0 ? (
          <Spacings.Inline scale="m">
            {sideImages && sideImages.length > 0 && (
              <Spacings.Stack scale="m" data-testid="side-images-container">
                {sideImages.map((image) => (
                  <div
                    key={image.url}
                    data-testid="side-image"
                    className={styles['side-image']}
                    onClick={() => selectImage(image)}
                  >
                    <img src={image.url} />
                  </div>
                ))}
              </Spacings.Stack>
            )}
            <div className={styles['main-image']}>
              <img data-testid="main-image" src={mainImage.url} />
            </div>
          </Spacings.Inline>
        ) : (
          <div
            data-testid="no-image-placeholder"
            className={styles['no-image']}
          ></div>
        )}
        <div className={styles.details}>
          <Spacings.Stack scale="m">
            <Spacings.Inline justifyContent="space-between">
              <Spacings.Inline alignItems="baseline">
                <Text.Headline as="h2" data-testid="bundle-name">
                  {localize({
                    obj: details,
                    key: 'name',
                    language: dataLocale,
                    fallbackOrder: languages,
                  })}
                </Text.Headline>
                {priceRange && (
                  <Text.Subheadline
                    as="h4"
                    tone="secondary"
                    data-testid="price-range"
                  >
                    {priceRange}
                  </Text.Subheadline>
                )}
              </Spacings.Inline>
              <Spacings.Inline alignItems="center">
                <Text.Body intlMessage={messages.projection} />
                <div className={styles['projection-select']}>
                  <SelectInput
                    data-testid="projection-select"
                    horizontalConstraint="auto"
                    options={[
                      {
                        value: PROJECTION.CURRENT,
                        label: intl.formatMessage(messages.current),
                      },
                      {
                        value: PROJECTION.STAGED,
                        label: intl.formatMessage(messages.staged),
                      },
                    ]}
                    value={projection}
                    onChange={(event) => setProjection(event.target.value)}
                  />
                </div>
              </Spacings.Inline>
            </Spacings.Inline>
            {description ? (
              <Text.Body data-testid="bundle-description">
                {localize({
                  obj: details,
                  key: 'description',
                  language: dataLocale,
                  fallbackOrder: languages,
                })}
              </Text.Body>
            ) : (
              <Text.Body
                data-testid="no-description-message"
                isItalic
                intlMessage={messages.noDescription}
              />
            )}
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={previewAddToCart}
            >
              {({
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                dirty,
                isValid,
                isSubmitting,
              }) => (
                <Spacings.Stack scale="m">
                  {categories.map((category, index) => {
                    const key = `category${index}`;
                    return (
                      <CategoryProductField
                        key={key}
                        name={key}
                        category={category}
                        priceFilters={getPriceFilters(
                          currency,
                          country,
                          date,
                          channel,
                          customerGroup
                        )}
                        dynamicPrice={dynamicPrice}
                        value={values[key]}
                        touched={touched[key] || {}}
                        errors={errors[key] || {}}
                        onChange={(event) => onFormChange(event, handleChange)}
                        onBlur={handleBlur}
                      />
                    );
                  })}
                  <div
                    className={classNames({
                      [styles.price]: lineItemPrices,
                      [styles['total-price']]: !lineItemPrices || dynamicPrice,
                    })}
                  >
                    <Spacings.Stack scale="xs">
                      {(!dynamicPrice || (dynamicPrice && !lineItemPrices)) && (
                        <Spacings.Inline
                          alignItems="flex-end"
                          justifyContent="space-between"
                        >
                          <Text.Subheadline
                            data-testid="base-price-label"
                            as={lineItemPrices ? 'h5' : 'h4'}
                            isBold={!lineItemPrices}
                            intlMessage={
                              lineItemPrices
                                ? messages.basePrice
                                : messages.totalPrice
                            }
                          />
                          <Text.Body data-testid="base-price-value-container">
                            {price ? (
                              <FormattedNumber
                                data-testid="base-price-value"
                                value={price.value.centAmount / 100}
                                style="currency"
                                currency={price.value.currencyCode}
                              />
                            ) : (
                              NO_VALUE_FALLBACK
                            )}
                          </Text.Body>
                        </Spacings.Inline>
                      )}
                      {!!lineItemPrices && (
                        <Spacings.Stack scale="xs">
                          {!dynamicPrice && (
                            <Spacings.Inline
                              alignItems="flex-end"
                              justifyContent="space-between"
                            >
                              <Text.Subheadline
                                data-testid="additional-price-label"
                                as="h5"
                                intlMessage={messages.additionalCharge}
                              />
                              <Text.Body>
                                <FormattedNumber
                                  data-testid="additional-price-value"
                                  value={lineItemPrices / 100}
                                  style="currency"
                                  currency={currency}
                                />
                              </Text.Body>
                            </Spacings.Inline>
                          )}
                          <Spacings.Inline
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Text.Subheadline
                              data-testid="total-price-label"
                              as="h4"
                              isBold
                              intlMessage={messages.totalPrice}
                            />
                            <Text.Body>
                              <FormattedNumber
                                data-testid="total-price-value"
                                value={
                                  ((price ? price.value.centAmount : 0) +
                                    lineItemPrices) /
                                  100
                                }
                                style="currency"
                                currency={currency}
                              />
                            </Text.Body>
                          </Spacings.Inline>
                        </Spacings.Stack>
                      )}
                    </Spacings.Stack>
                  </div>
                  <Constraints.Horizontal>
                    <PrimaryButton
                      data-testid="add-to-cart"
                      onClick={handleSubmit}
                      label={intl.formatMessage(messages.addToCart)}
                      isDisabled={!dirty || !isValid || isSubmitting}
                    />
                  </Constraints.Horizontal>
                </Spacings.Stack>
              )}
            </Formik>
            <div ref={cartPreview}>
              {cart && (
                <Spacings.Inline scale="m">
                  <div className={styles['cart-preview']}>
                    <Spacings.Stack>
                      <Text.Subheadline
                        as="h4"
                        intlMessage={messages.cartDraft}
                      />
                      <FormattedJSON
                        data-testid="draft-cart"
                        json={cartDraft}
                      />
                    </Spacings.Stack>
                  </div>
                  <div className={styles['cart-preview']}>
                    <Spacings.Stack>
                      <Text.Subheadline
                        as="h4"
                        intlMessage={messages.cartCreated}
                      />
                      <FormattedJSON
                        data-testid="created-cart"
                        json={omitDeep(cart.createCart, '__typename')}
                      />
                    </Spacings.Stack>
                  </div>
                </Spacings.Inline>
              )}
            </div>
          </Spacings.Stack>
        </div>
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

BundlePreview.displayName = 'BundlePreview';
BundlePreview.propTypes = {
  bundle: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.object,
    description: PropTypes.object,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    categories: PropTypes.array.isRequired,
    dynamicPrice: PropTypes.bool,
    price: PropTypes.shape({
      value: PropTypes.shape({
        centAmount: PropTypes.number,
        currencyCode: PropTypes.string,
      }),
    }),
  }),
  refetch: PropTypes.func.isRequired,
};

export default BundlePreview;
