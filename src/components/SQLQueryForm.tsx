import React, { useState, useEffect } from 'react';
import { X, Bot, Database, Send, Save, Terminal, ShieldAlert, Code2 } from 'lucide-react';
import type { SQLQuery, SQLDialect, SQLStatus } from '../types';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

interface SQLQueryFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SQLQuery;
}

const dialects: SQLDialect[] = ["PostgreSQL", "MySQL", "MS SQL", "Oracle", "Hive", "Snowflake", "Iné"];
const statuses: SQLStatus[] = ["Draft", "Validovaný", "Zastaraný", "Archivovaný"];

export function SQLQueryForm({ isOpen, onClose, initialData }: SQLQueryFormProps) {
  const { activeProject, addSQLQuery, updateSQLQuery } = useProject();
  const [formData, setFormData] = useState<Partial<SQLQuery>>({
    name: '',
    description: '',
    sqlText: '',
    dialect: 'PostgreSQL',
    author: 'Peter (BA)',
    owner: 'Peter (BA)',
    status: 'Draft',
    priority: 'Stredná',
    relatedProject: '',
    relatedRequirement: '',
    relatedJira: '',
    relatedDataFlow: '',
    reviewDeadline: '',
    tags: '',
    businessCriteria: {
      goal: '',
      tables: '',
      columns: '',
      filters: '',
      period: '',
      joins: '',
      groupBy: '',
      orderBy: '',
      limit: '',
      interpretation: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        sqlText: '',
        dialect: 'PostgreSQL',
        author: 'Peter (BA)',
        owner: 'Peter (BA)',
        status: 'Draft',
        priority: 'Stredná',
        relatedProject: activeProject?.name || '',
        relatedRequirement: '',
        relatedJira: '',
        relatedDataFlow: '',
        reviewDeadline: '',
        tags: '',
        businessCriteria: {
          goal: '',
          tables: '',
          columns: '',
          filters: '',
          period: '',
          joins: '',
          groupBy: '',
          orderBy: '',
          limit: '',
          interpretation: ''
        }
      });
    }
  }, [initialData, isOpen, activeProject]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof SQLQuery] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateSQL = () => {
    const bc = formData.businessCriteria;
    if (!bc) return;
    
    let sql = `SELECT ${bc.columns || '*'} \nFROM ${bc.tables || 'table_name'}`;
    if (bc.joins) sql += ` \nJOIN ${bc.joins}`;
    if (bc.filters || bc.period) {
      sql += ` \nWHERE ${bc.filters || '1=1'}`;
      if (bc.period) sql += ` AND date_col = '${bc.period}'`;
    }
    if (bc.groupBy) sql += ` \nGROUP BY ${bc.groupBy}`;
    if (bc.orderBy) sql += ` \nORDER BY ${bc.orderBy}`;
    if (bc.limit) sql += ` \nLIMIT ${bc.limit};`;

    setFormData(prev => ({ ...prev, sqlText: sql }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    if (initialData) {
      updateSQLQuery(activeProject.id, initialData.id, {
        ...formData,
        dateUpdated: new Date().toISOString().split('T')[0]
      });
    } else {
      const newQuery: SQLQuery = {
        ...(formData as SQLQuery),
        id: `sql_${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        dateUpdated: new Date().toISOString().split('T')[0]
      };
      addSQLQuery(activeProject.id, newQuery);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit SQL Intelligence' : 'New Analytical Workspace'}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Definujte biznis logiku a technickú špecifikáciu analytického dotazu.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white hover:bg-rose-50 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-600 transition-all shadow-sm group">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Business Criteria */}
            <div className="space-y-10">
              <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden group">
                <Bot className="absolute -right-4 -top-4 w-24 h-24 text-indigo-200/30 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-[10px] font-black text-indigo-600 mb-8 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Bot className="w-5 h-5" /> Business Logic (Generator)
                </h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Primary Goal (Business Context)</label>
                    <textarea 
                      name="businessCriteria.goal" 
                      value={formData.businessCriteria?.goal} 
                      onChange={handleChange} 
                      rows={2} 
                      className="w-full p-4 bg-white border border-indigo-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" 
                      placeholder="Čo presne chceme týmto dotazom pre biznis zistiť?" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Tables / Schemas</label>
                      <input name="businessCriteria.tables" value={formData.businessCriteria?.tables} onChange={handleChange} className="w-full p-3.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="users, orders, sessions..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Required Columns</label>
                      <input name="businessCriteria.columns" value={formData.businessCriteria?.columns} onChange={handleChange} className="w-full p-3.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="id, name, sum(price)..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Filters (WHERE Clause)</label>
                      <input name="businessCriteria.filters" value={formData.businessCriteria?.filters} onChange={handleChange} className="w-full p-3.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Analysis Period</label>
                      <input name="businessCriteria.period" value={formData.businessCriteria?.period} onChange={handleChange} className="w-full p-3.5 bg-white border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 transition-all" placeholder="today, YTD, last quarter..." />
                    </div>
                  </div>
                  <button type="button" onClick={generateSQL} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Generate SQL Draft
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Query Name <span className="text-rose-500">*</span></label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-inner" placeholder="e.g. Driver Connection Anomaly" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Database Dialect</label>
                    <select name="dialect" value={formData.dialect} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner">
                      {dialects.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Contextual Description</label>
                  <input name="description" value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner" placeholder="Pár slov o tom, kedy sa tento dotaz používa..." />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Review Deadline</label>
                    <input type="date" name="reviewDeadline" value={formData.reviewDeadline} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50 shadow-inner" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: SQL Text & Meta */}
            <div className="space-y-8 flex flex-col">
              <div className="flex-1 flex flex-col min-h-[400px]">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 ml-1">
                  <Terminal className="w-4 h-4 text-indigo-500" /> Technical SQL Specification
                </label>
                <div className="flex-1 bg-slate-900 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden group">
                  <textarea 
                    required 
                    name="sqlText" 
                    value={formData.sqlText} 
                    onChange={handleChange} 
                    className="absolute inset-0 w-full h-full p-8 bg-transparent text-indigo-300 font-mono text-sm leading-loose outline-none resize-none custom-scrollbar selection:bg-indigo-500/30" 
                    placeholder="-- Tu vložte alebo vygenerujte SQL dotaz..." 
                  />
                  <div className="absolute top-8 right-8 p-3 bg-white/5 rounded-xl border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Business Traceability</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Requirement</span>
                        <input name="relatedRequirement" value={formData.relatedRequirement} onChange={handleChange} className="bg-transparent text-xs font-black text-indigo-600 outline-none text-right w-24" placeholder="REQ-ID" />
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jira Ticket</span>
                        <input name="relatedJira" value={formData.relatedJira} onChange={handleChange} className="bg-transparent text-xs font-black text-blue-600 outline-none text-right w-24" placeholder="JIRA-ID" />
                     </div>
                   </div>
                </div>
                <div className="space-y-5">
                   <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Data Governance</h4>
                   <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Flow</span>
                        <input name="relatedDataFlow" value={formData.relatedDataFlow} onChange={handleChange} className="bg-transparent text-xs font-black text-slate-700 outline-none text-right w-24" placeholder="TOPIC NAME" />
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tags</span>
                        <input name="tags" value={formData.tags} onChange={handleChange} className="bg-transparent text-xs font-black text-slate-700 outline-none text-right w-24" placeholder="reporting, pii..." />
                     </div>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4 shadow-sm">
                <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                   <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-[10px] font-black text-amber-800 leading-relaxed uppercase tracking-widest italic">
                  <strong>Sandbox Protocol Active:</strong> Dokumentácia dotazu nesmie obsahovať reálne prihlasovacie údaje ani produkčné IP adresy. Všetky testy prebiehajú v mock prostredí.
                </p>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            Zrušiť Zmeny
          </button>
          <button onClick={handleSubmit} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95">
            <Save className="w-5 h-5" />
            Commit to Repository
          </button>
        </div>
      </div>
    </div>
  );
}
