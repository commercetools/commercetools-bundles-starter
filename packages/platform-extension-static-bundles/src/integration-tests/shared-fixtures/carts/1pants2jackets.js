import { pants, jacket } from "../products";
import { defaultCart } from "./defaultCart";

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
