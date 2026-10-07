/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Sponsor Form', () => {
  beforeEach(() => {
    // Visit the sponsors page before each test
    cy.visit('/sponsors');
    cy.findByText(/Become a Sponsor/i).should('exist');
  });

  it('should display all form fields', () => {
    // Scroll to the form section
    cy.findByText(/Contact Form/i).scrollIntoView();
    
    // Check all form elements are visible
    cy.findByLabelText(/Full Name/i).should('be.visible');
    cy.findByLabelText(/Company/i).should('be.visible');
    cy.findByLabelText(/Email Address/i).should('be.visible');
    cy.findByLabelText(/Phone Number/i).should('be.visible');
    cy.findByLabelText(/Sponsorship Interest/i).should('be.visible');
    cy.findByLabelText(/Message/i).should('be.visible');
    cy.findByRole('button', { name: /Submit/i }).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Scroll to the form section
    cy.findByText(/Contact Form/i).scrollIntoView();
    
    // Try to submit without filling fields
    cy.submitFormAndWait('Submit');
    
    // Check validation errors
    cy.findByText(/Full name is required/i).should('be.visible');
    cy.findByText(/Company name is required/i).should('be.visible');
    cy.findByText(/Invalid email address/i).should('be.visible');
    cy.findByText(/Sponsorship interest is required/i).should('be.visible');
  });

  it('should fill and submit the form', () => {
    // Intercept the form submission to Google Apps Script
    cy.intercept('POST', '**/script.google.com/macros/**').as('formSubmission');

    // Scroll to the form section
    cy.findByText(/Contact Form/i).scrollIntoView();
    
    // Fill the form
    cy.findByLabelText(/Full Name/i).type('Test Sponsor');
    cy.findByLabelText(/Company/i).type('Test Company LLC');
    cy.findByLabelText(/Email Address/i).type('sponsor@example.com');
    cy.findByLabelText(/Phone Number/i).type('123-456-7890');
    cy.findByLabelText(/Sponsorship Interest/i).select('Tournament Sponsorship');
    cy.findByLabelText(/Message/i).type('This is a test message from Cypress end-to-end testing for sponsor form.');
    
    // Submit form
    cy.submitFormAndWait('Submit');

    // Verify submission attempt (we don't necessarily expect success in test environment)
    cy.wait('@formSubmission').then((interception) => {
      // Log request details for debugging
      cy.log('Form submission request:', JSON.stringify(interception.request.body));
      
      // In a real environment, we would check for success message:
      // cy.checkForToast(/sponsorship request submitted/i);
    });
  });
});
