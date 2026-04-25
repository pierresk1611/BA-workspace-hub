import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { FolderOpen } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectLinkProps {
  projectId: string;
  className?: string;
  showIcon?: boolean;
}

export function ProjectLink({ projectId, className, showIcon = true }: ProjectLinkProps) {
  const { projects, setActiveProject } = useProject();
  const navigate = useNavigate();
  
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProject(projectId);
    navigate(`/projects/${projectId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-xs transition-colors group",
        className
      )}
    >
      {showIcon && <FolderOpen className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />}
      <span className="hover:underline underline-offset-2">{project.name}</span>
    </button>
  );
}
