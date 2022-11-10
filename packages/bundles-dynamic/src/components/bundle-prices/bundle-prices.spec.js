import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { MASTER_VARIANT_ID } from '../../constants';
import { generateCategoryAttributes } from '../../test-util';
import PricesTable from './prices-table';
import BundlePrices from './bundle-prices';
import messages from './messages';

const project = {
  currencies: Array.from({ length: 3 }, () => faker.finance.currencyCode()),
};
const mcURL = 'mc.europe-west1.gcp.commercetools.com';
const mocks = {
  match: {
    params: {
      projectKey: 'test-project',
    },
  },
  id: faker.datatype.uuid(),
  categories: Array.from({ length: 3 }).map(generateCategoryAttributes),
};
const mcPriceUrl = `https://${mcURL}/${mocks.match.params.projectKey}/products/${mocks.id}/variants/${MASTER_VARIANT_ID}/prices`;

const TITLE = '[data-testid="price-title"]';
const SUBTITLE = '[data-testid="price-subtitle"]';
const ACTIONS = '[data-testid="price-actions"]';

const loadBundlePrices = (dynamicPrice = faker.datatype.boolean()) =>
  shallow(<BundlePrices {...mocks} dynamicPrice={dynamicPrice} />);

describe('bundle prices', () => {
  beforeEach(() => {
    global.open = jest.fn();
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project }));
  });

  it('should render price table with bundle categories', () => {
    const wrapper = loadBundlePrices();
    expect(wrapper.find(PricesTable).prop('categories')).toEqual(
      mocks.categories
    );
  });

  describe('when bundle is statically priced', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadBundlePrices(false);
    });

    it('should display static bundle title', () => {
      expect(wrapper.find(TITLE).prop('intlMessage')).toEqual(
        messages.staticTitle
      );
    });

    it('should not display dynamic bundle subtitle', () => {
      expect(wrapper.find(SUBTITLE).exists()).toEqual(false);
    });

    it('should display view and add price buttons', () => {
      expect(wrapper.find(ACTIONS).exists()).toEqual(true);
    });

    it('when view prices button clicked, should open MC bundle product price list', () => {
      wrapper.find('[data-testid="view-prices-btn"]').simulate('click');
      expect(global.open).toHaveBeenCalledWith(`${mcPriceUrl}`, '_blank');
    });

    it('when add price button clicked, should open MC new product variant price modal', () => {
      wrapper.find('[data-testid="add-price-btn"]').simulate('click');
      expect(global.open).toHaveBeenCalledWith(`${mcPriceUrl}/new`, '_blank');
    });
  });

  describe('when bundle is dynamically priced', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadBundlePrices(true);
    });

    it('should display dynamic bundle title', () => {
      expect(wrapper.find(TITLE).prop('intlMessage')).toEqual(
        messages.dynamicTitle
      );
    });

    it('should display dynamic bundle subtitle', () => {
      expect(wrapper.find(SUBTITLE).prop('intlMessage')).toEqual(
        messages.dynamicSubtitle
      );
    });
  });
});
