import { expect } from 'chai';
import lodashPkg from 'lodash';
import { Products, ShippingMethods } from '../../shared-fixtures/index.mjs';
import {
  ensureResourcesExist,
  deleteResources,
  fetchResource,
  updateResource,
  TEST_TIMEOUT,
} from '../../test-utils.mjs';

const { get } = lodashPkg;

const tierCartDiscount = {
  name: {
    en: 'Spend $100, Get $5 off (Integration Test)',
  },
  key: 'integration-tier1',
  value: {
    type: 'relative',
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1 = 1) >= "100.00 USD"',
  target: {
    type: 'lineItems',
    predicate: '1=1',
  },
  validFrom: '2020-05-22T00:00:00.000Z',
  stackingMode: 'Stacking',
  isActive: true,
  requiresDiscountCode: true,
  sortOrder: '0.500202005132591',
  references: [],
  cartFieldTypes: {},
  lineItemFieldTypes: {},
  customLineItemFieldTypes: {},
  custom: {
    type: {
      typeId: 'type',
      key: 'custom-cart-discount-absolute',
    },
    fields: {
      ignoreQuantity: true,
      money: {
        fractionDigits: 2,
        centAmount: 500,
        currencyCode: 'USD',
        type: 'centPrecision',
      },
    },
  },
};

const cartDiscountPants2 = {
  name: {
    en: 'Buy 2 pants get one for $30 (integration test)',
  },
  key: 'integration-test-pants2',
  value: {
    type: 'relative',
    permyriad: 0,
  },
  cartPredicate: '1 = 1',
  target: {
    type: 'multiBuyLineItems',
    predicate: 'sku = "pants-tax"',
    triggerQuantity: 2,
    discountedQuantity: 1,
    selectionMode: 'Cheapest',
  },
  sortOrder: '0.584102939311021',
  isActive: true,
  requiresDiscountCode: false,
  validFrom: '2020-06-03T00:00:00.000Z',
  validUntil: '2022-06-03T00:00:00.000Z',
  stackingMode: 'Stacking',
  custom: {
    type: {
      typeId: 'type',
      key: 'custom-cart-discount-multibuy-fixed',
    },
    fields: {
      multiBuySelectionMode: 'Cheapest',
      multiBuyDiscountedQuantity: 1,
      appliesOver: 'FIXED_PRICE',
      fixedAmount: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 3000,
        fractionDigits: 2,
      },
      multiBuyTrigger: 2,
    },
  },
};

const cartDiscountTierTwo = {
  name: {
    en: 'SPEND $200 Get $10 Off (integration test)',
  },
  key: 'integration-test-tier-two',
  value: {
    type: 'relative',
    permyriad: 0,
  },
  cartPredicate: 'lineItemTotal(1=1) >= "200.00 USD"',
  target: {
    type: 'lineItems',
    predicate: '1=1',
  },
  validFrom: '2020-05-22T00:00:00.000Z',
  stackingMode: 'Stacking',
  isActive: true,
  requiresDiscountCode: false,
  sortOrder: '0.300202002130591',
  references: [],
  cartFieldTypes: {},
  lineItemFieldTypes: {},
  customLineItemFieldTypes: {},
  custom: {
    type: {
      typeId: 'type',
      key: 'custom-cart-discount-absolute',
    },
    fields: {
      ignoreQuantity: true,
      money: {
        fractionDigits: 2,
        centAmount: 1000,
        currencyCode: 'USD',
        type: 'centPrecision',
      },
    },
  },
};

const cartForThings = {
  currency: 'USD',
  country: 'US',
  taxMode: 'Disabled',
  lineItems: [
    {
      sku: 'pants-tax',
      quantity: 5,
    },
    {
      sku: 'belt-tax',
      quantity: 4,
    },
  ],
};

const externalTaxAmount = 111;

