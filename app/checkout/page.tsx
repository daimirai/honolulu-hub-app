'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, ArrowLeft, Leaf } from 'lucide-react';
import Link from 'next/link';
import { useCart, PRODUCTS } from '../lib/cart-context';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePayment = () => {
    setLoading(true);
    // Future: Integrate Stripe Elements or Checkout redirect here
    setTimeout(() => {
      alert("This will eventually redirect to Stripe for secure payment.");
      setLoading(false);
    }, 1000);
  };

  if (!isMounted) return <div className="min-h-screen bg-stone-50" />;

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    return { ...product, qty };
  }).filter(item => item.id);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Harvest
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl border border-stone-200 overflow-hidden">
          <div className="bg-green-800 p-8 text-white text-center">
            <Leaf className="mx-auto mb-2 opacity-50" size={32} />
            <h1 className="text-3xl font-bold">Secure Checkout</h1>
            <p className="text-green-100 opacity-80 mt-1">Review your Saturday morning box</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-stone-400">Order Summary</h2>
              <div className="divide-y divide-stone-100 border-t border-b border-stone-100 py-2">
                {cartItems.length > 0 ? cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-3">
                    <span>{item.name} <span className="text-stone-400 ml-2">x{item.qty}</span></span>
                    <span className="font-bold">${((item.price || 0) * item.qty).toFixed(2)}</span>
                  </div>
                )) : (
                  <div className="py-6 text-center text-stone-500 italic">
                    Your box is empty. Go back to the harvest list!
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-medium">Total due today</span>
                <span className="text-3xl font-black">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment CTA */}
            <div className="space-y-4 pt-4">
              <button 
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white py-4 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center"
              >
                {loading ? "Processing..." : (
                  <>
                    <CreditCard className="mr-3" /> Pay with Card
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center text-stone-400 text-sm gap-4">
                <span className="flex items-center"><ShieldCheck size={16} className="mr-1 text-green-600"/> Secure via Stripe</span>
                <span>•</span>
                <span>Cancel until Thu 8pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Reminder */}
        <div className="mt-8 text-center text-stone-500 text-sm">
          <p>Pickup is Saturday (8am-11am) @ Kailua Coffee Co.</p>
          <p className="mt-1 italic">Scan your receipt at the kiosk to collect your box.</p>
        </div>
      </div>
    </div>
  );
}
