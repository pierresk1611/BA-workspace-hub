import { useNavigate, useParams, Link, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, Network, FileText, ListTodo, Database,
  TerminalSquare, CheckSquare, Calendar, ListChecks, Gavel, CircleHelp,
  TriangleAlert, MessageSquare, Video, Bot, Download, GitBranch, Users,
  ClipboardCheck, ShieldCheck, Settings, Search, LogOut, ChevronRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  projectScoped: boolean;
}

export function buildSidebarPath(item: SidebarItem, projectId: string | undefined): string {
  if (item.key === "overview") {
    return projectId ? `/projects/${projectId}` : "/dashboard";
  }
  if (item.key === "projects") {
    return "/projects";
  }
  if (item.key === "settings") {
    return "/settings";
  }
  if (item.projectScoped) {
    return projectId ? `/projects/${projectId}/${item.path}` : "/projects";
  }
  return item.path || "/";
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "Core Workspace",
    items: [
      { key: "overview", label: "Prehľad", icon: LayoutDashboard, projectScoped: false },
      { key: "projects", label: "Projekty", icon: FolderKanban, projectScoped: false },
    ]
  },
  {
    title: "Analysis & Quality",
    items: [
      { key: "requirements", label: "Požiadavky", icon: ListChecks, path: "requirements", projectScoped: true },
      { key: "traceability", label: "Traceability Matrix", icon: GitBranch, path: "traceability", projectScoped: true },
      { key: "qa", label: "Acceptance Criteria & QA", icon: ClipboardCheck, path: "qa", projectScoped: true },
      { key: "quality-check", label: "BA Quality Check", icon: ShieldCheck, path: "quality-check", projectScoped: true },
    ]
  },
  {
    title: "Decisions & Risks",
    items: [
      { key: "decisions", label: "Rozhodnutia", icon: Gavel, path: "decisions", projectScoped: true },
      { key: "questions", label: "Otvorené otázky", icon: CircleHelp, path: "questions", projectScoped: true },
      { key: "risks", label: "Riziká a závislosti", icon: TriangleAlert, path: "risks", projectScoped: true },
    ]
  },
  {
    title: "Technical & Data",
    items: [
      { key: "linked-systems", label: "Prepojené systémy", icon: Network, path: "linked-systems", projectScoped: true },
      { key: "confluence", label: "Confluence zdroje", icon: FileText, path: "confluence", projectScoped: true },
      { key: "jira", label: "Jira zdroje", icon: ListTodo, path: "jira", projectScoped: true },
      { key: "kafka", label: "Kafka / dátové toky", icon: Database, path: "kafka", projectScoped: true },
      { key: "sql", label: "SQL Workspace", icon: TerminalSquare, path: "sql", projectScoped: true },
    ]
  },
  {
    title: "Task Management",
    items: [
      { key: "asana", label: "Asana tasky", icon: CheckSquare, path: "asana", projectScoped: true },
      { key: "calendar", label: "Kalendár a deadliny", icon: Calendar, path: "calendar", projectScoped: true },
    ]
  },
  {
    title: "Communication",
    items: [
      { key: "communications", label: "Komunikácia", icon: MessageSquare, path: "communications", projectScoped: true },
      { key: "meetings", label: "Meetingy a prepisy", icon: Video, path: "meetings", projectScoped: true },
      { key: "stakeholders", label: "Stakeholder mapa", icon: Users, path: "stakeholders", projectScoped: true },
    ]
  },
  {
    title: "Intelligence & Output",
    items: [
      { key: "ai-agent", label: "AI Project Agent", icon: Bot, path: "ai-agent", projectScoped: true },
      { key: "exports", label: "Exporty", icon: Download, path: "exports", projectScoped: true },
    ]
  },
  {
    title: "System",
    items: [
      { key: "settings", label: "Nastavenia", icon: Settings, path: "settings", projectScoped: false },
    ]
  }
];

export function Sidebar() {
  const { activeProject, setActiveProject, projects } = useProject();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();

  // derive project state from URL as requested
  const currentProjectId = params.projectId;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isItemActive = (item: SidebarItem, path: string) => {
    if (item.key === 'overview') return location.pathname === '/dashboard' || location.pathname === path;
    if (item.key === 'projects') return location.pathname === '/projects';
    if (item.key === 'settings') return location.pathname === '/settings';
    
    if (item.projectScoped) {
      if (!currentProjectId) return false;
      return location.pathname === path || location.pathname.startsWith(path + '/');
    }
    
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-72 h-full bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 z-50 shrink-0">
      
      {/* Brand */}
      <Link to="/dashboard" className="p-6 border-b border-slate-800/50 block hover:bg-slate-800/50 transition-colors">
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
        {sidebarGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-3">{group.title}</h3>
            {group.items.map((item) => {
              const path = buildSidebarPath(item, currentProjectId);
              const active = isItemActive(item, path);
              
              return item.projectScoped && !currentProjectId ? (
                <div
                  key={item.key}
                  title="Najprv vytvor alebo vyber projekt."
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold opacity-30 cursor-not-allowed group grayscale"
                >
                  <item.icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="flex-1 text-left text-xs">{item.label}</span>
                </div>
              ) : (
                <NavLink
                  key={item.key}
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
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Project Switcher */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        {activeProject && currentProjectId ? (
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
              value={currentProjectId}
              onChange={e => { 
                const selectedId = e.target.value;
                setActiveProject(selectedId); 
                navigate(`/projects/${selectedId}`); 
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 outline-none cursor-pointer"
            >
              <optgroup label="AKTÍVNE PROJEKTY" className="bg-slate-900 text-indigo-400">
                {projects.filter(p => !p.isClosed).map(p => <option key={p.id} value={p.id} className="bg-slate-800 text-slate-300">{p.name}</option>)}
              </optgroup>
              <optgroup label="UKONČENÉ PROJEKTY" className="bg-slate-900 text-slate-500">
                {projects.filter(p => p.isClosed).map(p => <option key={p.id} value={p.id} className="bg-slate-800 text-slate-500">{p.name} (Ukončené)</option>)}
              </optgroup>
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
        
        <div className="mt-4 flex items-center justify-end px-1">
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
