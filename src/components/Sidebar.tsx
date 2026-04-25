import { useNavigate, useParams, Link, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderOpen, ListChecks, Gavel, 
  HelpCircle, AlertTriangle, MessageSquare, Mic, 
  Bot, Settings, ChevronRight, Share2, 
  TerminalSquare, Download, Layers, Users,
  ShieldCheck, Search, Zap, PieChart, LogOut,
  Calendar, FileText, Link as LinkIcon, Kanban
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  globalPath: string;       // path when no project is active
  projectPath: string;      // path segment when a project is active e.g. "requirements"
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export function getProjectModulePath(projectId: string | undefined, moduleKey: string) {
  if (!projectId) return '/projects';
  if (!moduleKey || moduleKey === '/') return `/projects/${projectId}`;
  return `/projects/${projectId}/${moduleKey}`;
}

const menuGroups: SidebarGroup[] = [
  {
    title: "Core Workspace",
    items: [
      { label: 'Prehľad', icon: LayoutDashboard, globalPath: '/dashboard', projectPath: '' },
      { label: 'Projekty', icon: FolderOpen, globalPath: '/projects', projectPath: '/projects' }, // magic string to always go to /projects
      { label: 'Kalendár a deadliny', icon: Calendar, globalPath: '/projects', projectPath: 'calendar' },
    ]
  },
  {
    title: "Analysis & Quality",
    items: [
      { label: 'Požiadavky', icon: ListChecks, globalPath: '/projects', projectPath: 'requirements' },
      { label: 'Traceability Matrix', icon: Layers, globalPath: '/projects', projectPath: 'traceability' },
      { label: 'Acceptance Criteria & QA', icon: ShieldCheck, globalPath: '/projects', projectPath: 'qa' },
      { label: 'BA Quality Check', icon: PieChart, globalPath: '/projects', projectPath: 'quality-check' },
    ]
  },
  {
    title: "Decisions & Risks",
    items: [
      { label: 'Rozhodnutia', icon: Gavel, globalPath: '/projects', projectPath: 'decisions' },
      { label: 'Otvorené otázky', icon: HelpCircle, globalPath: '/projects', projectPath: 'questions' },
      { label: 'Riziká a závislosti', icon: AlertTriangle, globalPath: '/projects', projectPath: 'risks' },
    ]
  },
  {
    title: "Technical & Data",
    items: [
      { label: 'Prepojené systémy', icon: LinkIcon, globalPath: '/projects', projectPath: 'linked-systems' },
      { label: 'Confluence zdroje', icon: FileText, globalPath: '/projects', projectPath: 'confluence' },
      { label: 'Jira zdroje', icon: FileText, globalPath: '/projects', projectPath: 'jira' },
      { label: 'Kafka / dátové toky', icon: Zap, globalPath: '/projects', projectPath: 'kafka' },
      { label: 'SQL Workspace', icon: TerminalSquare, globalPath: '/projects', projectPath: 'sql' },
      { label: 'Asana tasky', icon: Kanban, globalPath: '/projects', projectPath: 'asana' },
    ]
  },
  {
    title: "Communication",
    items: [
      { label: 'Komunikácia', icon: MessageSquare, globalPath: '/projects', projectPath: 'communications' },
      { label: 'Meetingy a prepisy', icon: Mic, globalPath: '/projects', projectPath: 'meetings' },
      { label: 'Stakeholder mapa', icon: Users, globalPath: '/projects', projectPath: 'stakeholders' },
    ]
  },
  {
    title: "Intelligence & Output",
    items: [
      { label: 'AI Project Agent', icon: Bot, globalPath: '/projects', projectPath: 'ai-agent' },
      { label: 'Exporty', icon: Download, globalPath: '/projects', projectPath: 'exports' },
    ]
  }
];

export function Sidebar() {
  const { activeProject, setActiveProject, projects } = useProject();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();

  const currentProjectId = params.projectId || activeProject?.id;

  const getItemPath = (item: SidebarItem): string => {
    if (item.projectPath === '/projects') return '/projects';
    if (item.label === 'Prehľad' && !currentProjectId) return '/dashboard';
    
    return getProjectModulePath(currentProjectId, item.projectPath);
  };

  const isItemActive = (item: SidebarItem): boolean => {
    const path = getItemPath(item);
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/projects') return location.pathname === '/projects';
    if (path === `/projects/${currentProjectId}`) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 h-full bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 z-50 shrink-0">
      
      {/* Brand */}
      <Link to="/dashboard" className="p-6 border-b border-slate-800/50 block">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 hover:rotate-12 transition-transform duration-500">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tighter leading-none">BA HUB</h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Intelligence Workspace</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar scrollbar-dark">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-3">{group.title}</h3>
            {group.items.map((item) => {
              const active = isItemActive(item);
              const path = getItemPath(item);
              
              return (
                <Link
                  key={`${item.label}-${item.projectPath}`}
                  to={path}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative group",
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-slate-500 group-hover:text-indigo-400"
                  )} />
                  <span className="flex-1 text-left text-xs">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Project Switcher */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        {activeProject ? (
          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">Active Project</p>
            <Link to={`/projects/${activeProject.id}`} className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-3 group block hover:bg-slate-700 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shrink-0">
                {activeProject.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-white truncate group-hover:text-indigo-300 transition-colors">{activeProject.name}</h4>
                <p className="text-[9px] text-slate-500 font-bold">{activeProject.status}</p>
              </div>
            </Link>
            <select 
              value={activeProject.id}
              onChange={e => { setActiveProject(e.target.value); navigate(`/projects/${e.target.value}`); }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 outline-none cursor-pointer"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        ) : (
          <Link 
            to="/projects"
            className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-2xl text-xs font-black text-slate-400 border border-slate-700 border-dashed hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" /> Vybrať Projekt
          </Link>
        )}
        
        <div className="mt-4 flex items-center justify-between px-1">
          <Link to="/settings" className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <Settings className="w-4 h-4" />
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" /> Odhlásiť
          </button>
        </div>
      </div>
    </div>
  );
}
