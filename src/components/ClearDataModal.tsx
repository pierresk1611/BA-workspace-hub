import { useState } from 'react';
import { TriangleAlert, X, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearDataModal({ isOpen, onClose, onConfirm }: ClearDataModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [understandChecked, setUnderstandChecked] = useState(false);

  if (!isOpen) return null;

  const isConfirmed = confirmText === 'VYMAZAŤ' && understandChecked;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      onClose();
      setConfirmText('');
      setUnderstandChecked(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <TriangleAlert className="w-6 h-6" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Vymazať všetky lokálne dáta?</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Táto akcia vymaže všetky lokálne projekty, požiadavky, riziká a ostatné entity uložené vo vašom prehliadači. Táto zmena je nevratná.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                Napíšte "VYMAZAŤ" pre potvrdenie
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="VYMAZAŤ"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-300 outline-none focus:border-rose-500/50 transition-all"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={understandChecked}
                  onChange={(e) => setUnderstandChecked(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-slate-50 transition-all checked:bg-rose-500 checked:border-rose-500"
                />
                <svg
                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                Rozumiem, že sa vymažú všetky lokálne dáta a akcia sa nedá vrátiť späť.
              </span>
            </label>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Zrušiť
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className={cn(
              "flex-1 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl",
              isConfirmed 
                ? "bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700 active:scale-95" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            <Trash2 className="w-4 h-4" /> Vymazať dáta
          </button>
        </div>
      </div>
    </div>
  );
}
