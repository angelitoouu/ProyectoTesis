import { describe, expect, it } from 'vitest';
import { ESTADOS_VALIDOS, validarEstadoTaller } from '../../utils/validators.js';

describe('Prueba Unitaria 3: Ciclo y Estados de Encargos del Taller', () => {
  it('debe contener exactamente los 5 estados definidos en el flujo de trabajo', () => {
    expect(ESTADOS_VALIDOS).toHaveLength(5);
    expect(ESTADOS_VALIDOS).toEqual([
      'pendiente',
      'en_proceso',
      'listo_prueba',
      'listo_retiro',
      'entregado',
    ]);
  });

  it('debe retornar true para cada uno de los estados permitidos', () => {
    for (const estado of ESTADOS_VALIDOS) {
      expect(validarEstadoTaller(estado)).toBe(true);
    }
  });

  it('debe retornar false para estados desconocidos o inválidos', () => {
    expect(validarEstadoTaller('cancelado')).toBe(false);
    expect(validarEstadoTaller('en_espera')).toBe(false);
    expect(validarEstadoTaller('')).toBe(false);
    expect(validarEstadoTaller(null)).toBe(false);
  });
});
