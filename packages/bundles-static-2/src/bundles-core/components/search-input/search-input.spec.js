import React from 'react';
import faker from 'faker';
import { shallow } from 'enzyme';
import { TextInput } from '@commercetools-frontend/ui-kit';
import SearchInput from './search-input';

let wrapper;
const mocks = {
  value: '',
  onChange: jest.fn((value) => {
    wrapper.setProps({ value });
  }),
  onSubmit: jest.fn(),
  placeholder: faker.random.words(),
};

const searchInput = '[data-testid="search-input"]';
const clearButton = '[data-testid="clear-button"]';
const searchButton = '[data-testid="search-button"]';

function loadSearchInput() {
  return shallow(<SearchInput {...mocks} />);
}

describe('search input', () => {
  describe('when no value entered', () => {
    beforeEach(() => {
      wrapper = loadSearchInput();
    });

    it('should not display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });

    it('should not autofocus input', () => {
      expect(wrapper.find(TextInput).props().isAutofocussed).toEqual(false);
    });

    it('should display search button', () => {
      expect(wrapper.find(searchButton).exists()).toEqual(true);
    });

    it('should disable search buton', () => {
      expect(wrapper.find(searchButton).props().isDisabled).toEqual(true);
    });
  });

  describe('when value entered', () => {
    const newQuery = 'new query';

    beforeEach(() => {
      wrapper = loadSearchInput();
      wrapper
        .find(searchInput)
        .simulate('change', { target: { value: newQuery } });
    });

    it('should update query', () => {
      expect(mocks.onChange).toHaveBeenCalledWith(newQuery);
    });

    it('should autofocus input', () => {
      expect(wrapper.find(searchInput).props().isAutofocussed).toEqual(true);
    });

    it('should enable search button', () => {
      expect(wrapper.find(searchButton).props().isDisabled).toEqual(false);
    });

    describe('when search is performed', () => {
      beforeEach(() => {
        wrapper.find(searchButton).simulate('click');
      });

      it('should display clear button', () => {
        expect(wrapper.find(clearButton).exists()).toEqual(true);
      });

      it('when clear button clicked, should clear search input', () => {
        wrapper.find(clearButton).simulate('click');
        expect(wrapper.find(searchInput).props().value).toEqual('');
      });
    });
  });
});
