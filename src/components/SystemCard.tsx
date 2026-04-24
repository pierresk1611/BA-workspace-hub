import { useState } from 'react';
import { ExternalLink, FileText, Bot, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { LinkedSystem } from '../types';
import { useProject } from '../context/ProjectContext';

interface SystemCardProps {
  system: LinkedSystem;
  onEdit: (system: LinkedSystem) => void;
  onReadText: (text: string, title: string) => void;
}

export function SystemCard({ system, onEdit, onReadText }: SystemCardProps) {
  const { activeProjectId, deleteSystem } = useProject();
  const [showMenu, setShowMenu] = useState(false);

  const getSystemIcon = (type: string) => {
    // Placeholder function for specific icons/colors based on system type
    const colors: Record<string, string> = {
      'Confluence': 'bg-blue-600 text-white',
      'Jira': 'bg-blue-500 text-white',
      'Kafka': 'bg-slate-800 text-white',
      'Asana': 'bg-rose-500 text-white',
      'Teams': 'bg-indigo-600 text-white',
      'Miro': 'bg-yellow-400 text-black',
      'API dokumentácia': 'bg-emerald-500 text-white',
      'SQL / databázový zdroj': 'bg-cyan-600 text-white'
    };
    return colors[type] || 'bg-slate-400 text-white';
  };

  const handleDelete = () => {
    if (confirm('Naozaj chcete zmazať tento systém?')) {
      deleteSystem(activeProjectId, system.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full relative">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getSystemIcon(system.type)}`}>
              {system.type.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 line-clamp-1">{system.name}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {system.type === 'Iné' ? system.customTypeName : system.type}
              </p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                <button onClick={() => { onEdit(system); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Upraviť
                </button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Zmazať
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
          {system.shortDescription}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Owner</span>
            <span className="font-medium text-slate-700 truncate">{system.owner || '-'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Deadline/Review</span>
            <span className="font-medium text-slate-700">{system.deadline || '-'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Status</span>
            <span className="font-medium text-slate-700">{system.status || '-'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Priorita</span>
            <span className="font-medium text-slate-700">{system.priority || '-'}</span>
          </div>
        </div>
        
        {system.tags && (
          <div className="flex gap-1.5 flex-wrap">
            {system.tags.split(',').map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-wider rounded border border-blue-100">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex gap-2">
        <a 
          href={system.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Link
        </a>
        <button 
          onClick={() => onReadText(system.manualText, system.name)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors border border-blue-100"
        >
          <FileText className="w-3.5 h-3.5" />
          Text
        </button>
        <button 
          onClick={() => alert('AI Summary funkcia bude dostupná v ďalšej verzii po integrácii LLM.')}
          className="flex items-center justify-center w-8 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-100"
          title="AI Summary"
        >
          <Bot className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
