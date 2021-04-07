import React from 'react';
import { shallow } from 'enzyme';
import TabContainer from './tab-container';

const children = <div>{'Test'}</div>;
describe('render', () => {
  describe('when receiving `surface` color', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = { color: 'surface' };
      wrapper = shallow(<TabContainer {...props}>{children}</TabContainer>);
    });

    it('should render the surface style', () => {
      expect(wrapper).toRender({ className: 'container-color-surface' });
    });
  });
  describe('when receiving `neutral` color', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = { color: 'neutral' };
      wrapper = shallow(<TabContainer {...props}>{children}</TabContainer>);
    });

    it('should render the surface style', () => {
      expect(wrapper).toRender({ className: 'container-color-neutral' });
    });
  });
});
