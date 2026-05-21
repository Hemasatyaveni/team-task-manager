import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading dashboard...</div>;

  const totals = data?.totals || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 };

  const progressPercent = (value) => (totals.totalTasks ? Math.round((value / totals.totalTasks) * 100) : 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Total tasks</p>
          <h2 className="mt-4 text-3xl font-semibold">{totals.totalTasks}</h2>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Completed</p>
          <h2 className="mt-4 text-3xl font-semibold">{totals.completedTasks}</h2>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pending</p>
          <h2 className="mt-4 text-3xl font-semibold">{totals.pendingTasks}</h2>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overdue</p>
          <h2 className="mt-4 text-3xl font-semibold">{totals.overdueTasks}</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Progress overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Completed</span><span>{totals.completedTasks} ({progressPercent(totals.completedTasks)}%)</span></div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${progressPercent(totals.completedTasks)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Pending</span><span>{totals.pendingTasks} ({progressPercent(totals.pendingTasks)}%)</span></div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${progressPercent(totals.pendingTasks)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Overdue</span><span>{totals.overdueTasks} ({progressPercent(totals.overdueTasks)}%)</span></div>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${progressPercent(totals.overdueTasks)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Recent activities</h3>
          {data?.recentActivities?.length ? (
            <ul className="space-y-3 text-sm text-slate-300">
              {data.recentActivities.map((a, i) => (
                <li key={i} className="border-b border-slate-800 pb-2">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-slate-500 text-xs">{a.project} • {a.status} • {new Date(a.updatedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-400">No recent activity</div>
          )}
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <h4 className="font-semibold mb-2">Admin Actions</h4>
            <p className="text-slate-400 text-sm mb-4">Quick links for project and task management.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('/projects')} className="btn-primary">Manage Projects</button>
              <button onClick={() => navigate('/tasks')} className="btn-secondary">Manage Tasks</button>
              <button onClick={() => navigate('/admin')} className="btn-secondary">Open Admin Panel</button>
            </div>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-2">Team Overview</h4>
            <p className="text-slate-400 text-sm">Admins can view full team metrics in the Admin Panel.</p>
          </div>

          <div className="card">
            <h4 className="font-semibold mb-2">Create Quick Task</h4>
            <p className="text-slate-400 text-sm mb-4">Use the tasks page to create and assign tasks quickly.</p>
            <button onClick={() => navigate('/tasks')} className="btn-primary">Create Task</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Your assigned tasks</h3>
          {data?.tasks?.length ? (
            <ul className="space-y-3">
              {data.tasks.map((t) => (
                <li key={t._id} className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-slate-500 text-sm">{t.project?.name || ''}</div>
                    </div>
                    <div className="text-sm text-slate-400">{t.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-400">You have no assigned tasks.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
