'use client';

import React from 'react';

export function ProfessionalHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-8 px-6 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-8">
        {/* Brain Logo SVG */}
        <div className="flex-shrink-0">
          <svg
            width="120"
            height="120"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Brain outline */}
            <path
              d="M60 80 Q50 70 50 55 Q50 40 65 35 Q75 32 85 40 Q90 35 100 32 Q110 35 115 40 Q130 32 140 35 Q155 40 155 55 Q155 70 145 80"
              stroke="#06b6d4"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Brain folds */}
            <path
              d="M70 75 Q75 85 80 90"
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M100 70 Q100 85 100 95"
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M130 75 Q125 85 120 90"
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Circuit connections */}
            <line x1="65" y1="50" x2="75" y2="65" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="85" y1="45" x2="90" y2="60" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="100" y1="40" x2="100" y2="58" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="115" y1="45" x2="110" y2="60" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="135" y1="50" x2="125" y2="65" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Floating particles */}
            <circle cx="55" cy="35" r="2.5" fill="#06b6d4" opacity="0.8" />
            <circle cx="145" cy="40" r="2.5" fill="#06b6d4" opacity="0.8" />
            <circle cx="70" cy="25" r="1.5" fill="#06b6d4" opacity="0.6" />
            <circle cx="130" cy="28" r="1.5" fill="#06b6d4" opacity="0.6" />
            <circle cx="100" cy="20" r="2" fill="#06b6d4" opacity="0.7" />
            <circle cx="50" cy="70" r="1.5" fill="#06b6d4" opacity="0.5" />
            <circle cx="150" cy="75" r="1.5" fill="#06b6d4" opacity="0.5" />
            
            {/* Lower brain section */}
            <path
              d="M70 95 Q70 110 80 120 Q90 125 100 125 Q110 125 120 120 Q130 110 130 95"
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Additional circuit lines */}
            <line x1="80" y1="100" x2="85" y2="115" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <line x1="120" y1="100" x2="115" y2="115" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h1 className="text-5xl font-black text-cyan-400 tracking-wider mb-2" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}>
            NEUROEASE
          </h1>
          <p className="text-lg text-cyan-300 font-bold tracking-widest" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.2)' }}>
            EASE. ELEVATE. EMPOWER
          </p>
        </div>
      </div>
    </header>
  );
}
