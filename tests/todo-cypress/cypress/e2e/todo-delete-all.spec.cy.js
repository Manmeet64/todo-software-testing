describe('Delete All Todos', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#delete-all-btn').click()
    cy.get('#todo-table tbody tr').should('have.length', 0)
  })

  it('should clear all tasks and show the empty state message', () => {
    cy.get('#todo-input').type('Cypress - Bulk task one')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Bulk task one').should('be.visible')

    cy.get('#todo-input').type('Cypress - Bulk task two')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Bulk task two').should('be.visible')

    cy.get('#todo-table tbody tr').should('have.length.at.least', 2)

    cy.get('#delete-all-btn').click()

    cy.get('#todo-table tbody tr').should('have.length', 0)
    cy.contains('No tasks yet').should('be.visible')
  })

})
