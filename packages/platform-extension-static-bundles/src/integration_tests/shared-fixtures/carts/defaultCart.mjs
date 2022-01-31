import { customCartType } from '../types/index.mjs';

export const defaultCart = {
  currency: 'USD',
  country: 'US',
  taxMode: 'Disabled',
  deleteDaysAfterLastModification: 1,
  custom: {
    type: { typeId: 'type', key: customCartType.key },
    fields: {
      applyCartDiscount: [],
    },
  },
};
export default defaultCart;
