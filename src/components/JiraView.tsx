import { useState } from 'react';
import { 
  Plus, Search, Filter, 
  Edit, Trash2, Calendar, AlertTriangle, 
  CheckCircle, Clock, PieChart, 
  BarChart3, Layers
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { JiraFormModal } from './JiraFormModal';
import { JiraDetail } from './JiraDetail';
import type { JiraItem, JiraItemType, ProjectPriority } from '../types';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function JiraView() {
  const { activeProject, deleteJiraItem } = useProject();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JiraItem | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<JiraItem | undefined>(undefined);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [assigneeFilter] = useState<string>('');

  if (!activeProject) return null;

  const jiraItems = activeProject.jiraItems || [];

  const filteredItems = jiraItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.key.toLowerCase().includes(search.toLowerCase()) ||
                          item.manualText.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesPriority = priorityFilter ? item.priority === priorityFilter : true;
    const matchesAssignee = assigneeFilter ? item.assignee === assigneeFilter : true;
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesAssignee;
  });

  const openItems = jiraItems.filter(i => i.status !== 'Done' && i.status !== 'Cancelled').length;
  const blockedItems = jiraItems.filter(i => i.status === 'Blocked').length;
  
  const sortedByDeadline = [...jiraItems].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  const nearestDeadline = sortedByDeadline.length > 0 ? sortedByDeadline[0].deadline : 'N/A';

  // Chart Data
  const statusData = [
    { name: 'Done', value: jiraItems.filter(i => i.status === 'Done').length, color: '#22c55e' },
    { name: 'In Progress', value: jiraItems.filter(i => i.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'To Do', value: jiraItems.filter(i => i.status === 'To Do').length, color: '#94a3b8' },
    { name: 'Blocked', value: jiraItems.filter(i => i.status === 'Blocked').length, color: '#ef4444' },
    { name: 'Backlog', value: jiraItems.filter(i => i.status === 'Backlog').length, color: '#64748b' },
  ].filter(d => d.value > 0);

  const typeData = [
    { name: 'Story', value: jiraItems.filter(i => i.type === 'Story').length },
    { name: 'Task', value: jiraItems.filter(i => i.type === 'Task').length },
    { name: 'Bug', value: jiraItems.filter(i => i.type === 'Bug').length },
    { name: 'Epic', value: jiraItems.filter(i => i.type === 'Epic').length },
  ].filter(d => d.value > 0);

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case 'Kritická': return 'text-red-600 bg-red-50';
      case 'Vysoká': return 'text-orange-600 bg-orange-50';
      case 'Stredná': return 'text-blue-600 bg-blue-50';
      case 'Nízka': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getTypeIcon = (type: JiraItemType) => {
    switch (type) {
      case 'Bug': return <div className="w-2 h-2 rounded-full bg-rose-500" />;
      case 'Story': return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
      case 'Epic': return <div className="w-2 h-2 rounded-full bg-purple-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-blue-500" />;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Layers className="w-6 h-6" />
            </div>
            Jira zdroje
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manuálna správa ticketov a AI analýza bez priamej integrácie</p>
        </div>
        <button 
          onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Pridať Jira ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Otvorené položky</p>
              <h3 className="text-2xl font-black text-slate-900">{openItems}</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(openItems / jiraItems.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blokované</p>
              <h3 className="text-2xl font-black text-slate-900">{blockedItems}</h3>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vyžaduje okamžitý zásah</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Najbližší Deadline</p>
              <h3 className="text-2xl font-black text-slate-900">{nearestDeadline}</h3>
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Zostáva: 5 dní</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dokončené</p>
              <h3 className="text-2xl font-black text-slate-900">{jiraItems.filter(i => i.status === 'Done').length}</h3>
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i < 3 ? 'bg-purple-500' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <PieChart className="w-4 h-4 text-blue-600" />
            Rozdelenie podľa statusu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Rozdelenie podľa typu
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Hľadať v Jira zdrojoch (key, názov, obsah)..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]">
            <option value="">Všetky Statusy</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]">
            <option value="">Všetky Typy</option>
            <option value="Epic">Epic</option>
            <option value="Story">Story</option>
            <option value="Bug">Bug</option>
            <option value="Task">Task</option>
          </select>
          <button onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); setPriorityFilter(''); }} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kľúč / Typ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Názov Ticketu</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priorita</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{item.type}</p>
                        <p className="text-xs font-bold text-blue-600">{item.key}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">{item.title}</p>
                    <div className="flex gap-2 mt-1">
                      {item.tags.split(',').slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] font-bold text-slate-400">#{t.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">
                        {item.assignee.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                      item.status === 'Done' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Blocked' ? 'bg-red-100 text-red-700' : 
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">
                    {item.deadline}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingItem(item); setIsFormOpen(true); }}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if (confirm('Zmazať tento ticket?')) deleteJiraItem(activeProject.id, item.id); }}
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
          {filteredItems.length === 0 && (
            <div className="p-20 text-center">
              <Layers className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Nenašli sa žiadne Jira zdroje</h3>
              <p className="text-sm text-slate-500">Skúste zmeniť filtre alebo pridajte nový ticket.</p>
            </div>
          )}
        </div>
      </div>

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
