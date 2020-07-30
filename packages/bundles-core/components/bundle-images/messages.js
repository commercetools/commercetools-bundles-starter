import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'BundleImages.title',
    description: 'Bundle images title',
    defaultMessage: 'Manage or add images for this bundle.',
  },
  addImageButton: {
    id: 'BundleImages.buttons.addImages',
    description: 'Label for add images button',
    defaultMessage: 'Add Image',
  },
  addImageLink: {
    id: 'BundleImages.link.addImages',
    description: 'Label for add images link',
    defaultMessage: 'Add an image',
  },
  noImagesMessage: {
    id: 'BundleImages.message.noImages',
    description: 'No images error message',
    defaultMessage: 'No images found for this bundle.',
  },
  removeError: {
    id: 'BundleImages.message.delete.error',
    description: 'Error message for editing bundle',
    defaultMessage: 'Something went wrong. The image was not removed.',
  },
});
