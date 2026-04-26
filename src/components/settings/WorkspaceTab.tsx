import React from 'react';
import { Smartphone, CheckCircle2, Download, Info, Building2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export function WorkspaceTab() {
  const { workspaceSettings: settings, updateWorkspaceSettings: updateSettings } = useSettings();

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" /> Workspace Info
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Názov Workspace</label>
            <input 
              type="text" 
              value={settings.workspaceName}
              onChange={(e) => updateSettings({ workspaceName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Popis</label>
            <input 
              type="text" 
              value={settings.workspaceDescription}
              onChange={(e) => updateSettings({ workspaceDescription: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Režim dát</p>
            <p className="text-xs font-bold text-slate-700">{settings.dataMode}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Demo dáta</p>
            <p className="text-xs font-bold text-slate-700">{settings.demoDataEnabled ? 'Povolené' : 'Vypnuté / Clean Mode'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Verzia App</p>
            <p className="text-xs font-bold text-slate-700">v{settings.version}</p>
          </div>
        </div>
      </div>

      {/* PWA Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute -right-12 -bottom-12 w-48 h-48 md:w-80 md:h-80 bg-white/5 rounded-full blur-3xl" />
         <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-between">
           <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center text-center md:text-left">
             <div className="p-4 md:p-6 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-xl mx-auto md:mx-0">
               <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-indigo-300" />
             </div>
             <div className="space-y-2">
               <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Mobilná Aplikácia</h3>
               <p className="text-indigo-200/70 text-[11px] md:text-sm font-medium max-w-md leading-relaxed">
                 BA HUB podporuje inštaláciu ako PWA pre plnohodnotný mobilný zážitok.
               </p>
             </div>
           </div>

           <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
             <CheckCircle2 className="w-5 h-5 text-emerald-400" />
             <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">PWA Ready & Optimised</span>
           </div>
         </div>
      </div>
    </div>
  );
}
