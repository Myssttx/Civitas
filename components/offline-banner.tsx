'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="border-b bg-yellow-500/10 px-4 py-2">
      <div className="container mx-auto flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
        <AlertCircle className="h-4 w-4" />
        <span>You are offline. Some features may be unavailable.</span>
      </div>
    </div>
  );
}

