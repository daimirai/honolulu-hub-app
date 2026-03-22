'use client';

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle, XCircle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HubScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

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
        scanner.clear(); // Stop scanning after success
      },
      (error) => {
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  const verifyTicket = async (ticketId: string) => {
    setIsVerifying(true);
    // Simulate Supabase verification delay
    setTimeout(() => {
      // For MVP Demo: Any ID starting with TEST- or DEMO- is valid
      const valid = ticketId.startsWith('TEST-') || ticketId.startsWith('DEMO-');
      setIsValid(valid);
      setIsVerifying(false);
    }, 1200);
  };

  const resetScanner = () => {
    window.location.reload(); // Simplest way to re-init the scanner library
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

        {/* Scanner Container */}
        <div className="relative aspect-square bg-black rounded-[2.5rem] border-4 border-stone-800 overflow-hidden shadow-2xl">
          {!scanResult && (
            <div id="reader" className="w-full h-full"></div>
          )}
          
          {/* Status Overlays */}
          {isVerifying && (
            <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
              <RefreshCw className="animate-spin text-indigo-400" size={48} />
              <p className="font-bold tracking-widest uppercase text-indigo-200">Verifying Ticket...</p>
            </div>
          )}

          {scanResult && !isVerifying && isValid === true && (
            <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
              <CheckCircle className="text-white" size={80} />
              <div className="text-center">
                <p className="font-black text-2xl uppercase italic">Valid Ticket</p>
                <p className="text-green-100 font-mono mt-1 text-sm">{scanResult}</p>
              </div>
              <button 
                onClick={resetScanner}
                className="mt-4 bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-stone-100 transition-all"
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
                <p className="text-red-100 mt-2 text-sm leading-relaxed">Ticket ID not found in database. Please check the customer's receipt.</p>
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

        {/* Info Panel */}
        <div className="bg-stone-800/50 rounded-2xl p-6 border border-stone-700/50">
          <div className="flex items-start space-x-4">
            <Camera className="text-stone-500 mt-1" size={24} />
            <div className="space-y-1">
              <p className="text-sm font-bold">Scanning Protocol</p>
              <ul className="text-xs text-stone-400 space-y-2 list-disc pl-4">
                <li>Center the QR code in the frame</li>
                <li>Ensure there is adequate morning lighting</li>
                <li>Wait for green "Valid" screen before releasing box</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
