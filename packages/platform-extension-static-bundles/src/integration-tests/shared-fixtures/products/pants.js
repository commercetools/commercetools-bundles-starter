import { integrationTestProduct } from "../product-types";

const name = "pants";

export const pants = {
  key: name,
  name: {
    en: name,
  },
  productType: { typeId: "product-type", key: integrationTestProduct.key },
  slug: {
    en: name,
  },
  masterVariant: {
    sku: name,
    prices: [
      {
        value: {
          centAmount: 5500,
          currencyCode: "USD",
        },
      },
    ],
    attributes: [
      { name: "class", value: "Cotton Blend Pants" },
      { name: "department", value: "mens" },
    ],
  },
  publish: true,
};
export default pants;
