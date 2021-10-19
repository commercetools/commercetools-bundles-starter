import { pants, belt, shirt } from "../products";
import { defaultCart } from "./defaultCart";

export const cart2pants2shirts2belts = {
  ...defaultCart,
  // key: "cart2pants2shirts2belts",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 2,
    },
    {
      sku: shirt.masterVariant.sku,
      quantity: 2,
    },
    {
      sku: belt.masterVariant.sku,
      quantity: 2,
    },
  ],
};

export default cart2pants2shirts2belts;
