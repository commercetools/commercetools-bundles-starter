import React from 'react';
import { shallow } from 'enzyme';
import ViewHeader from './view-header';

const createTestProps = (props) => ({
  title: 'Title',
  subtitle: 'some subtitle',
  commands: <div>{'Commands'}</div>,
  backToList: <div>{'Back to list'}</div>,
  color: 'surface',
  ...props,
});

const children = <div>{'Test'}</div>;
describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
  });
  it('should output the correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe('when receiving `surface` color', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
    });

    it('should have `surface` color', () => {
      expect(wrapper.prop('className')).toEqual(
        expect.stringContaining('header-color-surface')
      );
    });
  });
  describe('when receiving `neutral` color', () => {
    beforeEach(() => {
      props = createTestProps({ color: 'neutral' });
      wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
    });

    it('should have `neutral` color', () => {
      expect(wrapper.prop('className')).toEqual(
        expect.stringContaining('header-color-neutral')
      );
    });
  });
  describe('when receiving `withBottomLine` as true', () => {
    beforeEach(() => {
      props = createTestProps({ withBottomLine: true });
      wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
    });
    it('should have bottom line style', () => {
      expect(wrapper.prop('className')).toEqual(
        expect.stringContaining('header-color-with-bottom-line')
      );
    });
  });
  describe('when receiving `withBottomLine` as false', () => {
    beforeEach(() => {
      props = createTestProps({ withBottomLine: false });
      wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
    });
    it('should not have bottom line style', () => {
      expect(wrapper.prop('className')).toEqual(
        expect.not.stringContaining('header-color-with-bottom-line')
      );
    });
  });
  describe('when not receiving `withBottomLine`', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<ViewHeader {...props}>{children}</ViewHeader>);
    });
    it('should have bottom line style', () => {
      expect(wrapper.prop('className')).toEqual(
        expect.stringContaining('header-color-with-bottom-line')
      );
    });
  });
});
