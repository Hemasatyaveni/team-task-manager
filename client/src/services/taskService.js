import api from './api';

const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (payload) => api.post('/tasks', payload),
  updateTask: (id, payload) => api.put(`/tasks/${id}`, payload),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default taskService;
