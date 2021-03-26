import { defineMessages } from 'react-intl';

export default defineMessages({
  status: {
    id: 'BundleDetails.status.label',
    description: 'Label for status select',
    defaultMessage: 'Status:',
  },
  deleteBundle: {
    id: 'BundleDetails.button.deleteBundle',
    description: 'Label for delete bundle button',
    defaultMessage: 'Delete Bundle',
  },
  deleteBundleConfirmation: {
    id: 'BundleDetails.message.deleteBundleConfirm',
    description: 'Delete bundle confirmation message',
    defaultMessage: 'Are you sure you want to delete this bundle?',
  },
  deleteSuccess: {
    id: 'BundleDetails.message.delete.success',
    description: 'Success message for deleting bundle',
    defaultMessage: 'Your bundle has been deleted.',
  },
  deleteError: {
    id: 'BundleDetails.message.delete.error',
    description: 'Error message for deleting bundle',
    defaultMessage: 'Something went wrong. Your bundle was not deleted.',
  },
  editSuccess: {
    id: 'BundleDetails.message.edit.success',
    description: 'Success message for editing bundle status',
    defaultMessage: 'Your bundle status has been saved.',
  },
  editError: {
    id: 'BundleDetails.message.edit.error',
    description: 'Error message for editing bundle status',
    defaultMessage: 'Something went wrong. Your bundle status was not saved.',
  },
});
