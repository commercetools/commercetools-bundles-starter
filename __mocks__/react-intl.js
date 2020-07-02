import { intlMock } from '@custom-applications-local/core/test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
