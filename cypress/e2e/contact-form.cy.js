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
    cy.findByLabelText(/^Message/i).should('be.visible');
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
    cy.findByText(/Message is required/i).should('be.visible');
  });

  it('should fill and submit the form', () => {
    cy.stubFormSubmit(200, { success: true, reference: 'a1b2c3d4e5f6a1b2c3d4e5f6' });

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

    cy.wait('@formSubmission').then(({ request, response }) => {
      expect(request.body.type).to.eq('contact');
      expect(request.body.website).to.eq('');
      expect(response.statusCode).to.eq(200);
    });
    cy.findByRole('heading', { name: /Thanks, we'll be in touch/i }).should('have.focus');
    cy.contains('a1b2c3d4e5f6a1b2c3d4e5f6').should('be.visible');
  });

  const fillContact = () => {
    cy.fillFormByLabels({
      'First Name': 'Test',
      'Last Name': 'User',
      'Email': 'test@example.com',
      'Subject': 'Test Message',
      'Message': 'This is a test message from Cypress end-to-end testing.',
    });
    cy.submitFormAndWait('Send Message');
  };

  it('shows the server message when the request is definitely rejected', () => {
    cy.stubFormSubmit(422, { success: false, message: 'Enter a valid email address.' });
    fillContact();
    cy.wait('@formSubmission');
    cy.findByText(/Enter a valid email address\./i).should('be.visible');
    cy.contains(/may already have been saved/i).should('not.exist');
  });

  it('shows the wait time when rate limited', () => {
    cy.stubFormSubmit(429, { success: false, message: 'Too many requests.' }, { 'Retry-After': '600' });
    fillContact();
    cy.wait('@formSubmission');
    cy.contains(/10 minutes/i).should('be.visible');
  });
});
