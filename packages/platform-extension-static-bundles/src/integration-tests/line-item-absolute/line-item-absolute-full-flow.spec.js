import { expect } from "chai";
import { get } from "lodash";
import { Products, ShippingMethods } from "../shared-fixtures";
import {
  ensureResourcesExist,
  deleteResources,
  updateResource,
  TEST_TIMEOUT,
  fetchResource,
} from "../test-utils";

const cartDiscountTierGte50 = {
  name: {
    en: "Spend $50, Get $5 off (Integration Test)",
  },
  key: "integration-tier-begin",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1 = 1) >= "50.00 USD"',
  target: {
    type: "lineItems",
    predicate: "1=1",
  },
  stackingMode: "Stacking",
  isActive: true,
  requiresDiscountCode: true,
  sortOrder: "0.500235605130591",
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-absolute",
    },
    fields: {
      ignoreQuantity: true,
      money: {
        centAmount: 500,
        currencyCode: "USD",
      },
    },
  },
};

const cartDiscountTierGte100 = {
  name: {
    en: "Spend $100, Get $5 off (Integration Test)",
  },
  key: "integration-tier1",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1 = 1) >= "100.00 USD"',
  target: {
    type: "lineItems",
    predicate: "1=1",
  },
  stackingMode: "Stacking",
  isActive: true,
  requiresDiscountCode: true,
  sortOrder: "0.500202005130591",
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-absolute",
    },
    fields: {
      ignoreQuantity: true,
      money: {
        centAmount: 500,
        currencyCode: "USD",
      },
    },
  },
};

const cartDiscountPantsBogo = {
  name: {
    en: "Buy 2 pants get one for $30 (integration test)",
  },
  key: "integration-test-pants2",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: "1 = 1",
  target: {
    type: "multiBuyLineItems",
    predicate: 'sku = "pants-tax"',
    triggerQuantity: 2,
    discountedQuantity: 1,
    selectionMode: "Cheapest",
  },
  sortOrder: "0.584102939351021",
  isActive: true,
  requiresDiscountCode: false,
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
        currencyCode: "USD",
        centAmount: 3000,
      },
      multiBuyTrigger: 2,
    },
  },
};

