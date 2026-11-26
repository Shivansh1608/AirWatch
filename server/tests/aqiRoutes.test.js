import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('AirWatch API Endpoints Integration Tests', () => {
  it('GET /api/health should return ok status and CPCB standard notice', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.cpcbStandard).toBeDefined();
  });

  it('GET /api/cities/popular should return pre-seeded Indian cities', async () => {
    const res = await request(app).get('/api/cities/popular');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(5);

    const delhi = res.body.data.find((c) => c.slug === 'delhi');
    expect(delhi).toBeDefined();
    expect(delhi.lat).toBeCloseTo(28.6139, 2);
  });

  it('GET /api/cities/search?q=delhi should return matched cities', async () => {
    const res = await request(app).get('/api/cities/search?q=delhi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some((c) => c.name.toLowerCase().includes('delhi'))).toBe(true);
  });

  it('GET /api/aqi/current should return real-time reading with data integrity fields', async () => {
    const res = await request(app).get('/api/aqi/current?city=delhi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const data = res.body.data;
    // Data integrity rules:
    expect(data.source).toBeDefined();
    expect(data.timestamp).toBeDefined();
    expect(['observed', 'forecast']).toContain(data.type);
    expect(typeof data.aqi).toBe('number');
    expect(['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']).toContain(data.category);
    expect(data.dominantPollutant).toBeDefined();
    expect(data.pollutants).toBeDefined();
  });

  it('GET /api/aqi/forecast should return hourly predictions labeled as forecast', async () => {
    const res = await request(app).get('/api/aqi/forecast?city=delhi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe('forecast');
    expect(Array.isArray(res.body.data.forecast)).toBe(true);
  });

  it('GET /api/weather should return surface temperature, humidity, wind', async () => {
    const res = await request(app).get('/api/weather?city=delhi');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.temperature).toBeDefined();
    expect(res.body.data.humidity).toBeDefined();
    expect(res.body.data.windSpeed).toBeDefined();
  });
});
