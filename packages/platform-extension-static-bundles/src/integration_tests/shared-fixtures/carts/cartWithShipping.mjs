
import { defaultCart } from "./defaultCart.mjs";
import { standard } from "../shipping-methods/index.mjs";

export const cartWithShipping = {
  ...defaultCart,
  shippingAddress: { country: "SU" },
  shippingMethod: { key: standard.key, typeId: "shipping-method" },
  taxMode: "ExternalAmount",
}
export default cartWithShipping
