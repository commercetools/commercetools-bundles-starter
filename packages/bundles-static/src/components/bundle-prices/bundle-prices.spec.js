import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { MASTER_VARIANT_ID } from '../../constants';
import { generateProduct } from '../../test-util';
import PricesTable from './prices-table';
import BundlePrices from './bundle-prices';

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
  bundle: generateProduct()
};
const mcPriceUrl = `https://${environment.frontendHost}/${mocks.match.params.projectKey}/products/${mocks.bundle.id}/variants/${MASTER_VARIANT_ID}/prices`;

global.open = jest.fn();

const loadBundlePrices = () => shallow(<BundlePrices {...mocks} />);

describe('bundle prices', () => {
  let wrapper;

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project, environment }));
    wrapper = loadBundlePrices();
  });

  it('should render price table with bundle variants', () => {
    expect(wrapper.find(PricesTable).prop('variants')).toEqual(
      mocks.bundle.products
    );
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
