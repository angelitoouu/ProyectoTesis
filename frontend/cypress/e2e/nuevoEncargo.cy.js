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
    cy.intercept('POST', '**/api/encargos', {
      statusCode: 201,
      body: {
        id: 101,
        codigo_ticket: 'TK-8899',
        nombre_cliente: 'Camila Silva',
        telefono_cliente: '+56911223344',
        prenda: 'Vestido de Fiesta',
        descripcion_trabajo: 'Ajuste de bastilla',
        estado: 'pendiente',
      },
    }).as('crearEncargo');

    cy.get('input#nombre_cliente').type('Camila Silva');
    cy.get('input#telefono_cliente').type('+56911223344');
    cy.get('input#prenda').type('Vestido de Fiesta');
    cy.get('textarea#descripcion_trabajo').type('Ajuste de bastilla y entalle');

    cy.get('button[type="submit"]').click();
    cy.wait('@crearEncargo');

    cy.get('.alert-success').should('be.visible');
    cy.contains('.ticket-tag', 'TK-8899').should('be.visible');
    cy.contains('Consultar Estado de mi Pedido').should('be.visible');
  });
});

