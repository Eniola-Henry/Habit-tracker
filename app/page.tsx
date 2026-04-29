'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/src/components/shared/SplashScreen';
import { getSession } from '@/src/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Keep splash visible for 1200ms (within the 800-2000ms window)
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
