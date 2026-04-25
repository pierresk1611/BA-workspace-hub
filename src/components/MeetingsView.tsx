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
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
               <Mic className="w-8 h-8" />
            </div>
            Meeting Intelligence
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Správa záznamov, transcriptov a AI výstupov zo stretnutí pre {activeProject.name}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setEditingMeeting(undefined); setIsModalOpen(true); }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nový Meeting
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main List Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Hľadať v názvoch meetingov, účastníkoch..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              />
            </div>
            <button className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
              {filteredMeetings.map(m => (
                <div 
                  key={m.id}
                  onClick={() => setActiveMeetingId(m.id)}
                  className={cn(
                    "p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden",
                    activeMeetingId === m.id 
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-100 -translate-y-1" 
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg"
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      activeMeetingId === m.id ? "bg-white/20 text-white border-white/30" : getTypeStyle(m.type)
                    )}>
                      {m.type}
                    </span>
                    <div className={cn(
                      "flex items-center gap-2 text-[10px] font-black",
                      activeMeetingId === m.id ? "text-indigo-100" : "text-slate-400"
                    )}>
                      <Clock className="w-3.5 h-3.5" /> {m.startTime} - {m.endTime}
                    </div>
                  </div>
                  <h3 className={cn(
                    "text-xl font-black mb-3 leading-tight transition-colors",
                    activeMeetingId === m.id ? "text-white" : "text-slate-900 group-hover:text-indigo-600"
                  )}>{m.title}</h3>
                  <div className={cn(
                    "flex items-center gap-3 text-xs font-bold mb-6",
                    activeMeetingId === m.id ? "text-indigo-200" : "text-slate-500"
                  )}>
                    <Calendar className="w-4 h-4" /> {m.date}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                     <div className="flex -space-x-3">
                       {m.participants.split(',').slice(0, 4).map((p, i) => (
                         <div key={i} className={cn(
                           "w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-black shadow-sm transition-transform group-hover:scale-110",
                           activeMeetingId === m.id ? "bg-indigo-400 border-indigo-500 text-white" : "bg-white border-slate-100 text-indigo-600"
                         )} style={{ transitionDelay: `${i * 50}ms` }}>
                           {p.trim().charAt(0).toUpperCase()}
                         </div>
                       ))}
                       {m.participants.split(',').length > 4 && (
                         <div className={cn(
                           "w-9 h-9 rounded-full border-2 flex items-center justify-center text-[8px] font-black",
                           activeMeetingId === m.id ? "bg-indigo-700 border-indigo-500 text-white" : "bg-indigo-50 border-white text-indigo-600"
                         )}>
                           +{m.participants.split(',').length - 4}
                         </div>
                       )}
                     </div>
                     <div className="flex gap-2">
                       {m.recordingUrl && <div className={cn("p-2 rounded-xl transition-all", activeMeetingId === m.id ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600")}><Play className="w-4 h-4 fill-current" /></div>}
                       {m.aiSummary && <div className={cn("p-2 rounded-xl transition-all shadow-md", activeMeetingId === m.id ? "bg-white text-indigo-600" : "bg-indigo-600 text-white")}><Zap className="w-4 h-4" /></div>}
                       <div className={cn("p-2 rounded-xl", activeMeetingId === m.id ? "bg-white/10 text-white" : "text-slate-300")}><ChevronRight className="w-4 h-4" /></div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Mic}
              title="Žiadne záznamy"
              description="História meetingov je prázdna. Pridajte záznam zo stretnutia pre automatickú analýzu a sledovanie akčných krokov."
              actionLabel="Pridať prvý meeting"
              onAction={() => setIsModalOpen(true)}
            />
          )}

        </div>

        {/* Right Detail Panel */}
        <div className="w-full lg:w-[600px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 overflow-hidden glass">
          {activeMeeting ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 relative">
                <div className="absolute top-10 right-10 flex gap-2">
                  <button 
                    onClick={() => { setEditingMeeting(activeMeeting); setIsModalOpen(true); }}
                    className="p-3 bg-white hover:bg-indigo-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { if (confirm('Zmazať meeting?')) deleteMeeting(activeProject.id, activeMeeting.id); }}
                    className="p-3 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full uppercase border border-indigo-200 tracking-widest">{activeMeeting.id}</span>
                  <StatusBadge status="Done" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6 pr-20">{activeMeeting.title}</h2>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3 text-sm font-black text-slate-600">
                    <Calendar className="w-5 h-5 text-indigo-500" /> {activeMeeting.date}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-black text-slate-600">
                    <Clock className="w-5 h-5 text-indigo-500" /> {activeMeeting.startTime} - {activeMeeting.endTime}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 pb-40">
                
                {/* Participants */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Users className="w-3 h-3" /> Participants
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {activeMeeting.participants.split(',').map((p, i) => (
                        <div key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm">
                           <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center text-[8px] font-black text-indigo-600 border border-indigo-100">{p.trim().charAt(0).toUpperCase()}</div>
                           {p.trim()}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Agenda */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <List className="w-3 h-3" /> Agenda & Goals
                  </h4>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-base text-slate-600 font-medium leading-relaxed italic shadow-inner">
                    "{activeMeeting.agenda}"
                  </div>
                </div>

                {/* AI Summary Section */}
                {activeMeeting.aiSummary && (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                       <Zap className="absolute -right-12 -bottom-12 w-64 h-64 text-indigo-500 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                       <h3 className="text-2xl font-black text-indigo-400 mb-8 flex items-center gap-3">
                         <Zap className="w-8 h-8" /> Executive Summary
                       </h3>
                       <p className="text-lg text-slate-300 leading-relaxed font-medium relative z-10 italic">
                         {activeMeeting.aiSummary.executiveSummary}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 shadow-sm relative group overflow-hidden">
                         <CheckCircle2 className="absolute -right-4 -top-4 w-24 h-24 text-emerald-200/30 group-hover:scale-110 transition-transform duration-500" />
                         <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4" /> Agreed Decisions
                         </h4>
                         <ul className="space-y-4 relative z-10">
                           {activeMeeting.aiSummary.decisions.map((d, i) => (
                             <li key={i} className="text-sm font-bold text-emerald-900 flex items-start gap-3">
                               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0"></div>
                               {d}
                             </li>
                           ))}
                         </ul>
                         <button className="mt-8 w-full py-3 bg-white border border-emerald-200 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95">
                           Vytvoriť Záznam Rozhodnutia
                         </button>
                       </div>
                       <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-sm relative group overflow-hidden">
                         <FileText className="absolute -right-4 -top-4 w-24 h-24 text-indigo-200/30 group-hover:scale-110 transition-transform duration-500" />
                         <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <FileText className="w-4 h-4" /> Identified Requirements
                         </h4>
                         <ul className="space-y-4 relative z-10">
                           {activeMeeting.aiSummary.requirements.map((r, i) => (
                             <li key={i} className="text-sm font-bold text-indigo-900 flex items-start gap-3">
                               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                               {r}
                             </li>
                           ))}
                         </ul>
                         <button className="mt-8 w-full py-3 bg-white border border-indigo-200 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95">
                           Exportovať Požiadavky
                         </button>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Action Items Registry</h4>
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter">Action Item</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter">Owner</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter">Deadline</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {activeMeeting.aiSummary.actionItems.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5">
                                   <p className="text-xs font-black text-slate-900">{item.task}</p>
                                </td>
                                <td className="px-6 py-5">
                                   <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[8px] font-black text-indigo-600">{item.owner.charAt(0)}</div>
                                      <span className="text-xs font-bold text-slate-600">{item.owner}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5">
                                   <span className="text-xs font-black text-rose-500">{item.deadline}</span>
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
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <MessageSquare className="w-4 h-4" /> Full Communication Transcript
                   </h4>
                   <div className="bg-slate-900 p-10 rounded-[3rem] font-mono text-[11px] leading-loose text-indigo-300 max-h-96 overflow-y-auto custom-scrollbar border-4 border-slate-800 shadow-2xl">
                     {activeMeeting.transcript || 'Žiadny transcript nebol vložený.'}
                   </div>
                </div>

              </div>

              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-white via-white to-transparent flex gap-4">
                 <button className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
                   <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> Export Meeting Intelligence
                 </button>
                 {activeMeeting.recordingUrl && (
                   <a 
                     href={activeMeeting.recordingUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="p-5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 rounded-[1.5rem] shadow-sm transition-all flex items-center justify-center group/play"
                   >
                     <Play className="w-6 h-6 group-hover/play:scale-125 transition-transform" />
                   </a>
                 )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-16 space-y-8 animate-in fade-in duration-500">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-100 group">
                <Mic className="w-16 h-16 text-slate-100 group-hover:text-indigo-200 transition-colors duration-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Meeting Context</h3>
                <p className="text-base text-slate-400 font-medium max-w-xs leading-relaxed italic">
                  Vyberte meeting pre zobrazenie AI analýzy, akčných krokov a prepisu komunikácie.
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
