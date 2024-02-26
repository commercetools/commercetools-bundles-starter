import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useShowSideNotification } from '@commercetools-us-ps/bundles-core/components/hooks';
import { ATTRIBUTES, MASTER_VARIANT_ID } from '../../constants';
import { BundleForm } from '../bundle-form';
import EditBundle from './edit-bundle.graphql';
import messages from './messages';

const EditBundleForm = ({ bundle, onComplete }) => {
  const showSuccessNotification = useShowSideNotification(
    'success',
    messages.editSuccess
  );
  const showErrorNotification = useShowSideNotification(
    'error',
    messages.editError
  );
  const [editBundle, { data, loading }] = useMutation(EditBundle, {
    onCompleted: showSuccessNotification,
    onError: showErrorNotification,
  });

  function onSubmit(values) {
    const {
      id,
      version,
      name,
      description,
      key,
      sku,
      dynamicPrice,
      minQuantity,
      maxQuantity,
      categories,
      categorySearch,
      slug,
    } = values;
    const updateAttribute = (attributeName, value) => ({
      setAttribute: {
        variantId: MASTER_VARIANT_ID,
        name: attributeName,
        ...(value && { value }),
      },
    });

    const actions = [];

    if (name) {
      actions.push({ changeName: { name } });
    }

    if (description) {
      actions.push({
        setDescription: { description },
      });
    }

    if (key) {
      actions.push({ setKey: { key } });
    }

    if (sku) {
      actions.push({
        setSku: { variantId: MASTER_VARIANT_ID, sku },
      });
    }

    if (dynamicPrice) {
      actions.push(updateAttribute(ATTRIBUTES.DYNAMIC_PRICE, dynamicPrice));
    }

    if (minQuantity || minQuantity === '') {
      actions.push(updateAttribute(ATTRIBUTES.MIN_QUANTITY, minQuantity));
    }

    if (maxQuantity || maxQuantity === '') {
      actions.push(updateAttribute(ATTRIBUTES.MAX_QUANTITY, maxQuantity));
    }

    if (categories) {
      actions.push(updateAttribute(ATTRIBUTES.CATEGORIES, categories));
      actions.push(updateAttribute(ATTRIBUTES.CATEGORY_SEARCH, categorySearch));
    }

    if (slug) {
      actions.push({ changeSlug: { slug } });
    }

    const variables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      id,
      version,
      actions,
    };

    return editBundle({ variables }).then(onComplete);
  }

  return (
    <BundleForm
      bundle={bundle}
      onSubmit={onSubmit}
      data={data}
      loading={loading}
    />
  );
};
EditBundleForm.displayName = 'EditBundleForm';
EditBundleForm.propTypes = {
  bundle: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default EditBundleForm;
