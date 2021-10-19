import { expect } from "chai";
import { get } from "lodash";
import { Carts } from "../shared-fixtures";
import {
  ensureResourcesExist,
  deleteResources,
  getLineItemAffectedDiscounts,
  updateResource,
  TEST_TIMEOUT,
  getLineItemBySku,
} from "../test-utils";

const cartDiscountToCreate = {
  name: {
    en: "$10 off cart",
  },
  key: "integration-10-off-cart",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: 'custom.applyCartDiscount contains "10off"',
  target: {
    type: "lineItems",
    predicate: `sku in ("pants", "pantspennyrounding")`,
  },
  sortOrder: "0.03242001115",
  isActive: true,
  requiresDiscountCode: false,
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-absolute",
    },
    fields: {
      money: {
        centAmount: 1000,
        currencyCode: "USD",
      },
      excludedCartDiscounts: [],
      ignoreQuantity: false,
    },
  },
};
const cartToCreate = Carts.cart1pants2jackets;
const cartToCreatePennyRounding1 = Carts.cart1pants1jacketspennyrounding;
const cartToCreatePennyRounding2 = Carts.cart2pants1jackets11pantspennyrounding;
describe("Integration test - line-item-absolute", () => {
  let createdDiscount = {};
  before(async () => {
    createdDiscount = await ensureResourcesExist(
      cartDiscountToCreate,
      "cartDiscounts",
    );
  });

  after(async () => {
    if (createdDiscount.id) {
      await deleteResources(createdDiscount, "cartDiscounts");
    }
  });
  describe("When creating a cart (1x$55.00, 2x$50.00 =$155) with line items and applying a 10off absolute discount, not ignoring quantity, no exclusions", () => {
    it("Cart should be discounted by $10 after applying the $10 off discount", async () => {
      const expectedTotalPriceDifference =
        cartDiscountToCreate.custom.fields.money.centAmount;

      const expectedDiscountId = createdDiscount.id;
      const createdCart = await ensureResourcesExist(cartToCreate, "carts");
      const actions = [
        {
          action: "setCustomField",
          name: "applyCartDiscount",
          value: ["10off"],
        },
      ];
      const updatedCart = await updateResource({
        resource: createdCart,
        resourceTypeId: "carts",
        actions,
      });

      const receivedTotalPriceDifference =
        createdCart.totalPrice.centAmount - updatedCart.totalPrice.centAmount;
      const pantslineItem = getLineItemBySku(updatedCart, "pants");
      const includedDiscounts = getLineItemAffectedDiscounts(pantslineItem);
      expect(includedDiscounts).to.contain(expectedDiscountId);
      expect(includedDiscounts.length).to.equal(1);

      expect(receivedTotalPriceDifference).to.equal(
        expectedTotalPriceDifference,
      );
    }).timeout(TEST_TIMEOUT);
  });

  describe("When creating a cart (1x$29.99, 1x$29.99 =$59.98) with two line items and applying a 10off absolute discount, not ignoring quantity, no exclusions. Test penny rounding.", () => {
    it("Cart should be discounted by $10 after applying the $10 off discount", async () => {
      const expectedTotalPriceDifference =
        cartDiscountToCreate.custom.fields.money.centAmount;
      const expectedDiscountId = createdDiscount.id;
      const createdCart = await ensureResourcesExist(
        cartToCreatePennyRounding1,
        "carts",
      );
      const actions = [
        {
          action: "setCustomField",
          name: "applyCartDiscount",
          value: ["10off"],
        },
      ];
      const updatedCart = await updateResource({
        resource: createdCart,
        resourceTypeId: "carts",
        actions,
      });

      const receivedTotalPriceDifference =
        createdCart.totalPrice.centAmount - updatedCart.totalPrice.centAmount;
      const pantslineItem = getLineItemBySku(updatedCart, "pantspennyrounding");
      const includedDiscounts = getLineItemAffectedDiscounts(pantslineItem);

      expect(includedDiscounts).to.contain(expectedDiscountId);
      expect(includedDiscounts.length).to.equal(1);

      expect(receivedTotalPriceDifference).to.equal(
        expectedTotalPriceDifference,
      );
    }).timeout(TEST_TIMEOUT);
  });

  describe("When creating a cart (1x$29.99, 1x$29.99,1x$29.99 =$89.97) with three line items and applying a 10off absolute discount, not ignoring quantity, no exclusions. Test penny rounding.", () => {
    it("Cart should be discounted by $10 after applying the $10 off discount", async () => {
      const expectedTotalPriceDifference =
        cartDiscountToCreate.custom.fields.money.centAmount;
      const expectedDiscountId = createdDiscount.id;
      const createdCart = await ensureResourcesExist(
        cartToCreatePennyRounding2,
        "carts",
      );
      const actions = [
        {
          action: "setCustomField",
          name: "applyCartDiscount",
          value: ["10off"],
        },
      ];
      const updatedCart = await updateResource({
        resource: createdCart,
        resourceTypeId: "carts",
        actions,
      });

      const receivedTotalPriceDifference =
        createdCart.totalPrice.centAmount - updatedCart.totalPrice.centAmount;
      const pantslineItem = getLineItemBySku(updatedCart, "pantspennyrounding");
      const includedDiscounts = getLineItemAffectedDiscounts(pantslineItem);
      expect(includedDiscounts).to.contain(expectedDiscountId);
      expect(includedDiscounts.length).to.equal(1);

      expect(receivedTotalPriceDifference).to.equal(
        expectedTotalPriceDifference,
      );
    }).timeout(TEST_TIMEOUT);
  });
});

