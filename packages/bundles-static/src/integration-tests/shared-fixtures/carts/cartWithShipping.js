
import { defaultCart } from "./defaultCart";
import { standard } from "../shipping-methods";

export const cartWithShipping = {
  ...defaultCart,
  shippingAddress: { country: "SU" },
  shippingMethod: { key: standard.key, typeId: "shipping-method" },
  taxMode: "ExternalAmount",
}
export default cartWithShipping