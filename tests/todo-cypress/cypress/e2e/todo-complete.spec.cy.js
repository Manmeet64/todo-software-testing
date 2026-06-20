describe('Complete Todo', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#delete-all-btn').click()
    cy.get('#todo-table tbody tr').should('have.length', 0)
  })

  it('should mark a task as completed when the checkbox is clicked', () => {
    cy.get('#todo-input').type('Cypress - Morning workout')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Morning workout').should('be.visible')

    cy.contains('td', 'Cypress - Morning workout')
      .closest('tr')
      .as('taskRow')

    cy.get('@taskRow').find('input[type="checkbox"]').should('not.be.checked')
    cy.get('@taskRow').find('input[type="checkbox"]').click()

    // CSS Modules mangles class names so use partial attribute match
    cy.get('@taskRow').should('have.attr', 'class').and('include', 'completedRow')
    cy.get('@taskRow').find('input[type="checkbox"]').should('be.checked')
  })

  it('should uncheck the task when the checkbox is clicked again', () => {
    cy.get('#todo-input').type('Cypress - Toggle task')
    cy.get('#add-todo-btn').click()
    cy.contains('td', 'Cypress - Toggle task').should('be.visible')

    cy.contains('td', 'Cypress - Toggle task')
      .closest('tr')
      .as('taskRow')

    cy.get('@taskRow').find('input[type="checkbox"]').click()
    cy.get('@taskRow').should('have.attr', 'class').and('include', 'completedRow')

    cy.get('@taskRow').find('input[type="checkbox"]').click()
    cy.get('@taskRow').should('have.attr', 'class').and('not.include', 'completedRow')
    cy.get('@taskRow').find('input[type="checkbox"]').should('not.be.checked')
  })

})
