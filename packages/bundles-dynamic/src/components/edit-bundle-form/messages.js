import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'EditBundle.title',
    description: 'The page title of create bundle',
    defaultMessage: 'Create a bundle'
  },
  backButton: {
    id: 'EditBundle.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Bundles list'
  },
  editSuccess: {
    id: 'EditBundle.form.message.edit.success',
    description: 'Success message for editing bundle',
    defaultMessage: 'Your bundle has been saved.'
  },
  editError: {
    id: 'EditBundle.form.message.edit.error',
    description: 'Error message for editing bundle',
    defaultMessage: 'Something went wrong. Your bundle was not saved.'
  }
});
