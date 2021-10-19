export const shippingMethodFullFlow1 = {
  name: "U.S. Standard 1: integration-STANDARD",
  description: "U.S. Standard 1: integration-STANDARD",
  localizedDescription: {
    "en-US": "U.S. Standard 1: integration-STANDARD",
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
  key: "integration-standardUS",
};
export default shippingMethodFullFlow1;
