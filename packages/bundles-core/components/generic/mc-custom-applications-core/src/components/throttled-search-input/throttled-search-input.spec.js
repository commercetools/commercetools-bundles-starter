import React from 'react';
import { shallow } from 'enzyme';
import { SearchIcon, TextInput } from '@commercetools-frontend/ui-kit';
import ThrottledSearchInput from './throttled-search-input';

let query = '';
const mockSetQuery = jest.fn((value) => {
  query = value;
});
const mockHandleSearch = jest.fn();
const debounceInterval = 200;

const searchInput = '[data-testid="search-input"]';
const clearButton = '[data-testid="clear-button"]';

function loadSearchInput() {
  return shallow(
    <ThrottledSearchInput
      query={query}
      debounceInterval={debounceInterval}
      setQuery={mockSetQuery}
      handleSearch={mockHandleSearch}
    />
  );
}

describe('throttled search input', () => {
  beforeAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('when no value entered', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = loadSearchInput();
    });

    it('should display search icon', () => {
      expect(wrapper.find(SearchIcon).exists()).toEqual(true);
    });

    it('should not display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });

    it('should not autofocus input', () => {
      expect(wrapper.find(TextInput).props().isAutofocussed).toEqual(false);
    });
  });

  describe('when value entered', () => {
    const newQuery = 'new query';
    let wrapper;
    beforeEach(() => {
      wrapper = loadSearchInput();

      const input = wrapper.find(searchInput);
      input.simulate('change', { target: { value: newQuery } });
      wrapper.update();
    });

    it('should update state', () => {
      expect(mockSetQuery).toHaveBeenCalledWith(newQuery);
    });

    it('should handle search after debounce interval', () => {
      expect(mockHandleSearch).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(mockHandleSearch).toHaveBeenCalledWith(newQuery);
      }, debounceInterval);
    });

    it('should display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(true);
    });

    it('should not display search icon', () => {
      expect(wrapper.find(SearchIcon).exists()).toEqual(false);
    });

    it('should autofocus input', () => {
      expect(wrapper.find(TextInput).props().isAutofocussed).toEqual(true);
    });

    it('when clear button clicked, should clear search input', () => {
      wrapper.find(clearButton).props().onClick();
      wrapper.update();

      setTimeout(() => {
        expect(wrapper.find(TextInput).props().value).toEqual('');
      });
    });
  });
});
