import { pants, belt } from "../products";
import { defaultCart } from "./defaultCart";

export const cart1pants0shirts1belt = {
  ...defaultCart,
  // key: "cart1pants0shirts1belt",
  lineItems: [
    {
      sku: pants.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: belt.masterVariant.sku,
      quantity: 1,
    },
  ],
};
export default cart1pants0shirts1belt;
