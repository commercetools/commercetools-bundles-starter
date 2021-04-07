/**
 * Translates a localized string on an entity.
 *
 * The `localize` function receives a complete entity that can have several
 * localized fields.
 *
 * Arguments
 *  - `obj`: that entity
 *  - `key`: the field within `obj` that might contain a localized strings
 *  - `language`: the language key that should be the first choice to show
 *  - `fallbackOrder`: an array of language keys which will be tried in the
 *     provided order for any set value
 *  - `fallback`: the final fallback that should be displayed as a last resort.
 *     This fallback will also be shown in case the field does not exist on the
 *     provided object.
 *
 * Before `fallback` kicks in, the following is tried to display a meaningful value:
 *  - if `language` is `<language>-<extlang>`, eg. `de-AT`, try if `de` is set
 *  - if not, iterate through all languages of project-settings
 *    (passed as `fallbackOrder`) and pick the first one with a value
 *  - if nothing is found, go through all the languages in provided localized
 *    string an pick the first with a value
 *  - if still no value is found display `fallback`
 *
 * NOTE: It is known that this might lead to strings displayed in different
 *       languages within the same page. This is an accepted downside.
 *
 * NOTE: A missing field is treated like a localied string with no translations:
 *       let a = localize({ obj: { name: { en: '', de: '' } }, language: 'en' })
 *       let b = localize({ obj: {}, language: 'en' })
 *       let c = localize({ obj: undefined, language: 'en' })
 *       a === b && a === c -> true
 */

const getPrimaryLanguage = (language) => language.split('-')[0];

const addFallbackHint = (value, language) =>
  `${value} (${language.toUpperCase()})`;

const findFallbackLanguage = (localizedString, fallbackOrder) =>
  fallbackOrder
    .concat(Object.keys(localizedString))
    .find((lang) => Boolean(localizedString[lang]));

export default function localize({
  obj: entity,
  key,
  language,
  fallbackOrder = [],
  fallback = '',
}) {
  // if there is no entity to be localized or the field does not exist on the
  // entity, then return the fallback
  if (!entity || !entity[key]) return fallback;

  const localizedString = entity[key];

  if (localizedString[language]) return localizedString[language];

  // see if we can fallback to the primary language, eg. de for de-AT
  const primaryLanguage = language && getPrimaryLanguage(language);
  if (localizedString[primaryLanguage]) return localizedString[primaryLanguage];

  const fallbackLanguage = findFallbackLanguage(localizedString, fallbackOrder);
  return fallbackLanguage
    ? addFallbackHint(localizedString[fallbackLanguage], fallbackLanguage)
    : fallback;
}
