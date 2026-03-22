'use client';

import React, { useEffect, useState } from 'react';
import { Package, Users, CheckCircle2, Clock, ArrowLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminCycleView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          products (name)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(filter.toLowerCase()) || 
    (o.customer_email && o.customer_email.toLowerCase().includes(filter.toLowerCase()))
  );

  const stats = {
    total: orders.length,
    pickedUp: orders.filter(o => o.status === 'picked_up').length,
    pending: orders.filter(o => o.status === 'paid').length
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/" className="text-stone-500 hover:text-stone-900 flex items-center mb-2 transition-colors text-sm font-bold uppercase tracking-wider">
              <ArrowLeft size={16} className="mr-2" /> Back to Storefront
            </Link>
            <h1 className="text-4xl font-black italic tracking-tight flex items-center">
              <Package className="mr-3 text-indigo-600" size={36} />
              Logistics: Kailua Hub
            </h1>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 bg-white px-4 py-3 rounded-2xl shadow-sm border border-stone-200 flex items-center">
              <Search className="text-stone-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search Ticket ID or Email..." 
                className="bg-transparent border-none outline-none w-full text-sm font-medium"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchOrders}
              className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <Clock size={20} className="text-stone-600" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total Boxes Expected</p>
            <h2 className="text-5xl font-black italic">{stats.total}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1 text-green-600">Successfully Picked Up</p>
            <h2 className="text-5xl font-black italic text-stone-900">{stats.pickedUp}</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1 text-amber-600">Pending Saturday Morning</p>
            <h2 className="text-5xl font-black italic text-stone-900">{stats.pending}</h2>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-stone-100">
                  <th className="p-8">Ticket ID</th>
                  <th className="p-8">Customer</th>
                  <th className="p-8">Box Contents</th>
                  <th className="p-8">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-stone-400 italic font-medium">No orders found matching your search.</td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="p-8 font-mono text-xs text-stone-500 group-hover:text-indigo-600 transition-colors">
                      {order.id.split('-')[0].toUpperCase()}...{order.id.slice(-4).toUpperCase()}
                    </td>
                    <td className="p-8">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-xs">
                          {order.customer_email?.[0].toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900">{order.customer_email || 'Demo Customer'}</p>
                          <p className="text-[10px] text-stone-400 font-medium">Order: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-1">
                        {order.order_items.map((item: any, i: number) => (
                          <div key={i} className="text-xs font-bold text-stone-600 flex items-center">
                            <span className="w-4 h-4 bg-stone-100 rounded flex items-center justify-center mr-2 text-[10px]">{item.quantity}</span>
                            {item.products.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-8">
                      {order.status === 'picked_up' ? (
                        <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={12} className="mr-1" /> Picked Up
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                      )}
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
