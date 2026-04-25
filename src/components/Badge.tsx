import { cn } from '../lib/utils';
import { Clock, AlertTriangle, CheckCircle2, CircleDot, Ban, Zap } from 'lucide-react';
import type { ProjectPriority, RequirementStatus, ACStatus, JiraStatus, DecisionStatus, SQLStatus } from '../types';

type UnifiedStatus = RequirementStatus | ACStatus | JiraStatus | DecisionStatus | SQLStatus | 'Overdue';

interface StatusBadgeProps {
  status: UnifiedStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'Done':
      case 'Passed':
      case 'Approved':
      case 'Potvrdené':
      case 'Aktuálne':
      case 'Validovaný':
        return { class: 'badge-status-done', icon: <CheckCircle2 className="w-3 h-3" /> };
      
      case 'In Progress':
      case 'In development':
      case 'In testing':
      case 'Navrhnuté':
        return { class: 'badge-status-progress', icon: <Zap className="w-3 h-3" /> };
      
      case 'Waiting for answer':
      case 'Na potvrdenie':
      case 'Ready for review':
      case 'Ready for refinement':
        return { class: 'badge-status-waiting', icon: <Clock className="w-3 h-3" /> };
      
      case 'Blocked':
      case 'Failed':
        return { class: 'badge-status-blocked', icon: <AlertTriangle className="w-3 h-3" /> };
      
      case 'Overdue':
        return { class: 'badge-status-overdue', icon: <AlertTriangle className="w-3 h-3" /> };
      
      case 'Draft':
      case 'Backlog':
      case 'To Do':
      case 'Cancelled':
      case 'Zrušené':
      case 'Zastarané':
      case 'Obsolete':
        return { class: 'badge-status-draft', icon: <CircleDot className="w-3 h-3" /> };
        
      default:
        return { class: 'badge-status-draft', icon: <CircleDot className="w-3 h-3" /> };
    }
  };

  const { class: statusClass, icon } = getStyle();

  return (
    <span className={cn('badge-status', statusClass, className)}>
      {icon}
      {status}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: ProjectPriority | string;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getStyle = () => {
    switch (priority) {
      case 'Kritická':
      case 'Critical':
        return 'badge-priority-critical';
      case 'Vysoká':
      case 'High':
        return 'badge-priority-high';
      case 'Stredná':
      case 'Medium':
        return 'badge-priority-medium';
      case 'Nízka':
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-low';
    }
  };

  return (
    <span className={cn('badge-priority', getStyle(), className)}>
      {priority}
    </span>
  );
}

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-8 bg-slate-50 rounded-full mb-6 shadow-inner">
        <Icon className="w-16 h-16 text-slate-200" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-400 font-medium max-w-sm mb-10 text-lg leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <Zap className="w-5 h-5 fill-current" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
