import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { ErrorMessage } from '@commercetools-frontend/ui-kit';
import { generateCategoryFormValues } from '../../test-util';
import {
  ADDITIONAL_CHARGE,
  CATEGORY,
  CATEGORY_PATH,
  CATEGORY_REF,
  MAX_QUANTITY,
  MIN_QUANTITY,
} from './constants';
import CategoryField, { FIELD_ADDITIONAL_CHARGE } from './category-field';

const mocks = {
  name: 'categories',
  title: faker.random.words(),
  onChange: jest.fn(),
  push: jest.fn(),
  remove: jest.fn(),
};

const ERROR_MESSAGE = 'Required field';
const ADD_BUTTON = `[data-testid="add-category"]`;
const REMOVE_BUTTON = (index) => `[data-testid="remove-category.${index}"]`;
const INPUT = (index, field) => `[name="${mocks.name}.${index}.${field}"]`;

const value = generateCategoryFormValues();
const { category, minQuantity, maxQuantity, additionalCharge } = value;
const emptyValue = {
  category: null,
  minQuantity: '',
  maxQuantity: '',
  additionalCharge: false,
};

function loadCategoryField(
  values,
  touched,
  errors,
  showAdditionalCharge = true
) {
  return shallow(
    <CategoryField
      {...mocks}
      value={values}
      touched={touched}
      errors={errors}
      showAdditionalCharge={showAdditionalCharge}
    />
  );
}

describe('category field', () => {
  it('when add button clicked, should add empty item to list', () => {
    const wrapper = loadCategoryField([value]);
    wrapper.find(ADD_BUTTON).simulate('click');
    expect(mocks.push).toHaveBeenCalledWith(emptyValue);
  });

  it('when remove button clicked, should remove item from list', () => {
    const index = 0;
    const wrapper = loadCategoryField([value, emptyValue]);
    wrapper.find(REMOVE_BUTTON(index)).simulate('click');
    expect(mocks.remove).toHaveBeenCalledWith(index);
  });

  it('when category input pristine, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadCategoryField([emptyValue], null, [
      { category: ERROR_MESSAGE },
    ]);
    expect(wrapper.find(INPUT(index, CATEGORY)).prop('hasError')).toEqual(
      false
    );
  });

  it('when category input touched with value, the input should not be in an error state', () => {
    const index = 0;
    const wrapper = loadCategoryField([value], [{ category: true }], []);
    expect(wrapper.find(INPUT(index, CATEGORY)).prop('hasError')).toEqual(
      false
    );
  });

  describe('when category input touched without value', () => {
    const index = 0;
    let wrapper;

    beforeEach(() => {
      wrapper = loadCategoryField(
        [emptyValue],
        [{ category: true }],
        [{ category: ERROR_MESSAGE }]
      );
    });

    it('the input should be in an error state', () => {
      expect(wrapper.find(INPUT(index, CATEGORY)).prop('hasError')).toEqual(
        true
      );
    });

    it('should display error message', () => {
      expect(wrapper.find(ErrorMessage)).toHaveLength(1);
    });
  });

  it('when list has one value, should disable remove button', () => {
    const index = 0;
    const wrapper = loadCategoryField([value]);
    expect(wrapper.find(REMOVE_BUTTON(index)).prop('isDisabled')).toEqual(true);
  });

  it('when list has more than one value, should enable remove button', () => {
    const index = 0;
    const wrapper = loadCategoryField([value, emptyValue]);
    expect(wrapper.find(REMOVE_BUTTON(index)).prop('isDisabled')).toEqual(
      false
    );
  });

  it('when additional charge shown, should render additional charge checkbox', () => {
    const index = 0;
    const wrapper = loadCategoryField([emptyValue], [], [], true);
    expect(
      wrapper.find(INPUT(index, FIELD_ADDITIONAL_CHARGE)).exists()
    ).toEqual(true);
  });

  it('when additional charge hidden, should not render additional charge checkbox', () => {
    const index = 0;
    const wrapper = loadCategoryField([emptyValue], [], [], false);
    expect(
      wrapper.find(INPUT(index, FIELD_ADDITIONAL_CHARGE)).exists()
    ).toEqual(false);
  });
});

