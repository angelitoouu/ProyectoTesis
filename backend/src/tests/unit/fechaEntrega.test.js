import { describe, expect, it } from 'vitest';
import { validarFechaEntrega } from '../../utils/validators.js';

describe('Prueba Unitaria 5: Validación de Fechas de Entrega Estimada', () => {
  it('debe retornar true para fechas válidas en formato YYYY-MM-DD', () => {
    expect(validarFechaEntrega('2026-11-20')).toBe(true);
    expect(validarFechaEntrega('2026-12-31')).toBe(true);
  });

  it('debe retornar false para fechas con formato inválido o texto incorrecto', () => {
    expect(validarFechaEntrega('20-11-2026')).toBe(false);
    expect(validarFechaEntrega('mañana')).toBe(false);
    expect(validarFechaEntrega('2026/11/20')).toBe(false);
  });

  it('debe retornar false si la fecha es nula, indefinida o vacía', () => {
    expect(validarFechaEntrega(null)).toBe(false);
    expect(validarFechaEntrega(undefined)).toBe(false);
    expect(validarFechaEntrega('')).toBe(false);
  });
});

