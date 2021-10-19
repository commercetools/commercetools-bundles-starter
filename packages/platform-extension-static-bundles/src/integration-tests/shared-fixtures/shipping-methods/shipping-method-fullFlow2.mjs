export const shippingMethodFullFlow2 = {
  name: "U.S. Standard 2: integration-STANDARD",
  description: "U.S. Standard2",
  localizedDescription: {
    "en-US": "U.S. Standard",
  },
  taxCategory: {
    typeId: "tax-category",
    key: "integration-no-tax-usa",
  },
  zoneRates: [
    {
      zone: {
        typeId: "zone",
        key: "integration-zone-us",
      },
      shippingRates: [
        {
          price: {
            type: "centPrecision",
            currencyCode: "USD",
            centAmount: 800,
            fractionDigits: 2,
          },
          tiers: [],
        },
      ],
    },
  ],
  isDefault: false,
  key: "integration-STANDARD2",
};
export default shippingMethodFullFlow2;
