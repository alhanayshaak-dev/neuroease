import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { GuardianProvider } from '@/context/GuardianContext';

// Trigger fresh build - v2

export const metadata: Metadata = {
  title: 'NeuroFlow - Calm. Control. Independence.',
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
      <body className="bg-neutral-950 text-neutral-50 antialiased">
        <AccessibilityProvider>
          <GuardianProvider>
            <div className="min-h-screen">{children}</div>
          </GuardianProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
