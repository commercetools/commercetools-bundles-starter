import React from 'react';
import { shallow } from 'enzyme';
import AWS, { mockS3 } from 'aws-sdk';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { intlMock } from '../test-util';
import FileUploadInput, { uploadElementId } from './file-upload-input';
import messages from './messages';

const mockFile = {
  name: 'The best file',
};
const mockFolder = 'AmazingFolder';
const mockEnvironment = {
  aws: {
    bucketName: 'mock-bucket',
    bucketRegion: 'mock-region',
    identityPoolId: 'mock-id',
  },
};
const mockOnChange = jest.fn();

function shouldShowError(message) {
  expect(mockShowNotification).toHaveBeenCalledWith({
    text: `${messages.uploadError.id} ${message}`,
  });
}

// TODO: the test does not have a mocks3 functionality yet, so it's need to be implemented.
describe.skip('file upload input', () => {
  let wrapper;

  beforeEach(() => {
    jest.mock('aws-sdk');
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ environment: mockEnvironment }));

    wrapper = shallow(
      <FileUploadInput
        intl={intlMock}
        showNotification={mockShowNotification}
        folder={mockFolder}
        onChange={mockOnChange}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.unmock('aws-sdk');
  });

  it('when file not selected, should not render file name', () => {
    expect(wrapper.html()).not.toContain(mockFile.name);
  });

  describe('when file selected', () => {
    const uploadFileButton = '[data-test="upload-file"]';

    beforeEach(() => {
      const upload = wrapper.find(`#${uploadElementId}`);
      upload.simulate('change', { target: { files: [mockFile] } });
    });

    it('should render file name', () => {
      expect(wrapper.html()).toContain(mockFile.name);
    });

    it('should render upload file button', () => {
      expect(wrapper.find(uploadFileButton).exists()).toEqual(true);
    });

    describe('and upload file button clicked', () => {
      beforeEach(() => {
        wrapper.find(uploadFileButton).simulate('click');
      });

      it('should hide upload file button', () => {
        expect(wrapper.find(uploadFileButton).exists()).toEqual(false);
      });

      it('should render loading spinner', () => {
        expect(wrapper.find(LoadingSpinner).exists()).toEqual(true);
      });

      it('should refresh aws credentials', () => {
        expect(AWS.config.credentials.refresh).toHaveBeenCalled();
      });

      describe('and aws credentials succesfully retrieved', () => {
        beforeEach(() => {
          AWS.config.credentials.refresh.mock.calls[0][0]();
        });

        it('should list all folders in bucket', () => {
          expect(mockS3.listObjects).toHaveBeenCalledWith(
            {
              Bucket: mockEnvironment.aws.bucketName,
              Prefix: mockFolder,
            },
            expect.any(Function)
          );
        });

        describe('if listing folders in bucket fails', () => {
          const message = 'Error!';

          beforeEach(() => {
            mockS3.listObjects.mock.calls[0][1]({ message }, null);
          });

          it('should render error notification', () => {
            shouldShowError(message);
          });

          it('should hide loading spinner', () => {
            expect(wrapper.find(LoadingSpinner).exists()).toEqual(false);
          });

          it('it should show upload button', () => {
            expect(wrapper.find(uploadFileButton).exists()).toEqual(true);
          });
        });

        describe('if listing folders succeeds and category folder exists', () => {
          beforeEach(() => {
            mockS3.listObjects.mock.calls[0][1](null, {
              Contents: [{}],
            });
          });

          it('should push file to s3', () => {
            expect(mockS3.upload).toHaveBeenCalled();
          });

          describe('if push to s3 succeeds', () => {
            const location = 'http://www.fakelocation.com';
            beforeEach(() => {
              mockS3.upload.mock.calls[0][1](null, { Location: location });
            });

            it('should fire on change', () => {
              expect(mockOnChange).toHaveBeenCalledWith(location);
            });

            it('should hide loading spinner', () => {
              expect(wrapper.find(LoadingSpinner).exists()).toEqual(false);
            });

            it('it should hide upload button', () => {
              expect(wrapper.find(uploadFileButton).exists()).toEqual(false);
            });
          });

          describe('if push to s3 fails', () => {
            const message = 'Error!';

            beforeEach(() => {
              mockS3.upload.mock.calls[0][1]({ message }, null);
            });

            it('if push to s3 fails, should show error notification', () => {
              shouldShowError(message);
            });

            it('should hide loading spinner', () => {
              expect(wrapper.find(LoadingSpinner).exists()).toEqual(false);
            });

            it('it should show upload button', () => {
              expect(wrapper.find(uploadFileButton).exists()).toEqual(true);
            });
          });
        });

        describe('if listing folders succeeds and category folder is empty', () => {
          beforeEach(() => {
            mockS3.listObjects.mock.calls[0][1](null, {
              Contents: [],
            });
          });

          it('should create folder', () => {
            expect(mockS3.putObject).toHaveBeenCalledWith(
              {
                Key: `${encodeURIComponent(mockFolder)}/`,
              },
              expect.any(Function)
            );
          });

          it('if create folder succeeds, should push file to s3', () => {
            mockS3.putObject.mock.calls[0][1](null, {});
            expect(mockS3.upload).toHaveBeenCalled();
          });

          describe('if create folder fails', () => {
            const message = 'Error!';

            beforeEach(() => {
              mockS3.putObject.mock.calls[0][1]({ message }, null);
            });

            it('should render error notification', () => {
              shouldShowError(message);
            });

            it('should hide loading spinner', () => {
              expect(wrapper.find(LoadingSpinner).exists()).toEqual(false);
            });

            it('it should show upload button', () => {
              expect(wrapper.find(uploadFileButton).exists()).toEqual(true);
            });
          });
        });
      });
    });
  });
});
