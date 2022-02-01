export const customLineItemType = {
  key: 'exclude-promotions-custom-line-item',
  name: {
    en: 'Exclude Promotions customLineItem Type'
  },
  description: {
    en:
      'Custom fields for customLineItesms intended to be used in exclude-promotions integration tests'
  },
  resourceTypeIds: ['custom-line-item'],
  fieldDefinitions: [
    {
      name: 'department',
      type: {
        name: 'String'
      },
      label: {
        en: 'Department'
      },
      required: false,
      inputHint: 'SingleLine'
    },
    {
      name: 'class',
      type: {
        name: 'String'
      },
      label: {
        en: 'Class'
      },
      required: false,
      inputHint: 'SingleLine'
    }
  ]
};
export default customLineItemType;
