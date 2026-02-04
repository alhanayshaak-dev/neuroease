'use client';

import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainContent wrapper component that provides proper spacing for fixed header and navigation.
 * Ensures content is not hidden behind fixed elements and has proper padding.
 */
export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main
      className={`
        min-h-screen
        pt-16
        pb-16
        bg-neutral-950
        ${className}
      `}
    >
      <div className="w-full max-w-full px-4 py-6 sm:px-6 md:px-8 md:max-w-6xl md:mx-auto">
        {children}
      </div>
    </main>
  );
}
