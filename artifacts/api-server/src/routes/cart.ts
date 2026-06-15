import { Router } from "express";
import { shopifyStorefrontRequest } from "../lib/shopifyStorefrontClient";

const router = Router();

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            image { url altText }
            product {
              id
              title
              handle
              description
              productType
              tags
              featuredImage { url altText }
              images(first: 1) { nodes { url altText } }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 20) {
                nodes {
                  id
                  title
                  availableForSale
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function normalizeCart(cart: any) {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: (cart.lines?.nodes ?? []).map((line: any) => ({
      id: line.id,
      quantity: line.quantity,
      cost: line.cost,
      merchandise: {
        id: line.merchandise?.id,
        title: line.merchandise?.title,
        selectedOptions: line.merchandise?.selectedOptions ?? [],
        image: line.merchandise?.image ?? null,
        product: line.merchandise?.product
          ? {
              id: line.merchandise.product.id,
              title: line.merchandise.product.title,
              handle: line.merchandise.product.handle,
              description: line.merchandise.product.description,
              productType: line.merchandise.product.productType,
              tags: line.merchandise.product.tags,
              featuredImage: line.merchandise.product.featuredImage ?? null,
              images: line.merchandise.product.images?.nodes ?? [],
              priceRange: line.merchandise.product.priceRange,
              variants: line.merchandise.product.variants?.nodes ?? [],
            }
          : null,
      },
    })),
  };
}

router.post("/cart", async (req, res) => {
  try {
    const { lines } = req.body as {
      lines?: Array<{ merchandiseId: string; quantity: number }>;
    };

    const data = await shopifyStorefrontRequest<any>(
      `
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
      `,
      { lines: lines ?? [] },
    );

    const userErrors = data?.cartCreate?.userErrors ?? [];
    if (userErrors.length > 0) {
      res.status(400).json({ error: userErrors[0].message });
      return;
    }

    res.status(201).json(normalizeCart(data.cartCreate.cart));
  } catch (err: any) {
    req.log.error({ err }, "Failed to create cart");
    res.status(503).json({ error: err.message ?? "Failed to create cart" });
  }
});

router.get("/cart/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const data = await shopifyStorefrontRequest<any>(
      `
      ${CART_FRAGMENT}
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ...CartFields }
      }
      `,
      { cartId },
    );

    if (!data?.cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.json(normalizeCart(data.cart));
  } catch (err: any) {
    req.log.error({ err }, "Failed to get cart");
    res.status(503).json({ error: err.message ?? "Failed to load cart" });
  }
});

router.post("/cart/:cartId/lines", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { merchandiseId, quantity } = req.body as {
      merchandiseId: string;
      quantity: number;
    };

    const data = await shopifyStorefrontRequest<any>(
      `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
      `,
      { cartId, lines: [{ merchandiseId, quantity }] },
    );

    const userErrors = data?.cartLinesAdd?.userErrors ?? [];
    if (userErrors.length > 0) {
      res.status(400).json({ error: userErrors[0].message });
      return;
    }

    res.json(normalizeCart(data.cartLinesAdd.cart));
  } catch (err: any) {
    req.log.error({ err }, "Failed to add cart line");
    res.status(503).json({ error: err.message ?? "Failed to add to cart" });
  }
});

router.patch("/cart/:cartId/lines/:lineId", async (req, res) => {
  try {
    const { cartId, lineId } = req.params;
    const { quantity } = req.body as { quantity: number };

    const data = await shopifyStorefrontRequest<any>(
      `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
      `,
      { cartId, lines: [{ id: lineId, quantity }] },
    );

    const userErrors = data?.cartLinesUpdate?.userErrors ?? [];
    if (userErrors.length > 0) {
      res.status(400).json({ error: userErrors[0].message });
      return;
    }

    res.json(normalizeCart(data.cartLinesUpdate.cart));
  } catch (err: any) {
    req.log.error({ err }, "Failed to update cart line");
    res.status(503).json({ error: err.message ?? "Failed to update cart" });
  }
});

router.delete("/cart/:cartId/lines/:lineId", async (req, res) => {
  try {
    const { cartId, lineId } = req.params;

    const data = await shopifyStorefrontRequest<any>(
      `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
      `,
      { cartId, lineIds: [lineId] },
    );

    const userErrors = data?.cartLinesRemove?.userErrors ?? [];
    if (userErrors.length > 0) {
      res.status(400).json({ error: userErrors[0].message });
      return;
    }

    res.json(normalizeCart(data.cartLinesRemove.cart));
  } catch (err: any) {
    req.log.error({ err }, "Failed to remove cart line");
    res.status(503).json({ error: err.message ?? "Failed to remove from cart" });
  }
});

export default router;
