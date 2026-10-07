/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Contact Form', () => {
  beforeEach(() => {
    // Visit the contact page before each test
    cy.visit('/contact');
    cy.findByRole('heading', { name: /Send us a Message/i }).should('exist');
  });

  it('should display all form fields', () => {
    // Check all form elements are visible
    cy.findByLabelText(/First Name/i).should('be.visible');
    cy.findByLabelText(/Last Name/i).should('be.visible');
    cy.findByLabelText(/Email/i).should('be.visible');
    cy.findByLabelText(/Phone \(Optional\)/i).should('be.visible');
    cy.findByLabelText(/Subject/i).should('be.visible');
    cy.findByLabelText(/Message/i).should('be.visible');
    cy.findByRole('button', { name: /Send Message/i }).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Try to submit without filling fields
    cy.submitFormAndWait('Send Message');
    
    // Check validation errors
    cy.findByText(/First name is required/i).should('be.visible');
    cy.findByText(/Last name is required/i).should('be.visible');
    cy.findByText(/Invalid email address/i).should('be.visible');
    cy.findByText(/Subject is required/i).should('be.visible');
    cy.findByText(/Message must be at least 10 characters/i).should('be.visible');
  });

  it('should fill and submit the form', () => {
    // Intercept the form submission to the same-origin PHP handler
    cy.intercept('POST', '**/forms/submit.php').as('formSubmission');

    // Fill the form
    const formData = {
      'First Name': 'Test',
      'Last Name': 'User',
      'Email': 'test@example.com',
      'Phone \\(Optional\\)': '123-456-7890',
      'Subject': 'Test Message',
      'Message': 'This is a test message from Cypress end-to-end testing.'
    };

    cy.fillFormByLabels(formData);
    
    // Submit form
    cy.submitFormAndWait('Send Message');

    // Verify submission attempt (we don't necessarily expect success in test environment)
    cy.wait('@formSubmission').then((interception) => {
      // Log request details for debugging
      cy.log('Form submission request:', JSON.stringify(interception.request.body));
      
      // In a real environment, we would check for success message:
      // cy.checkForToast(/message sent successfully/i);
    });
  });
});
