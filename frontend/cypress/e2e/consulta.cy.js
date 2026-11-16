describe('Prueba E2E 1: Flujo de Consulta y Seguimiento de Pedidos', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debe navegar desde el inicio hacia la página de consulta', () => {
    cy.contains('Seguimiento de Pedido').click();
    cy.url().should('include', '/consulta');
    cy.get('h1').should('contain', 'Consulta el Estado de tu Prenda');
  });

  it('debe permitir buscar por un ticket y mostrar mensaje si no existe', () => {
    cy.visit('/consulta');
    cy.get('input#query').should('be.visible').type('TK-9999');
    cy.get('form').submit();

    // Valida que el sistema responda con la alerta esperada
    cy.get('.alert-error, .alert', { timeout: 6000 }).should('be.visible')
      .and('contain', 'No encontramos encargos');
  });

  it('debe mostrar los detalles del encargo cuando la búsqueda es exitosa', () => {
    cy.visit('/consulta');

    // Intercepta la llamada a la API para simular un encargo existente
    cy.intercept('GET', '**/api/consulta*', [
      {
        codigo_ticket: 'TK-1234',
        prenda: 'Vestido de Fiesta',
        estado: 'en_proceso',
        fecha_entrega_estimada: '2026-11-15',
        descripcion_trabajo: 'Ajuste de cintura y bastilla',
        precio_total: 25000,
        abono: 10000,
        saldo: 15000,
      },
    ]).as('buscarEncargo');

    cy.get('input#query').type('TK-1234');
    cy.get('form').submit();
    cy.wait('@buscarEncargo');

    // Verifica que se renderice la tarjeta de resultados con los datos del encargo
    cy.get('.consult-result-card').should('be.visible');
    cy.contains('.ticket-tag', 'TK-1234').should('be.visible');
    cy.contains('Vestido de Fiesta').should('be.visible');
    cy.contains('Ajuste de cintura y bastilla').should('be.visible');
  });
});
