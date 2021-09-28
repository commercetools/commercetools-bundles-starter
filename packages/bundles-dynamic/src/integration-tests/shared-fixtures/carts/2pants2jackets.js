import { pants, jacket } from "../products";
import { defaultCart } from "./defaultCart";

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
