import { pants, jacket } from "../products/index.mjs";
import { defaultCart } from "./defaultCart.mjs";

export const cart2pants2jackets = {
  ...defaultCart,
  // key: "cart2pants2jackets",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 2,
    },
    {
      sku: jacket.masterVariant.sku,
      quantity: 2,
    },
  ],
};
export default cart2pants2jackets;
