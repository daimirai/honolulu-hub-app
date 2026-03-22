'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HubScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        verifyTicket(decodedText);
        scanner.clear();
      },
      (error) => {
        // Optional: Handle specific camera errors for better UX
        if (error?.includes("NotFoundError") || error?.includes("NotAllowedError")) {
          console.error("Camera access denied or not found");
        }
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  const verifyTicket = async (ticketId: string) => {
    setIsVerifying(true);
    try {
      // 1. Check database for order
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            products (name)
          )
        `)
        .eq('id', ticketId)
        .single();

      if (error || !data) {
        setIsValid(false);
      } else if (data.status === 'picked_up') {
        setIsValid(false); // Already picked up
        alert("This order was already picked up!");
      } else {
        setOrderData(data);
        // 2. Mark as Picked Up instantly
        await supabase
          .from('orders')
          .update({ status: 'picked_up' })
          .eq('id', ticketId);
        
        setIsValid(true);
      }
    } catch (err) {
      setIsValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetScanner = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-stone-900 font-sans text-stone-100 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <Link href="/" className="text-stone-400 hover:text-white flex items-center transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Exit
          </Link>
          <div className="flex items-center text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Shield size={16} className="mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Hub Staff Only</span>
          </div>
        </div>

        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black italic tracking-tight">Kailua Pickup Hub</h1>
          <p className="text-stone-400">Scan customer QR ticket to verify order</p>
        </header>

        <div className="relative aspect-square bg-black rounded-[2.5rem] border-4 border-stone-800 overflow-hidden shadow-2xl">
          {!scanResult && (
            <div id="reader" className="w-full h-full"></div>
          )}
          
          {isVerifying && (
            <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
              <RefreshCw className="animate-spin text-indigo-400" size={48} />
              <p className="font-bold tracking-widest uppercase text-indigo-200">Verifying Ticket...</p>
            </div>
          )}

          {scanResult && !isVerifying && isValid === true && (
            <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300 p-6 overflow-y-auto">
              <CheckCircle className="text-white" size={64} />
              <div className="text-center">
                <p className="font-black text-2xl uppercase italic">Valid Ticket</p>
                <p className="text-green-100 font-mono text-xs opacity-70 mb-4">{scanResult}</p>
              </div>
              
              {/* Order Contents for Staff */}
              <div className="w-full bg-white/10 rounded-xl p-4 text-left space-y-2">
                <p className="text-[10px] font-bold uppercase text-green-200">Box Contents:</p>
                {orderData?.order_items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm font-bold">
                    <span>{item.products.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={resetScanner}
                className="w-full bg-white text-green-700 py-3 rounded-xl font-bold hover:bg-stone-100 transition-all mt-4"
              >
                Next Customer
              </button>
            </div>
          )}

          {scanResult && !isVerifying && isValid === false && (
            <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
              <XCircle className="text-white" size={80} />
              <div className="text-center px-6">
                <p className="font-black text-2xl uppercase italic">Invalid Ticket</p>
                <p className="text-red-100 mt-2 text-sm leading-relaxed">Ticket ID not found or already scanned.</p>
              </div>
              <button 
                onClick={resetScanner}
                className="mt-4 bg-white text-red-700 px-8 py-3 rounded-xl font-bold hover:bg-stone-100 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="bg-stone-800/50 rounded-2xl p-6 border border-stone-700/50">
          <div className="flex items-start space-x-4">
            <Camera className="text-stone-500 mt-1" size={24} />
            <div className="space-y-1">
              <p className="text-sm font-bold">Scanning Protocol</p>
              <ul className="text-xs text-stone-400 space-y-2 list-disc pl-4">
                <li>Wait for green "Valid" screen before releasing box</li>
                <li>The list above shows exactly what to put in the bag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
