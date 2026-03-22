'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DiagnosticResult {
  status: 'loading' | 'success' | 'error';
  message: string;
}

interface ResultsState {
  env: DiagnosticResult;
  database: DiagnosticResult;
  auth: DiagnosticResult;
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<ResultsState>({
    env: { status: 'loading', message: '' },
    database: { status: 'loading', message: '' },
    auth: { status: 'loading', message: '' }
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // 1. Check Env Vars
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder-key');
    
    setResults(prev => ({
      ...prev,
      env: { 
        status: hasUrl && hasKey ? 'success' : 'error',
        message: hasUrl && hasKey ? 'Environment variables detected correctly.' : 'Missing or Placeholder Supabase keys found.'
      }
    }));

    // 2. Check Database Connectivity
    try {
      const { error } = await supabase.from('products').select('id', { count: 'exact', head: true });
      if (error) throw error;
      setResults(prev => ({
        ...prev,
        database: { status: 'success', message: `Connected to Supabase. Table 'products' is reachable.` }
      }));
    } catch (err: any) {
      setResults(prev => ({
        ...prev,
        database: { status: 'error', message: `Database fail: ${err.message || 'Check RLS or URL'}` }
      }));
    }

    // 3. Check Auth/Session
    try {
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
      setResults(prev => ({
        ...prev,
        auth: { status: 'success', message: 'Auth system initialized.' }
      }));
    } catch (err: any) {
      setResults(prev => ({
        ...prev,
        auth: { status: 'error', message: `Auth fail: ${err.message}` }
      }));
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'loading') return <Activity className="animate-spin text-stone-400" />;
    if (status === 'success') return <CheckCircle2 className="text-green-500" />;
    return <AlertTriangle className="text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black italic flex items-center">
            <Shield className="mr-3 text-indigo-500" size={32} />
            System Diagnostics
          </h1>
          <p className="text-stone-400 mt-2">Checking connectivity for Honolulu Hub MVP</p>
        </header>

        <div className="grid gap-4">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="bg-stone-800 p-6 rounded-2xl border border-stone-700 flex items-start gap-4">
              <div className="mt-1"><StatusIcon status={value.status} /></div>
              <div className="flex-1">
                <h2 className="font-bold uppercase text-xs tracking-widest text-stone-400 mb-1">{key}</h2>
                <p className={value.status === 'error' ? 'text-red-400' : 'text-stone-100'}>{value.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl">
          <h3 className="font-bold text-indigo-300 mb-2">Technical Info for Echo 📡</h3>
          <p className="text-xs text-indigo-200/70 leading-relaxed font-mono overflow-x-auto">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}<br/>
            Public Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present (Hidden)' : 'Missing'}
          </p>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-stone-100 text-stone-900 py-4 rounded-xl font-bold hover:bg-white transition-colors"
        >
          Re-run Tests
        </button>
      </div>
    </div>
  );
}
