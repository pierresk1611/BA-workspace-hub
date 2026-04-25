import { useState } from 'react';
import { 
  Download, Copy, FileText, Share2, 
  CheckCircle2, ChevronRight, LayoutDashboard, 
  Gavel, HelpCircle, AlertTriangle, ListChecks,
  Kanban, Zap, 
  Calendar, Eye, ShieldCheck,
  TerminalSquare, Table, ArrowRight,
  TrendingUp, Activity
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { calculateProjectProgress } from '../lib/projectUtils';
import { cn } from '../lib/utils';

type ExportType = 
  | 'Status Report' | 'Manager Summary' | 'Confluence Summary' 
  | 'Jira Tasks' | 'Decision Log' | 'Open Questions' 
  | 'Requirements Register' | 'Risk Summary' | 'Deadline Report'
  | 'SQL Documentation' | 'SQL Results' | 'Mermaid Diagram';

interface ExportCard {
  id: ExportType;
  title: string;
  description: string;
  icon: any;
  color: string;
  category: 'Project' | 'Analysis' | 'Technical' | 'Stakeholders' | 'Management';
}

export function ExportsView() {
  const { activeProject } = useProject();
  const [selectedExport, setSelectedExport] = useState<ExportType | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!activeProject) return null;

  const stats = calculateProjectProgress(activeProject);

  const exportCards: ExportCard[] = [
    { id: 'Status Report', title: 'Projektový Status Report', description: 'Kompletný prehľad progresu, zdravia a blokerov.', icon: LayoutDashboard, color: 'indigo', category: 'Project' },
    { id: 'Manager Summary', title: 'Manažérsky Summary', description: 'Stručný prehľad kľúčových míľnikov a rizík.', icon: Zap, color: 'amber', category: 'Project' },
    { id: 'Confluence Summary', title: 'Confluence Documentation', description: 'Štruktúrovaný výstup pripravený pre Confluence.', icon: FileText, color: 'blue', category: 'Analysis' },
    { id: 'Jira Tasks', title: 'Jira-ready Tasky', description: 'Drafty úloh s popismi a AC pre vývojový tím.', icon: Kanban, color: 'indigo', category: 'Project' },
    { id: 'Decision Log', title: 'Decision Log', description: 'Zoznam všetkých schválených rozhodnutí a ich dopadov.', icon: Gavel, color: 'emerald', category: 'Analysis' },
    { id: 'Open Questions', title: 'Open Questions List', description: 'Prehľad nevyriešených otázok a blokerov.', icon: HelpCircle, color: 'rose', category: 'Analysis' },
    { id: 'Requirements Register', title: 'Requirements Register', description: 'Kompletný zoznam požiadaviek s ich stavom.', icon: ListChecks, color: 'indigo', category: 'Analysis' },
    { id: 'Risk Summary', title: 'Risk Summary Report', description: 'Analýza rizík a ich mitigačných plánov.', icon: AlertTriangle, color: 'rose', category: 'Management' },
    { id: 'Deadline Report', title: 'Deadline & Calendar', description: 'Zoznam nadchádzajúcich a overdue termínov.', icon: Calendar, color: 'amber', category: 'Management' },
    { id: 'SQL Documentation', title: 'SQL Query Documentation', description: 'Dokumentácia SQL dotazov, filtrov a interpretácie.', icon: TerminalSquare, color: 'slate', category: 'Technical' },
    { id: 'SQL Results', title: 'SQL Result Export', description: 'Markdown tabuľka s manuálne vloženými výsledkami.', icon: Table, color: 'slate', category: 'Technical' },
    { id: 'Mermaid Diagram', title: 'Mermaid Flow Diagram', description: 'Textový popis diagramu pre vizualizáciu flowov.', icon: Share2, color: 'purple', category: 'Technical' },
  ];

  const generateMarkdown = (type: ExportType) => {
    let md = "";
    const today = new Date().toLocaleDateString();

    switch (type) {
      case 'Status Report':
        md = `# Projektový Status Report: ${activeProject.name}\n`;
        md += `**Dátum:** ${today} | **Progres:** ${stats.progress}% | **Zdravie:** ${stats.health}/100\n\n`;
        md += `## Aktuálny Stav\n${activeProject.shortDescription}\n\n`;
        md += `## Kľúčové Výsledky\n${activeProject.requirements.filter(r => r.status === 'Done').map(r => `- ${r.title}`).join('\n') || '- Žiadne dokončené požiadavky'}\n\n`;
        md += `## Otvorené Riziká\n${activeProject.risks.filter(r => r.status === 'Open').map(r => `- **${r.title}** (${r.severity}): ${r.description}`).join('\n')}\n\n`;
        md += `## Najbližšie Deadliny\n${activeProject.milestones.filter(m => m.status === 'In Progress' || m.status === 'Upcoming').slice(0, 3).map(m => `- ${m.title}: ${m.dueDate}`).join('\n')}\n\n`;
        break;

      case 'Confluence Summary':
        md = `# Analysis Summary: ${activeProject.name}\n\n`;
        md += `## 1. Kontext & Cieľ\n${activeProject.detailedDescription}\n\n`;
        md += `## 2. Scope\n${activeProject.requirements.slice(0, 5).map(r => `- ${r.title}`).join('\n')}\n\n`;
        md += `## 3. Rozhodnutia\n${activeProject.decisions.map(d => `### ${d.title}\n**Rozhodnutie:** ${d.decisionText}\n**Dopad:** ${d.impact}\n`).join('\n')}\n\n`;
        md += `## 4. Otvorené otázky\n${activeProject.questions.filter(q => q.status === 'Open').map(q => `- ${q.title} (Owner: ${q.owner})`).join('\n')}\n\n`;
        md += `## 5. Deadliny\n| Milestone | Dátum | Status |\n| --- | --- | --- |\n`;
        md += activeProject.milestones.map(m => `| ${m.title} | ${m.dueDate} | ${m.status} |`).join('\n');
        break;

      case 'Jira Tasks':
        md = `# Jira Tasks Draft: ${activeProject.name}\n\n`;
        md += activeProject.requirements.filter(r => r.status === 'Ready for refinement' || r.status === 'Draft').map(r => {
          return `## [TASK] ${r.title}\n**Popis:** ${r.description}\n**AC:**\n${r.acceptanceCriteria}\n**Priorita:** ${r.priority}\n**Owner:** ${r.owner}\n**Deadline:** ${r.deadline || 'TBD'}\n---\n`;
        }).join('\n');
        break;

      case 'SQL Documentation':
        md = `# SQL Documentation: ${activeProject.name}\n\n`;
        md += `> **BEZPEČNOSTNÁ POZNÁMKA:** Táto dokumentácia je generovaná z manuálne spracovaných mock dát a neobsahuje žiadne reálne connection stringy ani prístupové údaje.\n\n`;
        md += activeProject.sqlQueries.map(sq => {
          return `## ${sq.name}\n**Účel:** ${sq.description}\n\n### SQL Dotaz (${sq.dialect})\n\`\`\`sql\n${sq.sqlText}\n\`\`\`\n\n**Vstupné kritériá:** ${sq.businessCriteria.goal}\n**Tabuľky:** ${sq.businessCriteria.tables}\n**Owner:** ${sq.owner}\n**Review Deadline:** ${sq.reviewDeadline}\n---\n`;
        }).join('\n');
        break;

      case 'Decision Log':
        md = `# Decision Log: ${activeProject.name}\n\n`;
        md += `| ID | Rozhodnutie | Status | Schválil | Dátum |\n| --- | --- | --- | --- | --- |\n`;
        md += activeProject.decisions.map(d => `| ${d.id} | ${d.title} | ${d.status} | ${d.approvedBy} | ${d.date} |`).join('\n');
        break;

      default:
        md = `# Export: ${type}\nVygenerované z lokálnych dát projektu ${activeProject.name} dňa ${today}.`;
    }

    setPreviewContent(md);
    setSelectedExport(type);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([previewContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedExport?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-full overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <TrendingUp className="w-8 h-8" />
            </div>
            Project Export Engine
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl text-lg">
            Generujte profesionálne výstupy pre Confluence, Jira alebo manažérsky reporting priamo z vašich analýz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-white rounded-[1.5rem] border border-slate-200 flex items-center gap-4 shadow-sm">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Project Progress</span>
                <span className="text-xl font-black text-indigo-600 leading-none">{stats.progress}%</span>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-indigo-50 flex items-center justify-center relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-50" />
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * stats.progress) / 100} className="text-indigo-600 transition-all duration-1000" />
                </svg>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Export Cards List */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Export Template Registry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportCards.map((card) => (
                  <button 
                    key={card.id}
                    onClick={() => generateMarkdown(card.id)}
                    className={cn(
                      "p-6 rounded-[2.5rem] border text-left transition-all relative group overflow-hidden",
                      selectedExport === card.id 
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-100 -translate-y-1" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300 hover:shadow-lg"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl w-fit mb-4 transition-colors",
                      selectedExport === card.id ? "bg-white/20 text-white" : "bg-white text-indigo-600 shadow-sm"
                    )}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black mb-1 leading-tight">{card.title}</h3>
                    <p className={cn(
                      "text-[9px] font-bold leading-relaxed",
                      selectedExport === card.id ? "text-indigo-100" : "text-slate-400"
                    )}>
                      {card.description}
                    </p>
                    <div className={cn(
                      "absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      selectedExport === card.id ? "hidden" : "block"
                    )}>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedExport ? (
            <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[750px] animate-in zoom-in-95 duration-500 relative">
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Preview: {selectedExport}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Enterprise Markdown Template</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Skopírované' : 'Copy'}
                  </button>
                  <button 
                    onClick={downloadAsMarkdown}
                    className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
                  >
                    <Download className="w-5 h-5" />
                    Download .md
                  </button>
                </div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[#fdfdfd] relative group">
                 <div className="absolute inset-0 bg-slate-50/10 pointer-events-none"></div>
                 <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed relative z-10 selection:bg-indigo-100">
                   {previewContent}
                 </pre>
              </div>
              <div className="p-6 bg-amber-50 border-t border-amber-100 flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                   <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-[10px] font-black text-amber-800 leading-tight uppercase tracking-widest italic">
                  Bezpečnostné upozornenie: Tento export je generovaný výhradne z lokálnych mock dát. Neobsahuje reálne heslá ani prístupové údaje k systémom.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border-4 border-dashed border-slate-100 h-[750px] flex flex-col items-center justify-center p-16 text-center group transition-all hover:border-indigo-100">
              <div className="w-40 h-40 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 border border-slate-100 shadow-inner relative">
                <FileText className="w-16 h-16 text-slate-100 group-hover:text-indigo-200 transition-colors" />
                <Zap className="absolute -top-4 -right-4 w-12 h-12 text-indigo-100 group-hover:text-indigo-500 group-hover:animate-pulse transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Export Intelligence Engine</h3>
              <p className="text-base text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Vyberte šablónu exportu pre okamžité vygenerovanie náhľadu. Všetky dáta sú lokálne a pripravené na prenos do vašich interných systémov.
              </p>
              <div className="mt-12 flex gap-6">
                <div className="flex items-center gap-3 px-6 py-2 bg-indigo-50 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-100 shadow-sm">
                  <Activity className="w-4 h-4" /> Ready for Analysis
                </div>
                <div className="flex items-center gap-3 px-6 py-2 bg-rose-50 rounded-2xl text-[10px] font-black text-rose-400 uppercase tracking-widest border border-rose-100 shadow-sm">
                  <ShieldCheck className="w-4 h-4" /> Secure Sandbox
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