describe('parse category attributes to form value', () => {
  const id = faker.datatype.uuid();
  const path = faker.commerce.productName();
  const categoryRefAttribute = {
    name: CATEGORY_REF,
    value: {
      typeId: CATEGORY,
      id,
    },
  };
  const categoryPathAttribute = {
    name: CATEGORY_PATH,
    value: path,
  };
  const minQuantityAttribute = {
    name: MIN_QUANTITY,
    value: minQuantity,
  };
  const maxQuantityAttribute = {
    name: MAX_QUANTITY,
    value: maxQuantity,
  };
  const additionalChargeAttribute = {
    name: ADDITIONAL_CHARGE,
    value: additionalCharge,
  };
  const attributes = [
    categoryRefAttribute,
    categoryPathAttribute,
    minQuantityAttribute,
    maxQuantityAttribute,
    additionalChargeAttribute,
  ];

  it('should parse category reference id as category value', () => {
    const actual = CategoryField.parseCategoryValue([attributes])[0];
    expect(actual.category.value).toEqual(id);
  });

  it('should parse category path as category label', () => {
    const actual = CategoryField.parseCategoryValue([attributes])[0];
    expect(actual.category.label).toEqual(path);
  });

  it('when min quantity attribute exists, should parse min quantity', () => {
    const actual = CategoryField.parseCategoryValue([attributes])[0];
    expect(actual.minQuantity).toEqual(minQuantity);
  });

  it('when min quantity attribute missing, should parse min quantity as an empty string', () => {
    const actual = CategoryField.parseCategoryValue([
      {
        categoryRefAttribute,
        categoryPathAttribute,
        maxQuantityAttribute,
        additionalChargeAttribute,
      },
    ])[0];
    expect(actual.minQuantity).toEqual('');
  });

  it('when max quantity attribute exists, should parse max quantity', () => {
    const actual = CategoryField.parseCategoryValue([attributes])[0];
    expect(actual.maxQuantity).toEqual(maxQuantity);
  });

  it('when max quantity attribute missing, should parse max quantity as an empty string', () => {
    const actual = CategoryField.parseCategoryValue([
      {
        categoryRefAttribute,
        categoryPathAttribute,
        minQuantityAttribute,
        additionalChargeAttribute,
      },
    ])[0];
    expect(actual.maxQuantity).toEqual('');
  });

  it('when additional charge attribute exists, should parse additional charge', () => {
    const actual = CategoryField.parseCategoryValue([attributes])[0];
    expect(actual.additionalCharge).toEqual(additionalCharge);
  });

  it('when additional charge attribute missing, should parse additional charge as false', () => {
    const actual = CategoryField.parseCategoryValue([
      {
        categoryRefAttribute,
        categoryPathAttribute,
        minQuantityAttribute,
        maxQuantityAttribute,
      },
    ])[0];
    expect(actual.additionalCharge).toEqual(false);
  });
});

describe('convert form value to category attributes', () => {
  it('should convert category value to category reference id attribute', () => {
    const actual = CategoryField.convertToCategoryValue([value])[0];
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: CATEGORY_REF,
          value: { typeId: CATEGORY, id: category.value },
        }),
      ])
    );
  });

  it('should convert category label to category path attribute', () => {
    const actual = CategoryField.convertToCategoryValue([value])[0];
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: CATEGORY_PATH, value: category.label }),
      ])
    );
  });

  it('when min quantity exists, should convert value to min quantity attribute', () => {
    const actual = CategoryField.convertToCategoryValue([value])[0];
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: MIN_QUANTITY, value: minQuantity }),
      ])
    );
  });

  it('when max quantity exists, should convert value to max quantity attribute', () => {
    const actual = CategoryField.convertToCategoryValue([value])[0];
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: MAX_QUANTITY, value: maxQuantity }),
      ])
    );
  });

  it('when min quantity does not exist, should not convert value to min quantity attribute', () => {
    const actual = CategoryField.convertToCategoryValue([
      { category, minQuantity: '', maxQuantity },
    ])[0];
    expect(actual).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: MIN_QUANTITY, value: minQuantity }),
      ])
    );
  });

  it('when max quantity does not exist, should not convert value to min quantity attribute', () => {
    const actual = CategoryField.convertToCategoryValue([
      { category, minQuantity, maxQuantity: '' },
    ])[0];
    expect(actual).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: MAX_QUANTITY, value: maxQuantity }),
      ])
    );
  });

  it('when additional charge allowed, should convert value to additional charge attribute', () => {
    const actual = CategoryField.convertToCategoryValue(
      [{ category, minQuantity, maxQuantity, additionalCharge }],
      true
    )[0];
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: ADDITIONAL_CHARGE,
          value: additionalCharge,
        }),
      ])
    );
  });

  it('when additional charge disallowed, should not convert value to additional charge attribute', () => {
    const actual = CategoryField.convertToCategoryValue(
      [{ category, minQuantity, maxQuantity, additionalCharge }],
      false
    )[0];
    expect(actual).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: ADDITIONAL_CHARGE,
          value: additionalCharge,
        }),
      ])
    );
  });
});

describe('category field is empty', () => {
  it('when form value defined, should be false', () => {
    expect(CategoryField.isEmpty([value])).toEqual(false);
  });

  it('when form value undefined, should be true', () => {
    expect(CategoryField.isEmpty(undefined)).toEqual(true);
  });

  it('when form value null, should be true', () => {
    expect(CategoryField.isEmpty(null)).toEqual(true);
  });

  it('when category value missing, should be true', () => {
    expect(CategoryField.isEmpty([{}])).toEqual(true);
  });

  it('when category value null, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category: null, minQuantity, maxQuantity }])
    ).toEqual(true);
  });

  it('when category value undefined, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category: undefined, minQuantity, maxQuantity }])
    ).toEqual(true);
  });

  it('when category value empty string, should be true', () => {
    expect(
      CategoryField.isEmpty([
        { category: { value: '' }, minQuantity, maxQuantity },
      ])
    ).toEqual(true);
  });

  it('when category value whitespace, should be true', () => {
    expect(
      CategoryField.isEmpty([
        { category: { value: ' ' }, minQuantity, maxQuantity },
      ])
    ).toEqual(true);
  });

  it('when min quantity value null, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category, minQuantity: null, maxQuantity }])
    ).toEqual(true);
  });

  it('when min quantity value undefined, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category, minQuantity: undefined, maxQuantity }])
    ).toEqual(true);
  });

  it('when min quantity value empty string, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category, minQuantity: '', maxQuantity }])
    ).toEqual(true);
  });

  it('when min quantity value whitespace, should be true', () => {
    expect(
      CategoryField.isEmpty([{ category, minQuantity: ' ', maxQuantity }])
    ).toEqual(true);
  });
});
