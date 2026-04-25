import { useState } from 'react';
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2, Globe, Clock, ShieldCheck, Activity, Database, ChevronRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import type { ConfluenceSource } from '../types';
import { ConfluenceDetail } from './ConfluenceDetail';
import { ConfluenceFormModal } from './ConfluenceFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import { cn } from '../lib/utils';

export function ConfluenceView() {
  const { activeProject, activeProjectId, deleteConfluenceSource } = useProject();
  const [selectedSource, setSelectedSource] = useState<ConfluenceSource | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ConfluenceSource | undefined>(undefined);
  const [search, setSearch] = useState('');

  if (!activeProject) return null;

  const sources = activeProject.confluenceSources || [];
  
  const filteredSources = sources.filter(src => 
    src.name.toLowerCase().includes(search.toLowerCase()) || 
    src.tags.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingSource(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (source: ConfluenceSource) => {
    setEditingSource(source);
    setIsFormOpen(true);
  };

  const handleDelete = (sourceId: string) => {
    if (confirm('Naozaj chcete zmazať tento Confluence zdroj?')) {
      deleteConfluenceSource(activeProjectId, sourceId);
    }
  };

  const isOverdue = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (selectedSource) {
    const updatedSource = sources.find(s => s.id === selectedSource.id) || selectedSource;
    return (
      <ConfluenceDetail 
        source={updatedSource} 
        onBack={() => setSelectedSource(null)}
        onEdit={() => handleEdit(updatedSource)}
      />
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100">
               <Database className="w-8 h-8" />
            </div>
            Confluence Knowledge Base
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Správa manuálne vložených analytických dokumentov a Confluence zdrojov pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreate}
            className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Pridať Dokument
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Sources', val: sources.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Review Required', val: sources.filter(s => isOverdue(s.reviewDeadline)).length, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'Actual Docs', val: sources.filter(s => s.status === 'Aktuálne').length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Data Quality', val: '88%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' }
         ].map((s, i) => (
           <div key={i} className={cn("p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 bg-white")}>
              <div className={cn("p-4 rounded-2xl", s.bg, s.color)}>
                 <s.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none mb-1">{s.val}</p>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex-1 relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať dokument, tag, kľúčové slovo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtrovať
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredSources.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="Žiadna dokumentácia"
          description="Zatiaľ ste nepridali žiadnu Confluence dokumentáciu k tomuto projektu. Pridajte textové podklady pre AI analýzu."
          actionLabel="Pridať prvý zdroj"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredSources.map(src => (
            <div 
              key={src.id} 
              onClick={() => setSelectedSource(src)}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group cursor-pointer"
            >
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{src.name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Confluence Page</p>
                    </div>
                  </div>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group/menu relative">
                      <MoreVertical className="w-5 h-5" />
                      <div className="hidden group-hover/menu:block absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 py-2">
                        <button onClick={() => handleEdit(src)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                          <Edit className="w-4 h-4 text-blue-500" /> Upraviť Zdroj
                        </button>
                        <button onClick={() => handleDelete(src.id)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                          <Trash2 className="w-4 h-4" /> Zmazať Navždy
                        </button>
                      </div>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2 min-h-[40px] italic">
                  "{src.shortDescription}"
                </p>

                <div className="space-y-4 mb-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Metadata</span>
                      <div className="h-px flex-1 bg-slate-100 mx-3"></div>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <StatusBadge status={src.status as any} />
                      <div className={cn(
                        "flex items-center gap-2 font-black",
                        isOverdue(src.reviewDeadline) ? "text-rose-500" : "text-slate-400"
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase">Review: {src.reviewDeadline || 'TBD'}</span>
                      </div>
                   </div>
                </div>
                
                {src.tags && (
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-50">
                    {src.tags.split(',').map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] uppercase font-black tracking-widest rounded-lg border border-blue-100">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail & AI Extraction</span>
                 <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfluenceFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingSource}
      />
    </div>
  );
}
