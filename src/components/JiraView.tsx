import { useState } from 'react';
import { 
  Plus, Search, User,
  Edit, Trash2, Calendar, AlertTriangle, 
  Clock, PieChart, 
  BarChart3, Layers, ArrowRight, Download, Bot
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { JiraFormModal } from './JiraFormModal';
import { JiraDetail } from './JiraDetail';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { JiraItem, JiraStatus, ProjectPriority } from '../types';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from '../lib/utils';

export function JiraView() {
  const { activeProject, deleteJiraItem } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JiraItem | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<JiraItem | undefined>(undefined);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<JiraStatus | 'All'>('All');

  if (!activeProject) return null;

  const jiraItems = activeProject.jiraItems || [];

  const filteredItems = jiraItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.key.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    open: jiraItems.filter(i => i.status !== 'Done' && i.status !== 'Cancelled').length,
    blocked: jiraItems.filter(i => i.status === 'Blocked').length,
    done: jiraItems.filter(i => i.status === 'Done').length,
    total: jiraItems.length
  };

  const statusData = [
    { name: 'Done', value: stats.done, color: '#10b981' },
    { name: 'In Progress', value: jiraItems.filter(i => i.status === 'In Progress').length, color: '#4f46e5' },
    { name: 'To Do', value: jiraItems.filter(i => i.status === 'To Do').length, color: '#94a3b8' },
    { name: 'Blocked', value: stats.blocked, color: '#f43f5e' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100">
               <Layers className="w-8 h-8" />
            </div>
            Jira Sync Register
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Manuálna evidencia a AI analýza Jira ticketov pre projekt {activeProject.name}. Bez nutnosti API pripojenia.
          </p>
        </div>
        <button 
          onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}
          className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Pridať Jira Ticket
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Analytics</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Open Items</p>
                     <p className="text-3xl font-black text-slate-900">{stats.open}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                     <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Blocked</p>
                     <p className="text-3xl font-black text-rose-600">{stats.blocked}</p>
                  </div>
               </div>
               <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                  <Bot className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">AI Summary</p>
                  <p className="text-sm font-bold leading-relaxed italic relative z-10">
                    Na základe ticketov je progres v súlade s plánom, pozor však na blokovaný ticket LOG-1002.
                  </p>
               </div>
            </div>
            <div className="w-full md:w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex justify-center gap-2 flex-wrap mt-2">
                 {statusData.map(d => (
                   <div key={d.name} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                      <span className="text-[8px] font-black text-slate-400 uppercase">{d.name}</span>
                   </div>
                 ))}
              </div>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Type Distribution</h3>
               <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Story', val: jiraItems.filter(i => i.type === 'Story').length },
                      { name: 'Bug', val: jiraItems.filter(i => i.type === 'Bug').length },
                      { name: 'Task', val: jiraItems.filter(i => i.type === 'Task').length },
                      { name: 'Epic', val: jiraItems.filter(i => i.type === 'Epic').length },
                    ]}>
                      <XAxis dataKey="name" hide />
                      <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Stories</p>
                  <p className="text-xl font-black text-slate-900">{jiraItems.filter(i => i.type === 'Story').length}</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-rose-400 uppercase">Bugs</p>
                  <p className="text-xl font-black text-rose-600">{jiraItems.filter(i => i.type === 'Bug').length}</p>
               </div>
            </div>
         </div>

         <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden relative group">
            <Layers className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 group-hover:scale-110 transition-transform duration-700" />
            <div>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Registry Summary</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Completion Rate</span>
                    <span className="text-2xl font-black text-white">{Math.round((stats.done / stats.total) * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(stats.done / stats.total) * 100}%` }}></div>
                  </div>
               </div>
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 mt-6">
               Download Jira Report
            </button>
         </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať ticket (ID, názov)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           {(['All', 'To Do', 'In Progress', 'Blocked', 'Done'] as const).map(status => (
             <button
               key={status}
               onClick={() => setStatusFilter(status)}
               className={cn(
                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                 statusFilter === status ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
               )}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {filteredItems.map(item => (
             <div 
               key={item.id} 
               onClick={() => setSelectedItem(item)}
               className="bg-white rounded-[2.5rem] border border-slate-200 p-8 card-hover relative overflow-hidden group"
             >
               <div className={cn(
                 "absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 shadow-inner",
                 item.type === 'Bug' ? "text-rose-600" : "text-blue-600"
               )}>
                 <Layers className="w-20 h-20" />
               </div>
               
               <div className="flex items-start justify-between mb-6">
                 <div className="space-y-1.5">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.key}</span>
                      <StatusBadge status={item.status} />
                   </div>
                   <h4 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                 </div>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                     <PriorityBadge priority={item.priority} />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.type}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 italic h-10 leading-relaxed">
                    {item.manualText}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Deadline
                    </span>
                    <span className={cn(
                      "text-xs font-black",
                      new Date(item.deadline) < new Date() ? "text-rose-600" : "text-slate-900"
                    )}>{item.deadline}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Assignee
                    </span>
                    <span className="text-xs font-black text-slate-900 truncate">{item.assignee}</span>
                  </div>
               </div>

               <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-black text-slate-500">BA</div>
                     {item.linkedRequirement && <div className="w-6 h-6 rounded-full bg-indigo-600 border border-white flex items-center justify-center text-[8px] font-black text-white" title={item.linkedRequirement}>RQ</div>}
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                    View Detail <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <EmptyState 
          icon={Layers}
          title="Žiadne Jira tickety"
          description="V tomto projekte zatiaľ nie sú evidované žiadne Jira zdroje. Pridajte prvý manuálny záznam pre AI analýzu."
          actionLabel="Pridať Jira Ticket"
          onAction={() => setIsFormOpen(true)}
        />
      )}

      {/* Modals */}
      <JiraFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingItem} 
      />

      {selectedItem && (
        <JiraDetail 
          item={selectedItem} 
          onClose={() => setSelectedItem(undefined)} 
        />
      )}
    </div>
  );
}
