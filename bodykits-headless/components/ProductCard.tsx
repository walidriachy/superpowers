'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import type { ShopifyProduct } from '@/lib/shopify';
import { formatMoney } from '@/lib/shopify';

interface Props {
  product: ShopifyProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority }: Props) {
  const { addItem, loading } = useCart();

  const variant = product.variants.nodes[0];
  const compareAt = variant?.compareAtPrice;
  const isSale = compareAt && parseFloat(compareAt.amount) > parseFloat(product.priceRange.minVariantPrice.amount);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || !product.availableForSale) return;
    await addItem(variant.id);
  };

  return (
    <Link href={`/products/${product.handle}`} className="p-card">
      <div className="p-img">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        ) : (
          <div className="p-img__placeholder" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
        )}
        <div className="p-img-ov" aria-hidden="true" />
        <div className="p-glow" aria-hidden="true" />

        {isSale && <span className="p-badge">Sale</span>}
        {!product.availableForSale && (
          <span className="p-badge p-badge--out">Sold Out</span>
        )}
      </div>

      <div className="p-body">
        {product.vendor && <p className="p-cat">{product.vendor}</p>}
        <h3 className="p-name">{product.title}</h3>
        {product.description && <p className="p-desc">{product.description}</p>}

        <div className="p-foot">
          <div>
            <span className="p-price">{formatMoney(product.priceRange.minVariantPrice)}</span>
            {isSale && compareAt && (
              <span className="p-compare">{formatMoney(compareAt)}</span>
            )}
          </div>

          {product.availableForSale && variant ? (
            <button
              className="p-arrow"
              onClick={handleAddToCart}
              disabled={loading}
              aria-label={`Add ${product.title} to cart`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
              </svg>
            </button>
          ) : (
            <span className="p-unavailable">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
