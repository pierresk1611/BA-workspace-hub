import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  Activity as ActivityIcon, Clock, 
  Target, Flag, AlertTriangle, TrendingUp, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateProjectProgress } from '../lib/projectUtils';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { activeProject } = useProject();

  if (!activeProject) return null;

  const stats = calculateProjectProgress(activeProject);

  const colors = {
    progress: '#4f46e5',
    health: stats.health > 80 ? '#10b981' : stats.health > 50 ? '#f59e0b' : '#ef4444',
    background: '#f8fafc'
  };

  const chartData = [
    { name: 'Požiadavky', value: stats.reqProgress, color: '#4f46e5' },
    { name: 'Jira', value: stats.jiraProgress, color: '#0ea5e9' },
    { name: 'Asana', value: stats.asanaProgress, color: '#8b5cf6' },
    { name: 'Milestony', value: stats.milestoneProgress, color: '#ec4899' }
  ];

  const timelineData = [
    { date: '2026-03-01', progress: 5 },
    { date: '2026-03-15', progress: 12 },
    { date: '2026-04-01', progress: 22 },
    { date: '2026-04-15', progress: 31 },
    { date: '2026-04-25', progress: stats.progress }
  ];

  const currentMilestone = activeProject.milestones.find(m => m.status === 'In Progress') || 
                           activeProject.milestones.find(m => m.status === 'Upcoming');

  const blockers = [
    { title: "Posila flow", owner: "Peter (BA)", status: "Blocking Analysis" },
    { title: "XL integration scope", owner: "Katka (PO)", status: "Awaiting Stakeholder Decision" },
    { title: "GPS rules", owner: "Marek (Tech Lead)", status: "Technical Verification" }
  ];

  const asanaOverdue = activeProject.asanaTasks?.filter(t => 
    t.dueDate && t.dueDate < new Date().toISOString().split('T')[0] && t.status !== 'Done'
  ).length || 0;
  
  const asanaNextDue = activeProject.asanaTasks
    ?.filter(t => t.dueDate && t.dueDate >= new Date().toISOString().split('T')[0] && t.status !== 'Done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]?.dueDate || 'None';

  const asanaWarnings = activeProject.asanaTasks?.reduce((acc, t) => acc + (t.warnings?.length || 0), 0) || 0;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - stats.progress / 100)}
                  className="text-indigo-600 transition-all duration-1000 ease-out" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{stats.progress}%</span>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Progress</span>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeProject.name}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Status: {activeProject.status}</p>
                </div>
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</span>
                  </div>
                  <span className="text-xl font-black text-slate-900">+12% / week</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
                  </div>
                  <span className="text-xl font-black text-slate-900">{activeProject.targetDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ActivityIcon className="w-32 h-32" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Project Health</h3>
              <div className={`p-2 rounded-xl text-white shadow-lg`} style={{ backgroundColor: colors.health }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter" style={{ color: colors.health }}>{stats.health}</span>
              <span className="text-xl font-bold text-slate-300">/ 100</span>
            </div>
            <p className="text-sm text-slate-500 mt-4 font-medium italic">
              Health score je ovplyvnený {stats.overdueCount} overdue položkami a kritickými rizikami.
            </p>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex items-center justify-between text-xs font-bold">
               <span className="text-slate-400 uppercase tracking-tight">Stable Factors</span>
               <span className="text-emerald-500">82%</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-[82%] rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Asana Operational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-rose-600 rounded-[2rem] p-8 text-white shadow-xl shadow-rose-100 relative overflow-hidden">
           <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-70">Asana Tasks</p>
           <p className="text-4xl font-black mb-2">{activeProject.asanaTasks?.length || 0}</p>
           <p className="text-xs font-bold opacity-70">Importované úlohy</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Clock className="w-4 h-4 text-rose-500" /> Overdue
           </p>
           <p className={cn("text-4xl font-black mb-2", asanaOverdue > 0 ? "text-rose-600" : "text-emerald-600")}>
             {asanaOverdue}
           </p>
           <p className="text-xs font-bold text-slate-400">Úlohy po termíne</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Flag className="w-4 h-4 text-indigo-500" /> Next Due
           </p>
           <p className="text-2xl font-black text-slate-900 mb-2">{asanaNextDue}</p>
           <p className="text-xs font-bold text-slate-400">Najbližší deadline</p>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-amber-500" /> Warnings
           </p>
           <p className={cn("text-4xl font-black mb-2", asanaWarnings > 0 ? "text-amber-600" : "text-emerald-600")}>
             {asanaWarnings}
           </p>
           <p className="text-xs font-bold text-slate-400">Quality issues v importe</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Progress Over Time</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase rounded-lg">Week</button>
              <button className="px-3 py-1 text-slate-400 text-[10px] font-black uppercase rounded-lg">Month</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorProg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="progress" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorProg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Areas Completion Bar Chart */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Areas Completion</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Bar key={index} dataKey="value" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Footer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        
        {/* Next Milestone Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Flag className="w-16 h-16 text-indigo-600" />
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Next Milestone</h3>
          {currentMilestone ? (
            <div className="space-y-4">
              <h4 className="text-xl font-black text-slate-900 leading-tight">{currentMilestone.title}</h4>
              <div className="flex items-center justify-between text-[10px] font-black">
                <span className="text-indigo-600 uppercase">{currentMilestone.progress}% DONE</span>
                <span className="text-slate-400">{currentMilestone.dueDate}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${currentMilestone.progress}%` }}></div>
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-slate-400 italic">Všetky milestony dokončené.</p>
          )}
        </div>

        {/* Blockers Card */}
        <div className="bg-rose-50 rounded-3xl p-8 shadow-lg border border-rose-100">
          <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Active Blockers
          </h3>
          <div className="space-y-4">
            {blockers.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></div>
                <div>
                  <h5 className="text-sm font-black text-slate-900">{b.title}</h5>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tighter">{b.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines Card */}
        <div className="bg-amber-50 rounded-3xl p-8 shadow-lg border border-amber-100">
          <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Overdue Deadlines
          </h3>
          <div className="flex items-center gap-6">
            <span className="text-6xl font-black text-amber-600">{stats.overdueCount}</span>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 leading-tight">Položky po deadline vyžadujú okamžitú akciu.</p>
              <button className="text-[10px] font-black text-amber-600 uppercase hover:underline flex items-center gap-1">
                Zobraziť v kalendári <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