const cartDiscountTierGte200 = {
  name: {
    en: "SPEND $200 Get $10 Off (integration test)",
  },
  key: "integration-test-tier-two",
  value: {
    type: "relative",
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1=1) >= "200.00 USD"',
  target: {
    type: "lineItems",
    predicate: "1=1",
  },
  stackingMode: "Stacking",
  isActive: true,
  requiresDiscountCode: true,
  sortOrder: "0.300202005130591",
  custom: {
    type: {
      typeId: "type",
      key: "custom-cart-discount-absolute",
    },
    fields: {
      ignoreQuantity: true,
      money: {
        centAmount: 1000,
        currencyCode: "USD",
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
      sku: "pants-tax",
      quantity: 5,
    },
    {
      sku: "belt-tax",
      quantity: 4,
    },
  ],
};
const beltPrice = Products.beltTax.masterVariant.prices[0].value.centAmount;
const pantsPrice = Products.pantsTax.masterVariant.prices[0].value.centAmount;
const bogoTypePrice =
  cartDiscountPantsBogo.custom.fields.fixedAmount.centAmount;

const externalTaxAmount = 111;

describe("When creating a cart with several pants and belt items and 3 discounts", () => {
  let createdBogoCartDiscount = {};
  let createdCartDiscountTierGte200 = {};
  let createdDiscountCodeBeginFlow = {};
  let createdDiscountCodeAbsolute = {};
  let createdCartDiscountTierGte100 = {};
  let createdCartDiscountTierGte50 = {};
  let createdDiscountIds = {};

  before(async () => {
    createdBogoCartDiscount = await ensureResourcesExist(
      cartDiscountPantsBogo,
      "cartDiscounts",
    );
    createdCartDiscountTierGte200 = await ensureResourcesExist(
      cartDiscountTierGte200,
      "cartDiscounts",
    );
    createdCartDiscountTierGte100 = await ensureResourcesExist(
      cartDiscountTierGte100,
      "cartDiscounts",
    );
    createdCartDiscountTierGte50 = await ensureResourcesExist(
      cartDiscountTierGte50,
      "cartDiscounts",
    );
    const discountCodeToCreate = {
      isActive: true,
      code: "integration-tiered-promos-code-absolute",
      groups: ["integration"],
      cartDiscounts: [
        { typeId: "cart-discount", id: createdCartDiscountTierGte100.id },
      ],
    };

    createdDiscountCodeAbsolute = await ensureResourcesExist(
      discountCodeToCreate,
      "discountCodes",
    );
    const discountCodeToCreateBeginFlow = {
      isActive: true,
      code: "integration-tiered-promos-code-absolute-begin-flow",
      groups: ["integration"],
      cartDiscounts: [
        { typeId: "cart-discount", id: createdCartDiscountTierGte50.id },
        { typeId: "cart-discount", id: createdCartDiscountTierGte200.id },
      ],
    };
    createdDiscountCodeBeginFlow = await ensureResourcesExist(
      discountCodeToCreateBeginFlow,
      "discountCodes",
    );
    createdDiscountIds = {
      cartDiscounts: {
        bogo: createdBogoCartDiscount.id,
        tierGte50: createdCartDiscountTierGte50.id,
        tierGte100: createdCartDiscountTierGte100.id,
        tierGte200: createdCartDiscountTierGte200.id,
      },
      codes: {
        beginFlow: [
          createdCartDiscountTierGte50.id,
          createdCartDiscountTierGte200.id,
        ],
        absolute: [createdCartDiscountTierGte100.id],
      },
    };
  });

  after(async () => {
    if (createdDiscountCodeAbsolute.id) {
      await deleteResources(createdDiscountCodeAbsolute, "discountCodes");
    }
    if (createdDiscountCodeBeginFlow.id) {
      await deleteResources(createdDiscountCodeBeginFlow, "discountCodes");
    }
    if (createdCartDiscountTierGte100.id) {
      await deleteResources(createdCartDiscountTierGte100, "cartDiscounts");
    }
    if (createdCartDiscountTierGte50.id) {
      await deleteResources(createdCartDiscountTierGte50, "cartDiscounts");
    }
    if (createdCartDiscountTierGte200.id) {
      await deleteResources(createdCartDiscountTierGte200, "cartDiscounts");
    }
    if (createdBogoCartDiscount.id) {
      await deleteResources(createdBogoCartDiscount, "cartDiscounts");
    }
  });

  it("Cart should handle discounts appropriately after removing a line item and then adding shipping, tax, payment, order flow", async () => {
    const createdCart = await ensureResourcesExist(cartForThings, "carts");
    let runningTotal =
      pantsPrice * 3 + // 3 of the 5 pants are at full price
      2 * bogoTypePrice + // 2 are for 30 (buy 2 get 1 @ 30$)
      cartForThings.lineItems[1].quantity * beltPrice;
    const createdCartTotalPrice = createdCart.totalPrice.centAmount;
    expect(createdCartTotalPrice).to.equal(runningTotal);
    const applyCodeActionBeginFlow = {
      action: "addDiscountCode",
      code: createdDiscountCodeBeginFlow.code,
    };
    // apply discount via code
    const cartWithDiscountCodeBeginFlow = await updateResource({
      resource: createdCart,
      actions: [applyCodeActionBeginFlow],
      resourceTypeId: "carts",
    });
    const discountListBegin = [
      createdDiscountIds.cartDiscounts.bogo,
      ...createdDiscountIds.codes.beginFlow,
    ];
    const cartDiscountsAfterCodeAdditionBeginFlow = get(
      cartWithDiscountCodeBeginFlow,
      "lineItems[0].custom.fields.cartDiscountsAffecting",
      [],
    );
    runningTotal -= cartDiscountTierGte50.custom.fields.money.centAmount;
    runningTotal -= cartDiscountTierGte200.custom.fields.money.centAmount;
    expect(
      cartDiscountsAfterCodeAdditionBeginFlow,
      "cartdiscount list",
    ).to.include.members(discountListBegin);
    expect(
      cartDiscountsAfterCodeAdditionBeginFlow,
      "discount list",
    ).to.not.include.members([
      createdDiscountIds.tierGte100,
      createdDiscountIds.tierGte50,
    ]);
    expect(
      cartWithDiscountCodeBeginFlow.totalPrice.centAmount,
      "cart with discount totalprice.centAmount",
    ).to.equal(runningTotal);
    // set shipping
    const actionsShipping = [
      {
        action: "setShippingAddress",
        address: { country: "US" },
      },
      {
        action: "setShippingMethod",
        shippingMethod: {
          key: ShippingMethods.shippingMethodFullFlow1.key,
          typeId: "shipping-method",
        },
      },
      { action: "changeTaxMode", taxMode: "Disabled" },
    ];

    const updatedCartShipping = await updateResource({
      resource: cartWithDiscountCodeBeginFlow,
      resourceTypeId: "carts",
      actions: actionsShipping,
    });

    const cartDiscountsAffectingShipping = get(
      updatedCartShipping,
      "lineItems[0].custom.fields.cartDiscountsAffecting",
      [],
    );

    expect(
      cartDiscountsAffectingShipping,
      "cartDiscountsAffectingShipping",
    ).to.deep.equal(discountListBegin);
    runningTotal +=
      ShippingMethods.shippingMethodFullFlow1.zoneRates[0].shippingRates[0]
        .price.centAmount;
    expect(
      updatedCartShipping.totalPrice.centAmount,
      "updatedCartShipping.totalPrice.centAmount",
    ).to.equal(runningTotal);
    const externalTaxAmountDraft = {
      totalGross: {
        currencyCode: "USD",
        centAmount: externalTaxAmount,
      },
      taxRate: {
        name: "Vertex Tax",
        amount: 0.01,
        includedInPrice: true,
        country: "US",
      },
    };
    const lineItemTaxes = updatedCartShipping.lineItems.map((li) => ({
      action: "setLineItemTaxAmount",
      lineItemId: li.id,
      externalTaxAmount: externalTaxAmountDraft,
    }));
    //  Flow for the no price reset portion
    //  reset tax
    const actionsChangeTaxMode = [
      {
        action: "changeTaxMode",
        taxMode: "ExternalAmount",
      },
      ...lineItemTaxes,
      {
        action: "setShippingMethodTaxAmount",
        externalTaxAmount: externalTaxAmountDraft,
      },
    ];

    const updatedCartTaxMode = await updateResource({
      resource: updatedCartShipping,
      resourceTypeId: "carts",
      actions: actionsChangeTaxMode,
      maintainCartActions: true,
    });

    const cartDiscountsAffectingTaxModeChange = get(
      updatedCartTaxMode,
      "lineItems[0].custom.fields.cartDiscountsAffecting",
      [],
    );

    expect(cartDiscountsAffectingTaxModeChange).to.deep.equal(
      discountListBegin,
    );

    expect(
      updatedCartTaxMode.totalPrice.centAmount,
      "updatedCartTaxMode.totalPrice.centAmount",
    ).to.equal(runningTotal);
    // apply discount via code
    const applyCodeAction = {
      action: "addDiscountCode",
      code: createdDiscountCodeAbsolute.code,
    };
    const cartWithDiscountCode = await updateResource({
      resource: updatedCartTaxMode,
      actions: [applyCodeAction],
      resourceTypeId: "carts",
    });
    const discountList4 = [
      createdDiscountIds.cartDiscounts.bogo,
      ...createdDiscountIds.codes.beginFlow,
      ...createdDiscountIds.codes.absolute,
    ];
    const cartDiscountsAfterCodeAddition = get(
      cartWithDiscountCode,
      "lineItems[0].custom.fields.cartDiscountsAffecting",
      [],
    );
    runningTotal -=
      createdCartDiscountTierGte100.custom.fields.money.centAmount;
    expect(cartDiscountsAfterCodeAddition).to.include.members(discountList4);
    expect(
      cartWithDiscountCode.totalPrice.centAmount,
      "cartWithDiscountCode.totalPrice.centAmount",
    ).to.equal(runningTotal);

    // re do taxes
    const cartWithTaxesAndCodes = await updateResource({
      resource: cartWithDiscountCode,
      resourceTypeId: "carts",
      actions: actionsChangeTaxMode,
      maintainCartActions: true,
    });

    // create payment
    const payment = {
      amountPlanned: {
        type: "centPrecision",
        currencyCode: "USD",
        centAmount: cartWithTaxesAndCodes.totalPrice.centAmount,
        fractionDigits: 2,
      },
    };
    const cartPayment = await ensureResourcesExist(payment, "payments");
    expect(
      cartPayment.amountPlanned.centAmount,
      "cartPayment.amountPlanned.centAmount",
    ).to.equal(runningTotal);

    // create order
    const updatedCartOrder = await ensureResourcesExist(
      cartWithTaxesAndCodes,
      "orders",
    );
    expect(
      updatedCartOrder.totalPrice.centAmount,
      "cartOrder.totalPrice.centAmount",
    ).to.equal(runningTotal);
    const finalCodeBeginFlow = await fetchResource(
      createdDiscountCodeBeginFlow.id,
      "discountCodes",
    );
    createdDiscountCodeBeginFlow.version = finalCodeBeginFlow.version;
  }).timeout(TEST_TIMEOUT);
});
