// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input: RunInput): FunctionRunResult {
  /**
   * @type {{
   *   quantity: number
   *   percentage: number
   * }}
   */

  const cartLines = input.cart.lines
    .filter((line) => {
      if (line.merchandise.__typename == 'ProductVariant') {
        const variantMetafieldValue = line.merchandise?.metafield?.value;
        return variantMetafieldValue;
      }
    })
    .map((line) => {
      return /** @type {Target} */ ({
        cartLine: {
          id: line.merchandise.__typename == 'ProductVariant' ? line.merchandise?.id : false,
          quantity: line.quantity,
        },
        discount: {
          value: line.merchandise.__typename == 'ProductVariant' && line.merchandise?.metafield?.value.toString()
        }
      });
    });

  if (!cartLines.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: cartLines.map(line => {
      return {
        value: {
          fixedAmount: {
            amount: line.discount.value
          }
        },
        targets: [
          {
            productVariant: {
              id: line.cartLine.id,
              quantity: line.cartLine.quantity
            }
          }
        ],
        message: `$${line.discount.value} off`
      }
    }),
    discountApplicationStrategy: DiscountApplicationStrategy.All
  };
}
