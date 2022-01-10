import { pants, jacket } from "../products/index.mjs";
import { defaultCart } from "./defaultCart.mjs";

export const cart1pants2jackets = {
  ...defaultCart,
  // key: "cart1pants2jackets",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: jacket.masterVariant.sku,
      quantity: 2,
    },
  ],
};
export default cart1pants2jackets;
