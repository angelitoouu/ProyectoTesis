import { describe, expect, it } from 'vitest';
import { normalizarTelefono } from '../../utils/validators.js';

describe('Prueba Unitaria 4: Normalización y Limpieza de Teléfonos de Clientes', () => {
  it('debe eliminar espacios internos y externos de un número telefónico', () => {
    const rawPhone = '  +56 9 1111 2222  ';
    const cleanPhone = normalizarTelefono(rawPhone);
    expect(cleanPhone).toBe('+56911112222');
  });

  it('debe manejar números con formato chileno común sin alterar dígitos', () => {
    const phone = '9 8765 4321';
    expect(normalizarTelefono(phone)).toBe('987654321');
  });

  it('debe retornar cadena vacía si el valor es nulo o indefinido', () => {
    expect(normalizarTelefono(null)).toBe('');
    expect(normalizarTelefono(undefined)).toBe('');
    expect(normalizarTelefono('')).toBe('');
  });
});
