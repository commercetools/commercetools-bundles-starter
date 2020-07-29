import { intlMock } from '@commercetools-us-ps/mc-app-core/test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
