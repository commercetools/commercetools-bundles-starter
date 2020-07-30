import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import upperFirst from 'lodash/upperFirst';

export const getPriceFilters = (
  currency,
  country,
  date,
  channel,
  customerGroup
) => ({
  currency,
  country,
  date: date !== '' ? date : null,
  channel: channel ? JSON.parse(channel).id : null,
  customerGroup: customerGroup ? JSON.parse(customerGroup).id : null,
});

export const getScopedPriceParameters = (filters) =>
  reduce(
    filters,
    (result, value, key) => {
      return value ? `${result}&price${upperFirst(key)}=${value}` : result;
    },
    ''
  );

/**
 * Recursively remove keys from an object
 * https://github.com/lodash/lodash/issues/723#issuecomment-443403094
 * @usage
 *
 * const input = {
 *   id: 1,
 *   __typename: '123',
 *   createdAt: '1020209',
 *   address: {
 *     id: 1,
 *     __typename: '123',
 *   },
 *   variants: [
 *     20,
 *     {
 *       id: 22,
 *       title: 'hello world',
 *       __typename: '123',
 *       createdAt: '1020209',
 *       variantOption: {
 *         id: 1,
 *         __typename: '123',
 *       },
 *     },
 *     {
 *       id: 32,
 *       __typename: '123',
 *       createdAt: '1020209',
 *     },
 *   ],
 * }
 *
 * const output = {
 *   id: 1,
 *   address: {
 *     id: 1,
 *   },
 *   variants: [
 *     20,
 *     {
 *       id: 22,
 *       title: 'hello world',
 *       variantOption: {
 *         id: 1,
 *       },
 *     },
 *     {
 *       id: 32,
 *     },
 *   ],
 * }
 *
 * expect(omitDeep(input, ['createdAt, 'updatedAt', __typename']).to.deep.equal(output) // true
 *
 * @param {object} input
 * @param {Array<number | string>>} excludes
 * @return {object}
 */
export const omitDeep = (input, excludes) => {
  return Object.entries(input).reduce((output, [key, value]) => {
    const shouldExclude = Array.isArray(excludes)
      ? excludes.includes(key)
      : excludes === key;
    if (shouldExclude) return output;
    let omitted = value;

    if (Array.isArray(value)) {
      const arrValue = value;
      const nextValue = arrValue.map((arrItem) => {
        if (typeof arrItem === 'object') {
          return omitDeep(arrItem, excludes);
        }
        return arrItem;
      });
      omitted = nextValue;
    } else if (typeof value === 'object' && !isNil(value)) {
      omitted = omitDeep(value, excludes);
    }

    return { ...output, [key]: omitted };
  }, {});
};
