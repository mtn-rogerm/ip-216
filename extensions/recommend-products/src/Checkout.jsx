import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useApi,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

const PRODUCTS_QUERY = `query Products($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id
      title
      images(first: 1) {
        nodes {
          url
        }
      }
      variants(first: 1) {
        nodes {
          id
          price {
            amount
          }
        }
      }
    }
  }
}`;

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const { query, i18n } = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const lines = useCartLines();
  const { recommended_products } = useSettings();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!recommended_products) {
      setLoading(false);
      return;
    }

    const ids = recommended_products
      .split(",")
      .map((id) => `gid://shopify/Product/${id}`);

    const fetchProducts = async () => {
      try {
        const { data } = await query(PRODUCTS_QUERY, { variables: { ids } });
        setProducts(data.nodes.filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, recommended_products]);

  const handleAddToCart = async (variantId) => {
    setAdding(true);
    const result = await applyCartLinesChange({
      type: "addCartLine",
      merchandiseId: variantId,
      quantity: 1,
    });
    setAdding(false);
    if (result.type === "error") {
      setShowError(true);
      console.error(result.message);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  if (loading) return <LoadingSkeleton />;
  if (!products.length) return null;

  const productsOnOffer = getProductsOnOffer(lines, products);

  if (!productsOnOffer.length) return null;

  return (
    <ProductOffer
      product={productsOnOffer[0]}
      i18n={i18n}
      adding={adding}
      handleAddToCart={handleAddToCart}
      showError={showError}
    />
  );
}

function LoadingSkeleton() {
  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout spacing="base" columns={[64, "fill", "auto"]} blockAlignment="center">
          <SkeletonImage aspectRatio={1} />
          <BlockStack spacing="none">
            <SkeletonText inlineSize="large" />
            <SkeletonText inlineSize="small" />
          </BlockStack>
          <Button kind="secondary" disabled>
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
    </BlockStack>
  );
}

function getProductsOnOffer(lines, products) {
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  return products.filter((product) =>
    product.variants.nodes.some(({ id }) => !cartLineProductVariantIds.includes(id))
  );
}

function ProductOffer({ product, i18n, adding, handleAddToCart, showError }) {
  const { images, title, variants } = product;
  const variant = variants.nodes[0];
  const renderPrice = i18n.formatCurrency(variant.price.amount);
  const imageUrl =
    images.nodes[0]?.url ||
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png";

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>
          <Button
            kind="secondary"
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={() => handleAddToCart(variant.id)}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && <ErrorBanner />}
    </BlockStack>
  );
}

function ErrorBanner() {
  return (
    <Banner status="critical">
      There was an issue adding this product. Please try again.
    </Banner>
  );
}
