import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import userService from '../services/userService';

function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projectForm, setProjectForm] = useState({ name: '', description: '', members: [] });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending', deadline: '', assignedTo: '', project: '' });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  const [fetchError, setFetchError] = useState('');

  const loadAdminData = async () => {
    setLoadingData(true);
    setFetchError('');
    try {
      const [projectRes, taskRes, userRes] = await Promise.all([
        projectService.getProjects(),
        taskService.getTasks(),
        userService.getUsers(),
      ]);
      setProjects(projectRes.data.projects || []);
      setTasks(taskRes.data.tasks || []);
      setUsers(userRes.data.users || []);
    } catch (err) {
      setFetchError('Unable to load admin data. Please refresh the page.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm({ ...projectForm, [name]: value });
  };

  const handleProjectMembersChange = (e) => {
    const selectedMembers = Array.from(e.target.selectedOptions, (option) => option.value);
    setProjectForm({ ...projectForm, members: selectedMembers });
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await projectService.createProject(projectForm);
      setMessage('✓ Project created successfully');
      setProjectForm({ name: '', description: '', members: [] });
      await loadAdminData();
    } catch (err) {
      setMessage('✗ Failed to create project: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await taskService.createTask(taskForm);
      setMessage('✓ Task created successfully');
      setTaskForm({ title: '', description: '', priority: 'Medium', status: 'Pending', deadline: '', assignedTo: '', project: '' });
      await loadAdminData();
    } catch (err) {
      setMessage('✗ Failed to create task: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed').length;
  const overdueTasks = tasks.filter((task) => new Date(task.deadline) < new Date() && task.status !== 'Completed').length;
  const teamMembers = users.filter((user) => user.role === 'member');

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="text-slate-400 mt-2">Manage projects, assign tasks, track status, and keep your team aligned.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Projects</p>
          <h2 className="mt-3 text-3xl font-semibold">{totalProjects}</h2>
          <p className="mt-2 text-slate-500">Active project portfolios.</p>
        </div>
        <div className="card bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Tasks</p>
          <h2 className="mt-3 text-3xl font-semibold">{totalTasks}</h2>
          <p className="mt-2 text-slate-500">Total tasks across all projects.</p>
        </div>
        <div className="card bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pending</p>
          <h2 className="mt-3 text-3xl font-semibold">{pendingTasks}</h2>
          <p className="mt-2 text-slate-500">Work still in progress.</p>
        </div>
        <div className="card bg-slate-900 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overdue</p>
          <h2 className="mt-3 text-3xl font-semibold">{overdueTasks}</h2>
          <p className="mt-2 text-slate-500">Tasks that need immediate attention.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`px-6 py-3 font-medium transition border-b-2 ${activeTab === 'projects' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Create Project
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`px-6 py-3 font-medium transition border-b-2 ${activeTab === 'tasks' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Create Task
        </button>
      </div>

      {message && (
        <div className={`rounded-2xl p-4 ${message.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500 text-emerald-100' : 'bg-rose-500/10 border border-rose-500 text-rose-100'}`}>
          {message}
        </div>
      )}

      {loadingData ? (
        <div className="card">Loading admin details...</div>
      ) : fetchError ? (
        <div className="card text-rose-100">{fetchError}</div>
      ) : (
        <>
          {activeTab === 'projects' && (
            <div className="card max-w-3xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Plus size={20} /> Create Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <label className="block">
                  <span className="text-slate-200">Project Name *</span>
                  <input name="name" type="text" value={projectForm.name} onChange={handleProjectChange} required className="input-field mt-2" placeholder="e.g., Website Redesign" />
                </label>
                <label className="block">
                  <span className="text-slate-200">Description</span>
                  <textarea name="description" value={projectForm.description} onChange={handleProjectChange} className="input-field mt-2" placeholder="Project description..." rows="4" />
                </label>
                <label className="block">
                  <span className="text-slate-200">Team Members</span>
                  <select
                    name="members"
                    multiple
                    value={projectForm.members}
                    onChange={handleProjectMembersChange}
                    className="input-field mt-2 h-40"
                  >
                    {teamMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-slate-500 text-xs mt-2">Hold Ctrl/Cmd to select multiple team members.</p>
                </label>
                <button disabled={loading} type="submit" className="btn-primary">
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="card max-w-3xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Plus size={20} /> Create Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <label className="block">
                  <span className="text-slate-200">Task Title *</span>
                  <input name="title" type="text" value={taskForm.title} onChange={handleTaskChange} required className="input-field mt-2" placeholder="Task name" />
                </label>
                <label className="block">
                  <span className="text-slate-200">Description</span>
                  <textarea name="description" value={taskForm.description} onChange={handleTaskChange} className="input-field mt-2" placeholder="Task description..." rows="3" />
                </label>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-slate-200">Priority</span>
                    <select name="priority" value={taskForm.priority} onChange={handleTaskChange} className="input-field mt-2">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-200">Status</span>
                    <select name="status" value={taskForm.status} onChange={handleTaskChange} className="input-field mt-2">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-200">Deadline *</span>
                    <input name="deadline" type="date" value={taskForm.deadline} onChange={handleTaskChange} required className="input-field mt-2" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-slate-200">Assign To *</span>
                    <select name="assignedTo" value={taskForm.assignedTo} onChange={handleTaskChange} required className="input-field mt-2">
                      <option value="">Select team member</option>
                      {teamMembers.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-200">Project *</span>
                    <select name="project" value={taskForm.project} onChange={handleTaskChange} required className="input-field mt-2">
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button disabled={loading} type="submit" className="btn-primary">
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card lg:col-span-1">
              <h3 className="text-lg font-semibold mb-3">Team Members</h3>
              {teamMembers.length ? (
                <ul className="space-y-3 text-slate-300 text-sm">
                  {teamMembers.map((member) => (
                    <li key={member._id} className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-slate-500 text-xs">{member.email}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-slate-400">No members found yet.</div>
              )}
            </div>

            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Project & Task Overview</h3>
              <div className="space-y-4">
                {projects.length ? projects.map((project) => (
                  <div key={project._id} className="rounded-2xl border border-slate-800 p-4 bg-slate-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-slate-500 text-sm mt-1">{project.description || 'No description provided.'}</p>
                      </div>
                      <span className="text-slate-400 text-sm">{project.members?.length || 0} member(s)</span>
                    </div>
                    {project.members?.length ? (
                      <div className="mt-3 text-slate-400 text-sm">
                        Assigned: {project.members.map((member) => member.name).join(', ')}
                      </div>
                    ) : null}
                  </div>
                )) : (
                  <div className="text-slate-400">No projects created yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
            {tasks.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-sm text-slate-300">
                  <thead>
                    <tr className="text-left text-slate-400 uppercase tracking-[0.2em] text-xs">
                      <th className="p-4">Task</th>
                      <th className="p-4">Project</th>
                      <th className="p-4">Assigned</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 8).map((task) => (
                      <tr key={task._id} className="border-t border-slate-800 hover:bg-slate-900/70">
                        <td className="p-4">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-slate-500 text-xs">{task.description || 'No description'}</div>
                        </td>
                        <td className="p-4">{task.project?.name || 'Unassigned'}</td>
                        <td className="p-4">{task.assignedTo?.name || 'Unassigned'}</td>
                        <td className="p-4">{task.status}</td>
                        <td className="p-4">{new Date(task.deadline).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-slate-400">No tasks have been created yet.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanelPage;
