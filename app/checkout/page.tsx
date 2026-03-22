'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, ArrowLeft, Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const { products, cart, cartTotal, loading } = useCart();
  const [paying, setPaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePayment = () => {
    setPaying(true);
    // Simulate payment processing delay
    setTimeout(() => {
      // In development/test mode, we redirect directly to success with a mock session ID
      const mockSessionId = 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      router.push(`/checkout/success?session_id=${mockSessionId}`);
    }, 1500);
  };

  if (!isMounted || loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
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
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-stone-400">Order Summary</h2>
              <div className="divide-y divide-stone-100 border-t border-b border-stone-100 py-2">
                {cartItems.length > 0 ? cartItems.map((item: any) => (
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

            <div className="space-y-4 pt-4">
              <button 
                onClick={handlePayment}
                disabled={paying || cartItems.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white py-4 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center"
              >
                {paying ? "Finalizing Order..." : (
                  <>
                    <CreditCard className="mr-3" /> Complete Order (Test)
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center text-stone-400 text-sm gap-4">
                <span className="flex items-center"><ShieldCheck size={16} className="mr-1 text-green-600"/> Secure Checkout</span>
                <span>•</span>
                <span>Cancel until Thu 8pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
