import { useState, useEffect, useRef } from 'react';
import { 
  Search, X, FileText, 
  TerminalSquare, CheckSquare, ListChecks,
  Gavel, HelpCircle, AlertTriangle, MessageSquare, 
  Mic, Zap, LayoutDashboard, ChevronRight,
  Clock, Tag, Share2, Download, Users, ShieldCheck
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  type: string;
  category: string;
  title: string;
  subtitle?: string;
  date?: string;
  deadline?: string;
  priority?: string;
  status?: string;
  view: string;
}

export function GlobalSearch() {
  const { activeProject, projects } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchAll = () => {
      const q = query.toLowerCase();
      const items: SearchResult[] = [];

      if (!activeProject) return [];

      // 1. Projects
      projects.forEach(p => {
        if (p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)) {
          items.push({ id: p.id, type: 'Project', category: 'Projects', title: p.name, subtitle: p.shortDescription, view: 'Projekty' });
        }
      });

      // 2. Requirements
      activeProject.requirements.forEach(r => {
        if (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) {
          items.push({ id: r.id, type: 'Requirement', category: 'Analysis', title: r.title, subtitle: r.description, status: r.status, deadline: r.deadline, priority: r.priority, view: 'Požiadavky' });
        }
      });

      // 3. Decisions
      activeProject.decisions.forEach(d => {
        if (d.title.toLowerCase().includes(q) || d.decisionText.toLowerCase().includes(q) || d.context.toLowerCase().includes(q)) {
          items.push({ id: d.id, type: 'Decision', category: 'Analysis', title: d.title, subtitle: d.decisionText, status: d.status, deadline: d.reviewDeadline, view: 'Rozhodnutia' });
        }
      });

      // 4. Questions
      activeProject.questions.forEach(qs => {
        if (qs.title.toLowerCase().includes(q) || qs.context.toLowerCase().includes(q)) {
          items.push({ id: qs.id, type: 'Question', category: 'Analysis', title: qs.title, subtitle: qs.context, status: qs.status, deadline: qs.dueDate, priority: qs.priority, view: 'Otvorené otázky' });
        }
      });

      // 5. Risks & Dependencies
      activeProject.risks.forEach(r => {
        if (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
          items.push({ id: r.id, type: 'Risk', category: 'Management', title: r.title, subtitle: r.description, status: r.status, deadline: r.mitigationDeadline, priority: r.severity, view: 'Riziká a závislosti' });
        }
      });

      // 6. Asana Tasks
      activeProject.asanaTasks.forEach(t => {
        if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
          items.push({ id: t.id, type: 'Asana Task', category: 'Execution', title: t.title, subtitle: t.description, status: t.status, deadline: t.dueDate, priority: t.priority, view: 'Asana tasky' });
        }
      });

      // 7. Communications
      activeProject.communications.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.manualText.toLowerCase().includes(q)) {
          items.push({ id: c.id, type: 'Communication', category: 'Stakeholders', title: c.title, subtitle: c.manualText.substring(0, 50) + '...', date: c.date, view: 'Komunikácia' });
        }
      });

      // 8. Meetings
      activeProject.meetings.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.agenda.toLowerCase().includes(q)) {
          items.push({ id: m.id, type: 'Meeting', category: 'Stakeholders', title: m.title, subtitle: m.agenda, date: m.date, view: 'Meetingy a prepisy' });
        }
      });

      // 9. SQL Queries
      activeProject.sqlQueries.forEach(sq => {
        if (sq.name.toLowerCase().includes(q) || sq.sqlText.toLowerCase().includes(q)) {
          items.push({ id: sq.id, type: 'SQL Query', category: 'Technical', title: sq.name, subtitle: sq.sqlText.substring(0, 50) + '...', view: 'SQL Workspace' });
        }
      });

      // 10. SQL Results
      activeProject.sqlResults.forEach(sr => {
        if (sr.name.toLowerCase().includes(q)) {
          items.push({ id: sr.id, type: 'SQL Result', category: 'Technical', title: sr.name, subtitle: `Z výsledkov dotazu ${sr.queryId}`, date: sr.dateRun, view: 'SQL Workspace' });
        }
      });

      // 11. Linked Systems
      activeProject.systems.forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)) {
          items.push({ id: s.id, type: 'System', category: 'Technical', title: s.name, subtitle: s.shortDescription, status: s.status, deadline: s.deadline, view: 'Prepojené systémy' });
        }
      });

      // 12. Data Flows / Kafka
      activeProject.dataFlows.forEach(df => {
        if (df.name.toLowerCase().includes(q) || df.topicName.toLowerCase().includes(q)) {
          items.push({ id: df.id, type: 'Data Flow', category: 'Technical', title: df.name, subtitle: `${df.type}: ${df.topicName}`, deadline: df.validationDeadline, view: 'Kafka / dátové toky' });
        }
      });

      // 13. Diagrams
      activeProject.diagrams.forEach(d => {
        if (d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)) {
          items.push({ id: d.id, type: 'Diagram', category: 'Technical', title: d.title, subtitle: `Typ: ${d.type}`, date: d.dateCreated, view: 'Diagramy' });
        }
      });

      // 14. Stakeholders
      activeProject.stakeholders.forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) {
          items.push({ id: s.id, type: 'Stakeholder', category: 'Stakeholders', title: s.name, subtitle: `${s.role} | ${s.team}`, view: 'Stakeholder mapa' });
        }
      });

      // 15. Acceptance Criteria
      activeProject.acceptanceCriteria.forEach(ac => {
        if (ac.title.toLowerCase().includes(q) || ac.given.toLowerCase().includes(q)) {
          items.push({ id: ac.id, type: 'Acceptance Criteria', category: 'Analysis', title: ac.title, subtitle: `Given: ${ac.given.substring(0, 40)}...`, status: ac.status, deadline: ac.testDeadline, view: 'Acceptance Criteria & QA' });
        }
      });

      return items;
    };

    setResults(searchAll());
  }, [query, activeProject, projects]);

  const categories = ['All', 'Analysis', 'Management', 'Execution', 'Stakeholders', 'Technical'];
  const filteredResults = activeCategory === 'All' ? results : results.filter(r => r.category === activeCategory);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Project': return <LayoutDashboard className="w-4 h-4 text-indigo-500" />;
      case 'Requirement': return <ListChecks className="w-4 h-4 text-indigo-600" />;
      case 'Decision': return <Gavel className="w-4 h-4 text-emerald-600" />;
      case 'Question': return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'Risk': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Asana Task': return <CheckSquare className="w-4 h-4 text-blue-600" />;
      case 'Communication': return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'Meeting': return <Mic className="w-4 h-4 text-purple-600" />;
      case 'SQL Query': return <TerminalSquare className="w-4 h-4 text-slate-600" />;
      case 'Diagram': return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'Export': return <Download className="w-4 h-4 text-indigo-500" />;
      case 'Stakeholder': return <Users className="w-4 h-4 text-sky-600" />;
      case 'Acceptance Criteria': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative group">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
          isOpen ? "text-indigo-600" : "text-slate-400"
        )} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Hľadať naprieč projektom (požiadavky, riziká, meetingy...)" 
          className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
          
          {/* Categories Bar */}
          <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                  activeCategory === cat ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-500 hover:bg-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-3 space-y-2">
            {filteredResults.length > 0 ? (
              filteredResults.map((r, i) => (
                <div 
                  key={`${r.id}-${i}`}
                  className="p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                        {getIcon(r.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{r.title}</h4>
                          {r.priority && (
                            <span className={cn(
                              "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                              r.priority === 'Vysoká' || r.priority === 'Kritická' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                            )}>
                              {r.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{r.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{r.type}</span>
                      {r.deadline && (
                        <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold mt-1.5 justify-end">
                          <Clock className="w-3 h-3" /> {r.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <Tag className="w-3 h-3" /> {r.view}
                      </div>
                      {r.status && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> {r.status}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase">
                      Open Detail <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4 border border-slate-100 shadow-inner">
                  <Search className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">Nenašli sme žiadne výsledky pre "{query}"</p>
                <p className="text-xs text-slate-500 mt-1">Skús zmeniť kategóriu alebo hľadaný výraz.</p>
              </div>
            )}
          </div>

          {/* AI Hint */}
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
               <Zap className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <Zap className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none">AI Insight</p>
                <p className="text-[10px] text-indigo-100 font-medium mt-1">Chceš analyzovať tieto výsledky cez BA Agenta?</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-white text-indigo-600 text-[10px] font-black uppercase rounded-xl shadow-lg relative z-10 active:scale-95 transition-all">Launch AI</button>
          </div>

        </div>
      )}
    </div>
  );
}
