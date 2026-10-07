/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Join CICA Form', () => {
  beforeEach(() => {
    // Visit the join page before each test
    cy.visit('/join');
    cy.findByText(/Join CICA For Updates/i).should('exist');
  });

  it('should display all form fields', () => {
    // Check all form elements are visible
    cy.findByText(/Subscribe for Updates/i).should('be.visible');
    cy.findByLabelText(/Full Name/i).should('be.visible');
    cy.findByLabelText(/Email Address/i).should('be.visible');
    cy.findByLabelText(/Phone Number/i).should('be.visible');
    cy.findByRole('button', { name: /Subscribe Now/i }).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Try to submit without filling fields
    cy.submitFormAndWait('Subscribe Now');
    
    // Check validation errors
    cy.findByText(/Name is required/i).should('be.visible');
    cy.findByText(/Invalid email address/i).should('be.visible');
    cy.findByText(/Phone number is required/i).should('be.visible');
  });

  it('should fill and submit the form', () => {
    // Intercept the form submission to Google Apps Script
    cy.intercept('POST', '**/script.google.com/macros/**').as('formSubmission');

    // Fill the form
    const formData = {
      'Full Name': 'Test User',
      'Email Address': 'user@example.com',
      'Phone Number': '123-456-7890'
    };

    cy.fillFormByLabels(formData);
    
    // Submit form
    cy.submitFormAndWait('Subscribe Now');

    // Verify submission attempt (we don't necessarily expect success in test environment)
    cy.wait('@formSubmission').then((interception) => {
      // Log request details for debugging
      cy.log('Form submission request:', JSON.stringify(interception.request.body));
      
      // In a real environment, we would check for success message:
      // cy.checkForToast(/Thank you for joining/i);
    });
  });
});
