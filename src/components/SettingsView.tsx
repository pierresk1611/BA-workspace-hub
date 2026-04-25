import { useState } from 'react';
import { Settings, Database, Trash2, Library, ShieldCheck, HardDrive, Info } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ClearDataModal } from './ClearDataModal';

export function SettingsView() {
  const { loadDemoData, clearAllData } = useProject();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 bg-slate-50 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
            <Settings className="w-8 h-8" />
          </div>
          Nastavenia
        </h1>
        <p className="text-slate-500 font-medium mt-2 text-lg">
          Správa vášho workspace, lokálnych dát a konfigurácie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile & General - Placeholder */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 opacity-60">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Profil & Zabezpečenie
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">Meno používateľa</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">peter</p>
              </div>
              <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-full">UPRAVIŤ</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900 leading-none">Heslo</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">••••••••••••</p>
              </div>
              <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-full">ZMENIŤ</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
            * Úprava profilu bude dostupná v ďalšej verzii. Aktuálne sú prihlasovacie údaje fixné.
          </p>
        </div>

        {/* Data Management */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-2">
            <Database className="w-4 h-4" /> Správa lokálnych dát
          </h3>
          
          <div className="space-y-4">
            <div className="p-5 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100/50 space-y-3">
              <div className="flex items-center gap-3 text-indigo-900">
                <Library className="w-5 h-5 text-indigo-600" />
                <h4 className="font-black text-sm uppercase tracking-tight">Demo Dáta</h4>
              </div>
              <p className="text-xs text-indigo-700/70 font-medium leading-relaxed">
                Potrebujete vidieť, ako BA HUB funguje s dátami? Načítajte 3 demo projekty so všetkými entitami.
              </p>
              <button 
                onClick={() => {
                  if (confirm('Naozaj chcete načítať demo dáta?')) {
                    loadDemoData();
                  }
                }}
                className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
              >
                Načítať demo dáta
              </button>
            </div>

            <div className="p-5 bg-rose-50/50 rounded-[1.5rem] border border-rose-100/50 space-y-3">
              <div className="flex items-center gap-3 text-rose-900">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <h4 className="font-black text-sm uppercase tracking-tight text-rose-700">Vymazať dáta</h4>
              </div>
              <p className="text-xs text-rose-700/70 font-medium leading-relaxed">
                Chcete vyčistiť svoj workspace a začať nanovo? Táto akcia vymaže všetko z localStorage.
              </p>
              <button 
                onClick={() => setIsClearModalOpen(true)}
                className="w-full py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
              >
                Vymazať všetky lokálne dáta
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Info Section */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
           <div className="p-5 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/10">
             <HardDrive className="w-8 h-8 text-indigo-300" />
           </div>
           <div>
             <h3 className="text-lg font-black text-white flex items-center gap-2">
               Local Storage Persistence <Info className="w-4 h-4 text-slate-500" />
             </h3>
             <p className="text-slate-400 text-sm font-medium mt-2 max-w-2xl leading-relaxed">
               Vaše dáta sú uložené výhradne vo vašom prehliadači. Neposielame ich na žiaden server. 
               To znamená, že sú súkromné, ale ak vymažete cache prehliadača alebo použijete iné zariadenie, neuvidíte ich.
               Odporúčame používať funkciu Export pre zálohovanie dôležitých špecifikácií.
             </p>
           </div>
         </div>
      </div>

      <ClearDataModal 
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearAllData}
      />
    </div>
  );
}
