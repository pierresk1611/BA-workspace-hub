import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Activity as ActivityIcon, Clock, Target, Flag, AlertTriangle, 
  TrendingUp, ShieldCheck, ArrowRight, Layers, HelpCircle, 
  CheckCircle2, Zap, Calendar, ExternalLink, Plus, MessageSquare,
  FileText, Database, ShieldAlert, MoreHorizontal, PieChart, FolderOpen
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateProjectProgress, calculateProjectHealth } from '../lib/projectUtils';
import { cn } from '../lib/utils';

const ITEM_COLORS = {
  requirements: '#4f46e5',
  decisions: '#10b981',
  questions: '#fbbf24',
  risks: '#f43f5e',
  asana: '#a78bfa',
  jira: '#0ea5e9',
  meetings: '#ec4899',
  deadlines: '#6366f1'
};

const SEVERITY_COLORS: Record<string, string> = {
  'Kritická': '#e11d48',
  'Vysoká': '#f43f5e',
  'Stredná': '#f59e0b',
  'Nízka': '#10b981',
};

export function Dashboard() {
  const { activeProject } = useProject();
  const navigate = useNavigate();

  const stats = useMemo(() => activeProject ? calculateProjectProgress(activeProject) : null, [activeProject]);
  const health = useMemo(() => activeProject ? calculateProjectHealth(activeProject) : null, [activeProject]);

  if (!activeProject) {
    return (
      <div className="p-8 md:p-20 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-inner">
          <FolderOpen className="w-12 h-12 md:w-16 md:h-16" />
        </div>
        <div className="space-y-3 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Zatiaľ nemáš vytvorený žiadny projekt.</h2>
          <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed">
            Vyberte si projekt zo zoznamu alebo vytvorte nový, aby ste mohli sledovať jeho metriky.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/projects')}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm md:text-base uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" /> Vytvoriť prvý projekt
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !health) return null;

  const hasData = 
    activeProject.requirements.length > 0 || 
    activeProject.risks.length > 0 || 
    activeProject.decisions.length > 0 ||
    (activeProject.asanaTasks?.length || 0) > 0;

  if (!hasData) {
    return (
      <div className="p-4 md:p-10 flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in duration-700">
        <div className="space-y-6 max-w-2xl">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center text-indigo-600 shadow-2xl mx-auto border border-indigo-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <ActivityIcon className="w-12 h-12 md:w-16 md:h-16 relative z-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Váš projekt je pripravený</h1>
            <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed italic">
              "Každý veľký projekt začína prvou požiadavkou. Pridajte dáta a nechajte agenta analyzovať váš progres."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {[
            { label: 'Pridať Požiadavku', icon: Layers, color: 'bg-indigo-600', path: 'requirements', desc: 'Definujte scope projektu' },
            { label: 'Importovať Asana', icon: Zap, color: 'bg-violet-600', path: 'asana', desc: 'Načítajte úlohy z Asany' },
            { label: 'Vložiť SQL', icon: Database, color: 'bg-slate-900', path: 'sql', desc: 'Prepojte dátové dopyty' },
            { label: 'Zadať Riziko', icon: AlertTriangle, color: 'bg-rose-500', path: 'risks', desc: 'Identifikujte hrozby' }
          ].map((action, i) => (
            <button 
              key={i}
              onClick={() => navigate(`/projects/${activeProject.id}/${action.path}`)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-center space-y-4 group"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg group-hover:scale-110 transition-transform", action.color)}>
                <action.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{action.label}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const itemDistributionData = [
    { name: 'Requirements', value: activeProject.requirements.length, color: ITEM_COLORS.requirements },
    { name: 'Decisions', value: activeProject.decisions.length, color: ITEM_COLORS.decisions },
    { name: 'Questions', value: activeProject.questions.length, color: ITEM_COLORS.questions },
    { name: 'Risks', value: activeProject.risks.length, color: ITEM_COLORS.risks },
    { name: 'Asana', value: activeProject.asanaTasks?.length || 0, color: ITEM_COLORS.asana },
    { name: 'Meetings', value: activeProject.meetings?.length || 0, color: ITEM_COLORS.meetings }
  ].filter(d => d.value > 0);

  const statusBreakdownData = [
    { name: 'Reqs', done: activeProject.requirements.filter(r => r.status === 'Done').length, total: activeProject.requirements.length },
    { name: 'Decs', done: activeProject.decisions.filter(d => d.status === 'Potvrdené').length, total: activeProject.decisions.length },
    { name: 'Risks', done: activeProject.risks.filter(r => r.status === 'Resolved').length, total: activeProject.risks.length },
    { name: 'Asana', done: activeProject.asanaTasks?.filter(t => t.status === 'Done').length || 0, total: activeProject.asanaTasks?.length || 0 }
  ].map(d => ({ ...d, open: d.total - d.done }));

  const riskSeverityData = [
    { name: 'Kritická', value: activeProject.risks.filter(r => r.severity === 'Kritická').length },
    { name: 'Vysoká', value: activeProject.risks.filter(r => r.severity === 'Vysoká').length },
    { name: 'Stredná', value: activeProject.risks.filter(r => r.severity === 'Stredná').length },
    { name: 'Nízka', value: activeProject.risks.filter(r => r.severity === 'Nízka').length }
  ].filter(d => d.value > 0);

  const qualityData = [
    { name: 'Overdue', value: stats.overdueCount, color: '#f43f5e' },
    { name: 'Blocked', value: stats.blockedCount, color: '#f59e0b' },
    { name: 'No Owner', value: health.deductions.find(d => d.type === 'missing_owner')?.count || 0, color: '#fbbf24' },
    { name: 'No Deadline', value: health.deductions.find(d => d.type === 'missing_deadline')?.count || 0, color: '#94a3b8' }
  ];

  const timelineData = [
    { date: 'T-4 Weeks', progress: Math.max(0, stats.progress - 25) },
    { date: 'T-3 Weeks', progress: Math.max(0, stats.progress - 18) },
    { date: 'T-2 Weeks', progress: Math.max(0, stats.progress - 10) },
    { date: 'T-1 Week', progress: Math.max(0, stats.progress - 4) },
    { date: 'Dnes', progress: stats.progress }
  ];

  const quickActions = [
    { label: 'Požiadavka', icon: Layers, color: 'bg-indigo-600', path: 'requirements' },
    { label: 'Rozhodnutie', icon: CheckCircle2, color: 'bg-emerald-600', path: 'decisions' },
    { label: 'Otázka', icon: HelpCircle, color: 'bg-amber-500', path: 'questions' },
    { label: 'Riziko', icon: AlertTriangle, color: 'bg-rose-500', path: 'risks' },
  ];

  const recentActivity = [
    ...(activeProject.requirements || []).map(r => ({ type: 'requirement', title: r.title, date: r.dateCreated || 'Nedávno', icon: Layers, color: 'text-indigo-500' })),
    ...(activeProject.decisions || []).map(d => ({ type: 'decision', title: d.title, date: d.date || 'Nedávno', icon: CheckCircle2, color: 'text-emerald-500' })),
    ...(activeProject.questions || []).map(q => ({ type: 'question', title: q.title, date: q.dueDate || 'Nedávno', icon: MessageSquare, color: 'text-amber-500' })),
    ...(activeProject.meetings || []).map(m => ({ type: 'meeting', title: m.title, date: m.date, icon: Calendar, color: 'text-pink-500' }))
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      
      {/* Project Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        
        {/* Progress & Name Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-50/50 rounded-full group-hover:scale-110 transition-transform duration-1000 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            
            {/* Progress Gauge */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray="264%"
                    strokeDashoffset={`${264 * (1 - stats.progress / 100)}%`}
                    className="text-indigo-600 transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">{stats.progress}%</span>
                  <span className="text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Completion</span>
               </div>
            </div>

            {/* Project Info */}
            <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left w-full">
               <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {activeProject.status}
                    </span>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      SEVERITY_COLORS[activeProject.priority] ? "bg-white" : "bg-slate-100"
                    )} style={{ color: SEVERITY_COLORS[activeProject.priority], borderColor: SEVERITY_COLORS[activeProject.priority] + '33' }}>
                      Priority: {activeProject.priority}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    {activeProject.name}
                  </h1>
                  <p className="text-slate-500 font-medium text-sm md:text-lg italic line-clamp-2">
                    "{activeProject.shortDescription}"
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group/item hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                           <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</span>
                     </div>
                     <span className={cn(
                       "text-xl md:text-2xl font-black",
                       health.score > 75 ? "text-emerald-600" : "text-amber-600"
                     )}>{health.score}% Stable</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group/item hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                           <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
                     </div>
                     <span className="text-xl md:text-2xl font-black text-slate-900">{activeProject.targetDate || '---'}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Health Breakdown Card */}
        <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <ShieldCheck className="w-48 h-48" />
           </div>
           <div className="relative z-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-indigo-400" /> Health Breakdown
              </h3>
              <div className="space-y-6">
                 <div className="flex items-baseline gap-4">
                    <span className={cn(
                      "text-6xl md:text-8xl font-black tracking-tighter",
                      health.score > 75 ? "text-emerald-400" : "text-amber-400"
                    )}>{health.score}</span>
                    <span className="text-xl font-bold text-slate-500">/ 100</span>
                 </div>
                 <div className="space-y-4">
                    {health.deductions.length > 0 ? (
                      health.deductions.slice(0, 3).map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-bold">
                           <span className="text-slate-400 flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> {d.label}
                           </span>
                           <span className="text-rose-400">{d.points} pts</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                         <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                         <span className="text-xs font-bold text-emerald-100">Všetky faktory sú v norme.</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>
           <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
              <button 
                onClick={() => navigate(`/projects/${activeProject.id}/quality`)}
                className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Full Quality Audit <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
        {[
          { label: 'Reqs', val: activeProject.requirements.length, icon: Layers, color: ITEM_COLORS.requirements, path: 'requirements' },
          { label: 'Decs', val: activeProject.decisions.length, icon: CheckCircle2, color: ITEM_COLORS.decisions, path: 'decisions' },
          { label: 'Qs', val: activeProject.questions.length, icon: HelpCircle, color: ITEM_COLORS.questions, path: 'questions' },
          { label: 'Risks', val: activeProject.risks.length, icon: ShieldAlert, color: ITEM_COLORS.risks, path: 'risks' },
          { label: 'Asana', val: activeProject.asanaTasks?.length || 0, icon: Zap, color: ITEM_COLORS.asana, path: 'asana' },
          { label: 'Meetings', val: activeProject.meetings?.length || 0, icon: MessageSquare, color: ITEM_COLORS.meetings, path: 'meetings' },
          { label: 'Overdue', val: stats.overdueCount, icon: Clock, color: stats.overdueCount > 0 ? '#f43f5e' : '#94a3b8', path: 'calendar' },
          { label: 'Trace', val: 'Matrix', icon: Database, color: '#6366f1', path: 'traceability' },
        ].map((k, i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/projects/${activeProject.id}/${k.path}`)}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group flex flex-col items-center text-center gap-3"
          >
            <div className="p-3 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: k.color + '15', color: k.color }}>
              <k.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">{k.val}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        
        {/* Progress Trend */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-indigo-600" /> Progress Trend
              </h3>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                 Last 30 Days
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={timelineData}>
                    <defs>
                       <linearGradient id="colorProgProj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                       itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorProgProj)" dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Item Types Distribution */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <PieChart className="w-4 h-4 text-violet-600" /> Item Distribution
              </h3>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                    <Pie
                       data={itemDistributionData}
                       cx="50%"
                       cy="50%"
                       innerRadius={65}
                       outerRadius={95}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {itemDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                 </RePieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-xl font-black text-slate-900">{activeProject.requirements.length}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Business Scope</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-xl font-black text-slate-900">{activeProject.decisions.length}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Signed Off</p>
              </div>
           </div>
        </div>

        {/* Statuses Stacked Bar */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-emerald-600" /> Completion Status
           </h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={statusBreakdownData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} width={50} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="done" stackId="s1" fill="#10b981" name="Done" radius={[0, 0, 0, 0]} barSize={16} />
                    <Bar dataKey="open" stackId="s1" fill="#e2e8f0" name="Open" radius={[0, 8, 8, 0]} barSize={16} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Quality Overview Bar Chart */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Data Quality Issues
           </h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={qualityData} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={30}>
                       {qualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              Zobrazené faktory ovplyvňujú health score o {(100 - health.score)}%
           </p>
        </div>

        {/* Risks by Severity Donut */}
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Risks by Severity
           </h3>
           <div className="h-[250px] w-full">
              {riskSeverityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie
                         data={riskSeverityData}
                         cx="50%"
                         cy="50%"
                         innerRadius={50}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                      >
                         {riskSeverityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#94a3b8'} />
                         ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                   </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-30">
                   <ShieldCheck className="w-16 h-16 text-emerald-500" />
                   <p className="text-xs font-black uppercase tracking-widest">Žiadne aktívne riziká</p>
                </div>
              )}
           </div>
           <div className="flex flex-wrap justify-center gap-3">
              {Object.keys(SEVERITY_COLORS).map(s => (
                <div key={s} className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[s] }} />
                   <span className="text-[8px] font-black text-slate-400 uppercase">{s}</span>
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* Activity & Timeline & Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 pb-12">
         
         {/* Recent Activity */}
         <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 border border-slate-200 shadow-xl lg:col-span-1">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Recent Activity</h3>
               <button className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
               </button>
            </div>
            <div className="space-y-6">
               {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 group cursor-pointer">
                     <div className={cn("p-2.5 rounded-xl bg-slate-50 transition-all group-hover:scale-110", a.color)}>
                        <a.icon className="w-4 h-4" />
                     </div>
                     <div className="min-w-0 flex-1 border-b border-slate-50 pb-4">
                        <h5 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{a.title}</h5>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{a.type}</span>
                           <span className="text-slate-200">•</span>
                           <span className="text-[9px] font-medium text-slate-400">{a.date}</span>
                        </div>
                     </div>
                  </div>
               ))}
               {recentActivity.length === 0 && (
                 <p className="text-xs font-bold text-slate-400 italic text-center py-10">Žiadna nedávna aktivita.</p>
               )}
            </div>
         </div>

         {/* Upcoming Milestones */}
         <div className="bg-indigo-600 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl lg:col-span-1 relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <h3 className="text-xs font-black text-indigo-200 uppercase tracking-[0.2em] mb-10 relative z-10 flex items-center gap-2">
               <Flag className="w-4 h-4" /> Next Milestones
            </h3>
            <div className="space-y-8 relative z-10">
               {activeProject.milestones.slice(0, 3).map((m, i) => (
                  <div key={i} className="relative pl-8 border-l border-white/20 pb-2">
                     <div className={cn(
                       "absolute -left-2 top-0 w-4 h-4 rounded-full border-4 border-indigo-600 shadow-xl",
                       m.status === 'Completed' ? "bg-emerald-400" : m.status === 'In Progress' ? "bg-white animate-pulse" : "bg-indigo-400"
                     )} />
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <h5 className="text-sm font-black text-white">{m.title}</h5>
                           <span className="text-[9px] font-black text-indigo-200">{m.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: `${m.progress}%` }} />
                           </div>
                           <span className="text-[9px] font-black">{m.progress}%</span>
                        </div>
                     </div>
                  </div>
               ))}
               {activeProject.milestones.length === 0 && (
                 <p className="text-xs font-bold text-indigo-200 italic py-10 text-center">Žiadne míľniky.</p>
               )}
            </div>
         </div>

         {/* Quick Actions & Links */}
         <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 border border-slate-200 shadow-xl lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-8">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, i) => (
                     <button 
                       key={i}
                       onClick={() => navigate(`/projects/${activeProject.id}/${action.path}`)}
                       className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 hover:shadow-lg transition-all flex flex-col items-center gap-3 group"
                     >
                        <div className={cn("p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg", action.color)}>
                           <action.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{action.label}</span>
                     </button>
                  ))}
               </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
               <button 
                 onClick={() => navigate(`/projects/${activeProject.id}/reports`)}
                 className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
               >
                 <FileText className="w-4 h-4" /> Generate Report
               </button>
               <div className="flex items-center justify-center gap-6">
                  <button className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
                     <ExternalLink className="w-3 h-3" /> Confluence
                  </button>
                  <button className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1.5">
                     <ExternalLink className="w-3 h-3" /> Jira Board
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
