import NodeCache from 'node-cache';
import Utils from '../utils';

const cache = new NodeCache();
const utils = Utils({ cache });

describe('utils.asyncMemoize', () => {
  let cacheGetSpy;
  let cacheSetSpy;

  beforeEach(async () => {
    cache.flushAll();
    cacheGetSpy = jest.spyOn(cache, 'get');
    cacheSetSpy = jest.spyOn(cache, 'set');
  });

  it('should always call cache.get', async () => {
    expect.assertions(1);
    const key = 'cache_key1';
    await utils.asyncMemoize(key, () => {});
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
  });

  it('should set and return a value if there is a cache miss', async () => {
    expect.assertions(2);
    const key = 'cache_key1';
    const value = 'value1';
    const res = await utils.asyncMemoize(key, param => param, value);
    expect(cacheSetSpy).toHaveBeenCalledWith(key, value);
    expect(res).toEqual(value);
  });

  it('should return (but not set) a cached value if there is a cache hit', async () => {
    expect.assertions(2);
    const key = 'cache_key1';
    const value = 'value1';
    await utils.asyncMemoize(key, () => value);
    cacheSetSpy.mockClear();
    await utils.asyncMemoize(key);
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
    expect(cacheSetSpy).not.toHaveBeenCalled();
  });

  it('should throw if async fn rejects', async () => {
    expect.assertions(3);
    const key = 'cache_key1';
    expect(utils.asyncMemoize(key, async () => Promise.reject(new Error()))).rejects.toThrow();
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
    expect(cacheSetSpy).not.toHaveBeenCalled();
  });
});

describe('utils.memoize', () => {
  let cacheGetSpy;
  let cacheSetSpy;

  beforeEach(async () => {
    cache.flushAll();
    cacheGetSpy = jest.spyOn(cache, 'get');
    cacheSetSpy = jest.spyOn(cache, 'set');
  });

  it('should always call cache.get', () => {
    expect.assertions(1);
    const key = 'cache_key1';
    utils.memoize(key, () => ({}));
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
  });

  it('should set and return a value if there is a cache miss', () => {
    expect.assertions(2);
    const key = 'cache_key1';
    const value = 'value1';
    const res = utils.memoize(key, param => param, value);
    expect(cacheSetSpy).toHaveBeenCalledWith(key, value);
    expect(res).toEqual(value);
  });

  it('should return (but not set) a cached value if there is a cache hit', () => {
    expect.assertions(2);
    const key = 'cache_key1';
    const value = 'value1';
    utils.memoize(key, () => value);
    cacheSetSpy.mockClear();
    utils.memoize(key);
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
    expect(cacheSetSpy).not.toHaveBeenCalled();
  });

  it('should throw if fn returns undefined', () => {
    expect.assertions(3);
    const key = 'cache_key1';
    expect(() => utils.memoize(key, () => undefined)).toThrow();
    expect(cacheGetSpy).toHaveBeenCalledWith(key);
    expect(cacheSetSpy).not.toHaveBeenCalled();
  });
});
