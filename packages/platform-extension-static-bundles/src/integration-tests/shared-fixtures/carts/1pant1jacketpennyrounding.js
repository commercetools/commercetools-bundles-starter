import { pantspennyrounding, shortspennyrounding } from "../products";
import { defaultCart } from "./defaultCart";

export const cart1pants1jacketspennyrounding = {
  ...defaultCart,
  // key: "1pant1jacketpennyrounding",
  lineItems: [
    {
      sku: pantspennyrounding.masterVariant.sku,
      quantity: 1,
    },
    {
      sku: shortspennyrounding.masterVariant.sku,
      quantity: 1,
    },
  ],
};
export default cart1pants1jacketspennyrounding;
