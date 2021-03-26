const AWS = jest.genMockFromModule('aws-sdk');

export const mockS3 = {
  listObjects: jest.fn(),
  putObject: jest.fn(),
  upload: jest.fn(),
};

AWS.CognitoIdentityCredentials = jest.fn(() => ({
  refresh: jest.fn(),
}));
AWS.S3 = jest.fn(() => mockS3);

export default AWS;
