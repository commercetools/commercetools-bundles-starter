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
  currencies: Array.from({ length: 3 }, () => faker.finance.currencyCode())
};
const environment = {
  frontendHost: 'mc.commercetools.co'
};
const mocks = {
  match: {
    params: {
      projectKey: 'test-project'
    }
  },
  id: faker.random.uuid(),
  categories: Array.from({ length: 3 }).map(generateCategoryAttributes)
};
const mcPriceUrl = `https://${environment.frontendHost}/${mocks.match.params.projectKey}/products/${mocks.id}/variants/${MASTER_VARIANT_ID}/prices`;

global.open = jest.fn();

const TITLE = '[data-testid="price-title"]';
const SUBTITLE = '[data-testid="price-subtitle"]';
const ACTIONS = '[data-testid="price-actions"]';

const loadBundlePrices = (dynamicPrice = faker.random.boolean()) =>
  shallow(<BundlePrices {...mocks} dynamicPrice={dynamicPrice} />);

describe('bundle prices', () => {
  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, environment }));
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
