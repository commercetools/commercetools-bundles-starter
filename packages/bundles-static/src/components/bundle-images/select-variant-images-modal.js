import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { find, reduce, remove } from 'lodash';
import { useIntl } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FormModalPage } from '@commercetools-frontend/application-components';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  CheckActiveIcon,
  CheckInactiveIcon,
  Text,
  Tooltip
} from '@commercetools-frontend/ui-kit';
import { Loading } from '@commercetools-us-ps/mc-app-core/components/states';
import { getSkus } from '../../util';
import { MASTER_VARIANT_ID } from '../../constants';
import EditBundle from '../edit-bundle-form/edit-bundle.graphql';
import DEFAULT_VARIABLES from './constants';
import GetProductImages from './get-product-images.graphql';
import styles from './select-variant-images-modal.mod.css';
import messages from './messages';

const getImages = (variants, existingImages) =>
  reduce(
    variants,
    (allImages, variant) => {
      const { name, allVariants } = variant.masterData.current;
      const { images } = allVariants[0];

      images.forEach(image => {
        if (!find(existingImages, { url: image.url })) {
          allImages.push({ name, image: image.url });
        }
      });
      return allImages;
    },
    []
  );

const SelectVariantImagesModal = ({
  id,
  version,
  images,
  variants,
  isOpen,
  onClose,
  onSecondaryButtonClick,
  onPrimaryButtonClick
}) => {
  const skus = getSkus(variants);
  const intl = useIntl();
  const { dataLocale } = useApplicationContext();
  const [selected, setSelected] = useState([]);
  const { data, error, loading } = useQuery(GetProductImages, {
    variables: {
      ...DEFAULT_VARIABLES,
      locale: dataLocale,
      skus
    },
    fetchPolicy: 'no-cache'
  });
  const [addImages] = useMutation(EditBundle, {
    variables: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM, id, version }
  });

  const showErrorNotification = useShowNotification({
    kind: 'error',
    domain: DOMAINS.SIDE
  });

  if (loading) return <Loading />;
  if (error) {
    return (
      <Text.Body
        data-testid="error-message"
        intlMessage={messages.variantImagesError}
      />
    );
  }

  const isSelected = image => find(selected, image);

  function selectImage(item) {
    if (isSelected(item)) {
      const updatedSelection = [...selected];
      remove(updatedSelection, { image: item.image });
      setSelected(updatedSelection);
    } else {
      setSelected([...selected, item]);
    }
  }

  async function onSave() {
    const actions = selected.map(item => ({
      addExternalImage: {
        variantId: MASTER_VARIANT_ID,
        image: {
          url: item.image,
          dimensions: {
            width: 0,
            height: 0
          }
        }
      }
    }));

    try {
      await addImages({ variables: { actions } });
      onPrimaryButtonClick();
      onClose();
      setSelected([]);
    } catch (err) {
      showErrorNotification({
        text: intl.formatMessage(messages.variantImagesSaveError)
      });
    }
  }

  const variantImages = getImages(data.products.results, images);

  return (
    <FormModalPage
      title={intl.formatMessage(messages.selectImagesTitle)}
      isOpen={isOpen}
      onClose={onClose}
      isPrimaryButtonDisabled={selected.length === 0}
      onSecondaryButtonClick={onSecondaryButtonClick}
      onPrimaryButtonClick={onSave}
    >
      <div data-testid="image-container" className={styles.images}>
        {variantImages.length > 0 ? (
          variantImages.map(item => (
            <Tooltip key={item.image} title={item.name} placement="bottom">
              <div
                data-testid="variant-image"
                className={styles.image}
                onClick={() => selectImage(item)}
              >
                <div className={styles.select}>
                  {isSelected(item) ? (
                    <CheckActiveIcon size="scale" color="primary" />
                  ) : (
                    <CheckInactiveIcon size="scale" />
                  )}
                </div>
                <img src={item.image} />
              </div>
            </Tooltip>
          ))
        ) : (
          <Text.Body
            data-testid="no-results-message"
            intlMessage={messages.noVariantImagesMessage}
          />
        )}
      </div>
    </FormModalPage>
  );
};
SelectVariantImagesModal.displayName = 'SelectVariantImages';
SelectVariantImagesModal.propTypes = {
  id: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired,
  variants: PropTypes.array.isRequired,
  images: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired
};

export default SelectVariantImagesModal;
