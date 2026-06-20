describe('Delete Todo', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#delete-all-btn').click()
    cy.get('#todo-table tbody tr').should('have.length', 0)
  })

  it('should remove a task from the table after clicking the delete icon', () => {
    const title = 'Cypress - Call the bank'

    cy.get('#todo-input').type(title)
    cy.get('#add-todo-btn').click()
    cy.contains('td', title).should('be.visible')

    cy.contains('td', title)
      .closest('tr')
      .find('i.fa-trash')
      .click()

    cy.contains('td', title).should('not.exist')
  })

  it('should only remove the targeted task and leave others intact', () => {
    cy.get('#todo-input').type('Cypress - Task to keep')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Task to keep').should('be.visible')

    cy.get('#todo-input').type('Cypress - Task to delete')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Task to delete').should('be.visible')

    cy.contains('td', 'Cypress - Task to delete')
      .closest('tr')
      .find('i.fa-trash')
      .click()

    cy.contains('td', 'Cypress - Task to delete').should('not.exist')
    cy.contains('td', 'Cypress - Task to keep').should('be.visible')
  })

})
