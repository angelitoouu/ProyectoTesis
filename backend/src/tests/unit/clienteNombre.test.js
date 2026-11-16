import { describe, expect, it } from 'vitest';
import { validarNombreCliente } from '../../utils/validators.js';

describe('Prueba Unitaria 6: Validación y Limpieza de Nombre de Cliente', () => {
  it('debe aceptar nombres de clientes válidos con 2 o más caracteres', () => {
    expect(validarNombreCliente('Ana')).toBe(true);
    expect(validarNombreCliente('Juan Pérez')).toBe(true);
    expect(validarNombreCliente('  María González  ')).toBe(true);
  });

  it('debe rechazar nombres vacíos o con solo espacios en blanco', () => {
    expect(validarNombreCliente('')).toBe(false);
    expect(validarNombreCliente('   ')).toBe(false);
    expect(validarNombreCliente('A')).toBe(false);
  });

  it('debe rechazar entradas que no sean cadenas de texto', () => {
    expect(validarNombreCliente(null)).toBe(false);
    expect(validarNombreCliente(undefined)).toBe(false);
    expect(validarNombreCliente(12345)).toBe(false);
  });
});

