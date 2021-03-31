import React from 'react';
import { shallow } from 'enzyme';
import omit from 'lodash.omit';
import { ListIcon, BackIcon } from '@commercetools-frontend/ui-kit';
import BackToList from './back-to-list';

const createTestProps = (props) => ({
  href: '/foo/bar',
  label: 'Foo',
  iconType: 'list',
  ...props,
});

describe('rendering', () => {
  describe('when list iconType', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<BackToList {...props} />);
    });
    it('should render an FlatButton', () => {
      expect(wrapper).toRender('FlatButton');
    });
    it('should propagate all props to the FlatButton', () => {
      expect(wrapper.find('FlatButton').props()).toEqual(
        expect.objectContaining(omit(props, 'iconType'))
      );
    });
    it('should set the list icon if the iconType is list', () => {
      expect(wrapper.find('FlatButton')).toHaveProp(
        'icon',
        <ListIcon size="medium" color="primary" />
      );
    });
  });
  describe('when arrow iconType', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ iconType: 'arrow' });
      wrapper = shallow(<BackToList {...props} />);
    });
    it('should render an FlatButton', () => {
      expect(wrapper).toRender('FlatButton');
    });
    it('should propagate all props to the FlatButton', () => {
      expect(wrapper.find('FlatButton').props()).toEqual(
        expect.objectContaining(omit(props, 'iconType'))
      );
    });
    it('should set the list icon if the iconType is list', () => {
      expect(wrapper.find('FlatButton')).toHaveProp(
        'icon',
        <BackIcon size="medium" color="primary" />
      );
    });
  });
});
