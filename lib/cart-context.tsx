'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  available_quantity?: number;
  status?: string;
}

interface CartContextType {
  products: Product[];
  cart: Record<string, number>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  cartCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch real products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (data) setProducts(data);
      if (error) console.error('Error fetching products:', error);
      setLoading(false);
    }
    fetchProducts();
  }, []);

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
    const product = products.find(p => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ products, cart, addToCart, removeFromCart, cartTotal, cartCount, loading }}>
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
