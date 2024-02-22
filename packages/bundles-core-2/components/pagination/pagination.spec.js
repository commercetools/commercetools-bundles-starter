import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../test-util';
import { Pagination } from './pagination';

const mockPrevious = jest.fn();
const mockNext = jest.fn();

describe('pagination', () => {
  const previous = '[data-testid="previous-button"]';
  const next = '[data-testid="next-button"]';

  it('when viewing first page, should disable previous button', () => {
    const wrapper = shallow(
      <Pagination
        intl={intlMock}
        rowCount={30}
        offset={0}
        total={60}
        previous={mockPrevious}
        next={mockNext}
      />
    );

    expect(wrapper.find(previous).props().isDisabled).toEqual(true);
  });

  it('when viewing last page, should disable next button', () => {
    const wrapper = shallow(
      <Pagination
        intl={intlMock}
        rowCount={30}
        offset={30}
        total={60}
        previous={mockPrevious}
        next={mockNext}
      />
    );
    expect(wrapper.find(next).props().isDisabled).toEqual(true);
  });

  it('when next button clicked, should load next page', () => {
    const wrapper = shallow(
      <Pagination
        intl={intlMock}
        rowCount={30}
        offset={0}
        total={60}
        previous={mockPrevious}
        next={mockNext}
      />
    );
    const button = wrapper.find(next);
    button.simulate('click');
    expect(mockNext).toHaveBeenCalled();
  });

  it('when previous button clicked, should load previous page', () => {
    const wrapper = shallow(
      <Pagination
        intl={intlMock}
        rowCount={30}
        offset={30}
        total={60}
        previous={mockPrevious}
        next={mockNext}
      />
    );
    const button = wrapper.find(previous);
    button.simulate('click');
    expect(mockPrevious).toHaveBeenCalled();
  });
});
