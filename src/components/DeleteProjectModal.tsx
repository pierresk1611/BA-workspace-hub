import { useState } from 'react';
import { X, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName }: DeleteProjectModalProps) {
  const [confirmName, setConfirmName] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const isMatched = confirmName === projectName;
  const canDelete = isMatched && confirmed;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
      onClose();
    }
  };

  const entitiesToDelete = [
    'Projekt a jeho nastavenia',
    'Prepojené systémy',
    'Confluence & Jira zdroje',
    'Kafka / dátové toky',
    'SQL queries & výsledky',
    'Asana tasky & deadliny',
    'Požiadavky & Rozhodnutia',
    'Otázky & Riziká',
    'Komunikácia & Meetingy',
    'Exportné záznamy'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-rose-100 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-rose-50 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Vymazať projekt</h2>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1 italic">Destructive Action</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs font-black text-rose-900 uppercase tracking-tight">Kritické Varovanie</p>
              <p className="text-xs font-medium text-rose-800 leading-relaxed">
                Vymazanie odstráni projekt z tohto prototypu vrátane všetkých lokálne naviazaných dát. <strong>Táto akcia nemení žiadne dáta v externých systémoch</strong> (Jira, Confluence, Asana...).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Budú odstránené nasledovné entity:</p>
            <div className="grid grid-cols-2 gap-2">
              {entitiesToDelete.map((entity, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span className="text-[10px] font-bold text-slate-600">{entity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Pre potvrdenie napíš názov projektu: <span className="text-slate-900 select-none font-black italic">"{projectName}"</span>
              </label>
              <input 
                type="text" 
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="Napíšte názov projektu presne..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-slate-200 transition-all group">
              <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                confirmed ? "bg-rose-600 border-rose-600" : "border-slate-300 group-hover:border-slate-400"
              )}>
                {confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
                <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="sr-only"
                />
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Rozumiem, že projekt bude vymazaný</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Zrušiť
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!canDelete}
            className={cn(
              "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95",
              canDelete
                ? "bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            Vymazať projekt
          </button>
        </div>
      </div>
    </div>
  );
}
