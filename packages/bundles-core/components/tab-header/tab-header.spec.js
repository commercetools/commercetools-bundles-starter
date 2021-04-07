import React from 'react';
import { shallow } from 'enzyme';
import { TabHeader } from './tab-header';

const createTestProps = (props) => ({
  name: 'foo',
  to: '/foo',
  children: <div>{'hello'}</div>,
  location: { pathname: '/foo' },
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<TabHeader {...props} />);
  });
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe('when link target matches location', () => {
    beforeEach(() => {
      props = createTestProps({
        to: '/foo',
        location: { pathname: '/foo' },
      });
      wrapper = shallow(<TabHeader {...props} />);
    });
    it('should render "active" class', () => {
      expect(wrapper).toHaveClassName('header-list-item--active');
    });
  });
  describe('when link target does not match location', () => {
    beforeEach(() => {
      props = createTestProps({
        to: '/foo',
        location: { pathname: '/bar' },
      });
      wrapper = shallow(<TabHeader {...props} />);
    });
    it('should not render "active" class', () => {
      expect(wrapper).not.toHaveClassName('header-list-item--active');
    });
  });
  describe('when header should be disabled', () => {
    beforeEach(() => {
      props = createTestProps({
        isDisabled: true,
      });
      wrapper = shallow(<TabHeader {...props} />);
    });
    it('should render "disabled" class', () => {
      expect(wrapper).toHaveClassName('header-list-item--disabled');
    });
    it('should not pass target to LinkWrapper', () => {
      expect(wrapper.find('LinkWrapper')).toHaveProp('to', null);
    });
    it('should render "disabled" class for LinkWrapper', () => {
      expect(wrapper.find('LinkWrapper')).toHaveClassName('tab-text--disabled');
    });
  });
  describe('when header should not be disabled', () => {
    beforeEach(() => {
      props = createTestProps({
        isDisabled: false,
      });
      wrapper = shallow(<TabHeader {...props} />);
    });
    it('should not render "active" class', () => {
      expect(wrapper).not.toHaveClassName('header-list-item--disabled');
    });
    it('should pass target to LinkWrapper', () => {
      expect(wrapper.find('LinkWrapper')).toHaveProp('to', props.to);
    });
    it('should not render "disabled" class for LinkWrapper', () => {
      expect(wrapper.find('LinkWrapper')).not.toHaveClassName(
        'tab-text--disabled'
      );
    });
  });
});
