import { su } from "../shipping-zones/index.mjs";
import { standard as tax } from "../tax-categories/index.mjs";

export const standard = {
  key: "integration-standard",
  name: "(integration test) Standard",
  taxCategory: { typeId: "tax-category", key: tax.key },
  isDefault: false,
  zoneRates: [
    {
      zone: { typeId: "zone", key: su.key },
      shippingRates: [
        {
          price: {
            centAmount: 800,
            currencyCode: "USD",
          },
        },
      ],
    },
  ],
};
export default standard;
