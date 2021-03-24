import { intlMock } from '../test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
