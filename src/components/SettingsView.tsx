import { Settings } from 'lucide-react';
export function SettingsView() {
  return (
    <div className="p-8 animate-in fade-in flex flex-col items-center justify-center min-h-[80vh]">
      <div className="p-6 bg-slate-100 rounded-full mb-6">
        <Settings className="w-12 h-12 text-slate-300" />
      </div>
      <h2 className="text-2xl font-black text-slate-900">Nastavenia</h2>
      <p className="text-slate-500 mt-2">Modul pre nastavenia profilu a notifikácií pripravujeme.</p>
    </div>
  );
}
