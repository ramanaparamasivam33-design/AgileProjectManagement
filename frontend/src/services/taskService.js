import api from './api';

export const taskService = {
  getAll: async (status = '') => {
    const params = status ? { status } : {};
    return await api.get('/tasks', { params });
  },

  getByStory: async (storyId) => {
    return await api.get(`/stories/${storyId}/tasks`);
  },

  getById: async (id) => {
    return await api.get(`/tasks/${id}`);
  },

  create: async (data) => {
    return await api.post('/tasks', data);
  },

  update: async (id, data) => {
    return await api.put(`/tasks/${id}`, data);
  },

  updateStatus: async (id, status) => {
    return await api.patch(`/tasks/${id}/status`, { status });
  },

  delete: async (id) => {
    return await api.delete(`/tasks/${id}`);
  },
};
