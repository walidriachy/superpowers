'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatMoney } from '@/lib/shopify';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateItem, removeItem, loading } = useCart();

  const lines = cart?.lines.nodes ?? [];

  return (
    <>
      <div
        className={`cart-overlay ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
        aria-hidden
      />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer__head">
          <span className="cart-drawer__title">
            Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}
          </span>
          <button
            className="cart-drawer__close"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer__body">
          {lines.length === 0 ? (
            <div className="cart-drawer__empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your cart is empty</p>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            lines.map((line) => {
              const { product } = line.merchandise;
              const variant = line.merchandise.title !== 'Default Title' ? line.merchandise.title : null;
              return (
                <div key={line.id} className="cart-item">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      width={72}
                      height={72}
                      className="cart-item__img"
                    />
                  ) : (
                    <div className="cart-item__img" style={{ background: '#1a1a1a' }} />
                  )}

                  <div>
                    <Link href={`/products/${product.handle}`} onClick={() => setCartOpen(false)}>
                      <p className="cart-item__title">{product.title}</p>
                    </Link>
                    {variant && <p className="cart-item__variant">{variant}</p>}
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateItem(line.id, line.quantity - 1)}
                        disabled={loading || line.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-item__qty-num">{line.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        disabled={loading}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>

                  <span className="cart-item__price">
                    {formatMoney(line.cost.totalAmount)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {lines.length > 0 && cart && (
          <div className="cart-drawer__foot">
            <div className="cart-drawer__total">
              <span>Subtotal</span>
              <span>{formatMoney(cart.cost.subtotalAmount)}</span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="cart-drawer__checkout"
              rel="noopener"
            >
              Proceed to Checkout →
            </a>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', marginTop: 10 }}>
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
