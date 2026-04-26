import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, Server } from 'lucide-react';
import type { Dependency, DependencyStatus } from '../types';
import { useProject } from '../context/ProjectContext';

interface DependencyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Dependency;
}

const statusOptions: DependencyStatus[] = ["Plánované", "Prebieha", "Blokované", "Hotové", "Oneskorené"];

export function DependencyFormModal({ isOpen, onClose, initialData }: DependencyFormModalProps) {
  const { activeProject, addDependency, updateDependency } = useProject();
  const [formData, setFormData] = useState<Partial<Dependency>>({
    title: '',
    sourceSystem: '',
    targetSystem: '',
    description: '',
    owner: '',
    status: 'Plánované',
    deadline: '',
    relatedRequirementId: '',
    relatedJiraKey: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        sourceSystem: '',
        targetSystem: '',
        description: '',
        owner: 'Peter (BA)',
        status: 'Plánované',
        deadline: '',
        relatedRequirementId: '',
        relatedJiraKey: ''
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
      updateDependency(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Dependency = {
        ...(formData as Dependency),
        id: `DEP-${Math.floor(100 + Math.random() * 900)}`
      };
      addDependency(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť závislosť' : 'Nová závislosť'}</h2>
            <p className="text-sm text-slate-500">Mapovanie väzieb medzi systémami a tímami</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Názov závislosti <span className="text-red-500">*</span></label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-slate-400" />
                  Zdrojový systém
                </label>
                <input name="sourceSystem" value={formData.sourceSystem} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Tím A / Systém A" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  Cieľový systém
                </label>
                <input name="targetSystem" value={formData.targetSystem} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="napr. Systém B" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Popis väzby</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Deadline
                </label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Owner
                </label>
                <input name="owner" value={formData.owner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-400" />
                  Požiadavka
                </label>
                <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="REQ-001" />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" />
            Uložiť závislosť
          </button>
        </div>
      </div>
    </div>
  );
}
