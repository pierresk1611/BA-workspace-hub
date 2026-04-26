import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, TrendingUp, AlertTriangle, Clock, Filter, 
  ChevronRight, Activity, ShieldCheck, Zap, ArrowRight,
  BarChart2, Search, Database, Plus, Library, 
  PieChart as PieChartIcon, LayoutGrid, List, 
  CheckCircle2, Info, Flag
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { useProject } from '../context/ProjectContext';
import { calculateProjectProgress, calculateProjectHealth } from '../lib/projectUtils';
import { cn } from '../lib/utils';
import { LoadDemoModal } from './LoadDemoModal';
import { HandoverModal } from './HandoverModal';
import { ArrowRightLeft } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'Idea': '#94a3b8',
  'Discovery': '#fbbf24',
  'Analýza': '#60a5fa',
  'Solution Design': '#a78bfa',
  'Vývoj': '#3b82f6',
  'Testovanie': '#818cf8',
  'Uat': '#c084fc',
  'Rollout': '#f472b6',
  'Done': '#10b981',
  'Pozastavené': '#f87171',
  'Ukončené': '#64748b',
};

const PRIORITY_PALETTE: Record<string, string> = {
  'Kritická': '#e11d48',
  'Vysoká': '#f43f5e',
  'Stredná': '#f59e0b',
  'Nízka': '#10b981',
};

