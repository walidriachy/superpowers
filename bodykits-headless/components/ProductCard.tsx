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
    if (!variant || !product.availableForSale) return;
    await addItem(variant.id);
  };

  return (
    <Link href={`/products/${product.handle}`} className="product-card">
      <div className="product-card__img-wrap">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="product-card__img"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              opacity: .3,
            }}
          >
            🚗
          </div>
        )}

        {isSale && (
          <span className="product-card__badge badge badge--sale">SALE</span>
        )}
        {!product.availableForSale && (
          <span
            className="product-card__badge badge"
            style={{ color: 'rgba(255,255,255,.5)', borderColor: 'rgba(255,255,255,.15)', background: 'rgba(0,0,0,.6)' }}
          >
            Sold Out
          </span>
        )}
      </div>

      <div className="product-card__body">
        {product.vendor && (
          <p className="product-card__vendor">{product.vendor}</p>
        )}
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">
            {formatMoney(product.priceRange.minVariantPrice)}
          </span>
          {isSale && compareAt && (
            <span className="product-card__compare">
              {formatMoney(compareAt)}
            </span>
          )}
        </div>
        {!product.availableForSale && (
          <p className="product-card__unavailable">Out of stock</p>
        )}
      </div>

      {product.availableForSale && variant && (
        <button
          className="product-card__atc"
          onClick={handleAddToCart}
          disabled={loading}
          aria-label={`Add ${product.title} to cart`}
        >
          +
        </button>
      )}
    </Link>
  );
}
