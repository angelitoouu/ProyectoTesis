import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Validación de Estados del Taller', () => {
  it('debe rechazar con status 400 si se envía un estado de encargo no válido', async () => {
    const res = await request(app)
      .patch('/api/encargos/1/estado')
      .send({
        estado: 'estado_inventado',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Estado inválido');
  });

  it('debe rechazar con status 400 si se envía un estado vacío', async () => {
    const res = await request(app)
      .patch('/api/encargos/1/estado')
      .send({
        estado: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Estado inválido');
  });
});
