describe('Prueba E2E 4: Seguridad y Protección de Rutas Privadas del Taller', () => {
  it('debe redirigir a /login al intentar ingresar al panel de estados sin autenticación', () => {
    cy.visit('/panel');
    cy.url().should('include', '/login');
    cy.contains('Acceso Encargada').should('be.visible');
    cy.get('input#clave').should('be.visible');
  });

  it('debe redirigir a /login al intentar ingresar a la gestión de clientes sin autenticación', () => {
    cy.visit('/clientes');
    cy.url().should('include', '/login');
    cy.get('input#clave').should('be.visible');
  });

  it('debe autorizar el acceso a las rutas protegidas tras autenticarse con la clave correcta', () => {
    cy.visit('/login');
    cy.get('input#clave').type('admin123');
    cy.get('form').submit();

    cy.url().should('include', '/panel');
    cy.contains('Panel de Estados').should('be.visible');

    // Navegar a clientes ahora que está autenticada
    cy.contains('a', 'Clientes').click();
    cy.url().should('include', '/clientes');
    cy.contains('Gestión de Clientes').should('be.visible');
  });
});

