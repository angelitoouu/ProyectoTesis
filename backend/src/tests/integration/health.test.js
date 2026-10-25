import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Disponibilidad del Servicio (Health)', () => {
  it('debe responder 200 en la ruta raíz con el mensaje del taller', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('taller de costura');
  });

  it('debe responder 200 en /api/health con status OK y uptime', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('service', 'taller-costura-api');
    expect(res.body).toHaveProperty('uptime');
  });
});
