import { 
  LayoutDashboard, FolderKanban, Network, FileText, Kanban, Database, 
  TerminalSquare, CheckSquare, CalendarDays, ListChecks, Gavel, HelpCircle, 
  AlertTriangle, MessageSquare, Mic, Bot, Download, Replace, Users, 
  ShieldCheck, CheckCircle, Settings
} from "lucide-react";
import { cn } from "../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Prehľad" },
  { icon: FolderKanban, label: "Projekty" },
  { icon: Network, label: "Prepojené systémy" },
  { icon: FileText, label: "Confluence zdroje" },
  { icon: Kanban, label: "Jira zdroje" },
  { icon: Database, label: "Kafka / dátové toky" },
  { icon: TerminalSquare, label: "SQL Workspace" },
  { icon: CheckSquare, label: "Asana tasky" },
  { icon: CalendarDays, label: "Kalendár a deadliny" },
  { icon: ListChecks, label: "Požiadavky" },
  { icon: Gavel, label: "Rozhodnutia" },
  { icon: HelpCircle, label: "Otvorené otázky" },
  { icon: AlertTriangle, label: "Riziká a závislosti" },
  { icon: MessageSquare, label: "Komunikácia" },
  { icon: Mic, label: "Meetingy a prepisy" },
  { icon: Bot, label: "AI Project Agent" },
  { icon: Download, label: "Exporty" },
  { icon: Replace, label: "Traceability Matrix" },
  { icon: Users, label: "Stakeholder mapa" },
  { icon: ShieldCheck, label: "Acceptance Criteria & QA" },
  { icon: CheckCircle, label: "BA Quality Check" },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Bot className="text-blue-500" />
          <span className="truncate">BA Workspace</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Project Intelligence Hub</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activeView === item.label
                ? "bg-blue-600/10 text-blue-400" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800 sticky bottom-0 bg-slate-900">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          Nastavenia
        </button>
      </div>
    </aside>
  );
}
