import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  const total = input.cart.cost.subtotalAmount.amount;
  const deliveryGroups = input.cart.deliveryGroups;

    if (total <= 100 || deliveryGroups.length < 1) {
      return EMPTY_DISCOUNT;
    }
    if (total > 300) {
      return {
        discounts: [
          {
            targets: [
              {
                deliveryOption: {
                  handle: deliveryGroups[0].deliveryOptions[0].handle
                }
              }
            ],
            value: {
              percentage: {
                value: 100
              }
            },
            message: "100% off Standard shipping"
          },
        ]
      }
    }

    return {
      discounts: [
        {
          targets: [
            {
              deliveryOption: {
                handle: deliveryGroups[0].deliveryOptions[0].handle
              }
            }
          ],
          value: {
            percentage: {
              value: 50
            }
          },
          message: "50% off Standard shipping"
        },
      ]
    }
};
