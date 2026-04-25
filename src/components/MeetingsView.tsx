import { useState } from 'react';
import { 
  Mic, Search, Filter, Plus, Edit, Trash2, 
  Calendar, Clock, 
  ExternalLink, FileText, CheckCircle2, 
  Zap, List, Play, MessageSquare,
  ArrowRight, Download, Users, ChevronRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { MeetingFormModal } from './MeetingFormModal';
import { StatusBadge, PriorityBadge, EmptyState } from './Badge';
import type { Meeting, MeetingType } from '../types';
import { cn } from '../lib/utils';

export function MeetingsView() {
  const { activeProject, deleteMeeting } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>(undefined);
  
  const [search, setSearch] = useState('');
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);

  if (!activeProject) return null;

  const meetings = activeProject.meetings || [];

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.participants.toLowerCase().includes(search.toLowerCase())
  );

  const activeMeeting = meetings.find(m => m.id === activeMeetingId);

  const getTypeStyle = (type: MeetingType) => {
    switch (type) {
      case 'Discovery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Analysis': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Decision meeting': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Technical sync': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Stakeholder sync': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Mic className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            Meetings
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 hidden sm:block">
            Záznamy a AI výstupy zo stretnutí.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setEditingMeeting(undefined); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 md:w-5 h-4 md:h-5" /> Nový
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Main List Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8">
          
          <div className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hľadať meeting..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              />
            </div>
            <button className="p-2.5 md:p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 pb-12">
              {filteredMeetings.map(m => (
                <div 
                  key={m.id}
                  onClick={() => setActiveMeetingId(m.id)}
                  className={cn(
                    "p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden flex flex-col",
                    activeMeetingId === m.id 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-2xl" 
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg"
                  )}
                >
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <span className={cn(
                      "px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
                      activeMeetingId === m.id ? "bg-white/20 text-white border-white/30" : getTypeStyle(m.type)
                    )}>
                      {m.type}
                    </span>
                    <div className={cn(
                      "flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black",
                      activeMeetingId === m.id ? "text-indigo-100" : "text-slate-400"
                    )}>
                      <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" /> {m.startTime} - {m.endTime}
                    </div>
                  </div>
                  <h3 className={cn(
                    "text-lg md:text-xl font-black mb-2 md:mb-3 leading-tight truncate",
                    activeMeetingId === m.id ? "text-white" : "text-slate-900"
                  )}>{m.title}</h3>
                  <div className={cn(
                    "flex items-center gap-2 md:gap-3 text-[11px] md:text-xs font-bold mb-4 md:mb-6",
                    activeMeetingId === m.id ? "text-indigo-200" : "text-slate-500"
                  )}>
                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" /> {m.date}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 md:pt-6 border-t border-white/10">
                     <div className="flex -space-x-2.5">
                       {m.participants.split(',').slice(0, 3).map((p, i) => (
                         <div key={i} className={cn(
                           "w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-sm shrink-0",
                           activeMeetingId === m.id ? "bg-indigo-400 border-indigo-500 text-white" : "bg-white border-slate-100 text-indigo-600"
                         )}>
                           {p.trim().charAt(0).toUpperCase()}
                         </div>
                       ))}
                       {m.participants.split(',').length > 3 && (
                         <div className={cn(
                           "w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[7px] md:text-[8px] font-black",
                           activeMeetingId === m.id ? "bg-indigo-700 border-indigo-500 text-white" : "bg-indigo-50 border-white text-indigo-600"
                         )}>
                           +{m.participants.split(',').length - 3}
                         </div>
                       )}
                     </div>
                     <div className="flex gap-1.5 md:gap-2">
                       {m.aiSummary && <div className={cn("p-1.5 md:p-2 rounded-lg transition-all shadow-md", activeMeetingId === m.id ? "bg-white text-indigo-600" : "bg-indigo-600 text-white")}><Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /></div>}
                       <div className={cn("p-1.5 md:p-2 rounded-lg", activeMeetingId === m.id ? "bg-white/10 text-white" : "text-slate-300")}><ChevronRight className="w-4 h-4" /></div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Mic}
              title="Žiadne záznamy"
              description="História meetingov je prázdna."
              actionLabel="Nový meeting"
              onAction={() => setIsModalOpen(true)}
            />
          )}

        </div>

        {/* Right Detail Panel - Drawer on Mobile */}
        <div className={cn(
          "fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto bg-white lg:w-[600px] border-l border-slate-200 flex flex-col shadow-2xl transition-transform duration-500 lg:translate-x-0 overflow-hidden",
          activeMeetingId ? "translate-x-0" : "translate-x-full"
        )}>
          {activeMeeting ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
              <div className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50 relative">
                <button 
                  onClick={() => setActiveMeetingId(null)}
                  className="lg:hidden absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="absolute top-6 md:top-10 right-6 md:right-10 flex gap-2">
                  <button 
                    onClick={() => { setEditingMeeting(activeMeeting); setIsModalOpen(true); }}
                    className="p-2 md:p-3 bg-white hover:bg-indigo-50 rounded-xl md:rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button 
                    onClick={() => { if (confirm('Zmazať meeting?')) deleteMeeting(activeProject.id, activeMeeting.id); }}
                    className="p-2 md:p-3 bg-white hover:bg-rose-50 rounded-xl md:rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 mt-6 lg:mt-0">
                  <span className="text-[8px] md:text-[10px] font-black text-indigo-600 bg-indigo-100 px-3 md:px-4 py-1 md:py-1.5 rounded-full uppercase border border-indigo-200 tracking-widest">{activeMeeting.id}</span>
                  <StatusBadge status="Done" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-4 md:mb-6 pr-12 md:pr-20 truncate-2-lines">{activeMeeting.title}</h2>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black text-slate-600">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /> {activeMeeting.date}
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black text-slate-600">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /> {activeMeeting.startTime}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8 md:space-y-12 pb-32">
                
                {/* Participants */}
                <div className="space-y-3 md:space-y-4">
                   <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Users className="w-3 h-3" /> Participants
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {activeMeeting.participants.split(',').map((p, i) => (
                        <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm">
                           <div className="w-4 h-4 md:w-5 md:h-5 bg-indigo-50 rounded-full flex items-center justify-center text-[7px] md:text-[8px] font-black text-indigo-600 border border-indigo-100 shrink-0">{p.trim().charAt(0).toUpperCase()}</div>
                           <span className="truncate">{p.trim()}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Agenda */}
                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <List className="w-3 h-3" /> Agenda
                  </h4>
                  <div className="bg-slate-50 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 text-[13px] md:text-base text-slate-600 font-medium leading-relaxed italic shadow-inner">
                    "{activeMeeting.agenda}"
                  </div>
                </div>

                {/* AI Summary Section */}
                {activeMeeting.aiSummary && (
                  <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
                    <div className="p-6 md:p-10 bg-slate-900 rounded-2xl md:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                       <Zap className="absolute -right-8 -bottom-8 md:-right-12 md:-bottom-12 w-48 h-48 md:w-64 md:h-64 text-indigo-500 opacity-5" />
                       <h3 className="text-xl md:text-2xl font-black text-indigo-400 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                         <Zap className="w-6 h-6 md:w-8 md:h-8" /> Executive Summary
                       </h3>
                       <p className="text-[14px] md:text-lg text-slate-300 leading-relaxed font-medium relative z-10 italic">
                         {activeMeeting.aiSummary.executiveSummary}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                       <div className="p-6 md:p-8 bg-emerald-50 rounded-2xl md:rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                         <h4 className="text-[9px] md:text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> Decisions
                         </h4>
                         <ul className="space-y-3 md:space-y-4 relative z-10">
                           {activeMeeting.aiSummary.decisions.map((d, i) => (
                             <li key={i} className="text-xs md:text-sm font-bold text-emerald-900 flex items-start gap-2.5">
                               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></div>
                               {d}
                             </li>
                           ))}
                         </ul>
                       </div>
                       <div className="p-6 md:p-8 bg-indigo-50 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden">
                         <h4 className="text-[9px] md:text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                           <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" /> Requirements
                         </h4>
                         <ul className="space-y-3 md:space-y-4 relative z-10">
                           {activeMeeting.aiSummary.requirements.map((r, i) => (
                             <li key={i} className="text-xs md:text-sm font-bold text-indigo-900 flex items-start gap-2.5">
                               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                               {r}
                             </li>
                           ))}
                         </ul>
                       </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Items</h4>
                      <div className="bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-5 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                              <th className="px-5 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Owner</th>
                              <th className="px-5 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Deadline</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {activeMeeting.aiSummary.actionItems.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 md:px-6 py-4 md:py-5">
                                   <p className="text-[11px] md:text-xs font-black text-slate-900">{item.task}</p>
                                </td>
                                <td className="px-5 md:px-6 py-4 md:py-5">
                                   <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[7px] md:text-[8px] font-black text-indigo-600 shrink-0">{item.owner.charAt(0)}</div>
                                      <span className="text-[11px] md:text-xs font-bold text-slate-600 truncate max-w-[80px]">{item.owner}</span>
                                   </div>
                                </td>
                                <td className="px-5 md:px-6 py-4 md:py-5 text-right">
                                   <span className="text-[11px] md:text-xs font-black text-rose-500 whitespace-nowrap">{item.deadline}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transcript Viewer */}
                <div className="space-y-4 md:space-y-6">
                   <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" /> Transcript
                   </h4>
                   <div className="bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-[3rem] font-mono text-[10px] md:text-[11px] leading-loose text-indigo-300 max-h-96 overflow-y-auto custom-scrollbar border border-slate-800 shadow-2xl">
                     {activeMeeting.transcript || 'Žiadny transcript.'}
                   </div>
                </div>

              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-white via-white to-transparent flex gap-3 md:gap-4">
                 <button className="flex-1 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-95 group">
                   <Download className="w-5 h-5 md:w-6 md:h-6" /> Export Intelligence
                 </button>
                 {activeMeeting.recordingUrl && (
                   <a 
                     href={activeMeeting.recordingUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="p-4 md:p-5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 rounded-xl md:rounded-[1.5rem] shadow-sm transition-all flex items-center justify-center"
                   >
                     <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                   </a>
                 )}
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center text-center p-16 space-y-8 animate-in fade-in duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100 group">
                <Mic className="w-16 h-16 text-slate-100 group-hover:text-indigo-200 transition-colors duration-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Meeting Context</h3>
                <p className="text-base text-slate-400 font-medium max-w-xs leading-relaxed italic">
                  Vyberte meeting pre zobrazenie AI analýzy.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      <MeetingFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingMeeting} 
      />
      
    </div>
  );
}
