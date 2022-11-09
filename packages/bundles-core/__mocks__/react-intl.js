/* eslint-disable import/export */
import { intlMock } from '../components/test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
