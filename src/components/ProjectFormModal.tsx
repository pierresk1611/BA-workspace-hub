import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Project, ProjectStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Project;
}

const statuses: ProjectStatus[] = ["Idea", "Discovery", "Analýza", "Solution Design", "Refinement", "Vývoj", "Testovanie", "UAT", "Rollout", "Done", "Pozastavené"];
const priorities: ProjectPriority[] = ["Nízka", "Stredná", "Vysoká", "Kritická"];

export function ProjectFormModal({ isOpen, onClose, initialData }: ProjectFormModalProps) {
  const { addProject, updateProject } = useProject();

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    status: 'Idea',
    priority: 'Stredná',
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
    type: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '', shortDescription: '', detailedDescription: '', status: 'Idea', priority: 'Stredná',
        team: { businessAnalyst: '', productOwner: '', businessOwner: '', techLead: '', qaOwner: '', stakeholders: '' },
        startDate: '', targetDate: '', release: '', mainDeadline: '', tags: '', type: '', notes: ''
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
    if (initialData) {
      updateProject(initialData.id, formData);
    } else {
      const newProject: Project = {
        ...(formData as any),
        id: `proj_${Date.now()}`,
        metrics: { progress: 0, healthScore: 100, nearestDeadline: formData.mainDeadline || '-', overdueItems: 0, openJira: 0, openQuestions: 0, decisions: 0, highRisks: 0, sqlQueries: 0, sqlResults: 0 },
        charts: { progressOverTime: [], tasksByStatus: [], requirementsByStatus: [] },
        upcomingMeetings: [],
        recentActivities: [],
        requirements: [], decisions: [], risks: [], questions: [], systems: [], tasks: []
      };
      addProject(newProject);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Upraviť projekt' : 'Vytvoriť nový projekt'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Základné informácie */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Základné informácie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Názov projektu *</label>
                  <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Krátky popis *</label>
                  <input required name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Detailný popis</label>
                  <textarea name="detailedDescription" value={formData.detailedDescription || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status || 'Idea'} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priorita</label>
                  <select name="priority" value={formData.priority || 'Stredná'} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Tím */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Projektový tím</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Analyst</label>
                  <input name="team.businessAnalyst" value={formData.team?.businessAnalyst || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Owner</label>
                  <input name="team.productOwner" value={formData.team?.productOwner || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Owner</label>
                  <input name="team.businessOwner" value={formData.team?.businessOwner || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tech Lead</label>
                  <input name="team.techLead" value={formData.team?.techLead || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">QA Owner</label>
                  <input name="team.qaOwner" value={formData.team?.qaOwner || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stakeholderi</label>
                  <input name="team.stakeholders" value={formData.team?.stakeholders || ''} onChange={handleChange} placeholder="Napr. Logistika, Marketing..." className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Dátumy a metadáta */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Dátumy a Klasifikácia</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dátum začiatku</label>
                  <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cieľové dokončenie</label>
                  <input type="date" name="targetDate" value={formData.targetDate || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hlavný deadline</label>
                  <input type="date" name="mainDeadline" value={formData.mainDeadline || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cieľový release</label>
                  <input name="release" value={formData.release || ''} onChange={handleChange} placeholder="Napr. Q3 2026" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tagy</label>
                  <input name="tags" value={formData.tags || ''} onChange={handleChange} placeholder="Oddelené čiarkou" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Typ projektu</label>
                  <input name="type" value={formData.type || ''} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Poznámky</label>
                  <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            Zrušiť
          </button>
          <button type="submit" form="project-form" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            {initialData ? 'Uložiť zmeny' : 'Vytvoriť projekt'}
          </button>
        </div>
      </div>
    </div>
  );
}
