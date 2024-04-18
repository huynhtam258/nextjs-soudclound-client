import * as React from 'react';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import AppHeader from '@/components/header/app.header';
import AppFooter from '@/components/footer/app.footer';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SoundCloud',
  description: 'SoundCloud Description'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
        {children}
        <div style={{ marginBottom: '100px' }}></div>
      <AppFooter />
    </>
  );
}
