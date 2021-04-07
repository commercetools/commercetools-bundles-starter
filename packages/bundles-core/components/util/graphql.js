import omit from 'lodash/omit';

/**
 * Transforms a list of `LocalizedField` into a `LocalizedString` object
 *
 * [{ locale: 'en', value: 'Hello' }] -> { en: 'Hello' }
 */
export const transformLocalizedFieldToString = (localizedFields) => {
  if (!localizedFields || localizedFields.length === 0) return null;
  return localizedFields.reduce(
    (updatedLocalizedString, field) => ({
      ...updatedLocalizedString,
      [field.locale]: field.value,
    }),
    {}
  );
};

/**
 * Transforms a `LocalizedString` object into a list of `LocalizedField`
 *
 * { en: 'Hello' } -> [{ locale: 'en', value: 'Hello' }]
 */
export const transformLocalizedStringToField = (localizedString) => {
  if (!localizedString || Object.keys(localizedString).length === 0) return [];
  return Object.keys(localizedString)
    .sort()
    .reduce(
      (updatedLocalizedField, locale) =>
        updatedLocalizedField.concat({
          locale,
          value: localizedString[locale],
        }),
      []
    );
};

/**
 * Given a list of localized field names to map, replace the fields in the
 * format of `LocalizedField` to a `LocalizedString` object.
 * The existing "localized" fields (the list version) will be removed.
 *
 * Arguments:
 * - `objectWithLocalizedFields`: the object with `LocalizedField` fields
 * that need to be transformed into `LocalizedStrings`
 * - `fieldNames`: is an array of objects with following shape:
 *   * `from`: the field to transform and to remove after
 *   * `to`: the target field to write the transformed shape
 *
 * Returns the transformed object without the fields `LocalizedField`
 */
export const injectTransformedLocalizedFields = (
  objectWithLocalizedFields,
  fieldNames
) => {
  const transformedObject = fieldNames.reduce(
    (updatedObjectWithTransformedLocalizedStrings, field) => ({
      ...updatedObjectWithTransformedLocalizedStrings,
      [field.to]: transformLocalizedFieldToString(
        objectWithLocalizedFields[field.from]
      ),
    }),
    objectWithLocalizedFields
  );
  return omit(
    transformedObject,
    fieldNames.map((field) => field.from)
  );
};

/**
 * Map category GraphQL shape with nameAllLocales to reference shape
 * Includes ancestors and parent
 *
 * @param {Object} category - A category result object from graphql
 * @return {Object} Category (as a REST API representation):
 * `{ id, obj: { id, name } }`
 */
export function transformLocalizedFieldsForCategory(
  category,
  transformationOptions = [{ from: 'nameAllLocales', to: 'name' }]
) {
  const transformedData = injectTransformedLocalizedFields(
    category,
    transformationOptions
  );
  const parent = category.parent
    ? transformLocalizedFieldsForCategory(category.parent)
    : null;
  const ancestors = category.ancestors
    ? category.ancestors.map((ancestor) =>
        transformLocalizedFieldsForCategory(ancestor)
      )
    : null;
  return {
    ...transformedData,
    ...(parent ? { parent } : {}),
    ...(ancestors ? { ancestors } : {}),
  };
}
