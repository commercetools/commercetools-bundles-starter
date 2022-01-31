import { jacketSale } from "../products/index.mjs";

export const jacketSaleDiscount = {
  name: {
    en: "Integration test jacketSale",
  },
  key: "integration-product-discount-jacket-sale",
  value: {
    type: "absolute",
    money: [
      {
        centAmount: 500,
        currencyCode: "USD",
      },
    ],
  },
  predicate: `sku="${jacketSale.masterVariant.sku}"`,
  sortOrder: "0.99943542001115",
  isActive: true,
};

export default jacketSaleDiscount;
