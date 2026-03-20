import React from 'react';
import { QrCode, CheckCircle, Package, MapPin } from 'lucide-react';

export default function ScannerKiosk() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-10">
        
        {/* Kiosk Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center bg-slate-800 rounded-full px-4 py-1.5 mb-4 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
            <span className="text-sm font-medium text-slate-300">Live Kiosk Mode</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Hub Scanner</h1>
          <p className="text-slate-400 flex items-center justify-center text-lg">
            <MapPin size={18} className="mr-2"/> Kailua Coffee Co.
          </p>
        </div>
        
        {/* Main Camera/Scanner Area */}
        <div className="bg-slate-800 p-12 rounded-[2.5rem] shadow-2xl border border-slate-700/50 aspect-square flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/50 transition-colors cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
          
          <div className="relative">
            {/* Simulated scan line */}
            <div className="absolute inset-x-0 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] top-1/2 -translate-y-1/2 animate-[ping_3s_ease-in-out_infinite]"></div>
            <QrCode size={120} className="text-blue-400 mb-8 opacity-90 group-hover:scale-105 transition-transform duration-500" />
          </div>

          <p className="text-2xl font-semibold text-slate-200">Tap to Scan</p>
          <p className="text-slate-400 mt-2">Point camera at customer's receipt</p>
        </div>

        {/* Live Inventory Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-green-400 mb-1">42</div>
            <div className="text-slate-400 text-sm flex items-center font-medium">
              <CheckCircle size={16} className="mr-1.5"/> Picked Up
            </div>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-amber-400 mb-1">18</div>
            <div className="text-slate-400 text-sm flex items-center font-medium">
              <Package size={16} className="mr-1.5"/> Remaining
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
