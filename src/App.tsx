import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { SystemsView } from './components/SystemsView';
import { ConfluenceView } from './components/ConfluenceView';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  const [activeView, setActiveView] = useState("Prehľad");

  return (
    <ProjectProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {activeView === "Prehľad" && <Dashboard />}
            {activeView === "Prepojené systémy" && <SystemsView />}
            {activeView === "Confluence zdroje" && <ConfluenceView />}
            {activeView !== "Prehľad" && activeView !== "Prepojené systémy" && activeView !== "Confluence zdroje" && (
              <div className="p-12 text-center text-slate-500">
                <h2 className="text-xl font-medium mb-2">Modul: {activeView}</h2>
                <p>Tento modul zatiaľ nie je implementovaný v prototype.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}

export default App;
