import {
  reactExtension,
  Banner,
  useInstructions,
  useTranslate,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useCartLines
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const instructions = useInstructions();
  const lines = useCartLines();
  const total = lines.reduce((acc, item) => {
    return acc += item.cost.totalAmount.amount * item.quantity;
  }, 0);

  const canBlockProgress = useExtensionCapability("block_progress");

  useBuyerJourneyIntercept(({ canBlockProgress }) => {

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

  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="blocking-ext" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  };
};
