import { X, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface TextReaderModalProps {
  isOpen: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export function TextReaderModal({ isOpen, title, text, onClose }: TextReaderModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-800 line-clamp-1">{title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Skopírované' : 'Kopírovať'}
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">
              {text || "Žiadny text nebol vložený."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
