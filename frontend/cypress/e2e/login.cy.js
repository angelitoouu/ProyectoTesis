describe('Prueba E2E 2: Flujo de Autenticación de Encargada y Acceso al Panel', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debe rechazar el acceso con una clave incorrecta y mostrar alerta de error', () => {
    cy.get('input#clave').should('be.visible').type('clave_invalida');
    cy.get('form').submit();

    cy.get('.alert-error').should('be.visible')
      .and('contain', 'Clave incorrecta. Intenta nuevamente.');
  });

  it('debe ingresar exitosamente al panel con la clave correcta y permitir cerrar sesión', () => {
    cy.get('input#clave').should('be.visible').type('admin123');
    cy.get('form').submit();

    // Redirige al panel privado
    cy.url().should('include', '/panel');
    cy.contains('Panel de Estados').should('be.visible');

    // Cierra sesión
    cy.contains('button', 'Cerrar Sesión').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Acceso Encargada').should('be.visible');
  });
});
