import { Inter, Manrope } from 'next/font/google';

import { AuthProvider } from '@/contexts/auth-context';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { BackgroundGradient } from '@/components/ui/background-gradient';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Multi-Tenant Ticketing System',
  description: 'Enterprise support ticketing platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <BackgroundGradient />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
