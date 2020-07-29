import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CreateBundle.title',
    description: 'The page title of create bundle',
    defaultMessage: 'Create a bundle'
  },
  backButton: {
    id: 'CreateBundle.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Bundles list'
  },
  createSuccess: {
    id: 'CreateBundle.form.message.success',
    description: 'Success message for create bundle',
    defaultMessage: 'Your bundle has been created.'
  },
  createError: {
    id: 'CreateBundle.form.message.error',
    description: 'Error message for create bundle',
    defaultMessage: 'Something went wrong. Your bundle was not created.'
  }
});
