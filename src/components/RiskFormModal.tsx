import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, AlertTriangle, Shield, Zap } from 'lucide-react';
import type { Risk, RiskCategory, RiskStatus } from '../types';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

interface RiskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Risk;
}

const statusOptions: RiskStatus[] = ["Open", "Monitoring", "Mitigation in progress", "Resolved", "Accepted", "Closed"];
const categories: RiskCategory[] = ["Business", "Technical", "Data", "Security", "Process", "Operational", "Timeline", "Dependency"];

export function RiskFormModal({ isOpen, onClose, initialData }: RiskFormModalProps) {
  const { activeProject, addRisk, updateRisk } = useProject();
  const [formData, setFormData] = useState<Partial<Risk>>({
    title: '',
    description: '',
    category: 'Technical',
    impact: 3,
    probability: 3,
    severity: 'Stredná',
    owner: '',
    mitigationPlan: '',
    mitigationDeadline: '',
    status: 'Open',
    sourceUrl: '',
    manualSourceText: '',
    relatedRequirementId: '',
    relatedJiraKey: '',
    relatedSystemId: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        impact: 3,
        probability: 3,
        severity: 'Stredná',
        owner: 'Peter (BA)',
        mitigationPlan: '',
        mitigationDeadline: '',
        status: 'Open',
        sourceUrl: '',
        manualSourceText: '',
        relatedRequirementId: '',
        relatedJiraKey: '',
        relatedSystemId: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const score = (formData.impact || 0) * (formData.probability || 0);
    let severity: "Nízka" | "Stredná" | "Vysoká" | "Kritická" = "Nízka";
    if (score >= 20) severity = "Kritická";
    else if (score >= 12) severity = "Vysoká";
    else if (score >= 6) severity = "Stredná";
    
    setFormData(prev => ({ ...prev, severity }));
  }, [formData.impact, formData.probability]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = (name === 'impact' || name === 'probability') ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (initialData) {
      updateRisk(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Risk = {
        ...(formData as Risk),
        id: `RSK-${Math.floor(100 + Math.random() * 900)}`
      };
      addRisk(activeProject.id, newItem);
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
        "bg-white w-full h-full lg:h-auto lg:max-h-[95vh] lg:max-w-4xl lg:rounded-[2.5rem] shadow-2xl flex flex-col relative transition-transform duration-500 transform overflow-hidden border border-slate-200",
        isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-4 lg:scale-95 lg:opacity-0"
      )}>
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť riziko' : 'Nové riziko'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Identifikácia a plán mitigácie</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="risk-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Názov rizika *</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 transition-all font-bold text-xs md:text-sm shadow-inner" />
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Popis rizika</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium shadow-inner" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kategória</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-black appearance-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-rose-50/30 rounded-[2.5rem] border border-rose-100 space-y-6 shadow-sm">
                <h3 className="text-[10px] font-black text-rose-600 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Assessment Matrix
                </h3>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pravdepodobnosť</label>
                       <span className="text-xs font-black text-rose-600">{formData.probability}/5</span>
                    </div>
                    <input type="range" name="probability" min="1" max="5" value={formData.probability} onChange={handleChange} className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dopad (Impact)</label>
                       <span className="text-xs font-black text-rose-600">{formData.impact}/5</span>
                    </div>
                    <input type="range" name="impact" min="1" max="5" value={formData.impact} onChange={handleChange} className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity:</span>
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]",
                    formData.severity === 'Kritická' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' :
                    formData.severity === 'Vysoká' ? 'bg-orange-500 text-white' :
                    formData.severity === 'Stredná' ? 'bg-amber-400 text-white' : 'bg-slate-400 text-white'
                  )}>
                    {formData.severity}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Plán Mitigácie</span>
                  <button type="button" className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all">
                    <Zap className="w-3.5 h-3.5" /> AI Plan
                  </button>
                </label>
                <textarea name="mitigationPlan" value={formData.mitigationPlan} onChange={handleChange} rows={5} className="w-full p-5 bg-emerald-50/20 border border-emerald-100 rounded-[2rem] outline-none resize-none text-[11px] md:text-sm font-bold shadow-inner" placeholder="Opatrenia na zníženie rizika..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 text-slate-400" />
                    Owner
                  </label>
                  <input name="owner" value={formData.owner} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Deadline
                  </label>
                  <input type="date" name="mitigationDeadline" value={formData.mitigationDeadline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" />
                </div>
              </div>

              <div className="p-5 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Link2 className="w-4 h-4" />
                  Prepojenia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="REQ ID" />
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none" placeholder="Jira Key" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="risk-form" className="w-full sm:w-auto px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Uložiť riziko
          </button>
        </div>
      </div>
    </div>
  );
}
