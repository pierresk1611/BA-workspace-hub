import { useState } from 'react';
import { ExternalLink, FileText, Bot, MoreVertical, Edit, Trash2, Globe, Server, ShieldCheck, Clock } from 'lucide-react';
import type { LinkedSystem } from '../types';
import { useProject } from '../context/ProjectContext';
import { StatusBadge, PriorityBadge } from './Badge';
import { cn } from '../lib/utils';

interface SystemCardProps {
  system: LinkedSystem;
  onEdit: (system: LinkedSystem) => void;
  onReadText: (text: string, title: string) => void;
}

export function SystemCard({ system, onEdit, onReadText }: SystemCardProps) {
  const { activeProject, deleteSystem } = useProject();
  const [showMenu, setShowMenu] = useState(false);

  if (!activeProject) return null;

  const getSystemIcon = (type: string) => {
    const colors: Record<string, string> = {
      'Confluence': 'bg-blue-600 text-white shadow-blue-100',
      'Jira': 'bg-blue-500 text-white shadow-blue-100',
      'Kafka': 'bg-slate-800 text-white shadow-slate-100',
      'Asana': 'bg-rose-500 text-white shadow-rose-100',
      'Teams': 'bg-indigo-600 text-white shadow-indigo-100',
      'Miro': 'bg-yellow-400 text-black shadow-yellow-100',
      'API dokumentácia': 'bg-emerald-500 text-white shadow-emerald-100',
      'SQL / databázový zdroj': 'bg-cyan-600 text-white shadow-cyan-100'
    };
    return colors[type] || 'bg-slate-400 text-white shadow-slate-100';
  };

  const handleDelete = () => {
    if (confirm('Naozaj chcete zmazať tento systém?')) {
      deleteSystem(activeProject.id, system.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      <div className="p-8 flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-lg transform group-hover:scale-110 transition-transform duration-500",
              getSystemIcon(system.type)
            )}>
              {system.type.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{system.name}</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                {system.type === 'Iné' ? system.customTypeName : system.type}
              </p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 py-2 animate-in zoom-in-95 duration-200">
                <button onClick={() => { onEdit(system); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                  <Edit className="w-4 h-4 text-indigo-500" /> Upraviť Systém
                </button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                  <Trash2 className="w-4 h-4" /> Zmazať Navždy
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2 min-h-[40px] italic">
          "{system.shortDescription}"
        </p>

        <div className="space-y-3 mb-6">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Metadata</span>
              <div className="h-px flex-1 bg-slate-100 mx-3"></div>
           </div>
           <div className="grid grid-cols-2 gap-3">
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Owner</span>
                <span className="text-xs font-bold text-slate-700 truncate block">{system.owner || 'Unassigned'}</span>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Due Date</span>
                <span className="text-xs font-bold text-slate-700 block">{system.deadline || 'TBD'}</span>
             </div>
           </div>
           <div className="flex flex-wrap gap-2">
              <StatusBadge status={system.status as any} />
              <PriorityBadge priority={system.priority as any} />
           </div>
        </div>
        
        {system.tags && (
          <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-50">
            {system.tags.split(',').map(tag => (
              <span key={tag} className="px-3 py-1 bg-white text-slate-500 text-[9px] uppercase font-black tracking-widest rounded-lg border border-slate-200">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <a 
          href={system.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          Link
        </a>
        <button 
          onClick={() => onReadText(system.manualText, system.name)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <FileText className="w-4 h-4" />
          Text
        </button>
        <button 
          onClick={() => alert('AI Deep Analysis funkcia pracuje s lokálnym kontextom.')}
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-all shadow-sm group/btn"
          title="AI Summary"
        >
          <Bot className="w-5 h-5 group-hover/btn:animate-bounce" />
        </button>
      </div>
    </div>
  );
}
