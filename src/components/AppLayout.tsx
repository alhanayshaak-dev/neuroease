'use client';

import React from 'react';
import { Header, type HeaderProps } from './Header';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';

interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: Partial<HeaderProps>;
  mainContentClassName?: string;
}

/**
 * AppLayout component that combines Header, Navigation, and MainContent.
 * Provides the complete layout structure for all pages in the app.
 */
export function AppLayout({
  children,
  headerProps = {},
  mainContentClassName = '',
}: AppLayoutProps) {
  return (
    <>
      <Header {...headerProps} />
      <Navigation />
      <MainContent className={mainContentClassName}>{children}</MainContent>
    </>
  );
}
