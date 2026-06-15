import { Router } from "express";
import { shopifyStorefrontRequest } from "../lib/shopifyStorefrontClient";

const router = Router();

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    productType
    tags
    featuredImage { url altText }
    images(first: 10) {
      nodes { url altText }
    }
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
`;

function normalizeProduct(p: any) {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.description,
    productType: p.productType,
    tags: p.tags,
    featuredImage: p.featuredImage ?? null,
    images: p.images?.nodes ?? [],
    priceRange: p.priceRange,
    variants: p.variants?.nodes ?? [],
  };
}

router.get("/products", async (req, res) => {
  try {
    const { collection, first = "20" } = req.query as {
      collection?: string;
      first?: string;
    };

    let data: any;

    if (collection) {
      data = await shopifyStorefrontRequest<any>(
        `
        ${PRODUCT_FRAGMENT}
        query CollectionProducts($handle: String!, $first: Int!) {
          collectionByHandle(handle: $handle) {
            products(first: $first) {
              nodes { ...ProductFields }
            }
          }
        }
        `,
        { handle: collection, first: parseInt(first, 10) },
      );
      const nodes = data?.collectionByHandle?.products?.nodes ?? [];
      res.json(nodes.map(normalizeProduct));
    } else {
      data = await shopifyStorefrontRequest<any>(
        `
        ${PRODUCT_FRAGMENT}
        query Products($first: Int!) {
          products(first: $first) {
            nodes { ...ProductFields }
          }
        }
        `,
        { first: parseInt(first, 10) },
      );
      const nodes = data?.products?.nodes ?? [];
      res.json(nodes.map(normalizeProduct));
    }
  } catch (err: any) {
    req.log.error({ err }, "Failed to list products");
    res.status(503).json({ error: err.message ?? "Failed to load products" });
  }
});

router.get("/products/:handle", async (req, res) => {
  try {
    const { handle } = req.params;
    const data = await shopifyStorefrontRequest<any>(
      `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) { ...ProductFields }
      }
      `,
      { handle },
    );

    const product = data?.productByHandle;
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(normalizeProduct(product));
  } catch (err: any) {
    req.log.error({ err }, "Failed to get product");
    res.status(503).json({ error: err.message ?? "Failed to load product" });
  }
});

router.get("/collections", async (req, res) => {
  try {
    const data = await shopifyStorefrontRequest<any>(
      `
      query Collections {
        collections(first: 20) {
          nodes {
            id
            title
            handle
            description
            image { url altText }
          }
        }
      }
      `,
    );

    const nodes = data?.collections?.nodes ?? [];
    const collections = nodes.map((c: any) => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
      description: c.description,
      image: c.image ?? null,
    }));

    res.json(collections);
  } catch (err: any) {
    req.log.error({ err }, "Failed to list collections");
    res.status(503).json({ error: err.message ?? "Failed to load collections" });
  }
});

export default router;
