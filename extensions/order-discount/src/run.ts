import type {
  RunInput,
  FunctionRunResult
} from "../generated/api";
import {
  DiscountApplicationStrategy,
  TargetType,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {
  percentage: number;
  minimumAmount: number;
};

export function run(input: RunInput): FunctionRunResult {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  if (!configuration.percentage || !configuration.minimumAmount) {
    throw new Error('Configuration missing!');
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        value: {
          percentage: {
            value: configuration.percentage,
          },
        },
        conditions: [
          {
            orderMinimumSubtotal: {
              targetType: TargetType.OrderSubtotal,
              minimumAmount: configuration.minimumAmount,
              excludedVariantIds: [],
            },
          },
        ],
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: [],
            },
          },
        ],
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};
