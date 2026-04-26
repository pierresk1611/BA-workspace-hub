import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { DataFlow, DataFlowType } from '../types';
import { useProject } from '../context/ProjectContext';

interface KafkaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: DataFlow;
}

const flowTypes: DataFlowType[] = ["Kafka topic", "API", "DB view", "Event stream", "Manual export", "Iné"];
const criticalities = ["Nízka", "Stredná", "Vysoká", "Kritická"] as const;

export function KafkaFormModal({ isOpen, onClose, initialData }: KafkaFormModalProps) {
  const { activeProject, addDataFlow, updateDataFlow } = useProject();
  const [formData, setFormData] = useState<Partial<DataFlow>>({
    name: '',
    type: 'Kafka topic',
    topicName: '',
    docUrl: '',
    manualText: '',
    producer: '',
    consumer: '',
    payloadSummary: '',
    dataOwner: '',
    techOwner: '',
    businessOwner: '',
    frequency: '',
    criticality: 'Stredná',
    validationDeadline: '',
    reviewDate: '',
    linkedRequirements: '',
    linkedJira: '',
    risks: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        type: 'Kafka topic',
        topicName: '',
        docUrl: '',
        manualText: '',
        producer: '',
        consumer: '',
        payloadSummary: '',
        dataOwner: '',
        techOwner: '',
        businessOwner: '',
        frequency: '',
        criticality: 'Stredná',
        validationDeadline: '',
        reviewDate: '',
        linkedRequirements: '',
        linkedJira: '',
        risks: '',
        notes: ''
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
      updateDataFlow(activeProject.id, initialData.id, formData);
    } else {
      const newItem: DataFlow = {
        ...(formData as DataFlow),
        id: `df_${Date.now()}`
      };
      addDataFlow(activeProject.id, newItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Upraviť dátový tok' : 'Pridať nový dátový tok'}</h2>
            <p className="text-sm text-slate-500">Evidencia Kafka topicov, API a eventov</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Názov toku <span className="text-red-500">*</span></label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Typ zdroja</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  {flowTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Topic / Systémový názov</label>
                <input name="topicName" value={formData.topicName} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kritickosť</label>
                <select name="criticality" value={formData.criticality} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                  {criticalities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Validation Deadline <span className="text-red-500">*</span></label>
                <input required type="date" name="validationDeadline" value={formData.validationDeadline} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="md:col-span-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Producent</label>
                  <input name="producer" value={formData.producer} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Consumer</label>
                  <input name="consumer" value={formData.consumer} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Data Owner <span className="text-red-500">*</span></label>
                <input required name="dataOwner" value={formData.dataOwner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tech Owner</label>
                  <input name="techOwner" value={formData.techOwner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Owner</label>
                  <input name="businessOwner" value={formData.businessOwner} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Frekvencia</label>
                <input name="frequency" value={formData.frequency} onChange={handleChange} placeholder="napr. Real-time, Daily..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Dokumentačný link</label>
                <input name="docUrl" value={formData.docUrl} onChange={handleChange} placeholder="https://..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Požiadavka</label>
                  <input name="linkedRequirements" value={formData.linkedRequirements} onChange={handleChange} placeholder="REQ-001" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jira položka</label>
                  <input name="linkedJira" value={formData.linkedJira} onChange={handleChange} placeholder="PROJ-101" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Riziká k toku</label>
                <input name="risks" value={formData.risks} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payload Summary</label>
                <textarea name="payloadSummary" value={formData.payloadSummary} onChange={handleChange} rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-xs font-mono" />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Manuálne vložený text dokumentácie <span className="text-red-500">*</span></label>
              <textarea required name="manualText" value={formData.manualText} onChange={handleChange} rows={5} placeholder="Skopírujte text z dokumentácie..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm leading-relaxed" />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-all shadow-sm">
            Zrušiť
          </button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md">
            {initialData ? 'Uložiť zmeny' : 'Pridať dátový tok'}
          </button>
        </div>
      </div>
    </div>
  );
}
