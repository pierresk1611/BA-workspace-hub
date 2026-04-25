import { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CloseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note: string) => void;
  projectName: string;
}

export function CloseProjectModal({ isOpen, onClose, onConfirm, projectName }: CloseProjectModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmed && reason.trim()) {
      onConfirm(reason, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Ukončiť projekt</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle Action</p>
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
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 leading-relaxed">
              Ukončením projekt <strong>{projectName}</strong> nevymažeš. Ostane dostupný v aplikácii ako historický/archívny záznam, ale bude označený ako ukončený a väčšina aktívnych akcií bude zablokovaná.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dôvod ukončenia *</label>
              <input 
                type="text" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Napr. Projekt úspešne nasadený, Zmena priorít..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Záverečná poznámka</label>
              <textarea 
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Doplňujúce informácie k ukončeniu projektu..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-slate-200 transition-all group">
              <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                confirmed ? "bg-amber-600 border-amber-600" : "border-slate-300 group-hover:border-slate-400"
              )}>
                {confirmed && <CheckCircle2 className="w-4 h-4 text-white" />}
                <input 
                  type="checkbox" 
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="sr-only"
                />
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Potvrdzujem, že projekt má byť ukončený</span>
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
            disabled={!confirmed || !reason.trim()}
            className={cn(
              "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95",
              confirmed && reason.trim() 
                ? "bg-amber-600 text-white shadow-amber-100 hover:bg-amber-700" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            Ukončiť projekt
          </button>
        </div>
      </div>
    </div>
  );
}
