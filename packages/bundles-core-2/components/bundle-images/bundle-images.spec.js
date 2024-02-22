import React from 'react';
import { shallow } from 'enzyme';
import { getMutation, setMutation } from '@apollo/client';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { generateProduct, transformResults } from '../../test-util';
import MASTER_VARIANT_ID from './constants';
import { BundleImage } from '../bundle-image';
import BundleImages from './bundle-images';
import RemoveImage from './remove-image.graphql';
import messages from './messages';

const product = generateProduct();
const bundle = transformResults(product.masterData.current);
const { id, version } = product;
const { images } = bundle;
const mocks = {
  match: {
    params: {
      projectKey: 'test-project',
    },
  },
  id,
  version,
  onComplete: jest.fn(),
};

global.open = jest.fn();

const frontendHost = `mc.us-central1.gcp.commercetools.com`;
const mcImageUrl = `https://${frontendHost}/${mocks.match.params.projectKey}/products/${id}/variants/${MASTER_VARIANT_ID}/images`;
const noImagesMessage = '[data-testid="no-images-message"]';

const loadBundleImages = (mockImages = images) =>
  shallow(<BundleImages {...mocks} images={mockImages} />);

describe('bundle images', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      environment: { frontendHost },
    }));
    mocks.onComplete.mockClear();
  });

  it('when add image button clicked, should open MC new product variant image modal', () => {
    wrapper = loadBundleImages();
    wrapper.find('[data-testid="add-image-btn"]').simulate('click');
    expect(global.open).toHaveBeenCalledWith(`${mcImageUrl}/new`, '_blank');
  });

  describe('when bundle has no images', () => {
    beforeEach(() => {
      wrapper = loadBundleImages([]);
    });

    it('should display no images message', () => {
      expect(wrapper.find(noImagesMessage).exists()).toEqual(true);
    });

    it('when add image link clicked, should open MC new product variant image modal', () => {
      wrapper.find('[data-testid="add-image-link"]').simulate('click');
      expect(global.open).toHaveBeenCalledWith(`${mcImageUrl}/new`, '_blank');
    });
  });

  describe('when bundle has images', () => {
    let firstImage;
    let url;

    beforeEach(() => {
      wrapper = loadBundleImages();
      firstImage = wrapper.find(BundleImage).first();
      url = firstImage.prop('image').url;
    });

    it('should not display no images message', () => {
      expect(wrapper.find(noImagesMessage).exists()).toEqual(false);
    });

    it('should display image cards', () => {
      expect(wrapper.find(BundleImage)).toHaveLength(images.length);
    });

    it('when image removed, should remove image from bundle', () => {
      const mockMutation = getMutation(RemoveImage);
      firstImage.props().removeImage(url);
      expect(mockMutation).toHaveBeenCalledWith({
        variables: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          version,
          productId: id,
          variantId: MASTER_VARIANT_ID,
          imageUrl: url,
        },
      });
    });

    describe('when image removal completes successfully', () => {
      beforeEach(async () => {
        await firstImage.props().removeImage(url);
      });

      it('should invoke on complete', () => {
        expect(mocks.onComplete).toHaveBeenCalled();
      });
    });

    describe('when image removal change fails', () => {
      beforeEach(() => {
        setMutation({ error: { message: 'error' } });
      });

      it('should show error notification', async () => {
        try {
          await firstImage.props().removeImage(url);
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockShowNotification).toHaveBeenCalledWith({
            text: messages.removeError.id,
          });
        }
      });

      it('should not invoke on complete', () => {
        expect(mocks.onComplete).not.toHaveBeenCalled();
      });
    });
  });
});
