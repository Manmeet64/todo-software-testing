describe('Navigation', () => {

  it('should display the page title, empty inputs, and action buttons on load', () => {
    cy.visit('/')
    cy.contains('h1', 'My Tasks').should('be.visible')
    cy.get('#todo-input').should('exist').and('have.value', '')
    cy.get('#todo-due-date').should('exist').and('have.value', '')
    cy.get('#add-todo-btn').should('be.visible')
    cy.get('#delete-all-btn').should('be.visible')
  })

  it('should show 404 page for an unknown route', () => {
    cy.visit('/some-random-page', { failOnStatusCode: false })
    cy.contains('h1', '404 — Page Not Found').should('be.visible')
  })

})
