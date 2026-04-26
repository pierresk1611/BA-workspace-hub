import React, { useState, useEffect } from 'react';
import { 
  Settings, Wifi, WifiOff, Smartphone, CheckCircle2, 
  Download, Info, ShieldCheck, Database, Library, 
  Trash2, HardDrive 
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { LoadDemoModal } from './LoadDemoModal';
import { ClearDataModal } from './ClearDataModal';
import { cn } from '../lib/utils';

export function SettingsView() {
  const { projects, loadDemoData, clearAllData } = useProject();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-slate-900 rounded-xl md:rounded-2xl text-white shadow-xl">
              <Settings className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Nastavenia
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 md:mt-2 max-w-2xl hidden sm:block">
            Správa vášho workspace, lokálnych dát a konfigurácie.
          </p>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
          isOnline ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
        )}>
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOnline ? 'Online' : 'Offline Mode'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-12">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-12 pb-12">
          
          {/* PWA Section */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -right-12 -bottom-12 w-48 h-48 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl" />
             <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-between">
               <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center text-center md:text-left">
                 <div className="p-4 md:p-6 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-xl mx-auto md:mx-0">
                   <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-indigo-100" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Mobilná Aplikácia</h3>
                   <p className="text-indigo-100 text-[11px] md:text-sm font-medium max-w-md leading-relaxed">
                     Nainštalujte si BA HUB na svoju plochu pre rýchlejší prístup a plnohodnotný mobilný zážitok.
                   </p>
                 </div>
               </div>

               <div className="w-full lg:w-auto shrink-0">
                 {isInstalled ? (
                   <div className="flex flex-col items-center gap-3">
                     <div className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       <span className="text-xs md:text-sm font-black uppercase tracking-widest">Aplikácia nainštalovaná</span>
                     </div>
                     <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest text-center">Spustite z domovskej obrazovky</p>
                   </div>
                 ) : deferredPrompt ? (
                   <button 
                    onClick={handleInstallClick}
                    className="w-full lg:w-auto px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                     <Download className="w-5 h-5" /> Inštalovať Teraz
                   </button>
                 ) : (
                   <div className="px-6 py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm opacity-60">
                     <Info className="w-5 h-5" />
                     <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Browser-managed PWA</span>
                   </div>
                 )}
               </div>
             </div>

             <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
               {[
                 { label: 'Offline Prístup', desc: 'Funguje aj bez internetu' },
                 { label: 'Rýchly Štart', desc: 'Ikonka priamo na ploche' },
                 { label: 'Native Feel', desc: 'Bez adresného riadku' }
               ].map(benefit => (
                 <div key={benefit.label} className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">{benefit.label}</p>
                   <p className="text-[9px] md:text-[10px] font-medium text-indigo-200">{benefit.desc}</p>
                 </div>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            
            {/* Profile & General */}
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4 md:space-y-6 opacity-60">
              <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> Profil & Zabezpečenie
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] md:text-sm font-black text-slate-900 leading-none">Meno</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest truncate max-w-[100px] sm:max-w-none">peter</p>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black bg-slate-200 text-slate-500 px-2 md:px-3 py-1 rounded-full shrink-0">UPRAVIŤ</span>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] md:text-sm font-black text-slate-900 leading-none">Heslo</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest truncate max-w-[100px] sm:max-w-none">••••••••••••</p>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black bg-slate-200 text-slate-500 px-2 md:px-3 py-1 rounded-full shrink-0">ZMENIŤ</span>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6 md:space-y-8">
              <h3 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
                <Database className="w-3.5 h-3.5 md:w-4 md:h-4" /> Správa lokálnych dát
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 md:p-5 bg-indigo-50/50 rounded-xl md:rounded-[1.5rem] border border-indigo-100/50 space-y-3">
                  <div className="flex items-center gap-2 md:gap-3 text-indigo-900">
                    <Library className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                    <h4 className="font-black text-xs md:text-sm uppercase tracking-tight">Demo Dáta</h4>
                  </div>
                  <p className="text-[10px] md:text-xs text-indigo-700/70 font-medium leading-relaxed">
                    Načítajte demo projekty so všetkými entitami pre testovanie.
                  </p>
                  <button 
                    onClick={() => setIsDemoModalOpen(true)}
                    className="w-full py-2.5 md:py-3 bg-white border border-indigo-200 text-indigo-600 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
                  >
                    Načítať
                  </button>
                </div>

                <div className="p-4 md:p-5 bg-rose-50/50 rounded-xl md:rounded-[1.5rem] border border-rose-100/50 space-y-3">
                  <div className="flex items-center gap-2 md:gap-3 text-rose-900">
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                    <h4 className="font-black text-xs md:text-sm uppercase tracking-tight text-rose-700">Vymazať</h4>
                  </div>
                  <p className="text-[10px] md:text-xs text-rose-700/70 font-medium leading-relaxed">
                    Táto akcia vymaže všetko z lokálneho úložiska prehliadača.
                  </p>
                  <button 
                    onClick={() => setIsClearModalOpen(true)}
                    className="w-full py-2.5 md:py-3 bg-white border border-rose-200 text-rose-600 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
                  >
                    Vymazať
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-slate-900 rounded-2xl md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -right-12 -bottom-12 w-32 h-32 md:w-64 md:h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
             <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
               <div className="p-4 md:p-5 bg-white/10 rounded-xl md:rounded-[1.5rem] backdrop-blur-md border border-white/10 shrink-0">
                 <HardDrive className="w-6 h-6 md:w-8 md:h-8 text-indigo-300" />
               </div>
               <div>
                 <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                   Local Persistence <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
                 </h3>
                 <p className="text-slate-400 text-[11px] md:text-sm font-medium mt-1 md:mt-2 max-w-2xl leading-relaxed">
                   Dáta sú uložené výhradne vo vašom prehliadači. Sú súkromné a neopúšťajú vaše zariadenie. 
                   Odporúčame používať funkciu Export pre zálohovanie.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>

      <ClearDataModal 
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearAllData}
      />

      <LoadDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        onConfirm={loadDemoData}
        hasExistingProjects={projects.length > 0}
      />
    </div>
  );
}
