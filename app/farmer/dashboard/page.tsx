'use client';

import React, { useState } from 'react';
import { PlusCircle, Calendar, DollarSign, Sprout, ArrowRight, Save, X } from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  price: string;
  available: number;
  status: 'Active' | 'Sold Out';
}

const INITIAL_CROPS: Crop[] = [
  { id: '1', name: 'Apple Bananas (Bunch)', price: '$6.00', available: 40, status: 'Active' },
  { id: '2', name: 'Taro / Kalo (lb)', price: '$4.50', available: 100, status: 'Active' },
  { id: '3', name: 'Okinawan Sweet Potato (2 lb)', price: '$7.50', available: 50, status: 'Active' },
  { id: '4', name: 'Cherry Tomatoes (Pint)', price: '$5.00', available: 30, status: 'Active' },
  { id: '5', name: 'Aquaponic Butter Lettuce', price: '$3.00', available: 0, status: 'Sold Out' },
];

export default function FarmerDashboard() {
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [isEditing, setIsEditing] = useState(false);

  const handleConnectStripe = async () => {
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateInventory = (id: string, field: keyof Crop, value: string | number) => {
    setCrops(prev => prev.map(crop => {
      if (crop.id === id) {
        const updated = { ...crop, [field]: value };
        // Auto-update status based on availability
        if (field === 'available') {
          updated.status = Number(value) > 0 ? 'Active' : 'Sold Out';
        }
        return updated;
      }
      return crop;
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Stripe CTA */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 flex items-center">
              <Sprout className="text-green-600 mr-3" size={32} />
              Waimanalo Greens
            </h1>
            <p className="text-stone-500 mt-1">Honolulu Drop Cycle: Active</p>
          </div>
          <button 
            onClick={handleConnectStripe}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center"
          >
            Connect Bank Account <ArrowRight size={18} className="ml-2" />
          </button>
        </header>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 mb-2 flex items-center font-medium">
              <DollarSign size={18} className="mr-2 text-green-600"/> Pending Payout
            </div>
            <div className="text-4xl font-bold text-stone-900">$427.50</div>
            <div className="text-sm text-green-600 mt-2">Will auto-transfer Sunday</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 mb-2 flex items-center font-medium">
              <Calendar size={18} className="mr-2 text-blue-600"/> Next Drop (Kailua)
            </div>
            <div className="text-4xl font-bold text-stone-900">Sat, 8am</div>
            <div className="text-sm text-stone-500 mt-2">Orders close Thu 8pm</div>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h2 className="text-xl font-bold text-stone-800">Weekly Harvest List</h2>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-stone-700 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
                  >
                    <Save size={18} className="mr-2"/> Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
                  >
                    <X size={18} className="mr-2"/> Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
                >
                  <PlusCircle size={18} className="mr-2"/> Manage Inventory
                </button>
              )}
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-stone-500 text-sm uppercase tracking-wider border-b border-stone-100 bg-white">
                  <th className="p-6 font-medium">Product</th>
                  <th className="p-6 font-medium">Bulk Price</th>
                  <th className="p-6 font-medium">Available</th>
                  <th className="p-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-6 font-medium text-stone-900">{crop.name}</td>
                    <td className="p-6 text-stone-600">{crop.price}</td>
                    <td className="p-6 text-stone-600">
                      {isEditing ? (
                        <input 
                          type="number"
                          value={crop.available}
                          onChange={(e) => updateInventory(crop.id, 'available', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-stone-200 rounded bg-white text-stone-900"
                        />
                      ) : (
                        crop.available
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`${
                        crop.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                      } px-3 py-1 rounded-full text-sm font-medium`}>
                        {crop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
