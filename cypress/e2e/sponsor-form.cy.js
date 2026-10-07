/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Sponsor Form', () => {
  beforeEach(() => {
    cy.visit('/sponsors');
    cy.findByRole('heading', { name: /Become a Sponsor/i }).should('exist').scrollIntoView();
  });

  it('should display all form fields', () => {
    cy.findByLabelText(/Full Name/i).should('be.visible');
    cy.findByLabelText(/Company/i).should('be.visible');
    cy.findByLabelText(/Email Address/i).should('be.visible');
    cy.findByLabelText(/Phone Number/i).should('be.visible');
    cy.findByLabelText(/Sponsorship Interest/i).should('be.visible');
    cy.findByLabelText(/Message/i).should('be.visible');
    cy.findByRole('button', { name: /Send sponsorship inquiry/i }).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.submitFormAndWait('Send sponsorship inquiry');
    cy.findByText(/Full name is required/i).should('be.visible');
    cy.findByText(/Company name is required/i).should('be.visible');
    cy.findByText(/Invalid email address/i).should('be.visible');
    cy.findByText(/Sponsorship interest is required/i).should('be.visible');
  });

  it('prefills the interest from ?interest=', () => {
    cy.visit('/sponsors/?interest=premium');
    cy.findByLabelText(/Sponsorship Interest/i).should('have.value', 'Premium partner');
  });

  it('should fill and submit the form', () => {
    cy.stubFormSubmit(200, { success: true, reference: 'a1b2c3d4e5f6a1b2c3d4e5f6' });
    cy.findByLabelText(/Full Name/i).type('Test Sponsor');
    cy.findByLabelText(/Company/i).type('Test Company LLC');
    cy.findByLabelText(/Email Address/i).type('sponsor@example.com');
    cy.findByLabelText(/Phone Number/i).type('123-456-7890');
    cy.findByLabelText(/Sponsorship Interest/i).select('Matchday & community supporter');
    cy.findByLabelText(/Message/i).type('This is a test message from Cypress end-to-end testing for sponsor form.');
    cy.submitFormAndWait('Send sponsorship inquiry');

    cy.wait('@formSubmission').then(({ request, response }) => {
      expect(request.body.type).to.eq('sponsor');
      expect(request.body.website).to.eq('');
      expect(request.body.interest).to.eq('Matchday & community supporter');
      expect(response.statusCode).to.eq(200);
    });
    cy.findByRole('heading', { name: /Thanks, we'll be in touch/i }).should('have.focus');
  });
});
