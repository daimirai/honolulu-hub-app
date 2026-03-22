'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, ArrowRight, Download, Share2, Leaf, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Future: Clear the local cart here since the order is complete
    localStorage.removeItem('hono-hub-cart');
  }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Success Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
          <div className="bg-green-800 p-10 text-white text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
               <Leaf className="absolute -top-4 -left-4" size={120} />
               <Leaf className="absolute -bottom-4 -right-4 rotate-180" size={120} />
            </div>
            <CheckCircle className="mx-auto mb-4 text-green-400" size={64} />
            <h1 className="text-3xl font-black italic">Saturday is Reserved!</h1>
            <p className="text-green-100 opacity-90 mt-2 text-lg">Your harvest box is being prepared in Waimanalo.</p>
          </div>

          <div className="p-8 space-y-8 text-center">
            {/* QR Ticket */}
            <div className="space-y-4">
              <div className="bg-stone-50 p-6 rounded-[2rem] inline-block border-2 border-dashed border-stone-200">
                <QRCodeSVG 
                  value={sessionId} 
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Order Ticket ID</p>
                <p className="text-sm font-mono text-stone-600">{sessionId}</p>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <MapPin className="text-blue-600 mb-2" size={20} />
                <p className="text-xs font-bold text-stone-400 uppercase">Location</p>
                <p className="text-sm font-bold text-stone-900">Kailua Coffee Co.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <Calendar className="text-amber-600 mb-2" size={20} />
                <p className="text-xs font-bold text-stone-400 uppercase">Time</p>
                <p className="text-sm font-bold text-stone-900">Sat, 8am - 11am</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-stone-800 transition-colors">
                <Download className="mr-2" size={20} /> Save to Phone
              </button>
              <button className="w-full bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-stone-200 transition-colors">
                <Share2 className="mr-2" size={20} /> Share Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <Link href="/" className="flex items-center justify-center text-stone-400 hover:text-stone-900 font-bold transition-colors">
          Back to Waimanalo Greens <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-green-700" size={48} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
