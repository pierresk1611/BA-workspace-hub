import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, LogOut, ChevronDown } from 'lucide-react';
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

export function Topbar() {
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
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 min-w-0">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1 min-w-0">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-xs font-black text-slate-900 truncate max-w-[180px]">{crumb.label}</span>
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
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm">
        <GlobalSearch />
      </div>

      {/* Right: Project context + User */}
      <div className="flex items-center gap-4 ml-4">
        
        {/* Project Selector */}
        {currentProjectId && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:inline-block">Aktívny Projekt</span>
            <select 
              value={params.projectId || activeProject?.id || ''}
              onChange={e => { 
                const selectedId = e.target.value;
                if (selectedId === 'create') {
                  navigate('/projects');
                  return;
                }
                setActiveProject(selectedId); 
                const currentModule = location.pathname.split('/')[3];
                navigate(currentModule ? `/projects/${selectedId}/${currentModule}` : `/projects/${selectedId}`);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 outline-none cursor-pointer hover:border-indigo-300 transition-all"
            >
              <option value="" disabled>Vyber projekt...</option>
              {projects.length === 0 && <option value="" disabled>Žiadne projekty</option>}
              <optgroup label="AKTÍVNE PROJEKTY">
                {projects.filter(p => !p.isClosed).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
              <optgroup label="UKONČENÉ PROJEKTY">
                {projects.filter(p => p.isClosed).map(p => <option key={p.id} value={p.id}>{p.name} (Ukončené)</option>)}
              </optgroup>
              <option value="create">+ Vytvoriť projekt...</option>
            </select>
          </div>
        )}

        {/* Health */}
        {displayedProject && (() => {
          const healthScore = calculateProjectHealth(displayedProject).score;
          return (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</span>
              <span className={`text-xs font-black ${healthScore > 80 ? 'text-emerald-600' : healthScore > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                {healthScore}%
              </span>
            </div>
          );
        })()}

        {/* Notifications */}
        <NotificationCenter />

        <div className="w-px h-6 bg-slate-200" />

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 group">
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{username || 'BA User'}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lead Analyst</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-lg">
              {username ? username.charAt(0).toUpperCase() : 'BA'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Odhlásiť sa"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
