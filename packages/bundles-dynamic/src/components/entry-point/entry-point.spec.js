import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { ApplicationDynamicBundleManager } from './entry-point';
import { ROOT_PATH } from '../../constants';

jest.unmock('@apollo/client')

const environment = {
  mcApiUrl: 'https://mc-api.commercetools.co',
};

const project = {
  key: 'test-project',
};

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ environment, project }));
    wrapper = shallow(<ApplicationDynamicBundleManager />);
  });

  it('should render root route', () => {
    expect(wrapper.find(Route).prop('path')).toEqual(
      `/:projectKey/${ROOT_PATH}`
    );
  });
});
