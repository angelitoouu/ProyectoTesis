import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Validación de Campos Obligatorios en Encargos', () => {
  it('debe rechazar con status 400 cuando faltan datos obligatorios del encargo', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: '',
        telefono_cliente: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Faltan campos obligatorios');
  });

  it('debe rechazar con status 400 cuando se envía cliente y teléfono pero falta la prenda', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: 'María Soto',
        telefono_cliente: '+56987654321',
        precio_total: 15000,
        abono: 5000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Faltan campos obligatorios: nombre, teléfono y prenda.');
  });
});
