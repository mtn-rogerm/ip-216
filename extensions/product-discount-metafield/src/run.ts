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

  const targets = input.cart.lines
    .filter((line) => {
      if (line.merchandise.__typename == 'ProductVariant') {
        const variantMetafieldValue = line.merchandise?.product?.metafield?.value;
        return variantMetafieldValue;
      }
    })
    .map((line) => {
      return /** @type {Target} */ ({
        cartLine: {
          id: line.id,
        },
        discount: {
          value: line.merchandise.__typename == 'ProductVariant' && line.merchandise?.product?.metafield?.value.toString()
        }
      });
    });

  if (!targets.length) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets,
        value: {
          percentage: {
            value: configuration.percentage.toString(),
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
