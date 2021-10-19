import {
  pantspennyrounding,
  shortspennyrounding,
  shorts2pennyrounding,
} from "../products";
import { defaultCart } from "./defaultCart";

export const cart2pants1jackets11pantspennyrounding = {
  ...defaultCart,
  // key: "1pant1jacket1pantpennyrounding",
  lineItems: [
    {
      sku: pantspennyrounding.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: shortspennyrounding.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: shorts2pennyrounding.masterVariant.sku,
      quantity: 1,
    },
  ],
};
export default cart2pants1jackets11pantspennyrounding;