const cartDiscountBlazer = {
  name: {
    en: "Buy 2 pants get on for $150 (integration test)",
  },
  key: "integration-test-blazer",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: "1 = 1",
  target: {
    type: "multiBuyLineItems",
    predicate: 'sku = "pants"',
    triggerQuantity: 2,
    discountedQuantity: 1,
    selectionMode: "Cheapest",
  },
  sortOrder: "0.5841029391021",
  isActive: true,
  requiresDiscountCode: false,
  validFrom: "2020-06-03T00:00:00.000Z",
  validUntil: "2022-06-03T00:00:00.000Z",
  stackingMode: "Stacking",
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-multibuy-fixed",
    },
    fields: {
      multiBuySelectionMode: "Cheapest",
      multiBuyDiscountedQuantity: 1,
      appliesOver: "FIXED_PRICE",
      fixedAmount: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: 15000,
        fractionDigits: 2,
      },
      multiBuyTrigger: 2,
    },
  },
};

const cartDiscountTierTwo = {
  name: {
    en: "SPEND $300 Get $30 Off (integration test)",
  },
  key: "integration-test-tier-two",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1=1) >= "300.00 USD"',
  target: {
    type: "lineItems",
    predicate: "1=1",
  },
  validFrom: "2020-05-22T00:00:00.000Z",
  stackingMode: "Stacking",
  isActive: true,
  requiresDiscountCode: false,
  sortOrder: "0.300202005130591",
  references: [],
  cartFieldTypes: {},
  lineItemFieldTypes: {},
  customLineItemFieldTypes: {},
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-absolute",
    },
    fields: {
      ignoreQuantity: true,
      money: {
        fractionDigits: 2,
        centAmount: 3000,
        currencyCode: "USD",
        type: "centPrecision",
      },
    },
  },
};

const cartForThings = {
  currency: "USD",
  country: "US",
  taxMode: "Disabled",
  lineItems: [
    {
      sku: "pants",
      quantity: 10,
    },
    {
      sku: "belt",
      quantity: 10,
    },
  ],
};

describe("When creating a cart with x2 of a $189 item and 2 discounts", () => {
  let createdCartDiscountBlazer = {};
  let createdCartDiscountTierTwo = {};

  after(async () => {
    if (createdCartDiscountBlazer.id) {
      await deleteResources(createdCartDiscountBlazer, "cartDiscounts");
    }
    if (createdCartDiscountTierTwo.id) {
      await deleteResources(createdCartDiscountTierTwo, "cartDiscounts");
    }
  });

  it("Cart should _not_ be discounted after removing a line item", async () => {
    const createdCart = await ensureResourcesExist(cartForThings, "carts");
    createdCartDiscountBlazer = await ensureResourcesExist(
      cartDiscountBlazer,
      "cartDiscounts",
    );
    createdCartDiscountTierTwo = await ensureResourcesExist(
      cartDiscountTierTwo,
      "cartDiscounts",
    );

    const actions = [
      {
        action: "removeLineItem",
        lineItemId: createdCart.lineItems[0].id,
      },
    ];

    const updatedCart = await updateResource({
      resource: createdCart,
      resourceTypeId: "carts",
      actions,
    });

    const cartDiscountsAffecting = get(
      updatedCart,
      "lineItems[0].custom.fields.cartDiscountsAffecting",
      [],
    );
    expect(cartDiscountsAffecting).to.deep.equal([]);
    expect(updatedCart.totalPrice.centAmount).to.equal(10000);
  }).timeout(TEST_TIMEOUT);
});
