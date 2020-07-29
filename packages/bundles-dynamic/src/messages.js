import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  accessDeniedTitle: {
    id: 'Routes.Error.accessDenied.title',
    description: 'Access denied error title',
    defaultMessage: 'Not enough permissions to access this resource'
  },
  accessDeniedMessage: {
    id: 'Routes.Error.accessDenied.message',
    description: 'Access denied error message',
    defaultMessage:
      'We recommend contacting your project administrators for further questions.'
  },
  missingBundleTitle: {
    id: 'Routes.Error.missingBundle.title',
    description: 'Missing bundle error title',
    defaultMessage: 'Unable to locate Bundle Product Type'
  },
  missingBundleMessage: {
    id: 'Routes.Error.missingBundle.message',
    description: 'Missing bundle error message',
    defaultMessage:
      'Create a Bundle Product Type using the provided Terraform configuration or JSON payload.'
  }
});

const loadMessages = lang => {
  let loadAppI18nPromise;
  switch (lang) {
    case 'de':
      loadAppI18nPromise = import(
        './i18n/data/de.json' /* webpackChunkName: "app-i18n-de" */
      );
      break;
    case 'es':
      loadAppI18nPromise = import(
        './i18n/data/es.json' /* webpackChunkName: "app-i18n-es" */
      );
      break;
    default:
      loadAppI18nPromise = import(
        './i18n/data/en.json' /* webpackChunkName: "app-i18n-en" */
      );
  }

  return loadAppI18nPromise.then(
    result => result.default,
    error => {
      // eslint-disable-next-line no-console
      console.warn(
        `Something went wrong while loading the app messages for ${lang}`,
        error
      );

      return {};
    }
  );
};

export default loadMessages;
