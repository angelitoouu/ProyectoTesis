const { describe, it } = require('node:test');
const assert = require('node:assert');
const generateTicket = require('../src/utils/generateTicket');

describe('Utilidad generateTicket', () => {
  it('debe generar un ticket con prefijo TK- seguido de 4 dígitos', () => {
    const ticket = generateTicket();
    assert.match(ticket, /^TK-\d{4}$/, 'El ticket debe cumplir con el formato TK-0000');
  });

  it('debe generar tickets variados en llamadas sucesivas', () => {
    const tickets = new Set();
    for (let i = 0; i < 20; i++) {
      tickets.add(generateTicket());
    }
    // Al menos varios deben ser únicos entre 20 intentos
    assert.ok(tickets.size > 15, 'Debe generar tickets distintos');
  });
});
