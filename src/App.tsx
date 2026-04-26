import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { AllProjectsDashboard } from './components/AllProjectsDashboard';
import { Dashboard } from './components/Dashboard';
import { ProjectsView } from './components/ProjectsView';
import { SystemsView } from './components/SystemsView';
import { ConfluenceView } from './components/ConfluenceView';
import { JiraView } from './components/JiraView';
import { KafkaView } from './components/KafkaView';
import { SQLWorkspace } from './components/SQLWorkspace';
import { CalendarView } from './components/CalendarView';
import { RequirementsView } from './components/RequirementsView';
import { DecisionsView } from './components/DecisionsView';
import { QuestionsView } from './components/QuestionsView';
import { RisksView } from './components/RisksView';
import { AsanaView } from './components/AsanaView';
import { CommunicationView } from './components/CommunicationView';
import { MeetingsView } from './components/MeetingsView';
import { AIAgentView } from './components/AIAgentView';
import { ExportsView } from './components/ExportsView';
import { MermaidView } from './components/MermaidView';
import { TraceabilityMatrix } from './components/TraceabilityMatrix';
import { StakeholdersView } from './components/StakeholdersView';
import { QAView } from './components/QAView';
import { QualityCheckView } from './components/QualityCheckView';
import { SettingsView } from './components/SettingsView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { SettingsProvider } from './context/SettingsContext';

import { useState } from 'react';
import { MobileMenu } from './components/MobileMenu';
import { OfflineBanner } from './components/OfflineBanner';

// ProtectedRoute: redirects to /login if not authenticated
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative w-full">
      <OfflineBanner />
      
      {/* Desktop Sidebar - fixed on the left */}
      <aside className="hidden lg:block h-full w-72 shrink-0 border-r border-slate-200 bg-slate-900 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Menu Drawer - over everything else */}
      <MobileMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative w-full bg-slate-50 pb-safe">
          <div className="w-full max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// ProjectRoute: syncs URL projectId → context activeProjectId
function ProjectRoute({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>();
  const { setActiveProject, activeProjectId } = useProject();

  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      setActiveProject(projectId);
    }
  }, [projectId, activeProjectId, setActiveProject]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPageWrapper />} />

      {/* Protected shell */}
      <Route element={<ProtectedRoute />}>
        {/* Global dashboard (all projects) */}
        <Route path="/dashboard" element={<AllProjectsDashboard />} />

        {/* Projects list */}
        <Route path="/projects" element={<ProjectsView />} />

        {/* Project-specific routes */}
        <Route path="/projects/:projectId" element={
          <ProjectRoute>
            <Dashboard />
          </ProjectRoute>
        } />
        <Route path="/projects/:projectId/requirements" element={
          <ProjectRoute><RequirementsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/decisions" element={
          <ProjectRoute><DecisionsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/questions" element={
          <ProjectRoute><QuestionsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/risks" element={
          <ProjectRoute><RisksView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/asana" element={
          <ProjectRoute><AsanaView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/communications" element={
          <ProjectRoute><CommunicationView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/meetings" element={
          <ProjectRoute><MeetingsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/ai-agent" element={
          <ProjectRoute><AIAgentView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/exports" element={
          <ProjectRoute><ExportsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/diagrams" element={
          <ProjectRoute><MermaidView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/traceability" element={
          <ProjectRoute><TraceabilityMatrix /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/stakeholders" element={
          <ProjectRoute><StakeholdersView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/qa" element={
          <ProjectRoute><QAView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/quality-check" element={
          <ProjectRoute><QualityCheckView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/linked-systems" element={
          <ProjectRoute><SystemsView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/confluence" element={
          <ProjectRoute><ConfluenceView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/jira" element={
          <ProjectRoute><JiraView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/kafka" element={
          <ProjectRoute><KafkaView /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/sql" element={
          <ProjectRoute><SQLWorkspace /></ProjectRoute>
        } />
        <Route path="/projects/:projectId/calendar" element={
          <ProjectRoute><CalendarView /></ProjectRoute>
        } />
        
        {/* Settings */}
        <Route path="/settings" element={<SettingsView />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Wrapper that redirects authenticated users away from /login
function LoginPageWrapper() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ProjectProvider>
          <AppRoutes />
        </ProjectProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
