import api from './api';

const userService = {
  getUsers: () => api.get('/users'),
};

export default userService;
