import { useNavigate, useParams, NavLink, Link } from 'react-router-dom';
import { X, Bot, LogOut, ChevronRight } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { sidebarGroups, buildSidebarPath } from './Sidebar';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { activeProject, projects, setActiveProject } = useProject();
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const params = useParams<{ projectId?: string }>();
  const currentProjectId = params.projectId;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "relative w-[85%] max-w-[320px] bg-slate-900 shadow-2xl flex flex-col h-full transition-transform duration-300 ease-out transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight leading-none">BA HUB</h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-xl active:scale-95"
            aria-label="Zavrieť menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context / Switcher */}
        <div className="p-5 border-b border-slate-800 bg-slate-800/20 shrink-0 space-y-3">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Aktívny Projekt</p>
           {activeProject && currentProjectId ? (
             <div className="space-y-3">
                <div className="w-full bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg">
                    {activeProject.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-black text-white truncate">{activeProject.name}</h4>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">{activeProject.status}</p>
                  </div>
                </div>
                <div className="relative">
                  <select 
                    value={currentProjectId}
                    onChange={e => { 
                      const selectedId = e.target.value;
                      setActiveProject(selectedId); 
                      navigate(`/projects/${selectedId}`); 
                      onClose();
                    }}
                    className="w-full h-10 px-4 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 outline-none appearance-none cursor-pointer pr-10 focus:border-indigo-500 transition-colors"
                  >
                    <optgroup label="AKTÍVNE PROJEKTY">
                      {projects.filter(p => !p.isClosed).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                    <optgroup label="UKONČENÉ PROJEKTY">
                      {projects.filter(p => p.isClosed).map(p => <option key={p.id} value={p.id}>{p.name} (Ukončené)</option>)}
                    </optgroup>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>
             </div>
           ) : (
             <button 
               onClick={() => { navigate('/projects'); onClose(); }}
               className="w-full py-3.5 bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl text-[10px] font-black text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
             >
               + Vybrať Projekt
             </button>
           )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar scrollbar-dark">
          {sidebarGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const path = buildSidebarPath(item, currentProjectId);
                  const isDisabled = item.projectScoped && !currentProjectId;
                  
                  return (
                    <NavLink
                      key={item.key}
                      to={isDisabled ? '#' : path}
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                          return;
                        }
                        onClose();
                      }}
                      className={({ isActive }) => cn(
                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all min-h-[48px]",
                        isActive && !isDisabled
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                          : isDisabled 
                            ? "text-slate-600 opacity-40 grayscale cursor-not-allowed" 
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={cn("w-5 h-5", isActive && !isDisabled ? "text-white" : "text-slate-500")} />
                          <span className="flex-1">{item.label}</span>
                          {!isDisabled && <ChevronRight className="w-4 h-4 opacity-30" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 shrink-0 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
           <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-white font-black text-xs border border-slate-700">
                {username ? username.charAt(0).toUpperCase() : 'BA'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white leading-none mb-1 truncate">{username || 'Lead Analyst'}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Session</p>
              </div>
           </div>
           <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 h-12 bg-rose-900/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-rose-900/30 active:scale-95"
            >
              <LogOut className="w-4 h-4" /> Odhlásiť sa
            </button>
        </div>

      </div>
    </div>
  );
}
