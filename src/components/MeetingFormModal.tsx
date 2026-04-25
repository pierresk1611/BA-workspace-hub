import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Zap } from 'lucide-react';
import type { Meeting, MeetingType } from '../types';
import { useProject } from '../context/ProjectContext';

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900">{initialData ? 'Upraviť meeting' : 'Nový meeting'}</h2>
            <p className="text-sm text-slate-500 font-medium">Manuálny záznam a prepis stretnutia</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov meetingu *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dátum</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Od</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Do</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Účastníci</label>
                <input name="participants" value={formData.participants} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Mená oddelené čiarkou..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ meetingu</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold">
                    {typeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Follow-up deadline</label>
                  <input type="date" name="followUpDeadline" value={formData.followUpDeadline} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Agenda</label>
                <textarea name="agenda" value={formData.agenda} onChange={handleChange} rows={4} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-sm italic" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Recording Link (Teams/Sharepoint)</label>
                <div className="relative">
                  <Link2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="recordingUrl" value={formData.recordingUrl} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-indigo-600" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Manuálne vložený transcript</label>
                <textarea name="transcript" value={formData.transcript} onChange={handleChange} rows={12} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none font-mono text-[10px] leading-relaxed" placeholder="Vložte prepis meetingu..." />
                <button type="button" className="mt-2 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase hover:text-indigo-700">
                  <Zap className="w-3 h-3" /> AI Generate Summary from Transcript
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Poznámky</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none text-xs" />
              </div>
            </div>

          </div>
        </form>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-8 py-3 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-xl flex items-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť meeting
          </button>
        </div>
      </div>
    </div>
  );
}
