describe('Add Todo With Due Date', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#delete-all-btn').click()
    cy.get('#todo-table tbody tr').should('have.length', 0)
  })

  it('should display the due date in the table row after adding a task with a date', () => {
    const title = 'Cypress - Submit assignment'

    cy.get('#todo-input').type(title)
    cy.get('#todo-due-date').type('2026-12-31')
    cy.get('#add-todo-btn').click()

    cy.contains('td', title).should('be.visible')

    cy.contains('td', title)
      .closest('tr')
      .find('td')
      .eq(2)
      .invoke('text')
      .should('not.eq', '-')
      .and('not.eq', '')
  })

  it('should show a dash in the due date column when no date is provided', () => {
    const title = 'Cypress - No date task'

    cy.get('#todo-input').type(title)
    cy.get('#add-todo-btn').click()

    cy.contains('td', title).should('be.visible')

    cy.contains('td', title)
      .closest('tr')
      .find('td')
      .eq(2)
      .should('have.text', '-')
  })

})
