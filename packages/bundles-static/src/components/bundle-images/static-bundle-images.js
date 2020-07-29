import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  FlatButton,
  PlusBoldIcon,
  SecondaryButton,
  Text
} from '@commercetools-frontend/ui-kit';
import BundleImages from '@commercetools-us-ps/mc-app-bundles-core/components/bundle-images';
import SelectVariantImagesModal from './select-variant-images-modal';
import messages from './messages';

const StaticBundleImages = ({
  match,
  id,
  version,
  images,
  products,
  onComplete
}) => {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <>
      <BundleImages
        match={match}
        id={id}
        version={version}
        images={images}
        onComplete={onComplete}
        actions={
          <SecondaryButton
            data-testid="select-image-btn"
            iconLeft={<PlusBoldIcon />}
            label={intl.formatMessage(messages.selectImagesButton)}
            onClick={openModal}
          />
        }
        noImagesMessage={
          <>
            <Text.Body intlMessage={messages.orLabel} />
            <FlatButton
              data-testid="select-image-link"
              label={intl.formatMessage(messages.selectImagesLink)}
              onClick={openModal}
            />
          </>
        }
      />
      <SelectVariantImagesModal
        id={id}
        version={version}
        images={images}
        variants={products}
        isOpen={modalOpen}
        onClose={closeModal}
        onSecondaryButtonClick={closeModal}
        onPrimaryButtonClick={onComplete}
      />
    </>
  );
};

StaticBundleImages.displayName = 'BundleImages';
StaticBundleImages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  id: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired,
  products: PropTypes.array.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired
    })
  ),
  onComplete: PropTypes.func.isRequired
};

export default StaticBundleImages;
