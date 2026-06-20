describe('Add Todo', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#delete-all-btn').click()
    cy.get('#todo-table tbody tr').should('have.length', 0)
  })

  it('should add a task and display it in the table', () => {
    const title = 'Cypress - Buy groceries'

    cy.get('#todo-input').type(title)
    cy.get('#add-todo-btn').click()

    cy.contains('td', title).should('be.visible')
    cy.get('#todo-table tbody tr').should('have.length.at.least', 1)
  })

  it('should clear the input fields after adding a task', () => {
    cy.get('#todo-input').type('Cypress - Clear input check')
    cy.get('#add-todo-btn').click()

    cy.get('#todo-input').should('have.value', '')
    cy.get('#todo-due-date').should('have.value', '')
  })

  it('should not add a task when the title input is empty', () => {
    cy.get('#add-todo-btn').click()

    cy.get('#todo-table tbody tr').should('have.length', 0)
    cy.contains('No tasks yet').should('be.visible')
  })

})
