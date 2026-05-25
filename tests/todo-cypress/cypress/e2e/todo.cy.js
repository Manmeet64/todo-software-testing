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

  // Test 2: Add button does nothing when input is empty
  it('should not add a task when input is empty', () => {
    cy.get('#todo-table tbody tr').then(($rowsBefore) => {
      const countBefore = $rowsBefore.length
      cy.get('#add-todo-btn').click()
      cy.get('#todo-table tbody tr').should('have.length', countBefore)
    })
  })

  // Test 3: Input clears after adding a task
  it('should clear the input field after adding a task', () => {
    cy.get('#todo-input').type('Cypress - Morning workout')
    cy.get('#add-todo-btn').click()
    cy.get('#todo-input').should('have.value', '')
  })

  // Test 4: Multiple tasks appear in correct order (newest first)
  it('should show newest task at the top', () => {
    cy.get('#todo-input').type('Cypress - First task')
    cy.get('#add-todo-btn').click()
    cy.get('#todo-table').should('contain', 'Cypress - First task')

    cy.get('#todo-input').type('Cypress - Second task')
    cy.get('#add-todo-btn').click()
    cy.get('#todo-table').should('contain', 'Cypress - Second task')

    cy.get('#todo-table tbody tr').first().should('contain', 'Cypress - Second task')
  })

  // Test 5: Mark task complete then uncheck it (toggle)
  it('should toggle a task between complete and incomplete', () => {
    cy.get('#todo-input').type('Cypress - Toggle this task')
    cy.get('#add-todo-btn').click()
    cy.get('#todo-table').should('contain', 'Cypress - Toggle this task')

    // Mark complete
    cy.contains('td', 'Cypress - Toggle this task')
      .closest('tr')
      .find('input[type="checkbox"]')
      .click()

    cy.contains('td', 'Cypress - Toggle this task')
      .closest('tr')
      .find('input[type="checkbox"]')
      .should('be.checked')

    // Uncheck
    cy.contains('td', 'Cypress - Toggle this task')
      .closest('tr')
      .find('input[type="checkbox"]')
      .click()

    cy.contains('td', 'Cypress - Toggle this task')
      .closest('tr')
      .find('input[type="checkbox"]')
      .should('not.be.checked')
  })

})
