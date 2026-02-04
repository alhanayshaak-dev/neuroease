import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { GuardianProvider } from '@/context/GuardianContext';

export const metadata: Metadata = {
  title: 'NeuroEase - Ease. Elevate. Empower.',
  description: 'Real-time sensory overload detection and management for autistic individuals',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-neutral-50 antialiased">
        <AccessibilityProvider>
          <GuardianProvider>
            {children}
          </GuardianProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
