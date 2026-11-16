import { describe, expect, it } from 'vitest';
import generateTicket from '../../utils/generateTicket.js';

describe('Prueba Unitaria 1: Generador de Tickets (generateTicket)', () => {
  it('debe generar un ticket con formato TK- seguido de 4 dígitos', () => {
    const ticket = generateTicket();
    expect(ticket).toMatch(/^TK-\d{4}$/);
  });

  it('debe generar tickets aleatorios y distintos en llamadas sucesivas', () => {
    const tickets = new Set();
    for (let i = 0; i < 25; i++) {
      tickets.add(generateTicket());
    }
    expect(tickets.size).toBeGreaterThan(20);
  });
});
