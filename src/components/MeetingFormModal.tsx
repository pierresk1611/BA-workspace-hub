import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Zap } from 'lucide-react';
import type { Meeting, MeetingType } from '../types';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

interface MeetingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Meeting;
}

const typeOptions: MeetingType[] = [
  "Discovery", "Analysis", "Refinement", "Decision meeting", 
  "Technical sync", "Stakeholder sync", "BA sync", "UAT", "Status meeting"
];

export function MeetingFormModal({ isOpen, onClose, initialData }: MeetingFormModalProps) {
  const { activeProject, addMeeting, updateMeeting } = useProject();
  const [formData, setFormData] = useState<Partial<Meeting>>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    type: 'Analysis',
    recordingUrl: '',
    transcript: '',
    agenda: '',
    status: 'Completed',
    notes: '',
    followUpDeadline: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        participants: 'Peter (BA), ',
        type: 'Analysis',
        recordingUrl: '',
        transcript: '',
        agenda: '',
        status: 'Completed',
        notes: '',
        followUpDeadline: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (initialData) {
      updateMeeting(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Meeting = {
        ...(formData as Meeting),
        id: `MTG-${Math.floor(100 + Math.random() * 900)}`,
        relatedProjectId: activeProject.id
      };
      addMeeting(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300",
      isOpen ? "visible" : "invisible pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )} 
        onClick={onClose} 
      />

      {/* Drawer / Modal */}
      <div className={cn(
        "bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-5xl lg:rounded-[2.5rem] shadow-2xl flex flex-col relative transition-transform duration-500 transform overflow-hidden border border-slate-200",
        isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-4 lg:scale-95 lg:opacity-0"
      )}>
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť meeting' : 'Nový meeting'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Manuálny záznam a prepis</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="meeting-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov meetingu *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs md:text-sm shadow-inner" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dátum</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Od</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Do</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Účastníci</label>
                <input name="participants" value={formData.participants} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm font-bold shadow-inner" placeholder="Mená oddelené čiarkou..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ meetingu</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {typeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Follow-up deadline</label>
                  <input type="date" name="followUpDeadline" value={formData.followUpDeadline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Agenda</label>
                <textarea name="agenda" value={formData.agenda} onChange={handleChange} rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium italic shadow-inner" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Recording Link</label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="recordingUrl" value={formData.recordingUrl} onChange={handleChange} className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none text-xs text-indigo-600 font-bold shadow-inner" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  Transcript
                  <button type="button" className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <Zap className="w-3 h-3" /> AI Summary
                  </button>
                </label>
                <textarea name="transcript" value={formData.transcript} onChange={handleChange} rows={12} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none resize-none font-mono text-[10px] leading-relaxed shadow-inner" placeholder="Vložte prepis meetingu..." />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Poznámky</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-xs shadow-inner" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="meeting-form" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť meeting
          </button>
        </div>
      </div>
    </div>
  );
}
