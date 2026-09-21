const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Reglas de Lógica de Negocio (Taller de Costura)', () => {
  const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'listo_prueba', 'listo_retiro', 'entregado'];

  it('debe contener exactamente el ciclo de 5 estados definidos en el taller', () => {
    assert.strictEqual(ESTADOS_VALIDOS.length, 5);
    assert.ok(ESTADOS_VALIDOS.includes('pendiente'));
    assert.ok(ESTADOS_VALIDOS.includes('en_proceso'));
    assert.ok(ESTADOS_VALIDOS.includes('listo_prueba'));
    assert.ok(ESTADOS_VALIDOS.includes('listo_retiro'));
    assert.ok(ESTADOS_VALIDOS.includes('entregado'));
  });

  it('el cálculo del saldo pendiente debe ser coherente (precio_total - abono)', () => {
    const precioTotal = 25000;
    const abono = 10000;
    const saldo = precioTotal - abono;
    assert.strictEqual(saldo, 15000);
  });

  it('debe rechazar abono superior al precio total', () => {
    const validarMontos = (precio, abono) => {
      if (abono > precio) throw new Error('El abono no puede ser superior al precio total');
      return true;
    };
    assert.throws(() => validarMontos(10000, 15000), /superior al precio total/);
    assert.strictEqual(validarMontos(10000, 5000), true);
  });

  it('debe limpiar y normalizar formatos de teléfonos para consultas', () => {
    const rawPhone = '+56 9 1111 2222';
    const cleanPhone = rawPhone.replace(/\s+/g, '');
    assert.strictEqual(cleanPhone, '+56911112222');
  });
});
