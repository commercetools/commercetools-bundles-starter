import { intlMock } from '../components/generic/mc-custom-applications-core/src/test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