export function AllProjectsDashboard() {
  const { projects, setActiveProject, loadDemoData } = useProject();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [handoverProject, setHandoverProject] = useState<any>(null);

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

  // Global calculations
  const activeProjects = projects.filter(p => !p.isClosed);
  const closedProjects = projects.filter(p => p.isClosed);
  
  const healthResults = useMemo(() => projects.map(p => ({
    projectId: p.id,
    projectName: p.name,
    health: calculateProjectHealth(p),
    progress: calculateProjectProgress(p).progress,
    status: p.status,
    priority: p.priority
  })), [projects]);

  const avgHealth = useMemo(() => {
    const activeHealths = healthResults.filter(h => !projects.find(p => p.id === h.projectId)?.isClosed);
    if (activeHealths.length === 0) return 0;
    return Math.round(activeHealths.reduce((acc, h) => acc + h.health.score, 0) / activeHealths.length);
  }, [healthResults, projects]);

  const totalOverdue = useMemo(() => {
    return projects.reduce((acc, p) => acc + calculateProjectProgress(p).overdueCount, 0);
  }, [projects]);

  const nextDeadline = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const allDeadlines = projects.flatMap(p => [
      ...(p.deadlines || []).map(d => ({ dueDate: d.date, title: d.title, pName: p.name })),
      ...(p.requirements || []).map(r => ({ dueDate: r.deadline, title: r.title, pName: p.name })),
      ...(p.questions || []).map(q => ({ dueDate: q.dueDate, title: q.title, pName: p.name })),
      ...(p.asanaTasks || []).map(t => ({ dueDate: t.dueDate, title: t.title, pName: p.name }))
    ]).filter(d => d.dueDate && (d.dueDate as string) >= today)
      .sort((a, b) => (a.dueDate as string).localeCompare(b.dueDate as string));
    
    return allDeadlines[0] || null;
  }, [projects]);

  // Chart Data: Status Distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  // Chart Data: Priority Distribution
  const priorityData = useMemo(() => {
    const priorities = ['Nízka', 'Stredná', 'Vysoká', 'Kritická'];
    return priorities.map(p => ({
      name: p,
      value: projects.filter(proj => proj.priority === p).length
    }));
  }, [projects]);

  // Chart Data: Progress
  const progressData = useMemo(() => {
    return projects.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
      fullName: p.name,
      id: p.id,
      progress: calculateProjectProgress(p).progress
    })).sort((a, b) => b.progress - a.progress);
  }, [projects]);

  // Chart Data: Open Items by Type and Project
  const itemTypeData = useMemo(() => {
    return projects.slice(0, 5).map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
      fullName: p.name,
      id: p.id,
      requirements: p.requirements.filter(r => r.status !== 'Done').length,
      questions: p.questions.filter(q => q.status !== 'Answered').length,
      risks: p.risks.filter(r => !['Resolved', 'Closed'].includes(r.status)).length,
      asana: p.asanaTasks?.filter(t => t.status !== 'Done').length || 0
    }));
  }, [projects]);

  const atRiskProjects = useMemo(() => {
    return healthResults.filter(h => h.health.score < 75 && !projects.find(p => p.id === h.projectId)?.isClosed)
      .sort((a, b) => a.health.score - b.health.score);
  }, [healthResults, projects]);

  if (projects.length === 0) {
    return (
      <div className="p-8 md:p-20 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner">
          <FolderOpen className="w-12 h-12 md:w-16 md:h-16" />
        </div>
        <div className="space-y-3 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Váš Workspace je prázdny</h2>
          <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed">
            Začnite vytvorením prvého projektu a sledujte jeho progres, riziká a metriky v reálnom čase.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/projects')}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm md:text-base uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" /> Vytvoriť prvý projekt
          </button>
          <button 
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-sm md:text-base uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Library className="w-6 h-6 text-indigo-500" /> Načítať demo dáta
          </button>
        </div>

        <LoadDemoModal 
          isOpen={isDemoModalOpen} 
          onClose={() => setIsDemoModalOpen(false)} 
          onConfirm={loadDemoData}
          hasExistingProjects={projects.length > 0}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em] bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
              Portfolio Intelligence
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4 md:gap-6">
            <div className="p-3 md:p-4 bg-slate-900 rounded-2xl md:rounded-3xl text-white shadow-2xl">
              <Activity className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            Portfolio Overview
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-xl max-w-2xl leading-relaxed italic">
            "Sledujte zdravie, progres a riziká naprieč celým vaším portfóliom projektov."
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('cards')}
              className={cn(
                "p-3 rounded-xl transition-all",
                viewMode === 'cards' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-3 rounded-xl transition-all",
                viewMode === 'table' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => navigate('/projects')}
            className="flex-1 lg:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-5 h-5" /> Vytvoriť Projekt
          </button>
        </div>
      </div>

      {/* Hero Summary Row */}
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
        {[
          { label: 'Projekty', val: projects.length, icon: FolderOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Aktívne', val: activeProjects.length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Ukončené', val: closedProjects.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Health Score', val: `${avgHealth}%`, icon: ShieldCheck, color: avgHealth > 75 ? 'text-emerald-600' : 'text-amber-600', bg: avgHealth > 75 ? 'bg-emerald-50' : 'bg-amber-50', border: avgHealth > 75 ? 'border-emerald-100' : 'border-amber-100' },
          { label: 'Overdue', val: totalOverdue, icon: Clock, color: totalOverdue > 0 ? 'text-rose-600' : 'text-slate-400', bg: totalOverdue > 0 ? 'bg-rose-50' : 'bg-slate-50', border: totalOverdue > 0 ? 'border-rose-100' : 'border-slate-100' },
          { label: 'Next Deadline', val: nextDeadline ? nextDeadline.dueDate : '---', icon: Flag, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
        ].map((s, i) => (
          <div key={i} className={cn("bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all", s.border)}>
            <div className={cn("p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform", s.bg, s.color)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={cn("text-2xl md:text-3xl font-black leading-none mb-1 truncate", s.color)}>{s.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Overview Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Status Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-indigo-600" /> Projekty podľa statusu
            </h3>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={window.innerWidth < 768 ? 80 : 100}
                  paddingAngle={5}
                  dataKey="value"
                  label={window.innerWidth < 768 ? false : ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                {window.innerWidth < 768 && <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-rose-500" /> Projekty podľa priority
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontFamily="Inter"
                  axisLine={false} 
                  tickLine={false} 
                  width={60} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_PALETTE[entry.name] || '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Ranking */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Health Ranking
            </h3>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
            {healthResults.sort((a, b) => b.health.score - a.health.score).map((h, i) => (
              <div 
                key={h.projectId} 
                onClick={() => handleOpenProject(h.projectId)}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{h.projectName}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h.status}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-black shadow-sm",
                  h.health.score > 75 ? "bg-emerald-100 text-emerald-700" : 
                  h.health.score > 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                )}>
                  {h.health.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Progres Projektov
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-none">
                          <p className="text-xs font-black uppercase mb-1">{payload[0].payload.fullName}</p>
                          <p className="text-xl font-black text-indigo-400">{payload[0].value}% Complete</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="#4f46e5" 
                  radius={[10, 10, 0, 0]} 
                  barSize={40}
                  onClick={(data) => data && data.id && handleOpenProject(data.id)}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Open Items Stacked Bar */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-500" /> Otvorené Položky
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemTypeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Bar dataKey="requirements" stackId="a" fill="#4f46e5" name="Reqs" />
                <Bar dataKey="questions" stackId="a" fill="#fbbf24" name="Qs" />
                <Bar dataKey="risks" stackId="a" fill="#f43f5e" name="Risks" />
                <Bar dataKey="asana" stackId="a" fill="#a78bfa" name="Asana" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Need Attention Section */}
      {atRiskProjects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-rose-500 animate-pulse" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Potrebujú Pozornosť</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {atRiskProjects.map(p => (
              <div 
                key={p.projectId} 
                onClick={() => handleOpenProject(p.projectId)}
                className="bg-white p-6 rounded-[2rem] border border-rose-100 shadow-lg shadow-rose-50 hover:shadow-2xl transition-all cursor-pointer group border-l-8 border-l-rose-500"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Kritické Zdravie</p>
                     <h4 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">{p.projectName}</h4>
                   </div>
                   <div className="p-2 bg-rose-50 rounded-xl text-rose-600 font-black text-sm">
                     {p.health.score}%
                   </div>
                </div>
                <div className="space-y-3">
                   {p.health.deductions.slice(0, 2).map((d, i) => (
                     <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{d.count}x {d.label}</span>
                     </div>
                   ))}
                </div>
                <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                   Analyzovať <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects List Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <LayoutGrid className="w-6 h-6 text-slate-900" />
             <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Zoznam Projektov</h2>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex-1 md:max-w-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Hľadať v portfóliu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Všetky Statusy</option>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map(project => {
              const stats = calculateProjectProgress(project);
              const health = calculateProjectHealth(project);
              const isAtRisk = health.score < 75 && !project.isClosed;
              
              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project.id)}
                  className={cn(
                    "bg-white rounded-[2.5rem] border shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col",
                    isAtRisk ? "border-rose-100 ring-4 ring-rose-500/5" : "border-slate-200",
                    project.isClosed && "grayscale opacity-80"
                  )}
                >
                  <div className="p-8 space-y-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-110 transition-all">
                          {project.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.type}</p>
                          <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors truncate">{project.name}</h3>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        health.score > 75 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {health.score}%
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                       {!project.isClosed && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); setHandoverProject(project); }}
                           className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                           title="Odovzdať projekt"
                         >
                           <ArrowRightLeft className="w-4 h-4" />
                         </button>
                       )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 italic h-8">
                      "{project.shortDescription}"
                    </p>

                    <div className="flex flex-wrap gap-2">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                         project.isClosed ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                       )}>
                         {project.status}
                       </span>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                         PRIORITY_PALETTE[project.priority] ? `bg-white border-slate-100` : ""
                       )} style={{ color: PRIORITY_PALETTE[project.priority] }}>
                         {project.priority}
                       </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Progress</span>
                        <span className="text-indigo-600">{stats.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${stats.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-900">{project.metrics.openJira}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Jira Issues</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <p className={cn("text-xs font-black", stats.overdueCount > 0 ? "text-rose-600" : "text-slate-900")}>
                        {stats.overdueCount}
                      </p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Overdue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-900 truncate">{project.targetDate || '---'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Projekt', 'Status', 'Priorita', 'Progress', 'Health', 'Deadline', ''].map((h, i) => (
                      <th key={i} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProjects.map(project => {
                    const stats = calculateProjectProgress(project);
                    const health = calculateProjectHealth(project);
                    return (
                      <tr 
                        key={project.id}
                        onClick={() => handleOpenProject(project.id)}
                        className="hover:bg-indigo-50/30 transition-all cursor-pointer group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
                              {project.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{project.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{project.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase tracking-tight" style={{ color: PRIORITY_PALETTE[project.priority] }}>
                            {project.priority}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4 min-w-[150px]">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${stats.progress}%` }} />
                            </div>
                            <span className="text-xs font-black text-indigo-600 min-w-[36px]">{stats.progress}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-xs font-black shadow-sm",
                            health.score > 75 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {health.score}%
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {project.targetDate}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Global Information / Footer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                     <Database className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight">Portfolio Data Isolation</h3>
                     <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Secure Private Workspace</p>
                  </div>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                 Všetky dáta sú uložené lokálne v tomto prehliadači. Aplikácia neposiela vaše údaje na externé servery.
               </p>
               <div className="flex items-center gap-8">
                  <div className="space-y-1">
                     <p className="text-2xl font-black text-white">{projects.length}</p>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Projects</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="space-y-1">
                     <p className="text-2xl font-black text-indigo-400">{activeProjects.length}</p>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Scope</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                     <Info className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Status Reports</h3>
               </div>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">
                 Tento dashboard slúži ako "Single Source of Truth" pre váš manažment portfólia. 
                 Kliknutím na konkrétny graf alebo projekt získate detailnejšie analytiky.
               </p>
            </div>
            <div className="pt-8">
               <button 
                onClick={() => navigate('/exports')}
                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-3"
               >
                 Generovať Portfólio Report <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      <HandoverModal 
        isOpen={!!handoverProject}
        onClose={() => setHandoverProject(null)}
        project={handoverProject}
      />
    </div>
  );
}
