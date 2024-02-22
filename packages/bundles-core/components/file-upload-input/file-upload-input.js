import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import AWS from 'aws-sdk';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import messages from './messages';
import styles from './file-upload-input.mod.css';

// Exported for testing purposes
export const uploadElementId = 'file-upload';

const FileUploadInput = ({ folder, onChange, isDisabled }) => {
  const intl = useIntl();
  const showErrorNotification = useShowNotification({
    kind: 'error',
    domain: DOMAINS.PAGE,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { environment } = useApplicationContext();

  const aws = environment.aws;
  const bucketName = aws.bucketName;

  AWS.config.region = aws.bucketRegion;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: aws.identityPoolId,
  });

  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
      Bucket: bucketName,
    },
  });

  function chooseFile() {
    document.getElementById(uploadElementId).click();
  }

  function pushFile(item, callback) {
    const extension = item.name.split('.').pop();

    s3.upload(
      {
        Key: `${encodeURIComponent(folder)}/${item.name}`,
        Body: item,
        ContentType: `image/${extension}`,
        ACL: 'public-read',
      },
      callback
    );
  }

  function createFolderAndPushFile(item, callback) {
    s3.putObject(
      {
        Key: `${encodeURIComponent(folder)}/`,
      },
      (error, data) => {
        if (error) {
          callback(error, data);
        } else {
          pushFile(item, callback);
        }
      }
    );
  }

  function uploadFile(item, callback) {
    setUploading(true);
    AWS.config.credentials.refresh(() => {
      s3.listObjects({ Bucket: bucketName, Prefix: folder }, (error, data) => {
        if (error) {
          callback(error, data);
        } else if (data.Contents && data.Contents.length === 0) {
          createFolderAndPushFile(item, callback);
        } else {
          pushFile(item, callback);
        }
      });
    });
  }

  function fileUploaded(error, data) {
    setUploading(false);
    if (data) {
      onChange(data.Location);
      setFile(null);
    } else {
      showErrorNotification({
        text: `${intl.formatMessage(messages.uploadError)} ${error.message}`,
      });
    }
  }

  return (
    <Spacings.Inline scale="s" alignItems="center">
      <SecondaryButton
        data-test="choose-file"
        label={intl.formatMessage(messages.chooseButton)}
        onClick={chooseFile}
        isDisabled={isDisabled}
      />
      {file && (
        <>
          <Text.Body>{file.name}</Text.Body>
          {!uploading ? (
            <PrimaryButton
              data-test="upload-file"
              label={intl.formatMessage(messages.uploadButton)}
              onClick={() => uploadFile(file, fileUploaded)}
              isDisabled={isDisabled}
            />
          ) : (
            <LoadingSpinner />
          )}
        </>
      )}
      <input
        id={uploadElementId}
        type="file"
        accept="image/*"
        className={styles['file-input']}
        onChange={(event) => setFile(event.target.files[0])}
      />
    </Spacings.Inline>
  );
};
FileUploadInput.displayName = 'FileUploadInput';
FileUploadInput.propTypes = {
  folder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default FileUploadInput;
