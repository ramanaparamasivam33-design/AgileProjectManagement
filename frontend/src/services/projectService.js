import api from './api';

export const projectService = {
  getAll: async (search = '', status = '') => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    return await api.get('/projects', { params });
  },

  getById: async (id) => {
    return await api.get(`/projects/${id}`);
  },

  create: async (data) => {
    return await api.post('/projects', data);
  },

  update: async (id, data) => {
    return await api.put(`/projects/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/projects/${id}`);
  },
};