describe('When creating a cart with several pants and belt items and 3 discounts', () => {
  let createdCartDiscountPants2 = {};
  let createdCartDiscountTierTwo = {};
  let createdCode = {};
  let createdDiscount = {};
  let cartPayment = {};
  let updatedCartOrder = {};

  before(async () => {
    createdDiscount = await ensureResourcesExist(
      tierCartDiscount,
      'cartDiscounts',
    );
    createdCartDiscountTierTwo = await ensureResourcesExist(
      cartDiscountTierTwo,
      'cartDiscounts',
    );
    createdCartDiscountPants2 = await ensureResourcesExist(
      cartDiscountPants2,
      'cartDiscounts',
    );
    const discountCodeToCreate = {
      isActive: true,
      code: 'integration-tiered-promos-code-recalc',
      groups: ['integration'],
      cartDiscounts: [{ typeId: 'cart-discount', id: createdDiscount.id }],
    };
    createdCode = await ensureResourcesExist(
      discountCodeToCreate,
      'discountCodes',
    );
  });

  after(async () => {
    if (createdCode.id) {
      await deleteResources(createdCode, 'discountCodes');
    }
    if (createdDiscount.id) {
      await deleteResources(createdDiscount, 'cartDiscounts');
    }
    if (createdCartDiscountTierTwo.id) {
      await deleteResources(createdCartDiscountTierTwo, 'cartDiscounts');
    }
    if (createdCartDiscountPants2.id) {
      await deleteResources(createdCartDiscountPants2, 'cartDiscounts');
    }
  });

  it('Cart should handle discounts appropriately after removing a line item and then adding shipping, tax, recalculate, payment, order flow', async () => {
    const createdCart = await ensureResourcesExist(cartForThings, 'carts');
    let runningTotal = Products.pantsTax.masterVariant.prices[0].value.centAmount * 3
      + 2 * 3000
      + cartForThings.lineItems[1].quantity
        * Products.beltTax.masterVariant.prices[0].value.centAmount
      - cartDiscountTierTwo.custom.fields.money.centAmount;
    expect(createdCart.totalPrice.centAmount).to.equal(runningTotal);

    // set shipping
    const actionsShipping = [
      {
        action: 'setShippingAddress',
        address: { country: 'US' },
      },
      {
        action: 'setShippingMethod',
        shippingMethod: {
          key: 'integration-standardUS',
          typeId: 'shipping-method',
        },
      },
      { action: 'changeTaxMode', taxMode: 'Disabled' },
    ];

    const updatedCartShipping = await updateResource({
      resource: createdCart,
      resourceTypeId: 'carts',
      actions: actionsShipping,
    });

    const cartDiscountsAffectingShipping = get(
      updatedCartShipping,
      'lineItems[0].custom.fields.cartDiscountsAffecting',
      [],
    );
    const discountList2 = [
      createdCartDiscountPants2.id,
      createdCartDiscountTierTwo.id,
    ];
    runningTotal
      += ShippingMethods.shippingMethodFullFlow1.zoneRates[0].shippingRates[0]
        .price.centAmount;
    expect(cartDiscountsAffectingShipping).to.include.members(discountList2);
    expect(updatedCartShipping.totalPrice.centAmount).to.equal(runningTotal);

    const externalTaxAmountDraft = {
      totalGross: {
        currencyCode: 'USD',
        centAmount: externalTaxAmount,
      },
      taxRate: {
        name: 'Vertex Tax',
        amount: 0.01,
        includedInPrice: true,
        country: 'US',
      },
    };
    const lineItemTaxes = updatedCartShipping.lineItems.map((li) => ({
      action: 'setLineItemTaxAmount',
      lineItemId: li.id,
      externalTaxAmount: externalTaxAmountDraft,
    }));
    //  Flow for the no price reset portion
    //  reset tax
    const actionsChangeTaxMode = [
      {
        action: 'changeTaxMode',
        taxMode: 'ExternalAmount',
      },
      ...lineItemTaxes,
      {
        action: 'setShippingMethodTaxAmount',
        externalTaxAmount: externalTaxAmountDraft,
      },
    ];
    const updatedCartTaxMode = await updateResource({
      resource: createdCart,
      resourceTypeId: 'carts',
      actions: actionsChangeTaxMode,
    });
    const cartDiscountsAffectingTaxModeChange = get(
      updatedCartTaxMode,
      'lineItems[0].custom.fields.cartDiscountsAffecting',
      [],
    );
    const discountList3 = [
      createdCartDiscountPants2.id,
      createdCartDiscountTierTwo.id,
    ];
    expect(cartDiscountsAffectingTaxModeChange).to.deep.equal(discountList3);
    expect(updatedCartTaxMode.totalPrice.centAmount).to.equal(runningTotal);
    // apply discount via code
    const applyCodeAction = {
      action: 'addDiscountCode',
      code: createdCode.code,
    };
    const cartWithDiscountCode = await updateResource({
      resource: updatedCartTaxMode,
      actions: [applyCodeAction],
      resourceTypeId: 'carts',
    });

    const discountList4 = [
      createdCartDiscountPants2.id,
      createdDiscount.id,
      createdCartDiscountTierTwo.id,
    ];
    const cartDiscountsAfterCodeAddition = get(
      cartWithDiscountCode,
      'lineItems[0].custom.fields.cartDiscountsAffecting',
      [],
    );
    runningTotal -= createdDiscount.custom.fields.money.centAmount;
    expect(cartDiscountsAfterCodeAddition).to.deep.equal(discountList4);
    expect(cartWithDiscountCode.totalPrice.centAmount).to.equal(runningTotal);
    // recalculate cart
    const recalculateAction = {
      action: 'recalculate',
      updateProductData: false,
    };
    const cartRecalculated = await updateResource({
      resource: cartWithDiscountCode,
      actions: [recalculateAction],
      resourceTypeId: 'carts',
    });

    const discountList5 = [
      createdCartDiscountPants2.id,
      createdDiscount.id,
      createdCartDiscountTierTwo.id,
    ];
    const cartDiscountsAfterRecalculate = get(
      cartRecalculated,
      'lineItems[0].custom.fields.cartDiscountsAffecting',
      [],
    );
    expect(cartDiscountsAfterRecalculate).to.deep.equal(discountList5);
    expect(cartRecalculated.totalPrice.centAmount).to.equal(runningTotal);
    //  reset tax
    const actionsChangeTaxMode2 = [
      {
        action: 'changeTaxMode',
        taxMode: 'ExternalAmount',
      },
      ...lineItemTaxes,
      {
        action: 'setShippingMethodTaxAmount',
        externalTaxAmount: externalTaxAmountDraft,
      },
      {
        action: 'setCartTotalTax',
        externalTotalGross: {
          currencyCode: 'USD',
          centAmount: 1000,
        },
        externalTaxPortions: [
          {
            name: 'Vertex Tax',
            rate: 0.1,
            amount: {
              currencyCode: 'USD',
              centAmount: 111,
            },
          },
        ],
      },
    ];
    const updatedCartTaxMode2 = await updateResource({
      resource: cartRecalculated,
      resourceTypeId: 'carts',
      actions: actionsChangeTaxMode2,
      maintainCartActions: true,
    });

    const cartDiscountsAffectingTaxModeChange2 = get(
      updatedCartTaxMode2,
      'lineItems[0].custom.fields.cartDiscountsAffecting',
      [],
    );
    const discountList6 = [
      createdCartDiscountPants2.id,
      createdDiscount.id,
      createdCartDiscountTierTwo.id,
    ];
    expect(cartDiscountsAffectingTaxModeChange2).to.deep.equal(discountList6);
    expect(updatedCartTaxMode2.totalPrice.centAmount).to.equal(runningTotal);

    // create payment
    const payment = {
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: cartWithDiscountCode.totalPrice.centAmount,
        fractionDigits: 2,
      },
    };
    cartPayment = await ensureResourcesExist(payment, 'payments');
    expect(cartPayment.amountPlanned.centAmount).to.equal(runningTotal);

    // create order
    const order = {
      id: createdCart.id,
      version: updatedCartTaxMode2.version,
    };
    updatedCartOrder = await ensureResourcesExist(order, 'orders');
    expect(updatedCartOrder.totalPrice.centAmount).to.equal(runningTotal);
    const finalCode = await fetchResource(createdCode.id, 'discountCodes');
    createdCode.version = finalCode.version;
  }).timeout(TEST_TIMEOUT);
});
