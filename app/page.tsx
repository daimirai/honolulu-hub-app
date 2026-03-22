'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Clock, Leaf, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function ConsumerStorefront() {
  const { products, cart, addToCart, removeFromCart, cartTotal, cartCount, loading } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-32">
      <header className="bg-green-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Waimanalo Greens</h1>
        <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
          Fresh, local Oahu harvest. Pre-order now for Saturday morning pickup in Kailua.
        </p>
      </header>

      <div className="max-w-4xl mx-auto -mt-8 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border border-stone-100">
          <div className="flex items-center text-stone-600">
            <Clock className="text-amber-500 mr-3" size={24} />
            <div>
              <p className="font-bold text-stone-900">Order Cutoff</p>
              <p className="text-sm">Thursday @ 8:00 PM</p>
            </div>
          </div>
          <div className="flex items-center text-stone-600">
            <MapPin className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="font-bold text-stone-900">Pickup Hub</p>
              <p className="text-sm">Kailua Coffee Co.</p>
            </div>
          </div>
          <div className="flex items-center text-stone-600">
            <ShoppingBag className="text-green-500 mr-3" size={24} />
            <div>
              <p className="font-bold text-stone-900">Pickup Time</p>
              <p className="text-sm">Saturday 8am - 11am</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Leaf className="mr-2 text-green-600" /> This Week's Harvest
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12 text-stone-500 italic">No items available for this cycle yet.</div>
        ) : products.map((product) => {
          const quantity = cart[product.id] || 0;
          return (
            <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-stone-500 mt-1">{product.description}</p>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-2xl font-bold text-stone-900">${(product.price || 0).toFixed(2)}</span>
                
                {quantity === 0 ? (
                  <button 
                    onClick={() => addToCart(product.id)}
                    className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
                  >
                    Add to Box
                  </button>
                ) : (
                  <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                    <button onClick={() => removeFromCart(product.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-stone-600">
                      <Minus size={20} />
                    </button>
                    <span className="px-4 font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => addToCart(product.id)} className="p-2 hover:bg-white rounded-lg transition-colors text-stone-600">
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-2xl mr-4 relative text-green-800">
                <ShoppingCart size={28} />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[12px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-stone-500 text-sm font-bold uppercase tracking-tight">Your Total</p>
                <p className="text-3xl font-black text-stone-900">${cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <Link href="/checkout" className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl shadow-green-200 transition-all flex items-center">
              Checkout <ShoppingCart className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
