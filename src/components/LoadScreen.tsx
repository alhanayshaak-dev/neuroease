'use client';

import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface LoadScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function LoadScreen({ isVisible, onComplete }: LoadScreenProps) {
  const [progress, setProgress] = useState(0);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 30;
        if (next >= 100) {
          clearInterval(interval);
          setShouldFadeOut(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        shouldFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          {/* Brain Icon with Neon Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain
              className="w-20 h-20 text-primary-400 drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
              }}
            />
          </div>

          {/* Animated Glow Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-primary-400 animate-pulse"
            style={{
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            }}
          />
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-400 mb-2">NeuroFlow</h1>
          <p className="text-neutral-400 text-sm">by NeuroEase</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-neutral-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-300 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-neutral-500 text-sm">
        {progress < 30
          ? 'Initializing...'
          : progress < 60
            ? 'Loading your data...'
            : progress < 90
              ? 'Preparing dashboard...'
              : 'Almost ready...'}
      </p>
    </div>
  );
}
