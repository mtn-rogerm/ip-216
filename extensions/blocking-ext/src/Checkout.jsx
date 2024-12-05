import {
  reactExtension,
  useBuyerJourneyIntercept,
  useCartLines,
  useApi
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const lines = useCartLines();
  const total = lines.reduce((acc, item) => {
    return acc += item.cost.totalAmount.amount * item.quantity;
  }, 0);
  const { extension } = useApi();
  const capabilities = extension.capabilities;
  const canBlockProgress = capabilities.current.find(capability => capability === 'block_progress');

  useBuyerJourneyIntercept(() => {
    if (canBlockProgress && total < 500) {
      return {
        behavior: "block",
        reason: `Total amount is less than $500.`,
        errors: [
          {
            message:
              "You need to add more items in your cart. Min total is $500",
          },
        ],
      };
    };

    return {
      behavior: "allow",
      perform: () => {},
    };
  });
};
