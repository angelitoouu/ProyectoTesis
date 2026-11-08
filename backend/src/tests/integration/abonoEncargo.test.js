import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Prueba de Integración: Validación de Precios y Abonos en Encargos', () => {
  it('debe rechazar con status 400 si el precio total es negativo', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: 'Cliente Prueba',
        telefono_cliente: '+56912345678',
        prenda: 'Vestido',
        precio_total: -15000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('precio total no puede ser un número negativo');
  });

  it('debe rechazar con status 400 si el abono supera al precio total', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: 'Cliente Prueba',
        telefono_cliente: '+56912345678',
        prenda: 'Pantalón',
        precio_total: 10000,
        abono: 15000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('El abono no puede ser superior al precio total');
  });

  it('debe rechazar con status 400 si el abono ingresado es un número negativo', async () => {
    const res = await request(app)
      .post('/api/encargos')
      .send({
        nombre_cliente: 'Cliente Prueba',
        telefono_cliente: '+56912345678',
        prenda: 'Chaqueta',
        precio_total: 20000,
        abono: -3000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('El abono no puede ser negativo.');
  });
});
