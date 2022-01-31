export const extensionForCartTriggers = {
  destination: {
    type: 'HTTP',
    url: 'https://ctp-bundles-starter-integration-tests.loca.lt'
  },
  triggers: [{
    resourceTypeId: 'cart',
    actions: ['Create', 'Update']
  }],
  key: 'ctp-bundles-static-extension',
  timeoutInMs: 2000
};

export default extensionForCartTriggers;
