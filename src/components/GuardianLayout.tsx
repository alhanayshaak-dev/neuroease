'use client';

import React, { ReactNode } from 'react';
import { GuardianNav } from './GuardianNav';

interface GuardianLayoutProps {
  children: ReactNode;
}

export function GuardianLayout({ children }: GuardianLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Professional Minimal Header */}
      <header className="w-full bg-gradient-to-b from-slate-950 to-black border-b border-cyan-500/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#000" />
                <circle cx="12" cy="12" r="3" fill="#000" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">NeuroEase</h1>
              <p className="text-xs text-cyan-400 font-medium">Ease. Elevate. Empower</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-cyan-400 transition-colors" type="button" aria-label="Immersive Reader">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 px-4">{children}</main>
      <GuardianNav />
    </div>
  );
}
