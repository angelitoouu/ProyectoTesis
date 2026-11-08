import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Manejo de Rutas Inexistentes y Tipos Inválidos', () => {
  it('debe responder status 404 al consultar una ruta de API no existente', async () => {
    const res = await request(app).get('/api/ruta-desconocida-taller');
    expect(res.statusCode).toBe(404);
  });

  it('debe rechazar con status 400 cuando el precio total en /api/encargos no es un número válido', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: 'Cliente Test',
        telefono_cliente: '+56912345678',
        prenda: 'Vestido',
        precio_total: 'texto_invalido',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('precio total no puede ser un número negativo');
  });
});

