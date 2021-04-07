import { defineMessages } from 'react-intl';

export default defineMessages({
  chooseButton: {
    id: 'FileUpload.button.chooseFile',
    description: 'Choose file button for file upload field',
    defaultMessage: 'Choose File',
  },
  uploadButton: {
    id: 'FileUpload.button.uploadFile',
    description: 'Upload button for file upload field',
    defaultMessage: 'Upload',
  },
  uploadError: {
    id: 'FileUpload.error',
    description: 'Error message when upload fails',
    defaultMessage: 'Something went wrong uploading the selected file:',
  },
});
