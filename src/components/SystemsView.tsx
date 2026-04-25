import { useState } from 'react';
import { Plus, Search, Filter, Network, Globe, ShieldCheck, Activity, Database } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SystemCard } from './SystemCard';
import { SystemFormModal } from './SystemFormModal';
import { TextReaderModal } from './TextReaderModal';
import { EmptyState } from './Badge';
import type { LinkedSystem } from '../types';
import { cn } from '../lib/utils';

export function SystemsView() {
  const { activeProject } = useProject();
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<LinkedSystem | undefined>(undefined);
  
  const [readerData, setReaderData] = useState<{isOpen: boolean, text: string, title: string}>({
    isOpen: false, text: '', title: ''
  });

  if (!activeProject) return null;

  const systems = activeProject.systems || [];
  
  const filteredSystems = systems.filter(sys => 
    sys.name.toLowerCase().includes(search.toLowerCase()) || 
    sys.type.toLowerCase().includes(search.toLowerCase()) ||
    sys.tags.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingSystem(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (system: LinkedSystem) => {
    setEditingSystem(system);
    setIsFormOpen(true);
  };

  const handleReadText = (text: string, title: string) => {
    setReaderData({ isOpen: true, text, title });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Globe className="w-8 h-8" />
            </div>
            Linked Systems Ecosystem
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Správa prepojených systémov, dokumentácie a dátových zdrojov pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenCreate}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Pridať Systém
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Active Systems', val: systems.length, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Critical Assets', val: systems.filter(s => s.priority === 'Kritická' || s.priority === 'Vysoká').length, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'Documentation Hubs', val: systems.filter(s => s.type === 'Confluence').length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'System Health', val: '94%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' }
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
            placeholder="Hľadať systém, typ, vlastníka alebo tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtrovať
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredSystems.length === 0 ? (
        <EmptyState 
          icon={Network}
          title="Žiadne systémy"
          description="Tento projekt nemá zatiaľ prepojené žiadne externé systémy ani dokumentáciu. Pridajte zdroje pre lepšiu traceability."
          actionLabel="Pridať prvý systém"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
          {filteredSystems.map(sys => (
            <SystemCard 
              key={sys.id} 
              system={sys} 
              onEdit={handleOpenEdit}
              onReadText={handleReadText}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SystemFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingSystem}
      />
      
      <TextReaderModal 
        isOpen={readerData.isOpen}
        title={readerData.title}
        text={readerData.text}
        onClose={() => setReaderData({ ...readerData, isOpen: false })}
      />
    </div>
  );
}
