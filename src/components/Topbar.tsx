import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, LogOut, ChevronDown, Menu, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { GlobalSearch } from './GlobalSearch';
import { NotificationCenter } from './NotificationCenter';
import { calculateProjectHealth } from '../lib/projectUtils';

const MODULE_LABELS: Record<string, string> = {
  'requirements': 'Požiadavky',
  'decisions': 'Decision Log',
  'questions': 'Open Questions',
  'risks': 'Riziká & Závislosti',
  'sql': 'SQL Sandbox',
  'diagrams': 'Diagramy',
  'kafka': 'Kafka Flows',
  'communications': 'Komunikácia',
  'meetings': 'Meetingy',
  'stakeholders': 'Stakeholders',
  'ai-agent': 'AI Intelligence',
  'exports': 'Exporty',
  'traceability': 'Traceability',
  'qa': 'QA & Akceptácie',
  'quality-check': 'Quality Audit',
  'calendar': 'Kalendár',
  'linked-systems': 'Systémy',
  'confluence': 'Confluence',
  'jira': 'Jira',
  'asana': 'Asana',
};



interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { activeProject, setActiveProject, projects } = useProject();
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ projectId?: string; module?: string }>();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build breadcrumbs based on current route
  const buildBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs: { label: string; path: string }[] = [];

    crumbs.push({ label: 'Dashboard', path: '/dashboard' });

    if (segments[0] === 'projects') {
      crumbs.push({ label: 'Projekty', path: '/projects' });

      const projectId = segments[1];
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          crumbs.push({ label: project.name, path: `/projects/${projectId}` });

          const module = segments[2];
          if (module && MODULE_LABELS[module]) {
            crumbs.push({ label: MODULE_LABELS[module], path: location.pathname });
          }
        }
      }
    }

    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();
  const currentProjectId = params.projectId;
  const displayedProject = currentProjectId ? projects.find(p => p.id === currentProjectId) : activeProject;

  return (
    <header className="h-16 lg:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 w-full">
      
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
          aria-label="Otvoriť menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs - hidden on very small screens or compact */}
        <nav className="hidden sm:flex items-center gap-1 min-w-0">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1 min-w-0">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-xs font-black text-slate-900 truncate max-w-[120px] md:max-w-[180px]">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Brand Mobile Fallback (if no breadcrumbs) */}
        <div className="sm:hidden flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
           </div>
           <span className="text-sm font-black text-slate-900 tracking-tight">BA HUB</span>
        </div>
      </div>

      {/* Right: Search + Notifications + User */}
      <div className="flex items-center gap-2 md:gap-4 ml-2">
        
        {/* Search - hidden on mobile, or compact icon */}
        <div className="hidden lg:flex items-center max-w-sm mr-2">
          <GlobalSearch />
        </div>

        {/* Project Context - compact on mobile */}
        {displayedProject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
             <div className={cn(
               "w-2 h-2 rounded-full",
               calculateProjectHealth(displayedProject).score > 80 ? 'bg-emerald-500' : 'bg-amber-500'
             )} />
             <span className="text-[10px] font-black text-slate-900 truncate max-w-[80px]">
               {displayedProject.name}
             </span>
          </div>
        )}

        {/* Notifications */}
        <NotificationCenter />

        {/* User - compact on mobile */}
        <button className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{username || 'BA'}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Lead</span>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg">
            {username ? username.charAt(0).toUpperCase() : 'BA'}
          </div>
        </button>
      </div>
    </header>
  );
}
