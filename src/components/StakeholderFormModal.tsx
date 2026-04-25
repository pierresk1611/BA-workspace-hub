import React, { useState, useEffect } from 'react';
import { X, Save, User, Briefcase, Mail, Phone, Shield, Star, AlertTriangle, Info, Calendar } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';
import type { Stakeholder, DecisionPower } from '../types';

interface StakeholderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Stakeholder;
}

const powerOptions: DecisionPower[] = ['Decision maker', 'Contributor', 'Consulted', 'Informed', 'Blocker risk'];

export function StakeholderFormModal({ isOpen, onClose, initialData }: StakeholderFormModalProps) {
  const { activeProject, addStakeholder, updateStakeholder } = useProject();
  const [formData, setFormData] = useState<Partial<Stakeholder>>({
    name: '',
    role: '',
    team: '',
    decisionPower: 'Consulted',
    responsibilityArea: '',
    email: '',
    phone: '',
    followUpDeadline: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        role: '',
        team: '',
        decisionPower: 'Consulted',
        responsibilityArea: '',
        email: '',
        phone: '',
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
      updateStakeholder(activeProject.id, initialData.id, formData);
    } else {
      const newItem: Stakeholder = {
        ...(formData as Stakeholder),
        id: `STK-${Math.floor(100 + Math.random() * 900)}`,
      };
      addStakeholder(activeProject.id, newItem);
    }
    onClose();
  };

  const getPowerIcon = (power: DecisionPower) => {
    switch (power) {
      case 'Decision maker': return <Star className="w-4 h-4" />;
      case 'Contributor': return <Shield className="w-4 h-4" />;
      case 'Blocker risk': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
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
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{initialData ? 'Upraviť stakeholdera' : 'Nový stakeholder'}</h2>
            <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Správa kľúčových osôb projektu</p>
          </div>
          <button onClick={onClose} className="p-3 md:p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm text-slate-400">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <form id="stakeholder-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Meno a Priezvisko *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-xs md:text-sm shadow-inner" placeholder="napr. Ján Novák" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Rola</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input name="role" value={formData.role} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" placeholder="napr. Product Owner" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tím / Oddelenie</label>
                  <input name="team" value={formData.team} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold" placeholder="napr. Logistics IT" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Rozhodovacia právomoc</label>
                <div className="grid grid-cols-1 gap-2">
                  {powerOptions.map(power => (
                    <button
                      key={power}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, decisionPower: power }))}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-[10px] md:text-xs font-black uppercase tracking-widest",
                        formData.decisionPower === power 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                      )}
                    >
                      {getPowerIcon(power)}
                      {power}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Oblasť zodpovednosti</label>
                <textarea name="responsibilityArea" value={formData.responsibilityArea} onChange={handleChange} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none text-[11px] md:text-sm font-medium shadow-inner" placeholder="Za čo tento človek zodpovedá v projekte?" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400" />
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" placeholder="email@firma.sk" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-400" />
                    Telefón
                  </label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" placeholder="+421..." />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-rose-500" />
                  Follow-up Deadline
                </label>
                <input type="date" name="followUpDeadline" value={formData.followUpDeadline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] md:text-xs font-bold shadow-inner" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 shrink-0">
          <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
            Zrušiť
          </button>
          <button type="submit" form="stakeholder-form" className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {initialData ? 'Uložiť zmeny' : 'Pridať stakeholdera'}
          </button>
        </div>
      </div>
    </div>
  );
}
