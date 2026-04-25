import React, { useState, useRef } from 'react';
import { X, Upload, FileJson, Type, Database, CheckCircle2, AlertTriangle, ArrowRight, Save, Clipboard, Trash2, Search, Filter } from 'lucide-react';
import type { AsanaTask, AsanaTaskStatus, ProjectPriority } from '../types';
import { useProject } from '../context/ProjectContext';
import { cn } from '../lib/utils';

interface AsanaImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportType = 'CSV' | 'JSON' | 'Plain Text' | 'Demo';

interface ColumnMapping {
  source: string;
  target: keyof AsanaTask | '';
}

export function AsanaImportModal({ isOpen, onClose }: AsanaImportModalProps) {
  const { activeProject, importAsanaTasks } = useProject();
  const [step, setStep] = useState(1);
  const [importType, setImportType] = useState<ImportType>('CSV');
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping[]>([]);
  const [previewTasks, setPreviewTasks] = useState<AsanaTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [summary, setSummary] = useState({
    total: 0,
    imported: 0,
    skipped: 0,
    warnings: 0
  });

  if (!isOpen) return null;

  const resetImport = () => {
    setStep(1);
    setInputText('');
    setParsedData([]);
    setHeaders([]);
    setMapping([]);
    setPreviewTasks([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        processInput(text, 'CSV');
      };
      reader.readAsText(file);
    }
  };

  const parseCSVLine = (line: string) => {
    const pattern = /("([^"]*(?:""[^"]*)*)"|([^,]*))/g;
    const matches = Array.from(line.matchAll(pattern));
    const results = [];
    for (const match of matches) {
      let value = match[0];
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1).replace(/""/g, '"');
      }
      results.push(value.trim());
    }
    // Pop empty matches
    while (results.length > 0 && results[results.length - 1] === '') results.pop();
    return results;
  };

  const processInput = (text: string, type: ImportType) => {
    try {
      if (type === 'JSON') {
        const data = JSON.parse(text);
        const rows = Array.isArray(data) ? data : [data];
        setParsedData(rows);
        const firstRowKeys = rows.length > 0 ? Object.keys(rows[0]) : [];
        setHeaders(firstRowKeys);
        generateAutoMapping(firstRowKeys);
        setStep(3);
      } else if (type === 'CSV') {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length > 0) {
          const csvHeaders = parseCSVLine(lines[0]);
          const csvRows = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj: any = {};
            csvHeaders.forEach((h, i) => obj[h] = values[i] || '');
            return obj;
          });
          setHeaders(csvHeaders);
          setParsedData(csvRows);
          generateAutoMapping(csvHeaders);
          setStep(3);
        }
      } else if (type === 'Plain Text') {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        const textTasks = lines.map((line, i) => {
          // Simple parsing: split by common separators or just use the whole line as title
          const parts = line.split(/[|\t;,]/);
          const title = parts[0]?.trim() || `Task ${i+1}`;
          const owner = parts[1]?.trim() || 'Nepriradené';
          const dueDate = parts[2]?.trim().match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
          
          const task: AsanaTask = {
            id: `AS-IMPORT-${Date.now()}-${i}`,
            title,
            description: line,
            owner,
            status: 'Not started',
            priority: 'Stredná',
            progress: 0,
            dueDate,
            milestone: '',
            asanaUrl: '',
            lastUpdated: new Date().toISOString().split('T')[0],
            sourceImportType: 'Plain Text',
            importedAt: new Date().toISOString(),
            projectId: activeProject?.id,
            warnings: []
          };
          
          if (!dueDate) task.warnings?.push('chýba deadline');
          if (owner === 'Nepriradené') task.warnings?.push('chýba owner');
          
          return task;
        });
        setPreviewTasks(textTasks);
        setStep(4);
      } else if (type === 'Demo') {
        const demoData = [
          { title: 'User Interface Design', owner: 'Analyst', status: 'In progress', priority: 'Vysoká', dueDate: '2026-05-10', asanaUrl: 'https://app.asana.com/demo1' },
          { title: 'API Integration Layer', owner: 'Developer', status: 'Not started', priority: 'Stredná', dueDate: '2026-06-15', asanaUrl: 'https://app.asana.com/demo2' },
          { title: 'Database Schema Migration', owner: 'Nepriradené', status: 'Blocked', priority: 'Vysoká', dueDate: '', asanaUrl: 'https://app.asana.com/demo3' }
        ];
        const tasks = demoData.map((d, i) => ({
          ...d,
          id: `AS-DEMO-${Date.now()}-${i}`,
          description: 'Automaticky vygenerovaný demo task.',
          progress: 0,
          milestone: '',
          lastUpdated: new Date().toISOString().split('T')[0],
          sourceImportType: 'Demo' as any,
          importedAt: new Date().toISOString(),
          projectId: activeProject?.id,
          warnings: d.dueDate ? [] : ['chýba deadline']
        } as AsanaTask));
        setPreviewTasks(tasks);
        setStep(4);
      }
    } catch (err) {
      alert('Chyba pri spracovaní dát. Skontrolujte formát.');
    }
  };

  const generateAutoMapping = (srcHeaders: string[]) => {
    const targetFields: (keyof AsanaTask)[] = ['title', 'description', 'owner', 'status', 'priority', 'dueDate', 'asanaUrl', 'progress', 'milestone'];
    const newMapping: ColumnMapping[] = srcHeaders.map(h => {
      const low = h.toLowerCase().replace(/[\s_]/g, '');
      let target: keyof AsanaTask | '' = '';
      
      if (['name', 'taskname', 'title'].includes(low)) target = 'title';
      else if (['description', 'popis'].includes(low)) target = 'description';
      else if (['assignee', 'owner', 'vlastnik'].includes(low)) target = 'owner';
      else if (['status', 'stav'].includes(low)) target = 'status';
      else if (['priority', 'priorita'].includes(low)) target = 'priority';
      else if (['duedate', 'deadline', 'termín'].includes(low)) target = 'dueDate';
      else if (['url', 'link', 'asanaurl'].includes(low)) target = 'asanaUrl';
      else if (['progress', 'progres'].includes(low)) target = 'progress';
      else if (['section', 'milestone'].includes(low)) target = 'milestone';
      
      return { source: h, target };
    });
    setMapping(newMapping);
  };

  const applyMapping = () => {
    const tasks = parsedData.map((row, i) => {
      const task: any = {
        id: `AS-IMPORT-${Date.now()}-${i}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        sourceImportType: importType,
        importedAt: new Date().toISOString(),
        projectId: activeProject?.id,
        warnings: [],
        status: 'Not started',
        priority: 'Stredná',
        progress: 0
      };

      mapping.forEach(m => {
        if (m.target) {
          let value = row[m.source];
          if (m.target === 'progress') value = parseInt(value) || 0;
          task[m.target] = value;
        }
      });

      // Validations
      if (!task.title) task.warnings.push('chýba task name');
      if (!task.owner) { task.owner = 'Nepriradené'; task.warnings.push('chýba owner'); }
      if (!task.dueDate) task.warnings.push('chýba due date');
      
      return task as AsanaTask;
    });
    setPreviewTasks(tasks);
    setStep(4);
  };

  const handleFinalImport = () => {
    if (!activeProject) return;
    
    // Check duplicates logic
    const existingIds = new Set(activeProject.asanaTasks?.map(t => t.id) || []);
    const existingUrls = new Set(activeProject.asanaTasks?.map(t => t.asanaUrl).filter(Boolean) || []);
    
    const finalTasks = previewTasks.map(pt => {
      // If duplicate URL found, we might want to update, but context handles that.
      // For now we just pass them all.
      return pt;
    });

    importAsanaTasks(activeProject.id, finalTasks);
    
    setSummary({
      total: previewTasks.length,
      imported: previewTasks.length, // Simplified for now
      skipped: 0,
      warnings: previewTasks.filter(t => t.warnings && t.warnings.length > 0).length
    });
    setStep(5);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500 rounded-2xl text-white shadow-lg shadow-rose-100">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Importovať Asana Tasky</h2>
              <p className="text-sm text-slate-500 font-medium">Manuálny import bez pripojenia na API</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-sm">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { n: 1, label: 'Zdroj' },
            { n: 2, label: 'Dáta' },
            { n: 3, label: 'Mapping' },
            { n: 4, label: 'Preview' },
            { n: 5, label: 'Hotovo' }
          ].map(s => (
            <React.Fragment key={s.n}>
              <div className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                step === s.n ? "bg-indigo-600 text-white shadow-md" : 
                step > s.n ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
              )}>
                {step > s.n ? <CheckCircle2 className="w-3 h-3" /> : <span>{s.n}</span>}
                {s.label}
              </div>
              {s.n < 5 && <ArrowRight className="w-3 h-3 text-slate-200 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          
          {/* Step 1: Select Type */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {[
                { type: 'CSV', icon: Upload, desc: 'Nahrať alebo vložiť CSV export', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { type: 'JSON', icon: FileJson, desc: 'Vložiť JSON pole objektov', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { type: 'Plain Text', icon: Type, desc: 'Vložiť zoznam alebo odrážky', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { type: 'Demo', icon: Database, desc: 'Vyskúšať s demo dátami', color: 'bg-rose-50 text-rose-600 border-rose-100' }
              ].map(t => (
                <button 
                  key={t.type}
                  onClick={() => { setImportType(t.type as any); setStep(t.type === 'Demo' ? 4 : 2); if(t.type === 'Demo') processInput('', 'Demo'); }}
                  className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-left hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all group"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm", t.color)}>
                    <t.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{t.type}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Input Area */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Vložte {importType} dáta</h3>
                {importType === 'CSV' && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Nahrať súbor
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    importType === 'JSON' ? '[\n  { "name": "Task 1", "owner": "Peter" }\n]' : 
                    importType === 'CSV' ? 'Name,Owner,Deadline\nTask 1,Peter,2026-05-10' :
                    'Zadajte jeden task na riadok alebo skopírujte zoznam...'
                  }
                  className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-mono text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur rounded-lg border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {importType} Input
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Vkladajte iba manuálne exportované dáta. Aplikácia neukladá vaše prihlasovacie údaje k Asane.
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-slate-400 font-bold hover:text-slate-600 flex items-center gap-2">
                  Späť
                </button>
                <button 
                  disabled={!inputText.trim()}
                  onClick={() => processInput(inputText, importType)}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  Spracovať dáta
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Mapping */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Mapovanie stĺpcov</h3>
                  <p className="text-sm text-slate-500 font-medium">Priraďte stĺpce z vášho súboru k poliam v BA Workspace.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {parsedData.length} riadkov nájdených
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zdrojový stĺpec</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cieľové pole</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Príklad hodnoty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mapping.map((m, i) => (
                      <tr key={i}>
                        <td className="px-8 py-5 text-sm font-bold text-slate-700">{m.source}</td>
                        <td className="px-8 py-5">
                          <select 
                            value={m.target}
                            onChange={e => {
                              const newMapping = [...mapping];
                              newMapping[i].target = e.target.value as any;
                              setMapping(newMapping);
                            }}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-- Ignorovať --</option>
                            <option value="title">Task Name</option>
                            <option value="description">Description</option>
                            <option value="owner">Assignee / Owner</option>
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="dueDate">Due Date</option>
                            <option value="progress">Progress %</option>
                            <option value="asanaUrl">Asana URL</option>
                            <option value="milestone">Section / Milestone</option>
                          </select>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-400 italic">
                          {parsedData[0]?.[m.source]?.toString().substring(0, 30) || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(2)} className="text-slate-400 font-bold hover:text-slate-600">Späť</button>
                <button 
                  onClick={applyMapping}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Zobraziť Preview
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Náhľad importu</h3>
                  <p className="text-sm text-slate-500 font-medium">Skontrolujte dáta pred finálnym uložením.</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black flex items-center gap-2">
                    <Database className="w-4 h-4" /> {previewTasks.length} taskov
                  </div>
                  {previewTasks.some(t => t.warnings && t.warnings.length > 0) && (
                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-black flex items-center gap-2 border border-amber-100">
                      <AlertTriangle className="w-4 h-4" /> {previewTasks.filter(t => t.warnings && t.warnings.length > 0).length} s warningom
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Name</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Priority</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Warnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {previewTasks.map((t, i) => (
                        <tr key={i} className={cn(t.warnings && t.warnings.length > 0 ? "bg-amber-50/30" : "")}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-black text-slate-900">{t.title}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{t.asanaUrl || 'Bez URL'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn("px-2 py-1 rounded-lg text-[10px] font-black uppercase", t.owner === 'Nepriradené' ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-600")}>
                              {t.owner}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-indigo-600 uppercase">{t.status}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.priority}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-black text-slate-700">
                            {t.dueDate || <span className="text-rose-500">Chýba</span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {t.warnings?.map((w, wi) => (
                                <span key={wi} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black uppercase tracking-tighter">
                                  {w}
                                </span>
                              ))}
                              {t.warnings?.length === 0 && <span className="text-emerald-500 text-[10px] font-black">✓ OK</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(importType === 'Demo' ? 1 : 3)} className="text-slate-400 font-bold hover:text-slate-600">Späť</button>
                <div className="flex gap-4">
                   <button 
                    onClick={resetImport}
                    className="px-6 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={handleFinalImport}
                    className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-3"
                  >
                    <Save className="w-5 h-5" /> Importovať {previewTasks.length} taskov
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <div className="space-y-12 py-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Import Úspešný!</h3>
                <p className="text-slate-500 font-medium text-lg">Dáta z Asany boli úspešne pridané do projektu {activeProject?.name}.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {[
                  { label: 'Nájdené', val: summary.total, color: 'text-slate-900' },
                  { label: 'Importované', val: summary.imported, color: 'text-emerald-600' },
                  { label: 'Preskočené', val: summary.skipped, color: 'text-slate-400' },
                  { label: 'S Warningom', val: summary.warnings, color: summary.warnings > 0 ? 'text-amber-600' : 'text-emerald-600' }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className={cn("text-3xl font-black mb-1", s.color)}>{s.val}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <button 
                  onClick={onClose}
                  className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Zavrieť a zobraziť tasky
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Security Footer */}
        <div className="px-8 py-5 bg-slate-900 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Bezpečný Manuálny Import
           </div>
           <div className="w-1 h-1 bg-slate-700 rounded-full" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No API Connection</p>
           <div className="w-1 h-1 bg-slate-700 rounded-full" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Browser Parsing Only</p>
        </div>
      </div>
    </div>
  );
}
