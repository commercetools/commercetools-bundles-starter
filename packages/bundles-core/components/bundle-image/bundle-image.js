import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  BinLinearIcon,
  Card,
  EditIcon,
  ExpandIcon,
  IconButton,
  Spacings,
  Text,
  TextField,
} from '@commercetools-frontend/ui-kit';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import messages from './messages';
import styles from './bundle-image.mod.css';

const BundleImage = ({ image, editImage, removeImage }) => {
  const intl = useIntl();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { url, label } = image;

  function expandImage() {
    window.open(url, '_blank');
  }

  function handleRemoveImage() {
    removeImage(url);
    setIsConfirmingDelete(false);
  }

  return (
    <>
      <Card theme="light" type="raised" className={styles.image}>
        <Spacings.Inline scale="m" alignItems="center">
          <div className={styles['bundle-image']}>
            <img src={image.url} />
          </div>
          <div className={styles.details}>
            <TextField
              value={label || ''}
              title={intl.formatMessage(messages.imageLabel)}
              isReadOnly={true}
            />
            <div className={styles.actions}>
              <div className={styles['actions-left']}>
                <IconButton
                  data-testid="expand-image-btn"
                  label={intl.formatMessage(messages.expandButton)}
                  icon={<ExpandIcon />}
                  onClick={expandImage}
                  data-track-component="expandImage"
                  size="medium"
                  data-track-event="click"
                />
              </div>
              <div className={styles['actions-right']}>
                <IconButton
                  data-testid="edit-image-btn"
                  label={intl.formatMessage(messages.editButton)}
                  icon={<EditIcon />}
                  onClick={editImage}
                  data-track-component="editImage"
                  size="medium"
                  data-track-event="click"
                />
                <span className={styles['delete-image-icon']}>
                  <IconButton
                    data-testid="remove-image-btn"
                    label={intl.formatMessage(messages.removeButton)}
                    icon={<BinLinearIcon />}
                    onClick={() => {
                      setIsConfirmingDelete(true);
                    }}
                    data-track-component="deleteImage"
                    size="medium"
                    data-track-event="click"
                  />
                </span>
              </div>
            </div>
          </div>
        </Spacings.Inline>
      </Card>
      <ConfirmationDialog
        key={url}
        title={intl.formatMessage(messages.removeButton)}
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onCancel={() => setIsConfirmingDelete(false)}
        onConfirm={handleRemoveImage}
      >
        <Text.Body intlMessage={messages.removeImageConfirmation} />
      </ConfirmationDialog>
    </>
  );
};

BundleImage.displayName = 'BundleImage';
BundleImage.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    label: PropTypes.string,
  }).isRequired,
  editImage: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
};

export default BundleImage;
