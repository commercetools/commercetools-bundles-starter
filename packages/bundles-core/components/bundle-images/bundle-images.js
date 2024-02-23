import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import FlatButton from '@commercetools-uikit/flat-button';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { useShowSideNotification } from '../hooks';
import MASTER_VARIANT_ID from './constants';
import { BundleImage } from '../bundle-image';
import RemoveImage from './remove-image.graphql';
import messages from './messages';
import styles from './bundle-images.mod.css';

const BundleImages = ({
  match,
  id,
  version,
  images,
  onComplete,
  actions,
  noImagesMessage,
}) => {
  const { environment } = useApplicationContext();
  const { frontendHost } = environment;
  const intl = useIntl();
  const showErrorNotification = useShowSideNotification(
    'error',
    messages.removeError
  );
  const [removeImage] = useMutation(RemoveImage, {
    onCompleted: onComplete,
    onError: showErrorNotification,
  });

  const mcImageUrl = `https://${frontendHost}/${match.params.projectKey}/products/${id}/variants/${MASTER_VARIANT_ID}/images`;

  function addImage() {
    window.open(`${mcImageUrl}/new`, '_blank');
  }

  function editImage() {
    window.open(mcImageUrl, '_blank');
  }

  async function handleRemoveImage(url) {
    const removeVariables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      version,
      productId: id,
      variantId: MASTER_VARIANT_ID,
      imageUrl: url,
    };

    await removeImage({ variables: removeVariables });
  }

  return (
    <Spacings.Stack scale="m">
      <Spacings.Inline
        scale="s"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text.Body intlMessage={messages.title} />
        <Spacings.Inline scale="m">
          {actions}
          <SecondaryButton
            data-testid="add-image-btn"
            iconLeft={<ExternalLinkIcon />}
            label={intl.formatMessage(messages.addImageButton)}
            onClick={addImage}
          />
        </Spacings.Inline>
      </Spacings.Inline>
      <div>
        {images.length === 0 ? (
          <div data-testid="no-images-message" className={styles['no-images']}>
            <Spacings.Inline scale="xs">
              <Text.Body intlMessage={messages.noImagesMessage} />
              <FlatButton
                data-testid="add-image-link"
                label={`${intl.formatMessage(messages.addImageLink)}${
                  !noImagesMessage ? '.' : ''
                }`}
                onClick={addImage}
              />
              {noImagesMessage}
            </Spacings.Inline>
          </div>
        ) : (
          <div className={styles.images}>
            {images.map((image) => (
              <BundleImage
                key={image.url}
                image={image}
                editImage={editImage}
                removeImage={handleRemoveImage}
              />
            ))}
          </div>
        )}
      </div>
    </Spacings.Stack>
  );
};

BundleImages.displayName = 'BundleImages';
BundleImages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ),
  onComplete: PropTypes.func.isRequired,
  actions: PropTypes.node,
  noImagesMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default BundleImages;
