import React from 'react';
import { shallow } from 'enzyme';
import BundleImages from '@commercetools-us-ps/mc-app-bundles-core/components/bundle-images';
import { generateProduct } from '../../test-util';
import { transformResults } from '../bundle-details/static-bundle-details';
import StaticBundleImages from './static-bundle-images';
import SelectVariantImagesModal from './select-variant-images-modal';

const product = generateProduct();
const bundle = transformResults(product.masterData.current);
const { id, version } = product;
const { images, products } = bundle;
const mocks = {
  match: {
    params: {
      projectKey: 'test-project'
    }
  },
  id,
  version,
  products,
  images,
  onComplete: jest.fn()
};

const loadBundleImages = () => shallow(<StaticBundleImages {...mocks} />);

describe('static bundle images', () => {
  let wrapper;

  beforeEach(() => {
    mocks.onComplete.mockClear();
    wrapper = loadBundleImages();
  });

  it('when select image button clicked, should open select image modal', () => {
    const button = shallow(wrapper.find(BundleImages).prop('actions'));
    button.simulate('click');
    expect(wrapper.find(SelectVariantImagesModal).prop('isOpen')).toEqual(true);
  });

  // Enzyme seems to have issues with rendering fragments/arrays, hence the need to wrap the
  // `noImagesMessage` prop in a `div` for this test (https://github.com/airbnb/enzyme/issues/1149)
  it('when select image link clicked, should open select image modal', () => {
    const message = shallow(
      <div>{wrapper.find(BundleImages).prop('noImagesMessage')}</div>
    );
    message.find('[data-testid="select-image-link"]').simulate('click');
    expect(wrapper.find(SelectVariantImagesModal).prop('isOpen')).toEqual(true);
  });
});
