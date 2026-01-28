import client from './client';

export const analyticsAPI = {
  getDashboard: () => client.get('/analytics/dashboard'),
  getEndpointChecks: (id, params) => client.get(`/analytics/endpoint/${id}/checks`, { params }),
  getEndpointStats: (id, params) => client.get(`/analytics/endpoint/${id}/stats`, { params })
};