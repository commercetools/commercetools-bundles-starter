export const StaticBundleParentChildLinkType = {
  key: 'static-bundle-parent-child-link',
  name: {
    en: 'StaticBundleParentChildLink',
  },
  description: {
    en: 'Link to a parent static bundle product by custom ID',
  },
  resourceTypeIds: ['line-item', 'custom-line-item'],
  fieldDefinitions: [
    {
      name: 'external-id',
      type: {
        name: 'String',
      },
      label: {
        en: 'External ID',
      },
      required: false,
      inputHint: 'SingleLine',
    },
    {
      name: 'parent',
      label: {
        en: 'Parent External ID',
      },
      required: false,
      type: {
        name: 'String'
      },
      inputHint: 'SingleLine',
    },
  ],
};
export default StaticBundleParentChildLinkType;
