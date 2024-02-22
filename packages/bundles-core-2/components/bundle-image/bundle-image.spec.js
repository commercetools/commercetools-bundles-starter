import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { TextField } from '@commercetools-frontend/ui-kit';
import BundleImage from './bundle-image';

const mocks = {
  bundleId: faker.datatype.uuid(),
  image: {
    url: faker.image.imageUrl(),
    label: faker.random.word(),
  },
  editImage: jest.fn(),
  removeImage: jest.fn(),
};
global.open = jest.fn();

const loadBundleImage = () => shallow(<BundleImage {...mocks} />);

describe('bundle image', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = loadBundleImage();
  });

  it('should display image url', () => {
    expect(wrapper.find('img').prop('src')).toEqual(mocks.image.url);
  });

  it('should display image label', () => {
    expect(wrapper.find(TextField).prop('value')).toEqual(mocks.image.label);
  });

  it('when expand button clicked, should open image url', () => {
    wrapper.find('[data-testid="expand-image-btn"]').simulate('click');
    expect(global.open).toHaveBeenCalledWith(mocks.image.url, '_blank');
  });

  it('when edit button clicked, should edit image', () => {
    wrapper.find('[data-testid="edit-image-btn"]').simulate('click');
    expect(mocks.editImage).toHaveBeenCalled();
  });

  it('when remove confirm button clicked, should remove image', () => {
    wrapper.find('[data-testid="remove-image-btn"]').simulate('click');
    wrapper.find(ConfirmationDialog).props().onConfirm();
    expect(mocks.removeImage).toHaveBeenCalled();
  });
});
