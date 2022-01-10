import { pants, jacket } from "../products/index.mjs";
import { defaultCart } from "./defaultCart.mjs";

export const cart2pants1jacket = {
  ...defaultCart,
  // key: "cart2pants1jacket",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 2,
    },
    {
      sku: jacket.masterVariant.sku,
      quantity: 1,
    },
  ],
};
export default cart2pants1jacket;
