import React from 'react';
import { shallow } from 'enzyme';
import EntryPoint from './entry-point';

jest.unmock('@apollo/client');

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EntryPoint />);
  });

  it('should render without breaking', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
