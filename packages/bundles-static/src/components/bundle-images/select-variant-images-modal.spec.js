import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { flatten } from 'lodash';
import {
  mockMutation,
  setMutation,
  setQuery,
  useQuery
} from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { FormModalPage } from '@commercetools-frontend/application-components';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import {
  CheckActiveIcon,
  CheckInactiveIcon
} from '@commercetools-frontend/ui-kit';
import { Loading } from '@commercetools-us-ps/mc-app-core/components/states';
import { generateProduct } from '../../test-util';
import { getSkus } from '../../util';
import { transformResults } from '../bundle-details/static-bundle-details';
import SelectVariantImagesModal from './select-variant-images-modal';
import GetProductImages from './get-product-images.graphql';
import DEFAULT_VARIABLES from './constants';
import messages from './messages';
import { MASTER_VARIANT_ID } from '../../constants';

const dataLocale = faker.random.locale();
const product = generateProduct();
const bundle = transformResults(product.masterData.current);
const { id, version } = product;
const { images, products } = bundle;
const skus = getSkus(products);
const mocks = {
  id,
  version,
  variants: products,
  isOpen: true,
  onClose: jest.fn(),
  onSecondaryButtonClick: jest.fn(),
  onPrimaryButtonClick: jest.fn()
};

const variants = Array.from({ length: 3 }, generateProduct);
const variantImages = flatten(
  variants.map(variant => variant.masterData.current.allVariants[0].images)
);

const imageContainer = "[data-testid='image-container']";
const variantImage = "[data-testid='variant-image']";

const loadSelectVariantImagesModal = (mockImages = images) =>
  shallow(<SelectVariantImagesModal {...mocks} images={mockImages} />);

