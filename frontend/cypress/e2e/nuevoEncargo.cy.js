describe('Prueba E2E 3: Flujo de Creación y Solicitud de Nuevo Encargo', () => {
  beforeEach(() => {
    cy.visit('/solicitar');
  });

  it('debe mostrar el formulario de solicitud con los campos requeridos', () => {
    cy.get('h1').should('contain', 'Solicitar Nuevo Encargo');
    cy.get('input#nombre_cliente').should('be.visible').and('have.attr', 'required');
    cy.get('input#telefono_cliente').should('be.visible').and('have.attr', 'required');
    cy.get('input#prenda').should('be.visible').and('have.attr', 'required');
    cy.get('textarea#descripcion_trabajo').should('be.visible').and('have.attr', 'required');
  });

  it('debe registrar un nuevo encargo exitosamente y desplegar el ticket de seguimiento', () => {
    // Generar datos aleatorios únicos en cada ejecución
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const nombres = ['Camila Silva', 'Valeria Rojas', 'Ignacio Soto', 'Daniela Castro', 'Matías Vega', 'Fernanda Pinto'];
    const prendas = ['Vestido de Fiesta', 'Pantalón Formal', 'Falda Plisada', 'Chaqueta de Mezclilla', 'Blusa de Seda'];
    const trabajos = ['Ajuste de bastilla y entalle', 'Cambio de cierre y reducción', 'Entalle de cintura', 'Ajuste de mangas'];

    const nombreRandom = `${nombres[Math.floor(Math.random() * nombres.length)]} ${randomId}`;
    const telefonoRandom = `+569${Math.floor(10000000 + Math.random() * 90000000)}`;
    const prendaRandom = prendas[Math.floor(Math.random() * prendas.length)];
    const trabajoRandom = trabajos[Math.floor(Math.random() * trabajos.length)];
    const ticketRandom = `TK-${randomId}`;

    cy.intercept('POST', '**/api/encargos', {
      statusCode: 201,
      body: {
        id: randomId,
        codigo_ticket: ticketRandom,
        nombre_cliente: nombreRandom,
        telefono_cliente: telefonoRandom,
        prenda: prendaRandom,
        descripcion_trabajo: trabajoRandom,
        estado: 'pendiente',
      },
    }).as('crearEncargo');

    cy.get('input#nombre_cliente').type(nombreRandom);
    cy.get('input#telefono_cliente').type(telefonoRandom);
    cy.get('input#prenda').type(prendaRandom);
    cy.get('textarea#descripcion_trabajo').type(trabajoRandom);

    cy.get('button[type="submit"]').click();
    cy.wait('@crearEncargo');

    cy.get('.alert-success').should('be.visible');
    cy.contains('.ticket-tag', ticketRandom).should('be.visible');
    cy.contains('Consultar Estado de mi Pedido').should('be.visible');
  });
});
