import { useEffect, useState } from 'react';
import taskService from '../services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.getTasks().then((res) => {
      setTasks(res.data.tasks);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-slate-400">Review assigned tasks and update status quickly.</p>
        </div>
      </div>
      {loading ? (
        <div className="card">Loading tasks...</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-slate-400 text-sm uppercase tracking-[0.2em]">
                <th className="p-4">Task</th>
                <th className="p-4">Project</th>
                <th className="p-4">Assigned</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-t border-slate-800 hover:bg-slate-900/70">
                  <td className="p-4">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-slate-500 text-sm">{task.description || 'No description'}</div>
                  </td>
                  <td className="p-4">{task.project?.name}</td>
                  <td className="p-4">{task.assignedTo?.name}</td>
                  <td className="p-4">{task.status}</td>
                  <td className="p-4">{new Date(task.deadline).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && <div className="p-4 text-slate-400">No tasks found.</div>}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
