'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
  cart: Record<string, number>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PRODUCTS = [
  { id: '1', name: 'Apple Bananas (Bunch)', price: 6.00 },
  { id: '2', name: 'Taro / Kalo (1 lb)', price: 4.50 },
  { id: '3', name: 'Okinawan Sweet Potato (2 lb)', price: 7.50 },
  { id: '4', name: 'Local Cherry Tomatoes (Pint)', price: 5.00 },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});

  // Persist cart to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hono-hub-cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hono-hub-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { PRODUCTS };
