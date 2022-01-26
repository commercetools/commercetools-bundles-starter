export const awsLambdaExtension = {
  destination: {
    type: 'AWSLambda',
    arn: 'arn:aws:lambda:us-west-2:185277772334:function:bundles-static-extension',
    accessKey: 'AKIASWI3KOIXBLPJGKMT',
    accessSecret: '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'
  },
  triggers: [{
    resourceTypeId: 'cart',
    actions: ['Create', 'Update']
  }],
  key: 'ctp-bundles-static-extension',
  timeoutInMs: 2000
};

export default awsLambdaExtension;
