import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { Redirect } from 'react-router';
import { getMutation, setMutation } from '@apollo/client';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { StatusSelect } from '../index';
import * as PathContext from '../../context/path-context';
import DeleteBundle from './delete-bundle.graphql';
import EditBundle from './edit-bundle.graphql';
import BundleCommands from './bundle-commands';
import messages from './messages';

const ROOT_PATH = '/';
const mocks = {
  id: faker.datatype.uuid(),
  version: faker.datatype.number(5),
  match: {
    params: {
      projectKey: 'test-project',
      bundleId: faker.datatype.uuid(),
    },
  },
  onComplete: jest.fn(),
};

const variables = {
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  id: mocks.id,
  version: mocks.version,
};

const loadBundleCommands = (published, hasStagedChanges) =>
  shallow(
    <BundleCommands
      {...mocks}
      published={published}
      hasStagedChanges={hasStagedChanges}
    />
  );

describe('bundle commands', () => {
  let wrapper;

  beforeEach(() => {
    jest
      .spyOn(PathContext, 'usePathContext')
      .mockImplementation(() => ROOT_PATH);

    setMutation({ loading: true });
    mocks.onComplete.mockClear();
    mockShowNotification.mockClear();
  });

  describe('when status changed', () => {
    let mockMutation;

    beforeEach(() => {
      wrapper = loadBundleCommands(true, true);
      mockMutation = getMutation(EditBundle);
    });

    it('to published, should modify bundle status', () => {
      wrapper.find(StatusSelect).props().onChange(true);

      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [{ publish: { scope: 'All' } }],
        },
      });
    });

    it('to unpublished, should modify bundle status', () => {
      wrapper.find(StatusSelect).props().onChange(false);

      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          ...variables,
          actions: [{ unpublish: {} }],
        },
      });
    });

    describe('when status change completes successfully', () => {
      beforeEach(async () => {
        await wrapper.find(StatusSelect).props().onChange(false);
      });

      it('should show success notification', () => {
        expect(mockShowNotification).toHaveBeenCalledWith({
          text: messages.editSuccess.id,
        });
      });

      it('should invoke on complete', () => {
        expect(mocks.onComplete).toHaveBeenCalled();
      });
    });

    describe('when status change fails', () => {
      beforeEach(() => {
        setMutation({ error: { message: 'error' } });
      });

      it('should show error notification', async () => {
        try {
          await wrapper.find(StatusSelect).props().onChange(false);
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockShowNotification).toHaveBeenCalledWith({
            text: messages.editError.id,
          });
        }
      });

      it('should not invoke on complete', async () => {
        try {
          await wrapper.find(StatusSelect).props().onChange(false);
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mocks.onComplete).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('delete button', () => {
    beforeEach(() => {
      setMutation({ loading: true });
    });

    it('when product published, should not be rendered', () => {
      wrapper = loadBundleCommands(true, true);
      expect(wrapper.find(IconButton).exists()).toEqual(false);
    });

    it('when product unpublished, should be rendered', () => {
      wrapper = loadBundleCommands(false, true);
      expect(wrapper.find(IconButton).exists()).toEqual(true);
    });

    describe('when clicked', () => {
      beforeEach(() => {
        wrapper = loadBundleCommands(false, false);
        wrapper.find(IconButton).simulate('click');
      });

      it('should open confirm dialog', () => {
        expect(wrapper.find(ConfirmationDialog).props().isOpen).toEqual(true);
      });

      it('and dialog close button clicked, should close confirm dialog', () => {
        wrapper.find(ConfirmationDialog).props().onClose();
        expect(wrapper.find(ConfirmationDialog).props().isOpen).toEqual(false);
      });

      it('and dialog cancel button clicked, should close confirm dialog', () => {
        wrapper.find(ConfirmationDialog).props().onCancel();
        expect(wrapper.find(ConfirmationDialog).props().isOpen).toEqual(false);
      });

      it('and dialog confirm button clicked, should remove asset', () => {
        const mockMutation = getMutation(DeleteBundle);
        wrapper.find(ConfirmationDialog).props().onConfirm();

        expect(mockMutation).toHaveBeenCalled();
      });
    });

    describe('when bundle delete completes successfully', () => {
      it('should show success notification', async () => {
        wrapper = loadBundleCommands(false, true);
        wrapper.find(IconButton).simulate('click');
        await wrapper.find(ConfirmationDialog).props().onConfirm();
        expect(mockShowNotification).toHaveBeenCalledWith({
          text: messages.deleteSuccess.id,
        });
      });

      it('should redirect to root path', () => {
        setMutation({ data: {} });
        wrapper = loadBundleCommands(false, true);
        expect(wrapper.find(Redirect).prop('to')).toEqual(
          `/${mocks.match.params.projectKey}/${ROOT_PATH}`
        );
      });
    });

    describe('when bundle delete fails', () => {
      beforeEach(() => {
        setMutation({ error: { message: 'error' } });
        wrapper = loadBundleCommands(false, true);
        wrapper.find(IconButton).simulate('click');
        wrapper.update();
      });

      it('should show error notification', async () => {
        try {
          await wrapper.find(ConfirmationDialog).props().onConfirm();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockShowNotification).toHaveBeenCalledWith({
            text: messages.deleteError.id,
          });
        }
      });
    });
  });
});
