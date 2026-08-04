import api from './api';

export const storyService = {
  getByProject: async (projectId) => {
    return await api.get(`/projects/${projectId}/stories`);
  },

  getById: async (id) => {
    return await api.get(`/stories/${id}`);
  },

  create: async (data) => {
    return await api.post('/stories', data);
  },

  update: async (id, data) => {
    return await api.put(`/stories/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/stories/${id}`);
  },
};
