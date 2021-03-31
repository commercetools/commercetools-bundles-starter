import React from 'react';
import { shallow } from 'enzyme';
import { Text } from '@commercetools-frontend/ui-kit';
import Error from './error';

const title = 'Test Title';
const message = 'Test message.';

describe('error state', () => {
  it('should show error title', () => {
    const wrapper = shallow(<Error title={title} message={message} />);
    expect(wrapper.find(Text.Headline).exists()).toEqual(true);
  });

  it('when provided, should render error message', () => {
    const wrapper = shallow(<Error title={title} message={message} />);
    expect(wrapper.find(Text.Body).exists()).toEqual(true);
  });

  it('when not provided, should not render error message', () => {
    const wrapper = shallow(<Error title={title} />);
    expect(wrapper.find(Text.Body).exists()).toEqual(false);
  });
});
