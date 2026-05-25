describe('Todo App - Cypress Tests', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  // Test 1: Page loads with correct title and empty form
  it('should display the page title and empty input on load', () => {
    cy.contains('h1', 'My Tasks').should('be.visible')
    cy.get('#todo-input').should('have.value', '')
    cy.get('#todo-due-date').should('have.value', '')
  })

  // Test 2: Input clears after adding a task
  it('should clear the input field after adding a task', () => {
    cy.get('#todo-input').type('Cypress - Morning workout')
    cy.get('#add-todo-btn').click()
    cy.get('#todo-input').should('have.value', '')
  })

})
