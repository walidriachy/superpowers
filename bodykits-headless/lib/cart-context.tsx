'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ShopifyCart } from './shopify';
import { createCart, addToCart, updateCartLine, removeFromCart, getCart } from './shopify';

interface CartContextValue {
  cart: ShopifyCart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = 'bk_cart_id';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (stored) {
      getCart(stored).then((c) => {
        if (c) setCart(c);
        else localStorage.removeItem(CART_ID_KEY);
      });
    }
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cart) return cart.id;
    const newCart = await createCart();
    setCart(newCart);
    localStorage.setItem(CART_ID_KEY, newCart.id);
    return newCart.id;
  }, [cart]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true);
      try {
        const cartId = await ensureCart();
        const updated = await addToCart(cartId, variantId, quantity);
        setCart(updated);
        localStorage.setItem(CART_ID_KEY, updated.id);
        setCartOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [ensureCart]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setLoading(true);
      try {
        const updated = await updateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        const updated = await removeFromCart(cart.id, [lineId]);
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
