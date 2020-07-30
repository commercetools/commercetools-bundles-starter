const notification = {
  dismiss: jest.fn(),
};
const mockShowNotification = jest.fn(() => notification);
const useShowNotification = jest.fn(() => mockShowNotification);

export * from '@commercetools-frontend/actions-global';
export { useShowNotification, mockShowNotification };
