import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Project, ProjectStatus, ProjectPriority, ProjectType } from '../types';
import { useProject } from '../context/ProjectContext';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Project;
}

const statuses: ProjectStatus[] = ["Idea", "Discovery", "Analýza", "Solution Design", "Refinement", "Vývoj", "Testovanie", "UAT", "Rollout", "Done", "Pozastavené"];
const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];
const projectTypes: ProjectType[] = ["IT projekt", "Logistický projekt", "Procesná zmena", "Reporting / BI", "Data / SQL analýza", "Interný nástroj", "Iné"];


export function ProjectFormModal({ isOpen, onClose, initialData }: ProjectFormModalProps) {
  const { addProject, updateProject } = useProject();

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    status: 'Idea',
    priority: 'Stredná',
    type: 'IT projekt',
    team: {
      businessAnalyst: '',
      productOwner: '',
      businessOwner: '',
      techLead: '',
      qaOwner: '',
      stakeholders: ''
    },
    startDate: '',
    targetDate: '',
    release: '',
    mainDeadline: '',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', shortDescription: '', detailedDescription: '', status: 'Idea', priority: 'Stredná',
        team: { businessAnalyst: '', productOwner: '', businessOwner: '', techLead: '', qaOwner: '', stakeholders: '' },
        startDate: '', targetDate: '', release: '', mainDeadline: '', tags: '', type: 'IT projekt', notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('team.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        team: { ...prev.team!, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString();
    if (initialData) {
      updateProject(initialData.id, { ...formData, lastModified: today });
    } else {
      const newProject: Project = {
        ...(formData as any),
        id: `proj_${Date.now()}`,
        lastModified: today,
        metrics: { 
          progress: 0, 
          healthScore: 100, 
          nearestDeadline: formData.mainDeadline || '-', 
          overdueItems: 0, 
          openJira: 0, 
          openQuestions: 0, 
          decisions: 0, 
          highRisks: 0, 
          sqlQueries: 0, 
          sqlResults: 0 
        },
        charts: { progressOverTime: [], tasksByStatus: [], requirementsByStatus: [] },
        upcomingMeetings: [],
        recentActivities: [],
        requirements: [], decisions: [], risks: [], questions: [], confluenceSources: [], systems: [], tasks: []
      };
      addProject(newProject);
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
        "bg-white w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-4xl lg:rounded-[2.5rem] shadow-2xl flex flex-col relative transition-transform duration-500 transform overflow-hidden",
        isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-4 lg:scale-95 lg:opacity-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-10 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Upraviť projekt' : 'Nový projekt'}
            </h2>
            <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-1 md:mt-2">
              Definícia parametrov workspaceu
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 md:p-4 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8 md:space-y-12">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
            
            {/* Základné informácie */}
            <div className="space-y-6">
              <h3 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Základné dáta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov projektu *</label>
                  <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Krátky popis *</label>
                  <input required name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailný popis</label>
                  <textarea name="detailedDescription" value={formData.detailedDescription || ''} onChange={handleChange} rows={4} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select name="status" value={formData.status || 'Idea'} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner appearance-none">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priorita</label>
                  <select name="priority" value={formData.priority || 'Stredná'} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner appearance-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tím */}
            <div className="space-y-6">
              <h3 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Projektový tím</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Business Analyst</label>
                  <input name="team.businessAnalyst" value={formData.team?.businessAnalyst || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Owner</label>
                  <input name="team.productOwner" value={formData.team?.productOwner || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Business Owner</label>
                  <input name="team.businessOwner" value={formData.team?.businessOwner || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                </div>
              </div>
            </div>

            {/* Dátumy a metadáta */}
            <div className="space-y-6 pb-20">
              <h3 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Klasifikácia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dátum začiatku</label>
                  <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hlavný deadline</label>
                  <input type="date" name="mainDeadline" value={formData.mainDeadline || ''} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Typ projektu</label>
                  <select name="type" value={formData.type || 'IT projekt'} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner appearance-none">
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
          <button 
            onClick={onClose} 
            className="flex-1 px-8 py-4 md:py-5 bg-white border border-slate-200 text-slate-600 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Zrušiť
          </button>
          <button 
            type="submit" 
            form="project-form" 
            className="flex-1 px-8 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            {initialData ? 'Uložiť zmeny' : 'Vytvoriť projekt'}
          </button>
        </div>
      </div>
    </div>
  );
}
