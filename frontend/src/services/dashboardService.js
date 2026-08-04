import api from './api';

export const dashboardService = {
  getStats: async () => {
    return await api.get('/dashboard/stats');
  },

  triggerOverdueCheck: async () => {
    return await api.post('/dashboard/trigger-overdue-check');
  },
};
