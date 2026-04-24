import { 
  AlertCircle, Calendar, Clock, Database, CheckSquare, 
  HelpCircle, MessageSquare, Plus, FileText, Kanban, Bot, ShieldCheck,
  TrendingUp, Download, Network
} from "lucide-react";
import { mockProject } from "../data/mockProject";
import { cn } from "../lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

function MetricCard({ title, value, icon: Icon, trend, className, valueClass }: any) {
  return (
    <div className={cn("bg-white p-5 rounded-xl border border-slate-200 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className={cn("text-2xl font-bold text-slate-800", valueClass)}>{value}</h2>
        {trend && <span className="text-xs font-medium text-slate-500">{trend}</span>}
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, primary }: any) {
  return (
    <button className={cn(
      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-sm font-medium",
      primary 
        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 shadow-sm"
        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:shadow-sm"
    )}>
      <Icon className={cn("w-5 h-5", primary ? "text-blue-600" : "text-slate-400")} />
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

export function Dashboard() {
  const { metrics, charts, upcomingMeetings, recentActivities, team } = mockProject;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{mockProject.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
              {mockProject.status}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              Priorita: {mockProject.priority}
            </span>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl">{mockProject.description}</p>
        </div>
        
        <div className="flex gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <span className="block text-xs text-slate-400 font-medium">Business Analyst</span>
            <span className="font-semibold">{team.businessAnalyst}</span>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">Product Owner</span>
            <span className="font-semibold">{team.productOwner}</span>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div>
            <span className="block text-xs text-slate-400 font-medium">Tech Lead</span>
            <span className="font-semibold">{team.techLead}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Celkový progres" value={`${metrics.progress}%`} icon={TrendingUp} trend={`Cieľ: ${mockProject.release}`} />
        <MetricCard title="Health Score" value={`${metrics.healthScore}%`} icon={ShieldCheck} valueClass={metrics.healthScore > 70 ? "text-green-600" : "text-amber-500"} />
        <MetricCard title="Najbližší deadline" value={metrics.nearestDeadline} icon={Calendar} trend="O 16 dní" />
        <MetricCard 
          title="Overdue položky" 
          value={metrics.overdueItems} 
          icon={AlertCircle} 
          className="border-red-200 bg-red-50/50"
          valueClass="text-red-600"
          trend="Vyžaduje pozornosť"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Charts & Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Progres v čase</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.progressOverTime}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Tasky podľa statusu</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.tasksByStatus} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {charts.tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Rýchle akcie</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <QuickActionButton icon={FileText} label="Pridať Confluence text" primary />
              <QuickActionButton icon={Kanban} label="Pridať Jira text" primary />
              <QuickActionButton icon={Bot} label="Vygenerovať AI summary" primary />
              <QuickActionButton icon={Database} label="Pridať SQL dotaz" />
              <QuickActionButton icon={Network} label="Pridať Kafka link" />
              <QuickActionButton icon={MessageSquare} label="Vložiť Teams/Mail" />
              <QuickActionButton icon={Clock} label="Pridať deadline" />
              <QuickActionButton icon={ShieldCheck} label="BA Quality Check" />
              <QuickActionButton icon={Download} label="Export status report" />
              <QuickActionButton icon={Plus} label="Pridať projekt" />
            </div>
          </div>

        </div>

        {/* Right Column - Lists & Summaries */}
        <div className="col-span-1 space-y-6">
          
          {/* Summary Stats */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Otvorené položky a znalosti</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3"><CheckSquare className="w-4 h-4 text-blue-500" /><span className="text-sm font-medium">Otvorené Jira tasky</span></div>
                <span className="font-bold text-slate-700">{metrics.openJira}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3"><HelpCircle className="w-4 h-4 text-amber-500" /><span className="text-sm font-medium">Otvorené otázky</span></div>
                <span className="font-bold text-slate-700">{metrics.openQuestions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3"><CheckSquare className="w-4 h-4 text-green-500" /><span className="text-sm font-medium">Potvrdené rozhodnutia</span></div>
                <span className="font-bold text-slate-700">{metrics.decisions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3"><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-medium">Vysoké riziká</span></div>
                <span className="font-bold text-slate-700">{metrics.highRisks}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="text-xl font-bold text-indigo-700">{metrics.sqlQueries}</div>
                  <div className="text-xs font-medium text-indigo-600 mt-1">SQL Dotazov</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-xl font-bold text-purple-700">{metrics.sqlResults}</div>
                  <div className="text-xs font-medium text-purple-600 mt-1">SQL Výsledkov</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Najbližšie mítingy</h3>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-blue-200">
                    {meeting.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{meeting.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {meeting.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Posledné aktivity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-slate-200">
                    {activity.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
