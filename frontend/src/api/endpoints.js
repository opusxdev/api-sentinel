import client from './client';

export const endpointsAPI = {
  getAll: () => client.get('/endpoints'),
  getById: (id) => client.get(`/endpoints/${id}`),
  create: (data) => client.post('/endpoints', data),
  update: (id, data) => client.put(`/endpoints/${id}`, data),
  delete: (id) => client.delete(`/endpoints/${id}`),
  toggle: (id) => client.put(`/endpoints/${id}/toggle`)
};