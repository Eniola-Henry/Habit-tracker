import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegistrar from '@/src/components/shared/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Build better habits, one day at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
