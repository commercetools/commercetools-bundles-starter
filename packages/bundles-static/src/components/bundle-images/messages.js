import { defineMessages } from 'react-intl';

export default defineMessages({
  selectImagesButton: {
    id: 'StaticBundleImages.buttons.selectImages',
    description: 'Label for select images button',
    defaultMessage: 'Select Images from Variants'
  },
  orLabel: {
    id: 'StaticBundleImages.label.or',
    description: 'Label for or text',
    defaultMessage: 'or'
  },
  selectImagesLink: {
    id: 'StaticBundleImages.link.selectImages',
    description: 'Label for select images link',
    defaultMessage: 'select images from bundle variants.'
  },
  selectImagesTitle: {
    id: 'StaticBundleImages.title.selectImages',
    description: 'Title for select images modal',
    defaultMessage: 'Select and Add Images from Variants'
  },
  noVariantImagesMessage: {
    id: 'StaticBundleImages.message.noVariantImages',
    description: 'No variant images error message',
    defaultMessage: 'No variant images available for selection.'
  },
  variantImagesError: {
    id: 'StaticBundleImages.message.variants.error',
    description: 'Error message for retrieving variant images',
    defaultMessage: 'Something went wrong. Unable to retrieve variant images.'
  },
  variantImagesSaveError: {
    id: 'StaticBundleImages.message.variants.save.error',
    description: 'Error message for saving variant images to bundle',
    defaultMessage:
      'Something went wrong. Selected images were not added to bundle.'
  }
});
