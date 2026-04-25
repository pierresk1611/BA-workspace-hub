import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, TrendingUp, AlertTriangle, Clock, Filter, 
  ChevronRight, Activity, ShieldCheck, Zap, ArrowRight,
  BarChart2, Search
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateProjectProgress } from '../lib/projectUtils';
import { cn } from '../lib/utils';

const STATUS_COLORS: Record<string, string> = {
  'Analýza': 'bg-blue-100 text-blue-700 border-blue-200',
  'Solution Design': 'bg-violet-100 text-violet-700 border-violet-200',
  'Discovery': 'bg-amber-100 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'Done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Blocked': 'bg-rose-100 text-rose-700 border-rose-200',
};

const PRIORITY_COLORS: Record<string, string> = {
  'Vysoká': 'text-rose-600 bg-rose-50 border-rose-200',
  'Stredná': 'text-amber-600 bg-amber-50 border-amber-200',
  'Nízka': 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export function AllProjectsDashboard() {
  const { projects, setActiveProject } = useProject();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const handleOpenProject = (projectId: string) => {
    setActiveProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  const filteredProjects = useMemo(() => projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }), [projects, search, statusFilter, priorityFilter]);

  // Global stats
  const totalProjects = projects.length;
  const overdueTotal = projects.reduce((s, p) => s + (p.metrics.overdueItems || 0), 0);
  const avgHealth = projects.length > 0 
    ? Math.round(projects.reduce((s, p) => s + p.metrics.healthScore, 0) / projects.length) 
    : 0;
  const allStatuses = [...new Set(projects.map(p => p.status))];
  const highRiskProjects = projects.filter(p => p.metrics.healthScore < 72);

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Global Workspace
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <FolderOpen className="w-8 h-8" />
            </div>
            All Projects Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg max-w-2xl">
            Prehľad všetkých projektov. Klikni na projekt pre zobrazenie detailného dashboardu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            {viewMode === 'cards' ? <BarChart2 className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', val: totalProjects, icon: FolderOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Avg Health Score', val: `${avgHealth}%`, icon: ShieldCheck, color: avgHealth > 75 ? 'text-emerald-600' : 'text-amber-600', bg: avgHealth > 75 ? 'bg-emerald-50' : 'bg-amber-50', border: avgHealth > 75 ? 'border-emerald-100' : 'border-amber-100' },
          { label: 'Overdue Items', val: overdueTotal, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { label: 'At Risk', val: highRiskProjects.length, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((s, i) => (
          <div key={i} className={cn("bg-white p-8 rounded-[2.5rem] border shadow-xl flex items-center gap-6", s.border)}>
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

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hľadať projekt..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter:</span>
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 outline-none cursor-pointer hover:bg-slate-50 transition-all"
          >
            <option value="all">Všetky statusy</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 outline-none cursor-pointer hover:bg-slate-50 transition-all"
          >
            <option value="all">Všetky priority</option>
            <option value="Vysoká">Vysoká</option>
            <option value="Stredná">Stredná</option>
            <option value="Nízka">Nízka</option>
          </select>
        </div>
      </div>

      {/* Projects View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map(project => {
            const stats = calculateProjectProgress(project);
            const isAtRisk = project.metrics.healthScore < 72;
            return (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                className={cn(
                  "bg-white rounded-[3rem] border shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col",
                  isAtRisk ? "border-amber-200" : "border-slate-200"
                )}
              >
                {isAtRisk && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-t-[3rem]" />
                )}
                <div className="p-8 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.type}</p>
                        <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2 italic">
                    "{project.shortDescription}"
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight border", STATUS_COLORS[project.status] || 'bg-slate-100 text-slate-600 border-slate-200')}>
                      {project.status}
                    </span>
                    <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight border", PRIORITY_COLORS[project.priority] || 'bg-slate-50 text-slate-400 border-slate-100')}>
                      {project.priority}
                    </span>
                    {project.metrics.overdueItems > 0 && (
                      <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {project.metrics.overdueItems} overdue
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                      <span className="text-sm font-black text-indigo-600">{stats.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-900">{project.metrics.healthScore}%</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</p>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <p className="text-xs font-black text-slate-900">{project.metrics.openJira}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Open Jira</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xs font-black", project.metrics.overdueItems > 0 ? "text-rose-600" : "text-slate-900")}>
                      {project.targetDate}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Projekt', 'Status', 'Priorita', 'Progress', 'Health', 'Target', 'Overdue', ''].map((h, i) => (
                    <th key={i} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProjects.map(project => {
                  const stats = calculateProjectProgress(project);
                  return (
                    <tr 
                      key={project.id}
                      onClick={() => handleOpenProject(project.id)}
                      className="hover:bg-indigo-50/30 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{project.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{project.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border", STATUS_COLORS[project.status] || 'bg-slate-100 text-slate-600 border-slate-200')}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border", PRIORITY_COLORS[project.priority] || 'bg-slate-50 text-slate-400 border-slate-100')}>
                          {project.priority}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 min-w-[120px]">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${stats.progress}%` }} />
                          </div>
                          <span className="text-sm font-black text-indigo-600 min-w-[36px]">{stats.progress}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn("text-sm font-black", project.metrics.healthScore > 75 ? "text-emerald-600" : project.metrics.healthScore > 60 ? "text-amber-600" : "text-rose-600")}>
                          {project.metrics.healthScore}%
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {project.targetDate}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {project.metrics.overdueItems > 0 ? (
                          <span className="flex items-center gap-1.5 text-xs font-black text-rose-600">
                            <AlertTriangle className="w-4 h-4" />
                            {project.metrics.overdueItems}
                          </span>
                        ) : (
                          <span className="text-xs font-black text-emerald-600">✓ OK</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                          Otvoriť <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Alerts */}
      {overdueTotal > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-sm">
          <div className="p-4 bg-amber-100 rounded-2xl shrink-0">
            <Zap className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-black text-amber-900 text-lg mb-2">Attention Required</h4>
            <p className="text-sm font-medium text-amber-800">
              Naprieč všetkými projektmi máš <strong>{overdueTotal} overdue položiek</strong>, z toho <strong>{highRiskProjects.length} projektov</strong> majú health score pod 72%. Skontroluj riziká a termíny.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
