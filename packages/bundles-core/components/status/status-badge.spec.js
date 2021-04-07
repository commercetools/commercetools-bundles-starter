import React from 'react';
import { shallow } from 'enzyme';
import StatusBadge, { PRODUCT_ACTIONS, PRODUCT_STATUS } from './status-badge';
import styles from './status-badge.mod.css';
import messages from './messages';

const loadStatusBadge = (code) => shallow(<StatusBadge code={code} />);

const statusIndicator = "[data-testid='status-indicator']";
const statusMessage = "[data-testid='status-message']";

describe('status badge', () => {
  describe('given a code', () => {
    const code = PRODUCT_ACTIONS.PUBLISH;
    let wrapper;
    beforeEach(() => {
      wrapper = loadStatusBadge(code);
    });

    it('should display code indicator ', () => {
      expect(wrapper.find(statusIndicator).prop('className')).toEqual(
        styles[code]
      );
    });

    it('should display code message', () => {
      expect(wrapper.find(statusMessage).prop('id')).toEqual(messages[code].id);
    });
  });

  describe('get code', () => {
    it('when published and unmodified, should return published', () => {
      expect(StatusBadge.getCode(true, false)).toEqual(
        PRODUCT_STATUS.PUBLISHED
      );
    });

    it('when published and modified, should return modified', () => {
      expect(StatusBadge.getCode(true, true)).toEqual(PRODUCT_STATUS.MODIFIED);
    });

    it('when unpublished, should return unpublished', () => {
      expect(StatusBadge.getCode(false, true)).toEqual(
        PRODUCT_STATUS.UNPUBLISHED
      );
    });
  });
});
