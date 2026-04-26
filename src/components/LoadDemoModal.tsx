import { Library, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasExistingProjects: boolean;
}

export function LoadDemoModal({ isOpen, onClose, onConfirm, hasExistingProjects }: LoadDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Library className="w-6 h-6" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Načítať demo dáta?</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Táto akcia pridá testovacie projekty a ukážkové dáta do lokálneho workspace. Demo dáta sa nikdy nenačítavajú automaticky.
          </p>

          {hasExistingProjects && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
              <p className="text-xs font-bold text-amber-700 leading-relaxed">
                Už máš vytvorené vlastné projekty. Demo dáta budú pridané k nim bez prepísania tvojich dát.
              </p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Zrušiť
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95"
          >
            Načítať demo dáta
          </button>
        </div>
      </div>
    </div>
  );
}
