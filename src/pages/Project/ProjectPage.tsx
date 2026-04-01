import { useState, useEffect } from 'react';
import ProjectModal from '../../components/portfolio/ProjectModal';
import { portfolioService } from '../../services/portfolioService';
import type { Project } from '../../types/project';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Plus, AlertCircle, Briefcase, Edit, Trash2, ExternalLink, Github } from 'lucide-react';

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getProjects();
      setProjects(response.projects || []);
    } catch (err: unknown) {
      setError('Failed to fetch projects. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioService.deleteProject(id);
      setProjects((prev) => prev.filter(p => p._id !== id));
    } catch (err: unknown) {
      alert('Failed to delete project.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Portfolio Projects
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage and showcase the projects displayed on your public portfolio.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow font-medium transition-all duration-200 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first portfolio project.</p>
          <button onClick={handleCreate} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            + Create a project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100 border-b border-gray-100">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Briefcase className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                
                {/* Overlay Links */}
                <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.codeLink && (
                    <a href={project.codeLink} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white" title="View Source">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.demoLink && (
                    <a href={project.demoLink} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white" title="Live Demo">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1">
                    {project.title}
                  </h3>
                  <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    project.status === 'complete' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {project.status === 'complete' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-5 leading-relaxed">
                  {project.description}
                </p>
                
                {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {project.techStack.slice(0, 4).map((tech, index) => (
                      <span key={index} className="text-[11px] uppercase tracking-wider bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded-md font-bold">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[11px] uppercase tracking-wider bg-gray-50 border border-gray-200 text-gray-500 px-2 py-1 rounded-md font-bold">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 mr-1.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-700 font-semibold transition-colors px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          project={selectedProject} 
          onSuccess={fetchProjects} 
        />
      )}
    </div>
  );
}