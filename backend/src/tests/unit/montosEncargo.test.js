import { describe, expect, it } from 'vitest';
import { calcularSaldo, validarMontos } from '../../utils/validators.js';

describe('Prueba Unitaria 2: Lógica de Precios, Abonos y Saldos', () => {
  it('debe calcular correctamente el saldo pendiente (precio_total - abono)', () => {
    const precioTotal = 25000;
    const abono = 10000;
    const saldo = calcularSaldo(precioTotal, abono);

    expect(saldo).toBe(15000);
  });

  it('debe calcular saldo 0 cuando el abono cubre la totalidad del precio', () => {
    const saldo = calcularSaldo(18000, 18000);
    expect(saldo).toBe(0);
  });

  it('debe rechazar cuando el abono es superior al precio total', () => {
    expect(() => validarMontos(10000, 15000)).toThrow('El abono no puede ser superior al precio total');
  });

  it('debe rechazar montos o abonos negativos', () => {
    expect(() => validarMontos(-5000, 0)).toThrow('El precio total no puede ser negativo');
    expect(() => validarMontos(10000, -2000)).toThrow('El abono no puede ser negativo');
  });
});
