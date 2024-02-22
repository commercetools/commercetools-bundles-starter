import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import StatusSelect, { StatusLabel, StatusOption } from './status-select';
import StatusBadge, { PRODUCT_ACTIONS, PRODUCT_STATUS } from './status-badge';

const VALUES = {
  PUBLISH_UNMODIFIED: JSON.stringify({
    status: PRODUCT_ACTIONS.PUBLISH,
    hasStagedChanges: false,
  }),
  PUBLISH_MODIFIED: JSON.stringify({
    status: PRODUCT_ACTIONS.PUBLISH,
    hasStagedChanges: true,
  }),
  UNPUBLISH_UNMODIFIED: JSON.stringify({
    status: PRODUCT_ACTIONS.UNPUBLISH,
    hasStagedChanges: false,
  }),
  UNPUBLISH_MODIFIED: JSON.stringify({
    status: PRODUCT_ACTIONS.UNPUBLISH,
    hasStagedChanges: true,
  }),
};

const mocks = {
  onChange: jest.fn(),
};

const loadStatusSelect = (published, hasStagedChanges) =>
  shallow(
    <StatusSelect
      published={published}
      hasStagedChanges={hasStagedChanges}
      {...mocks}
    />
  );

const loadStatusLabel = (value) => shallow(<StatusLabel data={{ value }} />);

describe('status select', () => {
  describe('when product published and modified', () => {
    let wrapper;
    let select;

    beforeEach(() => {
      wrapper = loadStatusSelect(true, true);
      select = wrapper.find(SelectInput);
    });

    it('should have published value with modified status', () => {
      expect(select.prop('value')).toEqual(VALUES.PUBLISH_MODIFIED);
    });

    it('should display publish and unpublish options', () => {
      const { options, filterOption } = select.props();
      const actual = options.filter(filterOption);
      expect(actual).toHaveLength(2);
      expect(actual).toEqual([
        { value: VALUES.PUBLISH_MODIFIED },
        { value: VALUES.UNPUBLISH_MODIFIED },
      ]);
    });
  });

  describe('when product published and unmodified', () => {
    let wrapper;
    let select;

    beforeEach(() => {
      wrapper = loadStatusSelect(true, false);
      select = wrapper.find(SelectInput);
    });

    it('should have published value with unmodified status', () => {
      expect(select.prop('value')).toEqual(VALUES.PUBLISH_UNMODIFIED);
    });

    it('should display unpublish option', () => {
      const { options, filterOption } = select.props();
      const actual = options.filter(filterOption);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual({ value: VALUES.UNPUBLISH_UNMODIFIED });
    });
  });

  describe('when product unpublished', () => {
    let wrapper;
    let select;

    beforeEach(() => {
      wrapper = loadStatusSelect(false, false);
      select = wrapper.find(SelectInput);
    });

    it('should have unpublished value', () => {
      expect(select.prop('value')).toEqual(VALUES.UNPUBLISH_UNMODIFIED);
    });

    it('should display publish option', () => {
      const { options, filterOption } = select.props();
      const actual = options.filter(filterOption);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toEqual({ value: VALUES.PUBLISH_UNMODIFIED });
    });
  });

  describe('when publish option selected', () => {
    let wrapper;
    let select;

    beforeEach(() => {
      wrapper = loadStatusSelect(false, false);
      select = wrapper.find(SelectInput);
      const { onChange } = select.props();
      onChange({ target: { value: VALUES.PUBLISH_UNMODIFIED } });
    });

    it('should notify on change with publish action', () => {
      expect(mocks.onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('when unpublish option selected', () => {
    let wrapper;
    let select;

    beforeEach(() => {
      wrapper = loadStatusSelect(true, false);
      select = wrapper.find(SelectInput);
      const { onChange } = select.props();
      onChange({ target: { value: VALUES.UNPUBLISH_UNMODIFIED } });
    });

    it('should notify on change with unpublish action', () => {
      expect(mocks.onChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('status label', () => {
  it('when product published and modified, should display modified status', () => {
    const wrapper = loadStatusLabel(VALUES.PUBLISH_MODIFIED);
    expect(wrapper.find(StatusBadge).prop('code')).toEqual(
      PRODUCT_STATUS.MODIFIED
    );
  });

  it('when product published and unmodified, should display published status', () => {
    const wrapper = loadStatusLabel(VALUES.PUBLISH_UNMODIFIED);
    expect(wrapper.find(StatusBadge).prop('code')).toEqual(
      PRODUCT_STATUS.PUBLISHED
    );
  });

  it('when product unpublished, should display unpublished status', () => {
    const wrapper = loadStatusLabel(VALUES.UNPUBLISH_UNMODIFIED);
    expect(wrapper.find(StatusBadge).prop('code')).toEqual(
      PRODUCT_STATUS.UNPUBLISHED
    );
  });
});

describe('status option', () => {
  it('should display status of value', () => {
    const wrapper = shallow(
      <StatusOption data={{ value: VALUES.UNPUBLISH_UNMODIFIED }} />
    );
    expect(wrapper.find(StatusBadge).prop('code')).toEqual(
      PRODUCT_ACTIONS.UNPUBLISH
    );
  });
});
