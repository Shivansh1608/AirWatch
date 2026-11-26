import api from './client';

export async function fetchCurrentAQI(params = {}) {
  const res = await api.get('/aqi/current', { params });
  return res.data?.data;
}

export async function fetchAQIForecast(params = {}) {
  const res = await api.get('/aqi/forecast', { params });
  return res.data?.data;
}

export async function fetchAQIHistory(params = {}) {
  const res = await api.get('/aqi/history', { params });
  return res.data?.data;
}

export async function fetchNearbyStations(params = {}) {
  const res = await api.get('/aqi/stations', { params });
  return res.data?.data;
}

export async function fetchWeather(params = {}) {
  const res = await api.get('/weather', { params });
  return res.data?.data;
}

export async function searchCities(query) {
  const res = await api.get('/cities/search', { params: { q: query } });
  return res.data?.data || [];
}

export async function fetchPopularCities() {
  const res = await api.get('/cities/popular');
  return res.data?.data || [];
}
