/* eslint-disable import/prefer-default-export */
import localize from './localize';

function convertToPathName(categoriesInPath, language, languages) {
  return categoriesInPath
    .map((categoryInPath) =>
      localize({
        obj: normalizeCategory(categoryInPath),
        key: 'name',
        language,
        fallbackOrder: languages,
      })
    )
    .join(' > ');
}

function normalizeCategory(category) {
  return category.obj
    ? // we assume that this is expanded reference or mapped from graphql
      category.obj
    : // we assume that this is a direct fetch of the object
      category;
}

/**
 * Get the ancestors of the category,
 * Apply an `limit` if you need to limit how far up the ancestors' tree
 * of the category you need to go. ATM we do this when we get the parent.
 *
 * @param {Object} category
 * @param {Number} limit
 * @return {Array}
 */
export function getAncestors(cat, limit = 0) {
  const category = normalizeCategory(cat);
  const ancestors = category.ancestors || [];
  const maxLimit = limit > ancestors.length ? ancestors.length : limit;
  if (!limit) return ancestors;
  return ancestors.slice(ancestors.length - maxLimit);
}

export function getCategoryLevel(cat) {
  return getAncestors(cat).length + 1;
}

/**
 * @param {Object} category
 * @param {String} lang
 * @param {Array} languages
 * @param {Number} limit
 *
 * @return {String} - A string representation of the path
 */
export function getPathName(cat, lang, languages, limit = 0) {
  const ancestors = getAncestors(cat, limit);
  return convertToPathName([...ancestors, cat], lang, languages);
}
