import { useEffect, useState } from 'react';
import projectService from '../services/projectService';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((res) => {
      setProjects(res.data.projects);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-slate-400">Manage your team projects and assignments.</p>
        </div>
      </div>
      {loading ? (
        <div className="card">Loading projects...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-slate-400 mt-2">{project.description || 'No description provided.'}</p>
                </div>
                <div className="text-right text-sm text-slate-500">{project.members.length} members</div>
              </div>
              <div className="mt-4 text-slate-400 text-sm">
                Created by {project.createdBy?.name}
              </div>
            </div>
          ))}
          {projects.length === 0 && <div className="card">No projects available yet.</div>}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
