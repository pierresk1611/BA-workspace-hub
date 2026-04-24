import { useState } from 'react';
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import type { ConfluenceSource } from '../types';
import { ConfluenceDetail } from './ConfluenceDetail';
import { ConfluenceFormModal } from './ConfluenceFormModal';

export function ConfluenceView() {
  const { activeProject, activeProjectId, deleteConfluenceSource } = useProject();
  const [selectedSource, setSelectedSource] = useState<ConfluenceSource | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ConfluenceSource | undefined>(undefined);
  const [search, setSearch] = useState('');

  if (!activeProject) return <div className="p-6 text-center text-slate-500">Žiadny projekt nie je vybraný.</div>;

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

  // If a source is selected, render the detail view
  if (selectedSource) {
    // Make sure we pass the most up-to-date source if it was edited
    const updatedSource = sources.find(s => s.id === selectedSource.id) || selectedSource;
    return (
      <ConfluenceDetail 
        source={updatedSource} 
        onBack={() => setSelectedSource(null)}
        onEdit={() => handleEdit(updatedSource)}
      />
    );
  }

  // Otherwise render the list view
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Confluence zdroje
          </h1>
          <p className="text-slate-500 text-sm mt-1">Zoznam manuálne vložených analytických dokumentov pre AI extrakciu.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Pridať zdroj
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať podľa názvu alebo tagu..." 
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

      {filteredSources.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Žiadne Confluence zdroje</h3>
          <p className="text-slate-500 text-sm">Zatiaľ ste nepridali žiadnu dokumentáciu k tomuto projektu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map(src => (
            <div key={src.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedSource(src)}>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{src.name}</h3>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded group relative">
                      <MoreVertical className="w-5 h-5" />
                      <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
                        <div onClick={() => handleEdit(src)} className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                          <Edit className="w-4 h-4" /> Upraviť
                        </div>
                        <div onClick={() => handleDelete(src.id)} className="px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" /> Zmazať
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                  {src.shortDescription}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className={`px-2 py-1 rounded-full font-medium ${
                    src.status === 'Aktuálne' ? 'bg-green-100 text-green-700' :
                    src.status === 'Zastarané' ? 'bg-red-100 text-red-700' :
                    src.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {src.status}
                  </span>
                  <span>Review: <strong className={src.reviewDeadline < new Date().toISOString().split('T')[0] ? 'text-red-500' : ''}>{src.reviewDeadline || 'Nenastavené'}</strong></span>
                </div>
                
                {src.tags && (
                  <div className="flex gap-1.5 flex-wrap">
                    {src.tags.split(',').map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-wider rounded border border-blue-100">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
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
