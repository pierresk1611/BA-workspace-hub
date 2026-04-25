import { useState } from 'react';
import { 
  Plus, Search, Filter, Database, 
  Edit, Trash2, Clock, Users, Network, 
  Layers, Zap, GitBranch, ArrowRight,
  ShieldCheck, Share2, Info
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { KafkaFormModal } from './KafkaFormModal';
import { KafkaDetail } from './KafkaDetail';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { DataFlow, DataFlowType } from '../types';
import { cn } from '../lib/utils';

export function KafkaView() {
  const { activeProject, deleteDataFlow } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState<DataFlow | undefined>(undefined);
  const [selectedFlow, setSelectedFlow] = useState<DataFlow | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  if (!activeProject) return null;

  const dataFlows = activeProject.dataFlows || [];

  const filteredFlows = dataFlows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(search.toLowerCase()) || 
                          flow.topicName.toLowerCase().includes(search.toLowerCase()) ||
                          flow.manualText.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? flow.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: DataFlowType) => {
    switch (type) {
      case 'Kafka topic': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'API': return <Database className="w-5 h-5 text-blue-500" />;
      case 'Event stream': return <Network className="w-5 h-5 text-indigo-500" />;
      default: return <Layers className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <GitBranch className="w-8 h-8" />
            </div>
            Data Flows & Integration
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Architektúra dátových tokov, Kafka topicov a systémových integrácií pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingFlow(undefined); setIsFormOpen(true); }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Pridať Tok
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Active Flows', val: dataFlows.length, icon: GitBranch, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Critical Path (P0)', val: dataFlows.filter(f => f.criticality === 'Kritická').length, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'Kafka Topics', val: dataFlows.filter(f => f.type === 'Kafka topic').length, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'API Integrations', val: dataFlows.filter(f => f.type === 'API').length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' }
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

      {/* Dependency Map Visualization */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Network className="w-6 h-6 text-indigo-400" />
                Integration Architecture Map
              </h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Vizuálna reprezentácia tokov medzi kľúčovými komponentami Driver App.</p>
            </div>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center gap-2">
               <Share2 className="w-4 h-4" /> Expand Map
            </button>
          </div>
          
          <div className="h-64 flex items-center justify-around px-12">
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-left duration-1000">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-indigo-400 shadow-2xl group-hover:border-indigo-500/50 transition-all">
                <Database className="w-10 h-10" />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Core Warehouse</span>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent relative mx-12">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                alza.ab.Parcels.v1
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-md animate-ping left-1/4"></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-md animate-ping left-3/4"></div>
            </div>
            <div className="flex flex-col items-center gap-4 scale-110">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 border-4 border-indigo-400 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 animate-pulse-slow">
                <Zap className="w-12 h-12" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Driver App Kafka</span>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent relative mx-12">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-500/20 whitespace-nowrap">
                gps.accuracy.stream
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right duration-1000">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-blue-400 shadow-2xl group-hover:border-blue-500/50 transition-all">
                <Users className="w-10 h-10" />
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                 <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900">Data Flow Registry</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Celkovo {dataFlows.length} tokov</p>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Hľadať topic, payload, systém..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                 {(['All', 'Kafka topic', 'API', 'Event stream'] as const).map(type => (
                   <button
                     key={type}
                     onClick={() => setTypeFilter(type === 'All' ? '' : type)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap",
                       (typeFilter || 'All') === type ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                     )}
                   >
                     {type}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Flow & Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Topic / Endpoint</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Producer → Consumer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Criticality</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Owner</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFlows.map(flow => (
                <tr 
                  key={flow.id} 
                  onClick={() => setSelectedFlow(flow)}
                  className="hover:bg-indigo-50/30 transition-all cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {getTypeIcon(flow.type)}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{flow.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flow.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 truncate max-w-[220px]">{flow.topicName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase">{flow.producer}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{flow.consumer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <PriorityBadge priority={flow.criticality} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-600">
                        {flow.dataOwner.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{flow.dataOwner}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingFlow(flow); setIsFormOpen(true); }}
                        className="p-3 bg-white hover:bg-indigo-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (confirm('Zmazať tento dátový tok?')) deleteDataFlow(activeProject.id, flow.id); }}
                        className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFlows.length === 0 && (
            <EmptyState 
              icon={GitBranch}
              title="Žiadne dátové toky"
              description="Nenašli sme žiadne záznamy pre vybrané filtre. Pridajte novú systémovú integráciu alebo Kafka topic."
              actionLabel="Pridať prvý tok"
              onAction={() => setIsFormOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-6">
         <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
            <Info className="w-6 h-6" />
         </div>
         <div className="space-y-2">
            <h4 className="text-base font-black text-indigo-900 tracking-tight">Security & Governance Compliance</h4>
            <p className="text-sm text-indigo-700/70 font-medium leading-relaxed max-w-4xl">
               Všetky dátové toky musia prejsť kvartálnou validáciou (Data Quality Check). BA je zodpovedný za udržiavanie aktuálneho popisu payloadu a identifikáciu PII (Personally Identifiable Information) v Kafka topicoch.
            </p>
         </div>
      </div>

      {/* Modals */}
      <KafkaFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingFlow} 
      />

      {selectedFlow && (
        <KafkaDetail 
          flow={selectedFlow} 
          onClose={() => setSelectedFlow(undefined)} 
        />
      )}
    </div>
  );
}
