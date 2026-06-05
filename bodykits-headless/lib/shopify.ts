const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const ENDPOINT = `https://${DOMAIN}/api/2024-01/graphql.json`;

async function storefront<T = any>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? 'Shopify GraphQL error');
  }
  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: { nodes: ShopifyVariant[] };
  options: { name: string; values: string[] }[];
  seo: { title: string | null; description: string | null };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { nodes: ShopifyProduct[]; pageInfo: PageInfo };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: {
    nodes: CartLine[];
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

// ─── Fragments ────────────────────────────────────────────────────────────────

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    handle
    title
    vendor
    productType
    availableForSale
    featuredImage { ...ImageFragment }
    priceRange {
      minVariantPrice { ...MoneyFragment }
      maxVariantPrice { ...MoneyFragment }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        compareAtPrice { ...MoneyFragment }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { ...MoneyFragment }
      subtotalAmount { ...MoneyFragment }
      totalTaxAmount { ...MoneyFragment }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { ...MoneyFragment } }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            product {
              handle
              title
              featuredImage { ...ImageFragment }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProducts(first = 12, cursor?: string) {
  const query = `
    query GetProducts($first: Int!, $cursor: String) {
      products(first: $first, after: $cursor, sortKey: BEST_SELLING) {
        pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
        nodes { ...ProductCard }
      }
    }
    ${PRODUCT_CARD_FRAGMENT}
  `;
  const data = await storefront<{ products: { nodes: ShopifyProduct[]; pageInfo: PageInfo } }>(
    query,
    { first, cursor }
  );
  return data.products;
}

export async function getProductByHandle(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id handle title description descriptionHtml vendor productType
        availableForSale
        tags
        featuredImage { ...ImageFragment }
        images(first: 20) { nodes { ...ImageFragment } }
        priceRange {
          minVariantPrice { ...MoneyFragment }
          maxVariantPrice { ...MoneyFragment }
        }
        variants(first: 100) {
          nodes {
            id title availableForSale
            price { ...MoneyFragment }
            compareAtPrice { ...MoneyFragment }
            selectedOptions { name value }
          }
        }
        options { name values }
        seo { title description }
      }
    }
    ${IMAGE_FRAGMENT}
    ${MONEY_FRAGMENT}
  `;
  const data = await storefront<{ product: ShopifyProduct | null }>(query, { handle });
  return data.product;
}

export async function getCollections() {
  const query = `
    query GetCollections {
      collections(first: 20, sortKey: UPDATED_AT) {
        nodes {
          id handle title description
          image { ...ImageFragment }
        }
      }
    }
    ${IMAGE_FRAGMENT}
  `;
  const data = await storefront<{ collections: { nodes: ShopifyCollection[] } }>(query);
  return data.collections.nodes;
}

export async function getCollectionByHandle(handle: string, first = 12, cursor?: string) {
  const query = `
    query GetCollection($handle: String!, $first: Int!, $cursor: String) {
      collection(handle: $handle) {
        id handle title description
        image { ...ImageFragment }
        products(first: $first, after: $cursor, sortKey: BEST_SELLING) {
          pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
          nodes { ...ProductCard }
        }
      }
    }
    ${IMAGE_FRAGMENT}
    ${PRODUCT_CARD_FRAGMENT}
  `;
  const data = await storefront<{ collection: ShopifyCollection | null }>(query, {
    handle,
    first,
    cursor,
  });
  return data.collection;
}

export async function searchProducts(query: string, first = 12) {
  const gql = `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query, sortKey: RELEVANCE) {
        nodes { ...ProductCard }
      }
    }
    ${PRODUCT_CARD_FRAGMENT}
  `;
  const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(gql, {
    query,
    first,
  });
  return data.products.nodes;
}

// ─── Cart mutations ───────────────────────────────────────────────────────────

export async function createCart(): Promise<ShopifyCart> {
  const mutation = `
    mutation CartCreate {
      cartCreate {
        cart { ...CartFragment }
      }
    }
    ${CART_FRAGMENT}
  `;
  const data = await storefront<{ cartCreate: { cart: ShopifyCart } }>(mutation);
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const mutation = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
        userErrors { field message }
      }
    }
    ${CART_FRAGMENT}
  `;
  const data = await storefront<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>(mutation, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const mutation = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFragment }
      }
    }
    ${CART_FRAGMENT}
  `;
  const data = await storefront<{ cartLinesUpdate: { cart: ShopifyCart } }>(mutation, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const mutation = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFragment }
      }
    }
    ${CART_FRAGMENT}
  `;
  const data = await storefront<{ cartLinesRemove: { cart: ShopifyCart } }>(mutation, {
    cartId,
    lineIds,
  });
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFragment }
    }
    ${CART_FRAGMENT}
  `;
  const data = await storefront<{ cart: ShopifyCart | null }>(query, { cartId });
  return data.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMoney(money: ShopifyMoney): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: money.currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(money.amount));
}
