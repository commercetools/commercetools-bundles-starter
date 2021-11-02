import { v4 as uuid } from 'uuid';

/**
 * Utility helper containing common functions for caching/memoization,
 * serverless shims, etc.
 *
 * @typedef {Object} NodeCache node-cache or API-compliant alternative
 * @param {NodeCache} $0.cache an instantiated instance of NodeCache
 */
export default ({ cache }) => {
  const utils = {};

  /**
   * @returns {string} a random UUID
   */
  utils.uuid = () => uuid();

  /**
   * Memoizes an function returning a promise
   *
   * @param {string} key cache key
   * @param {Function} fn async function to memoize
   * @param  {...any} params rest parameters to pass to fn
   */
  utils.asyncMemoize = async (key, fn, ...params) => {
    const cacheHit = cache.get(key);
    if (!cacheHit) {
      // Failing awaits should throw automatically
      const value = await fn(...params);
      cache.set(key, value);
      return value;
    }
    return cacheHit;
  };

  /**
   * Memoizes a synchronous function
   *
   * @param {string} key cache key
   * @param {Function} fn synchronous function to memoize
   * @param  {...any} params rest parameters to pass to fn
   */
  utils.memoize = (key, fn, ...params) => {
    const cacheHit = cache.get(key);
    if (!cacheHit) {
      const value = fn(...params);
      if (value === undefined) {
        throw new Error(`No cachable value returned for key ${key}`);
      }
      cache.set(key, value);
      return value;
    }
    return cacheHit;
  };

  return utils;
};
