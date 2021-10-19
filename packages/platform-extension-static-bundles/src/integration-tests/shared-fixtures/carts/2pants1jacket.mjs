import { pants, jacket } from "../products";
import { defaultCart } from "./defaultCart";

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
