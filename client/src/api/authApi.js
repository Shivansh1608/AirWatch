import api from './client';

export async function loginUser(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data?.data;
}

export async function registerUser(name, email, password) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data?.data;
}

export async function refreshAccessToken() {
  const res = await api.post('/auth/refresh');
  return res.data?.data?.accessToken;
}

export async function logoutUser() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function fetchMe() {
  const res = await api.get('/auth/me');
  return res.data?.data?.user;
}

export async function fetchFavourites() {
  const res = await api.get('/favourites');
  return res.data?.data || [];
}

export async function addFavouriteCity(city) {
  const res = await api.post('/favourites', { city });
  return res.data?.data;
}

export async function removeFavouriteCity(slug) {
  const res = await api.delete(`/favourites/${slug}`);
  return res.data?.data;
}

export async function fetchAlerts() {
  const res = await api.get('/alerts');
  return res.data?.data || [];
}

export async function createAlert(data) {
  const res = await api.post('/alerts', data);
  return res.data?.data;
}

export async function deleteAlert(id) {
  const res = await api.delete(`/alerts/${id}`);
  return res.data;
}

export async function fetchNotifications() {
  const res = await api.get('/notifications');
  return res.data?.data || [];
}

export async function markNotificationRead(id) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
}
