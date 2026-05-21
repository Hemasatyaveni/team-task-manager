const Task = require('../models/Task');

exports.getDashboard = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user._id };

    const tasks = await Task.find(filter).populate('assignedTo', 'name').populate('project', 'name');
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
    const overdueTasks = tasks.filter((task) => task.deadline < new Date() && task.status !== 'Completed').length;

    const recentActivities = tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map((task) => ({
        title: task.title,
        status: task.status,
        project: task.project?.name,
        updatedAt: task.updatedAt,
      }));

    res.json({
      totals: { totalTasks, completedTasks, pendingTasks, overdueTasks },
      recentActivities,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};
