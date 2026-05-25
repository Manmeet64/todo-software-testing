describe('Navigation - Path Testing', () => {

  // Test 1: Valid route loads the todo page
  it('should load the todo app on the root path', () => {
    cy.visit('/')
    cy.contains('h1', 'My Tasks').should('be.visible')
    cy.get('#todo-input').should('exist')
  })

  // Test 2: Invalid route shows the 404 not found page
  it('should show 404 page for an unknown route', () => {
    cy.visit('/some-random-page', { failOnStatusCode: false })
    cy.contains('h1', '404 — Page Not Found').should('be.visible')
  })

})
