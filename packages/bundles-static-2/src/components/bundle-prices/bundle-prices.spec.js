import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { generateProduct } from '../../test-util';
import PricesTable from './prices-table';
import BundlePrices from './bundle-prices';

const project = {
  currencies: Array.from({ length: 3 }, () => faker.finance.currencyCode()),
};
const mocks = {
  match: {
    params: {
      projectKey: 'test-project',
    },
  },
  bundle: generateProduct(),
};

const loadBundlePrices = () => shallow(<BundlePrices {...mocks} />);

describe('bundle prices', () => {
  let wrapper;

  beforeEach(() => {
    global.open = jest.fn();
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ project }));
    wrapper = loadBundlePrices();
  });

  it('should render price table with bundle variants', () => {
    expect(wrapper.find(PricesTable).prop('variants')).toEqual(
      mocks.bundle.products
    );
  });

  it('when view prices button clicked, should open MC bundle product price list', () => {
    wrapper.find('[data-testid="view-prices-btn"]').simulate('click');
    expect(global.window.location.pathname).toContain('/');
  });

  it('when add price button clicked, should open MC new product variant price modal', () => {
    wrapper.find('[data-testid="add-price-btn"]').simulate('click');
    expect(global.window.location.pathname).toContain('/');
  });
});
