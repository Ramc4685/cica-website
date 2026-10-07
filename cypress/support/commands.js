// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Custom command to fill out a form based on field labels
Cypress.Commands.add('fillFormByLabels', (formData) => {
  Object.keys(formData).forEach(label => {
    cy.findByLabelText(new RegExp(label, 'i'))
      .should('exist')
      .type(formData[label]);
  });
});

// Custom command to submit a form and wait for response
Cypress.Commands.add('submitFormAndWait', (submitButtonText) => {
  cy.findByRole('button', { name: new RegExp(submitButtonText, 'i') })
    .should('exist')
    .click();
  
  // Wait for network response
  cy.wait(1000); // Basic wait, in real tests you might use cy.intercept() instead
});

// Custom command to check for toast notifications
Cypress.Commands.add('checkForToast', (messageRegex) => {
  cy.get('body').should('contain.text', messageRegex);
});

// Stub the same-origin PHP handler so specs never depend on a live backend (use test:e2e:php for the real one).
Cypress.Commands.add('stubFormSubmit', (statusCode, body, headers = {}) => {
  cy.intercept('POST', '**/forms/submit.php', { statusCode, body, headers }).as('formSubmission');
});
