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
    cy.stubFormSubmit(200, { success: true, reference: 'a1b2c3d4e5f6a1b2c3d4e5f6' });

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

    cy.wait('@formSubmission').then(({ request, response }) => {
      expect(request.body.type).to.eq('sponsor');
      expect(request.body.website).to.eq('');
      expect(response.statusCode).to.eq(200);
    });
  });
});
