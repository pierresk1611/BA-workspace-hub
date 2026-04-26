import React, { useState, useRef } from 'react';
import { 
  Download, Upload, Trash2, Database, 
  FileJson, AlertTriangle, CheckCircle2, X 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useProject } from '../../context/ProjectContext';

export function DataTab() {
  const { exportData, importData } = useSettings();
  const { clearAllData } = useProject();
  const [importPreview, setImportPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setImportPreview(json);
        setError(null);
      } catch (err) {
        setError("Neplatný formát JSON súboru.");
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importPreview) return;
    const result = await importData(JSON.stringify(importPreview));
    if (result.ok) {
      window.location.reload(); // Reload to apply all imported context
    } else {
      setError(result.error || "Chyba pri importe.");
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Warning Box */}
      <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest">Bezpečnosť lokálnych dát</h4>
          <p className="text-xs text-rose-700/80 font-medium leading-relaxed">
            Dáta sú uložené v <strong>localStorage</strong> vášho prehliadača. Toto úložisko nie je šifrované 
            a je viazané na tento prehliadač a doménu. Nevkladajte do aplikácie citlivé produkčné heslá ani tajomstvá.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Export Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Download className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Exportovať workspace</h3>
              <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">
                Stiahne všetky projekty, požiadavky, používateľov a nastavenia ako jeden JSON súbor. Slúži ako záloha.
              </p>
            </div>
          </div>
          <button 
            onClick={exportData}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <FileJson className="w-4 h-4" /> Exportovať JSON
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Importovať workspace</h3>
              <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">
                Nahrajte JSON export a obnovte dáta. Pozor: Táto akcia prepíše aktuálne nastavenia a používateľov.
              </p>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
          >
            <Upload className="w-4 h-4" /> Nahrať Súbor
          </button>
        </div>
      </div>

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Náhľad importu</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Skontrolujte dáta pred nahraním</p>
              </div>
              <button onClick={() => setImportPreview(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Projekty</p>
                  <p className="text-xl font-black text-slate-900">{importPreview.projects?.length || 0}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Používatelia</p>
                  <p className="text-xl font-black text-slate-900">{importPreview.users?.length || 0}</p>
                </div>
              </div>
              
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                  Potvrdením sa prepíšu všetky aktuálne dáta v tomto workspace. Odporúčame si najprv spraviť vlastný export.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setImportPreview(null)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Zrušiť
              </button>
              <button 
                onClick={handleImport}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100"
              >
                Potvrdiť Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-rose-100 shadow-sm space-y-6">
         <div className="flex items-center gap-4 text-rose-600">
           <Trash2 className="w-6 h-6" />
           <h3 className="text-xl font-black tracking-tight uppercase tracking-widest">Nebezpečná zóna</h3>
         </div>
         <p className="text-slate-500 text-xs font-medium max-w-2xl leading-relaxed">
           Kliknutím na tlačidlo nižšie vymažete všetky lokálne dáta projektu, používateľov a nastavenia. 
           Táto akcia je nevratná a workspace sa vráti do čistého stavu.
         </p>
         <button 
            onClick={() => {
              if (confirm("Naozaj chcete vymazať VŠETKY dáta? Táto akcia je nevratná.")) {
                clearAllData();
                window.location.reload();
              }
            }}
            className="px-8 py-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 shadow-sm"
         >
           Vymazať Všetky Lokálne Dáta
         </button>
      </div>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 bg-rose-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 z-[200] animate-in slide-in-from-bottom-8">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs font-bold">{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg ml-2"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
