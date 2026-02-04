'use client';

import React from 'react';
import { useGuardianContext } from '@/context/GuardianContext';
import { LogOut, Settings } from 'lucide-react';

export function GuardianHeader() {
  const { session, logout } = useGuardianContext();

  return (
    <header className="fixed top-0 left-0 right-0 bg-black z-50 no-print">
      <div className="px-6 py-4 flex items-center justify-between max-w-full">
        {/* Left: App Name Only */}
        <div>
          <h1 className="text-cyan-400 font-bold text-2xl tracking-wider">NeuroEase</h1>
          <p className="text-cyan-300 text-xs font-semibold tracking-widest">EASE • ELEVATE • EMPOWER</p>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Settings Icon */}
          <button 
            type="button" 
            className="p-2 hover:bg-cyan-900/20 rounded-lg transition-colors" 
            aria-label="Settings"
          >
            <Settings size={24} className="text-cyan-400" />
          </button>
          
          {/* Logout Button */}
          {session && (
            <button 
              type="button"
              onClick={logout}
              className="p-2 hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut size={24} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