describe('select variant images modal', () => {
  let wrapper;

  const getFirstImage = () => wrapper.find(variantImage).first();
  const saveFirstImageSelection = () => {
    setQuery({ data: { products: { results: variants } } });
    wrapper = loadSelectVariantImagesModal();
    getFirstImage().simulate('click');
    wrapper.update();
    wrapper
      .find(FormModalPage)
      .props()
      .onPrimaryButtonClick();
  };

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ dataLocale }));
    mocks.onClose.mockClear();
    mocks.onPrimaryButtonClick.mockClear();
  });

  it('should retrieve variant images', () => {
    setQuery({ loading: true });
    loadSelectVariantImagesModal();
    expect(useQuery).toHaveBeenCalledWith(GetProductImages, {
      variables: {
        ...DEFAULT_VARIABLES,
        locale: dataLocale,
        skus
      },
      fetchPolicy: 'no-cache'
    });
  });

  it('should initially render loading message', () => {
    setQuery({ loading: true });
    wrapper = loadSelectVariantImagesModal();
    expect(wrapper.find(Loading).exists()).toEqual(true);
  });

  it('should render error when query returns error', () => {
    setQuery({ error: { message: 'error' } });
    wrapper = loadSelectVariantImagesModal();
    const error = wrapper.find("[data-testid='error-message']");
    expect(error.props().intlMessage).toEqual(messages.variantImagesError);
  });

  describe('when query returns data and product has no images', () => {
    beforeEach(() => {
      setQuery({ data: { products: { results: variants } } });
      wrapper = loadSelectVariantImagesModal([]);
    });

    it('should display variant images', () => {
      expect(wrapper.find(variantImage)).toHaveLength(variantImages.length);
    });

    it('primary form button should be disabled', () => {
      expect(
        wrapper.find(FormModalPage).prop('isPrimaryButtonDisabled')
      ).toEqual(true);
    });
  });

  describe('when query returns data and product has variant images added', () => {
    const existingImages = variants.reduce(
      (allImages, variant) => [
        ...allImages,
        variant.masterData.current.allVariants[0].images[0]
      ],
      []
    );

    beforeEach(() => {
      setQuery({ data: { products: { results: variants } } });
      wrapper = loadSelectVariantImagesModal(existingImages);
    });

    it('should display remaining variant images', () => {
      expect(wrapper.find(variantImage)).toHaveLength(
        variantImages.length - existingImages.length
      );
    });

    it('primary form button should be disabled', () => {
      expect(
        wrapper.find(FormModalPage).prop('isPrimaryButtonDisabled')
      ).toEqual(true);
    });
  });

  describe('when query returns empty results', () => {
    beforeEach(() => {
      setQuery({ data: { products: { results: [] } } });
      wrapper = loadSelectVariantImagesModal([]);
    });

    it('should not display images', () => {
      expect(wrapper.find(variantImage)).toHaveLength(0);
    });

    it('should display no result message', () => {
      expect(
        wrapper.find("[data-testid='no-results-message']").exists()
      ).toEqual(true);
    });

    it('primary form button should be disabled', () => {
      expect(
        wrapper.find(FormModalPage).prop('isPrimaryButtonDisabled')
      ).toEqual(true);
    });
  });

  describe('when image selected', () => {
    beforeEach(() => {
      setQuery({ data: { products: { results: variants } } });
      wrapper = loadSelectVariantImagesModal();
      getFirstImage().simulate('click');
      wrapper.update();
    });

    it('should display active checkbox icon', () => {
      expect(
        getFirstImage()
          .shallow()
          .find(CheckActiveIcon)
          .exists()
      ).toEqual(true);
    });

    it('should not display inactive checkbox icon', () => {
      expect(
        getFirstImage()
          .shallow()
          .find(CheckInactiveIcon)
          .exists()
      ).toEqual(false);
    });

    it('should enable primary form button', () => {
      expect(
        wrapper.find(FormModalPage).prop('isPrimaryButtonDisabled')
      ).toEqual(false);
    });

    describe('when image unselected', () => {
      beforeEach(() => {
        getFirstImage().simulate('click');
        wrapper.update();
      });

      it('should not display active checkbox icon', () => {
        expect(
          getFirstImage()
            .shallow()
            .find(CheckActiveIcon)
            .exists()
        ).toEqual(false);
      });

      it('should display inactive checkbox icon', () => {
        expect(
          getFirstImage()
            .shallow()
            .find(CheckInactiveIcon)
            .exists()
        ).toEqual(true);
      });
    });
  });

  it('when image selection saved, should add images to bundle', () => {
    saveFirstImageSelection();
    expect(mockMutation).toHaveBeenCalledWith({
      variables: {
        actions: [
          {
            addExternalImage: {
              variantId: MASTER_VARIANT_ID,
              image: {
                url: variantImages[0].url,
                dimensions: {
                  width: 0,
                  height: 0
                }
              }
            }
          }
        ]
      }
    });
  });

  describe('when image save succeeds', () => {
    beforeEach(() => {
      setMutation({ data: {} });
      saveFirstImageSelection();
    });

    it('should invoke primary button click', () => {
      expect(mocks.onPrimaryButtonClick).toHaveBeenCalled();
    });

    it('should close modal', () => {
      expect(mocks.onClose).toHaveBeenCalled();
    });

    it('should reset selected images', () => {
      expect(
        wrapper
          .find(imageContainer)
          .shallow()
          .find(CheckActiveIcon)
      ).toHaveLength(0);
    });
  });

  describe('when image save fails', () => {
    beforeEach(() => {
      setMutation({ error: { message: 'failure' } });
      saveFirstImageSelection();
    });

    it('should not invoke primary button click method', () => {
      expect(mocks.onPrimaryButtonClick).not.toHaveBeenCalled();
    });

    it('should not close modal', () => {
      expect(mocks.onClose).not.toHaveBeenCalled();
    });

    it('should not reset selected images', () => {
      expect(
        wrapper
          .find(imageContainer)
          .shallow()
          .find(CheckActiveIcon)
      ).toHaveLength(1);
    });

    it('should show error notification', () => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: messages.variantImagesSaveError.id
      });
    });
  });
});
