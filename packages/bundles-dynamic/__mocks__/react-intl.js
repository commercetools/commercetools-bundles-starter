/* eslint-disable import/export */
import { intlMock } from '@commercetools-us-ps/bundles-core/components/test-util';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };
