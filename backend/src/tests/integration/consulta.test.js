import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Endpoint de Consulta Pública (/api/consulta)', () => {
  it('debe responder status 400 si se omite el parámetro query en la URL', async () => {
    const res = await request(app).get('/api/consulta');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Debes indicar un teléfono o código de ticket');
  });

  it('debe responder status 400 si el parámetro query es enviado como cadena vacía', async () => {
    const res = await request(app).get('/api/consulta?query=');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Debes indicar un teléfono o código de ticket');
  });
});

