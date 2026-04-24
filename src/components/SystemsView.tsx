import { useState } from 'react';
import { Plus, Search, Filter, Network } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SystemCard } from './SystemCard';
import { SystemFormModal } from './SystemFormModal';
import { TextReaderModal } from './TextReaderModal';
import type { LinkedSystem } from '../types';

export function SystemsView() {
  const { activeProject } = useProject();
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<LinkedSystem | undefined>(undefined);
  
  const [readerData, setReaderData] = useState<{isOpen: boolean, text: string, title: string}>({
    isOpen: false, text: '', title: ''
  });

  if (!activeProject) return <div className="p-6 text-center text-slate-500">Žiadny projekt nie je vybraný.</div>;

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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prepojené systémy</h1>
          <p className="text-slate-500 text-sm mt-1">Zoznam všetkých manuálne prepojených systémov pre projekt {activeProject.name}</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Pridať systém
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať podľa názvu, typu alebo tagu..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          Filtrovať
        </button>
      </div>

      {/* Grid */}
      {filteredSystems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <Network className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Žiadne systémy neboli nájdené</h3>
          <p className="text-slate-500 text-sm">Pridajte nový systém pomocou tlačidla vyššie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
