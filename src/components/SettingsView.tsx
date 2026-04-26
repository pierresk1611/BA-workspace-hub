import React, { useState } from 'react';
import { 
  Settings, Building2, Users, UserCircle, 
  Database, ShieldCheck, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { WorkspaceTab } from './settings/WorkspaceTab';
import { UsersTab } from './settings/UsersTab';
import { ProfileTab } from './settings/ProfileTab';
import { DataTab } from './settings/DataTab';
import { SecurityTab } from './settings/SecurityTab';
import { useSettings } from '../context/SettingsContext';

type TabType = 'workspace' | 'users' | 'profile' | 'data' | 'security';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabType>('workspace');
  const { isAdmin } = useSettings();

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'users', label: 'Používatelia', icon: Users, hidden: !isAdmin },
    { id: 'profile', label: 'Môj Profil', icon: UserCircle },
    { id: 'data', label: 'Správa Dát', icon: Database },
    { id: 'security', label: 'Bezpečnosť', icon: ShieldCheck },
  ].filter(t => !t.hidden);

  const renderTab = () => {
    switch (activeTab) {
      case 'workspace': return <WorkspaceTab />;
      case 'users': return <UsersTab />;
      case 'profile': return <ProfileTab />;
      case 'data': return <DataTab />;
      case 'security': return <SecurityTab />;
      default: return <WorkspaceTab />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-2.5 bg-slate-900 rounded-xl text-white">
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            Nastavenia
          </h1>
          <p className="text-slate-500 font-medium text-[10px] md:text-sm mt-1 max-w-2xl hidden sm:block">
            Konfigurácia workspaceu, používateľov a lokálneho úložiska.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Tab Sidebar (Desktop) / Tab Scroller (Mobile) */}
        <div className="bg-white border-r border-slate-200 lg:w-72 flex flex-col shrink-0">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto no-scrollbar lg:p-4 p-2 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all flex-1 lg:flex-none",
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 lg:translate-x-1" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className={cn("w-4 h-4 md:w-5 md:h-5", activeTab === tab.id ? "text-white" : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
