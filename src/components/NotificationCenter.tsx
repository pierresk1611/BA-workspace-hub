import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Check, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Deadline' | 'Risk' | 'Question' | 'Data Quality' | 'System' | 'Owner' | 'Warning';
  severity: 'info' | 'warning' | 'critical' | 'success';
  projectId?: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  targetPath?: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Deadline' | 'Risk' | 'Question' | 'Data Quality' | 'System'>('All');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const { projects } = useProject();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load read status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ba_hub_read_notifications');
    if (saved) {
      try {
        setReadIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse read notifications", e);
      }
    }
  }, []);

  // Save read status to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ba_hub_read_notifications', JSON.stringify(Array.from(readIds)));
  }, [readIds]);

  // Handle click outside and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Generate mock notifications based on projects
  const notifications = useMemo(() => {
    const items: NotificationItem[] = [];
    const today = new Date().toISOString().split('T')[0];

    projects.forEach(p => {
      if (p.isClosed) {
        items.push({
          id: `closed-${p.id}`,
          title: 'Projekt uzavretý',
          message: `Projekt "${p.name}" bol ukončený.`,
          type: 'System',
          severity: 'info',
          projectId: p.id,
          createdAt: new Date().toISOString(),
          targetPath: `/projects/${p.id}`
        });
        return; // Don't generate issue notifications for closed projects
      }

      // Check overdue risks
      (p.risks || []).forEach((r: any) => {
        if (r.severity === 'Kritická' && !['Resolved', 'Closed', 'Accepted'].includes(r.status)) {
          items.push({
            id: `risk-crit-${p.id}-${r.id}`,
            title: 'Kritické riziko',
            message: `Otvorené kritické riziko: ${r.title}`,
            type: 'Risk',
            severity: 'critical',
            projectId: p.id,
            entityType: 'risk',
            entityId: r.id,
            createdAt: today,
            targetPath: `/projects/${p.id}/risks`
          });
        }
      });

      // Check missing owners in requirements
      (p.requirements || []).forEach((r: any) => {
        if (!r.owner && r.status !== 'Done' && r.status !== 'Obsolete') {
          items.push({
            id: `req-owner-${p.id}-${r.id}`,
            title: 'Chýbajúci vlastník',
            message: `Požiadavka nemá priradeného vlastníka: ${r.title}`,
            type: 'Owner',
            severity: 'warning',
            projectId: p.id,
            entityType: 'requirement',
            entityId: r.id,
            createdAt: today,
            targetPath: `/projects/${p.id}/requirements`
          });
        }
      });

      // Check overdue questions
      (p.questions || []).forEach((q: any) => {
        if (q.dueDate && q.dueDate < today && !['Answered', 'Cancelled'].includes(q.status)) {
          items.push({
            id: `q-overdue-${p.id}-${q.id}`,
            title: 'Nezodpovedaná otázka po termíne',
            message: `Otázka od ${q.author || 'Neznámy'} čaká na odpoveď po termíne.`,
            type: 'Question',
            severity: 'warning',
            projectId: p.id,
            entityType: 'question',
            entityId: q.id,
            createdAt: q.dueDate,
            targetPath: `/projects/${p.id}/questions`
          });
        }
      });

      // Check overdue tasks in Asana
      (p.asanaTasks || []).forEach((t: any) => {
        if (t.dueDate && t.dueDate < today && t.status !== 'Completed') {
          items.push({
            id: `asana-overdue-${p.id}-${t.id}`,
            title: 'Úloha po termíne',
            message: `Asana úloha je po termíne: ${t.title}`,
            type: 'Deadline',
            severity: 'critical',
            projectId: p.id,
            entityType: 'asanaTask',
            entityId: t.id,
            createdAt: t.dueDate,
            targetPath: `/projects/${p.id}/asana`
          });
        }
      });

      // Data quality
      (p.sqlQueries || []).forEach((sq: any) => {
         if (sq.status === 'Failed' || sq.status === 'Error') {
           items.push({
             id: `sql-warn-${p.id}-${sq.id}`,
             title: 'SQL Data Quality Warning',
             message: `Problém s dopytom: ${sq.name}`,
             type: 'Data Quality',
             severity: 'warning',
             projectId: p.id,
             entityType: 'sql',
             entityId: sq.id,
             createdAt: today,
             targetPath: `/projects/${p.id}/sql`
           });
         }
      });
    });

    // No static examples anymore - only real data
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [projects]);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !readIds.has(n.id);
    return n.type === filter;
  });

  const handleNotificationClick = (notif: NotificationItem) => {
    setReadIds(prev => new Set(prev).add(notif.id));
    setIsOpen(false);
    if (notif.targetPath) {
      // Check if project exists before routing
      if (notif.projectId) {
         const proj = projects.find(p => p.id === notif.projectId);
         if (!proj) {
            navigate('/projects');
            return;
         }
      }
      navigate(notif.targetPath);
    }
  };

  const markAllRead = () => {
    const newReadIds = new Set(readIds);
    notifications.forEach(n => newReadIds.add(n.id));
    setReadIds(newReadIds);
  };

  const getSeverityColors = (severity: string, isRead: boolean) => {
    if (isRead) return 'bg-slate-50 border-slate-100 text-slate-500';
    switch (severity) {
      case 'critical': return 'bg-rose-50 border-rose-100 text-rose-700';
      case 'warning': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'success': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      default: return 'bg-indigo-50 border-indigo-100 text-indigo-700';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <span className="w-2 h-2 rounded-full bg-rose-500" />;
      case 'warning': return <span className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'success': return <span className="w-2 h-2 rounded-full bg-emerald-500" />;
      default: return <span className="w-2 h-2 rounded-full bg-indigo-500" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative"
        title="Notification Centre"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 bg-rose-500 rounded-full border border-white text-[8px] font-black text-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover / Drawer Container */}
      <div className={cn(
        "fixed inset-0 z-[60] lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-2 lg:w-[400px] lg:max-h-[85vh] bg-white lg:rounded-2xl shadow-2xl border-l lg:border border-slate-200 overflow-hidden flex flex-col transition-all duration-500",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full lg:translate-x-0 lg:opacity-0 lg:pointer-events-none"
      )}>
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
               <X className="w-5 h-5" />
             </button>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifikácie</h3>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Označiť všetko
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {['All', 'Unread', 'Deadline', 'Risk', 'Question', 'Data Quality', 'System'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors",
                filter === f 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest">Žiadne novinky</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const isRead = readIds.has(notif.id);
              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] flex gap-4 shadow-sm",
                    getSeverityColors(notif.severity, isRead)
                  )}
                >
                  <div className="pt-1.5 shrink-0">
                     {!isRead && getSeverityBadge(notif.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className={cn(
                        "text-xs font-black truncate",
                        isRead ? 'text-slate-600' : 'text-slate-900'
                      )}>
                        {notif.title}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-40 shrink-0">
                        {notif.createdAt}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed",
                      isRead ? 'text-slate-400 font-medium' : 'text-slate-700 font-bold'
                    )}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        />
      )}
    </div>
  );
}
