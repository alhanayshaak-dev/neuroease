'use client';

import React from 'react';

export default function GuardianError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring service in production
    // logErrorToService(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Guardian Error</h1>
        <p className="text-gray-400 mb-8">An error occurred in the guardian section. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
