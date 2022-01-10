import { pants, belt, shirt } from "../products/index.mjs";
import { defaultCart } from "./defaultCart.mjs";

export const cart1pants1shirt1belt = {
  ...defaultCart,
  // key: "cart1pants1shirt1belt",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: shirt.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: belt.masterVariant.sku,
      quantity: 1,
    },
  ],
};

export default cart1pants1shirt1belt;
