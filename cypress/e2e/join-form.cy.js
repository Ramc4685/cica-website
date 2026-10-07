/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Community updates form', () => {
  beforeEach(() => {
    cy.visit('/join');
    cy.findByRole('heading', { name: /Request community updates/i }).should('exist');
  });

  it('should display all form fields', () => {
    cy.findByLabelText(/Full Name/i).should('be.visible');
    cy.findByLabelText(/Email Address/i).should('be.visible');
    cy.findByLabelText(/Phone Number/i).should('be.visible');
    cy.findByRole('button', { name: /Request updates/i }).should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.submitFormAndWait('Request updates');
    cy.findByText(/Name is required/i).should('be.visible');
    cy.findByText(/Invalid email address/i).should('be.visible');
  });

  it('should fill and submit the form', () => {
    cy.stubFormSubmit(200, { success: true, reference: 'a1b2c3d4e5f6a1b2c3d4e5f6' });
    cy.fillFormByLabels({
      'Full Name': 'Test User',
      'Email Address': 'user@example.com',
      'Phone Number': '123-456-7890'
    });
    cy.submitFormAndWait('Request updates');

    cy.wait('@formSubmission').then(({ request, response }) => {
      expect(request.body.type).to.eq('updates');
      expect(request.body.website).to.eq('');
      expect(response.statusCode).to.eq(200);
    });
    cy.findByRole('heading', { name: /Thanks, we'll be in touch/i }).should('have.focus');
    cy.contains('a1b2c3d4e5f6a1b2c3d4e5f6').should('be.visible');
  });
});
