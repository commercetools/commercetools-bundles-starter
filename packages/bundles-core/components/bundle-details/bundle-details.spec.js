import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { setQuery, useQuery } from '@apollo/client';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { TabHeader, ViewHeader, Error, Loading } from '../index';
import { localize, transformLocalizedFieldToString } from '../util';
import { generateProduct } from '../../test-util';
import GetBundle from './get-bundle.graphql';
import messages from './messages';
import BundleDetails from './bundle-details';

const project = {
  key: faker.random.word(),
  languages: [faker.random.locale(), faker.random.locale()],
  currencies: [faker.finance.currencyCode(), faker.finance.currencyCode()],
};
const dataLocale = project.languages[0];
const bundle = generateProduct(project.languages);
const mocks = {
  match: {
    params: {
      projectKey: project.key,
      bundleId: faker.datatype.uuid(),
    },
  },
  transformResults: jest.fn((projection) => ({
    name: transformLocalizedFieldToString(projection.nameAllLocales),
  })),
  headers: <TabHeader>General</TabHeader>,
  container: jest.fn(),
};

const loadBundleDetails = () => shallow(<BundleDetails {...mocks} />);

describe('bundle details', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(AppContext, 'useApplicationContext').mockImplementation(() => ({
      dataLocale,
      project,
    }));
  });

  it('should retrieve bundle', () => {
    setQuery({ loading: true });
    loadBundleDetails();
    expect(useQuery).toHaveBeenCalledWith(GetBundle, {
      variables: {
        id: mocks.match.params.bundleId,
        locale: dataLocale,
        currency: project.currencies[0],
      },
      fetchPolicy: 'no-cache',
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });
  });

  it('should initially render loading message', () => {
    setQuery({ loading: true });
    wrapper = loadBundleDetails();
    expect(wrapper.find(Loading).exists()).toEqual(true);
  });

  it('should render error when query returns error', () => {
    setQuery({ error: { message: 'error' } });
    wrapper = loadBundleDetails();
    const error = wrapper.find(Error);
    expect(error.props().title).toEqual(messages.errorLoadingTitle.id);
  });

  describe('when query returns bundle information', () => {
    beforeEach(() => {
      setQuery({ data: { product: bundle } });
      wrapper = loadBundleDetails();
    });

    it('should render back link', () => {
      const backToList = shallow(wrapper.find(ViewHeader).prop('backToList'));
      expect(backToList.prop('label')).toEqual(messages.backButton.id);
    });

    it('should display bundle name', () => {
      expect(wrapper.find(ViewHeader).prop('title')).toContain(
        localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallback: bundle.id,
          fallbackOrder: project.languages,
        })
      );
    });
  });

  it('when bundle does not have staged changes, should display current bundle information', () => {
    const stagedBundle = generateProduct(project.languages, true, false);
    setQuery({ data: { product: stagedBundle } });
    wrapper = loadBundleDetails();
    expect(mocks.transformResults).toHaveBeenCalledWith(
      stagedBundle.masterData.current
    );
  });

  it('when bundle has staged changes, should display staged bundle information', () => {
    const stagedBundle = generateProduct(project.languages, true, true);
    setQuery({ data: { product: stagedBundle } });
    wrapper = loadBundleDetails();
    expect(mocks.transformResults).toHaveBeenCalledWith(
      stagedBundle.masterData.staged
    );
  });
});
