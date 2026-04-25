import { useState } from 'react';
import { 
  CheckSquare, Search, Plus, Edit, Trash2, 
  Bot, Link2, ExternalLink, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, FileText, 
  BarChart2, TrendingUp, Info
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { RequirementFormModal } from './RequirementFormModal';
import type { Requirement, RequirementStatus } from '../types';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie
} from 'recharts';

export function RequirementsView() {
  const { activeProject, deleteRequirement } = useProject();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [editingReq, setEditingReq] = useState<Requirement | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!activeProject) return null;

  const requirements = activeProject.requirements || [];

  const filteredReqs = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(search.toLowerCase()) || 
                          req.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = !typeFilter || req.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeReq = requirements.find(r => r.id === activeReqId);


  // Stats for charts
  const statusData = [
    { name: 'Done', value: requirements.filter(r => r.status === 'Done').length, color: '#22c55e' },
    { name: 'In Dev/Test', value: requirements.filter(r => r.status === 'In development' || r.status === 'In testing').length, color: '#3b82f6' },
    { name: 'Potvrdené', value: requirements.filter(r => r.status === 'Potvrdené' || r.status === 'Ready for refinement').length, color: '#6366f1' },
    { name: 'Draft', value: requirements.filter(r => r.status === 'Draft' || r.status === 'Na potvrdenie').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const typeData = [
    { name: 'Business', value: requirements.filter(r => r.type === 'Business').length },
    { name: 'Functional', value: requirements.filter(r => r.type === 'Functional').length },
    { name: 'Technical', value: requirements.filter(r => r.type === 'Security' || r.type === 'Data' || r.type === 'Non-functional').length },
    { name: 'UX/UI', value: requirements.filter(r => r.type === 'UX').length },
  ].filter(d => d.value > 0);

  const progress = requirements.length > 0 
    ? Math.round((requirements.filter(r => r.status === 'Done').length / requirements.length) * 100) 
    : 0;

  const getStatusColor = (status: RequirementStatus) => {
    switch (status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700';
      case 'In development':
      case 'In testing': return 'bg-blue-100 text-blue-700';
      case 'Potvrdené':
      case 'Ready for refinement': return 'bg-indigo-100 text-indigo-700';
      case 'Draft':
      case 'Na potvrdenie': return 'bg-slate-100 text-slate-500';
      case 'Obsolete': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <CheckSquare className="w-6 h-6" />
            </div>
            Register požiadaviek
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Business, funkčné a technické špecifikácie projektu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Celkový progres</p>
              <p className="text-xl font-black text-blue-700">{progress}%</p>
            </div>
            <div className="w-24 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button 
            onClick={() => { setEditingReq(undefined); setIsFormOpen(true); }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Pridať požiadavku
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left: Table & Filters */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-8">
              <div className="h-32 w-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={statusData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Podľa statusu</h3>
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-slate-500 font-medium">{d.name}: <span className="text-slate-900 font-bold">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-500" />
                Podľa typu
              </h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters & Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
              <div className="flex-1 relative w-full">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Hľadať ID, názov alebo ownera..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none">
                  <option value="">Všetky Typy</option>
                  <option value="Business">Business</option>
                  <option value="Functional">Functional</option>
                  <option value="Security">Security</option>
                  <option value="UX">UX</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none">
                  <option value="">Všetky Statusy</option>
                  <option value="Potvrdené">Potvrdené</option>
                  <option value="In development">V vývoji</option>
                  <option value="Done">Hotové</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Názov</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Typ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priorita</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReqs.map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => setActiveReqId(r.id)}
                      className={`hover:bg-blue-50/30 transition-all cursor-pointer group ${activeReqId === r.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-400">{r.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{r.title}</p>
                        <p className="text-[10px] text-slate-500">{r.owner}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">{r.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight ${getStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          {r.deadline || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase ${
                          r.priority === 'Kritická' ? 'text-rose-600' : 
                          r.priority === 'Vysoká' ? 'text-orange-600' : 
                          r.priority === 'Stredná' ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingReq(r); setIsFormOpen(true); }}
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if (confirm('Zmazať požiadavku?')) deleteRequirement(activeProject.id, r.id); }}
                            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 border border-transparent hover:border-slate-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Detail Sidebar */}
        <div className="w-full lg:w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10 overflow-hidden">
          {activeReq ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase">{activeReq.id}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 text-slate-400"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeReq.title}</h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusColor(activeReq.status)}`}>{activeReq.status}</span>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase">{activeReq.type}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Popis požiadavky
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{activeReq.description}</p>
                </div>

                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Acceptance Criteria
                  </h4>
                  <div className="text-xs text-blue-800 font-mono whitespace-pre-wrap leading-relaxed">
                    {activeReq.acceptanceCriteria}
                  </div>
                  <button className="w-full py-2 bg-white border border-blue-200 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
                    <Bot className="w-3.5 h-3.5" /> Upraviť AC cez AI
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Owner</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">{activeReq.owner.charAt(0)}</div>
                      <span className="text-sm font-bold text-slate-700">{activeReq.owner}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deadline</h4>
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                      <Clock className="w-4 h-4" />
                      {activeReq.deadline || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prepojenia a Zdroj</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Link2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">Jira Ticket</span>
                      </div>
                      <span className="text-xs font-black text-blue-600">{activeReq.relatedJiraKey || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">Zdroj</span>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{activeReq.source}</span>
                    </div>
                    {activeReq.sourceUrl && (
                      <a href={activeReq.sourceUrl} target="_blank" className="flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 text-indigo-600 transition-colors">
                        <span className="text-xs font-bold">Otvoriť dokumentáciu</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 text-slate-600 transition-all">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="text-[10px] font-bold uppercase">Vytvoriť riziko</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 text-slate-600 transition-all">
                    <Info className="w-5 h-5 text-indigo-500" />
                    <span className="text-[10px] font-bold uppercase">Vytvoriť otázku</span>
                  </button>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-200">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-lg flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Prepojiť s Jira Story
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="p-6 bg-slate-100 rounded-full mb-6">
                <FileText className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Vyberte požiadavku</h3>
              <p className="text-sm text-slate-500 mt-2">Kliknite na riadok v tabuľke pre zobrazenie detailov a prepojení.</p>
            </div>
          )}
        </div>

      </div>

      <RequirementFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingReq} 
      />
    </div>
  );
}
