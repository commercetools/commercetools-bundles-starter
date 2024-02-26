import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { getLazyQuery, setLazyQuery } from '@apollo/client';
import { FieldLabel } from '@commercetools-frontend/ui-kit';
import { useEffectMock } from '@commercetools-us-ps/bundles-core/components/test-util';
import { generateCategoryAttributes } from '../../test-util';
import CategoryProductField, { PRICE } from './category-product-field';
import messages from './messages';

const productId = faker.datatype.uuid();
const sku = faker.lorem.slug();
const centAmount = faker.finance.amount() * 100;
const currencyCode = faker.finance.currencyCode();
const product = {
  label: faker.commerce.product(),
  value: JSON.stringify({
    productId,
    sku,
    price: { value: { centAmount, currencyCode } },
  }),
};
const quantity = faker.datatype.number({ min: 1, max: 3 });
const emptyValue = {
  product: null,
  quantity: '',
  price: null,
};
const newPriceFilters = {
  currency: faker.finance.currencyCode(),
};

const mocks = {
  name: 'category0',
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

const loadCategoryProductField = (
  category,
  value = emptyValue,
  errors = {},
  touched = {},
  priceFilters = {}
) =>
  shallow(
    <CategoryProductField
      {...mocks}
      category={category}
      value={value}
      errors={errors}
      touched={touched}
      priceFilters={priceFilters}
    />
  );

describe('category product field', () => {
  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
  });

  describe('when category has an additional charge', () => {
    const category = generateCategoryAttributes(true);

    it('should display field hint', () => {
      const wrapper = loadCategoryProductField(category);
      expect(wrapper.find(FieldLabel).prop('hint')).toEqual(
        messages.additionalCharge.id
      );
    });

    it('when product and quantity provided, should update price value', () => {
      const value = {
        product,
        quantity,
      };
      loadCategoryProductField(category, value);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: {
            centAmount: centAmount * quantity,
            currencyCode,
          },
        },
      });
    });

    it('when product provided and quantity field not provided, should update price value', () => {
      const value = {
        product,
        quantity: '',
      };
      loadCategoryProductField(category, value);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: {
            centAmount: 0,
            currencyCode,
          },
        },
      });
    });

    it('when product provided and quantity field has error, should reset price value', () => {
      const value = {
        product,
        quantity,
      };
      const errors = {
        quantity: 'Quantity required',
      };
      loadCategoryProductField(category, value, errors);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: null,
        },
      });
    });

    it('when product not provided and quantity provided, should reset price value', () => {
      const value = {
        product: null,
        quantity,
      };
      loadCategoryProductField(category, value);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: null,
        },
      });
    });

    it('when price filters change and product provided, should retrieve updated variant price', () => {
      setLazyQuery({ loading: true });
      const value = {
        product,
        quantity,
      };
      loadCategoryProductField(category, value, {}, {}, newPriceFilters);
      const lazyQuery = getLazyQuery();
      expect(lazyQuery).toHaveBeenCalledWith({
        variables: { id: productId, skus: [sku], ...newPriceFilters },
      });
    });

    it('when price filters change and product not provided, should not retrieve updated variant price', () => {
      setLazyQuery({ loading: true });
      const value = {
        product: null,
        quantity,
      };
      loadCategoryProductField(category, value, {}, {}, newPriceFilters);
      const lazyQuery = getLazyQuery();
      expect(lazyQuery).not.toHaveBeenCalled();
    });

    it('when updated price variant retrieved, should update price value', () => {
      const newPrice = {
        centAmount: faker.finance.amount() * 100,
        currencyCode: faker.finance.currencyCode(),
      };
      const value = {
        product,
        quantity,
      };
      setLazyQuery({
        data: {
          product: {
            masterData: {
              current: {
                allVariants: [
                  {
                    price: {
                      value: newPrice,
                    },
                  },
                ],
              },
            },
          },
        },
      });
      loadCategoryProductField(category, value, {}, {}, newPriceFilters);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: {
            centAmount: newPrice.centAmount * quantity,
            currencyCode: newPrice.currencyCode,
          },
        },
      });
    });
  });

  describe('when category does not have an additional charge', () => {
    const category = generateCategoryAttributes(false);

    it('should not display hint', () => {
      const wrapper = loadCategoryProductField(category);
      expect(wrapper.find(FieldLabel).prop('hint')).toEqual('');
    });

    it('when field values provided, should reset price value', () => {
      const value = {
        product,
        quantity,
      };
      loadCategoryProductField(category, value);
      expect(mocks.onChange).toHaveBeenCalledWith({
        target: {
          name: `${mocks.name}.${PRICE}`,
          value: null,
        },
      });
    });

    it('when price filters change, should not retrieve updated variant price', () => {
      setLazyQuery({ loading: true });
      const value = {
        product,
        quantity,
      };
      loadCategoryProductField(category, value, {}, {}, newPriceFilters);
      const lazyQuery = getLazyQuery();
      expect(lazyQuery).not.toHaveBeenCalled();
    });
  });
});
