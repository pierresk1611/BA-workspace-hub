import React, { useState, useEffect } from 'react';
import { X, Save, Link2, Calendar, User, AlertTriangle, Shield, Zap } from 'lucide-react';
import type { Risk, RiskCategory, RiskStatus } from '../types';
import { useProject } from '../context/ProjectContext';

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť riziko' : 'Nové riziko'}</h2>
            <p className="text-sm text-slate-500">Identifikácia a plán mitigácie rizika</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Risk Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov rizika <span className="text-red-500">*</span></label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Popis rizika</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategória</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Risk Matrix Assessment
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Pravdepodobnosť (1-5)</label>
                    <input type="range" name="probability" min="1" max="5" value={formData.probability} onChange={handleChange} className="w-full accent-rose-500" />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Nízka</span>
                      <span>Vysoká</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Dopad / Impact (1-5)</label>
                    <input type="range" name="impact" min="1" max="5" value={formData.impact} onChange={handleChange} className="w-full accent-rose-500" />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Zanedbateľný</span>
                      <span>Katastrofálny</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Výsledná Severity:</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                    formData.severity === 'Kritická' ? 'bg-rose-600 text-white' :
                    formData.severity === 'Vysoká' ? 'bg-orange-500 text-white' :
                    formData.severity === 'Stredná' ? 'bg-amber-400 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {formData.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Mitigation & Links */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Mitigation Plan (Opatrenia)
                </label>
                <textarea name="mitigationPlan" value={formData.mitigationPlan} onChange={handleChange} rows={4} className="w-full p-2.5 bg-emerald-50/30 border border-emerald-100 rounded-xl outline-none resize-none font-medium" placeholder="Aké kroky podnikneme na zníženie rizika?" />
                <button type="button" className="mt-2 text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:text-indigo-700">
                  <Zap className="w-3 h-3" /> Vygenerovať mitigáciu cez AI
                </button>
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
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Mitigation Deadline
                  </label>
                  <input type="date" name="mitigationDeadline" value={formData.mitigationDeadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                  <Link2 className="w-4 h-4" />
                  Prepojenia
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input name="relatedRequirementId" value={formData.relatedRequirementId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="REQ-001" />
                  <input name="relatedJiraKey" value={formData.relatedJiraKey} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="LOG-123" />
                </div>
                <input name="relatedSystemId" value={formData.relatedSystemId} onChange={handleChange} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="Súvisiaci systém ID" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Zdrojový Link</label>
                <input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" placeholder="https://..." />
              </div>
            </div>

          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" />
            Uložiť riziko
          </button>
        </div>
      </div>
    </div>
  );
}
