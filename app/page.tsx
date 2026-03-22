import React from 'react';
import { ShoppingBag, MapPin, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function ConsumerStorefront() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Hero Section */}
      <header className="bg-green-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Waimanalo Greens</h1>
        <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
          Fresh, local Oahu harvest. Pre-order now for Saturday morning pickup in Kailua.
        </p>
      </header>

      {/* Logistics Banner */}
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

      {/* Product List */}
      <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Leaf className="mr-2 text-green-600" /> This Week's Harvest
        </h2>

        {/* Item 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Apple Bananas (Bunch)</h3>
            <p className="text-stone-500 mt-1">Grown in Waimanalo. Sweet and dense.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <span className="text-2xl font-bold text-stone-900">$6.00</span>
            <button className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Add to Box
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Taro / Kalo (1 lb)</h3>
            <p className="text-stone-500 mt-1">Freshly harvested. Perfect for poi or roasting.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <span className="text-2xl font-bold text-stone-900">$4.50</span>
            <button className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Add to Box
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Okinawan Sweet Potato (2 lb)</h3>
            <p className="text-stone-500 mt-1">Vibrant purple, naturally sweet, and nutrient-dense.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <span className="text-2xl font-bold text-stone-900">$7.50</span>
            <button className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Add to Box
            </button>
          </div>
        </div>

        {/* Item 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Local Cherry Tomatoes (Pint)</h3>
            <p className="text-stone-500 mt-1">Sun-ripened in Waimanalo. Bursting with flavor.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between">
            <span className="text-2xl font-bold text-stone-900">$5.00</span>
            <button className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Add to Box
            </button>
          </div>
        </div>

      </main>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-stone-500 text-sm font-medium">Your Box</p>
            <p className="text-2xl font-bold text-stone-900">$10.50</p>
          </div>
          <Link href="/checkout" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-sm transition-colors">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
