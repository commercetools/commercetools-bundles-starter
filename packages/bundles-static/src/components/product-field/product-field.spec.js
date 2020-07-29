import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { ErrorMessage } from '@commercetools-frontend/ui-kit';
import ProductField from './product-field';
import { PRODUCT, QUANTITY } from './constants';

const mocks = {
  name: 'products',
  title: faker.random.words(),
  onChange: jest.fn(),
  push: jest.fn(),
  remove: jest.fn()
};

const ERROR_MESSAGE = 'Required field';
const ADD_PRODUCT_BUTTON = `[data-testid="add-product"]`;
const REMOVE_PRODUCT_BUTTON = index =>
  `[data-testid="remove-product.${index}"]`;
const INPUT = (index, field) => `[name="${mocks.name}.${index}.${field}"]`;

const product = {
  label: faker.random.word(),
  value: JSON.stringify({
    productId: faker.random.uuid(),
    name: faker.random.words(),
    id: faker.random.number(5),
    sku: faker.lorem.slug()
  })
};
const quantity = faker.random.number();
const value = {
  product,
  quantity
};
const emptyValue = { product: null, quantity: '' };

const valueNoSku = {
  product: {
    label: faker.random.word(),
    value: JSON.stringify({
      productId: faker.random.uuid(),
      name: faker.random.words(),
      id: faker.random.number(5)
    })
  },
  quantity: faker.random.number()
};

function loadProductField(values, touched, errors) {
  return shallow(
    <ProductField {...mocks} value={values} touched={touched} errors={errors} />
  );
}

describe('product field', () => {
  it('when add button clicked, should add empty item to list', () => {
    const wrapper = loadProductField([value]);
    wrapper.find(ADD_PRODUCT_BUTTON).simulate('click');
    expect(mocks.push).toHaveBeenCalledWith(emptyValue);
  });

  it('when remove button clicked, should remove item from list', () => {
    const index = 0;
    const wrapper = loadProductField([value, emptyValue]);
    wrapper.find(REMOVE_PRODUCT_BUTTON(index)).simulate('click');
    expect(mocks.remove).toHaveBeenCalledWith(index);
  });

  it('when product input pristine, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadProductField([emptyValue], null, [
      { product: ERROR_MESSAGE }
    ]);
    expect(wrapper.find(INPUT(index, PRODUCT)).prop('hasError')).toEqual(false);
  });

  it('when product input touched with value, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadProductField([value], [{ product: true }], []);
    expect(wrapper.find(INPUT(index, PRODUCT)).prop('hasError')).toEqual(false);
  });

  describe('when product input touched without value', () => {
    const index = 0;
    let wrapper;

    beforeEach(() => {
      wrapper = loadProductField(
        [emptyValue],
        [{ product: true }],
        [{ product: ERROR_MESSAGE }]
      );
    });

    it('the input should be in an error state', () => {
      expect(wrapper.find(INPUT(index, PRODUCT)).prop('hasError')).toEqual(
        true
      );
    });

    it('should display error message', () => {
      expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    });
  });

  it('when quantity input pristine, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadProductField([emptyValue], null, [
      { quantity: ERROR_MESSAGE }
    ]);
    expect(wrapper.find(INPUT(index, QUANTITY)).prop('hasError')).toEqual(
      false
    );
  });

  it('when quantity input touched with value, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadProductField([value], [{ quantity: true }], []);
    expect(wrapper.find(INPUT(index, QUANTITY)).prop('hasError')).toEqual(
      false
    );
  });

  describe('when quantity input touched without value', () => {
    const index = 0;
    let wrapper;

    beforeEach(() => {
      wrapper = loadProductField(
        [emptyValue],
        [{ quantity: true }],
        [{ quantity: ERROR_MESSAGE }]
      );
    });

    it('the input should be in an error state', () => {
      expect(wrapper.find(INPUT(index, QUANTITY)).prop('hasError')).toEqual(
        true
      );
    });

    it('should display error message', () => {
      expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    });
  });

  describe('when second quantity input touched without value', () => {
    const index = 1;
    let wrapper;

    beforeEach(() => {
      wrapper = loadProductField(
        [emptyValue, emptyValue],
        [undefined, { quantity: true }],
        [undefined, { quantity: ERROR_MESSAGE }]
      );
    });

    it('the input should be in an error state', () => {
      expect(wrapper.find(INPUT(index, QUANTITY)).prop('hasError')).toEqual(
        true
      );
    });

    it('should display error message', () => {
      expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    });
  });

  it('when product and quantity inputs touched without value, should display one error message', () => {
    const wrapper = loadProductField(
      [emptyValue],
      [{ product: true, quantity: true }],
      [{ product: ERROR_MESSAGE, quantity: ERROR_MESSAGE }]
    );
    expect(wrapper.find(ErrorMessage)).toHaveLength(1);
  });

  it('when product lacks a SKU, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadProductField([valueNoSku], [{ product: true }], []);
    expect(wrapper.find(INPUT(index, PRODUCT)).prop('hasError')).toEqual(false);
  });

  it('when list has one value, should disable remove button', () => {
    const index = 0;
    const wrapper = loadProductField([value]);
    expect(
      wrapper.find(REMOVE_PRODUCT_BUTTON(index)).prop('isDisabled')
    ).toEqual(true);
  });

  it('when list has more than one value, should enable remove button', () => {
    const index = 0;
    const wrapper = loadProductField([value, emptyValue]);
    expect(
      wrapper.find(REMOVE_PRODUCT_BUTTON(index)).prop('isDisabled')
    ).toEqual(false);
  });
});

describe('product field is empty', () => {
  it('when form value defined, should be false', () => {
    expect(ProductField.isEmpty([{ product, quantity }])).toEqual(false);
  });

  it('when form value undefined, should be true', () => {
    expect(ProductField.isEmpty(undefined)).toEqual(true);
  });

  it('when form value null, should be true', () => {
    expect(ProductField.isEmpty(null)).toEqual(true);
  });

  it('when product value missing, should be true', () => {
    expect(ProductField.isEmpty([{}])).toEqual(true);
  });

  it('when product value null, should be true', () => {
    expect(ProductField.isEmpty([{ product: null, quantity }])).toEqual(true);
  });

  it('when product value undefined, should be true', () => {
    expect(ProductField.isEmpty([{ product: undefined, quantity }])).toEqual(
      true
    );
  });

  it('when product value empty string, should be true', () => {
    expect(
      ProductField.isEmpty([{ product: { value: '' }, quantity }])
    ).toEqual(true);
  });

  it('when product value whitespace, should be true', () => {
    expect(
      ProductField.isEmpty([{ product: { value: ' ' }, quantity }])
    ).toEqual(true);
  });

  it('when quantity value null, should be true', () => {
    expect(ProductField.isEmpty([{ product, quantity: null }])).toEqual(true);
  });

  it('when quantity value undefined, should be true', () => {
    expect(ProductField.isEmpty([{ product, quantity: undefined }])).toEqual(
      true
    );
  });

  it('when quantity value empty string, should be true', () => {
    expect(ProductField.isEmpty([{ product, quantity: '' }])).toEqual(true);
  });

  it('when quantity value whitespace, should be true', () => {
    expect(ProductField.isEmpty([{ product, quantity: ' ' }])).toEqual(true);
  });
});
