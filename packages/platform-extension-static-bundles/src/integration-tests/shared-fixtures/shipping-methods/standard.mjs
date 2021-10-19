import { su } from "../shipping-zones";
import { standard as tax } from "../tax-categories";

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
