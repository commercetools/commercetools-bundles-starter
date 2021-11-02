import NodeCache from 'node-cache';
import { v4 as uuid } from 'uuid';
import nock from 'nock';
import Commercetools from '../commercetools';
import Helper from '../helper';

const clientId = 'client1';
const clientSecret = 'secret1';
const projectKey = 'projectKey1';
const host = 'https://api.commercetools.co';
const oauthHost = 'https://auth.commercetools.co';
const bundleProductTypeKey = 'key1';
const customTypeKey = 'key2';

const commercetools = Commercetools({
  clientId,
  clientSecret,
  projectKey,
  host,
  oauthHost,
});
const cache = new NodeCache();
const helper = Helper({
  commercetools,
  cache,
  bundleProductTypeKey,
  customTypeKey,
});

beforeEach(() => {
  nock.cleanAll();
  cache.flushAll();
  nock(oauthHost)
    .persist()
    .post('/oauth/token')
    .reply(200, {
      access_token: 'token1',
    });
});

describe('helper.getBundleProductTypeId', () => {
  const id = uuid();
  let cacheSetSpy;

  beforeEach(async () => {
    cache.flushAll();
    cacheSetSpy = jest.spyOn(cache, 'set');
  });

  it('should fetch a product type ID from the CT API if there is a cache miss', async () => {
    nock(host)
      .get(helper.uri.bundleProductTypeByKey)
      .reply(200, { id });
    expect.assertions(2);
    const res = await helper.getBundleProductTypeId();
    expect(cacheSetSpy).toHaveBeenCalledWith('bundle_product_type_id', id);
    expect(res).toEqual(id);
  });

  it('should throw an error if there is no valid ID returend', async () => {
    nock(host)
      .get(helper.uri.bundleProductTypeByKey)
      .reply(200, {});
    expect.assertions(1);
    await expect(helper.getBundleProductTypeId()).rejects.toThrow();
  });
});

describe('helper.getParentChildAssociationTypeId', () => {
  const id = uuid();
  let cacheSetSpy;

  beforeEach(async () => {
    cache.flushAll();
    cacheSetSpy = jest.spyOn(cache, 'set');
  });

  it('should fetch a type ID from the CT API if there is a cache miss', async () => {
    nock(host)
      .get(helper.uri.customTypeByKey)
      .reply(200, { id });
    expect.assertions(2);
    const res = await helper.getParentChildAssociationTypeId();
    expect(cacheSetSpy).toHaveBeenCalledWith(
      'parent_child_association_type_id',
      id
    );
    expect(res).toEqual(id);
  });

  it('should throw an error if there is no valid ID returend', async () => {
    nock(host)
      .get(helper.uri.customTypeByKey)
      .reply(200, {});
    expect.assertions(1);
    await expect(helper.getParentChildAssociationTypeId()).rejects.toThrow();
  });
});

describe('cartHandler.buildParentChildAssociationCustomType', () => {
  it('should return a valid parent-child-link object', () => {
    expect.assertions(1);
    const externalId = uuid();
    const parent = uuid();
    const res = helper.buildParentChildAssociationCustomType({
      externalId,
      parent,
    });
    expect(res).toEqual({
      fields: {
        'external-id': externalId,
        parent,
      },
      type: {
        key: customTypeKey,
      },
    });
  });
});
