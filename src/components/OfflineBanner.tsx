import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white px-4 py-2 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
      <WifiOff className="w-4 h-4" />
      <span className="text-xs font-black uppercase tracking-[0.2em]">Si offline. Zobrazujú sa lokálne uložené dáta.</span>
    </div>
  );
}
