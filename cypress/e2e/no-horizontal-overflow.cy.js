/// <reference types="cypress" />

// Narrow phones must not scroll sideways; the 320px header once overflowed by 10px.
const pages = ['/', '/about/', '/champions/', '/gallery/']
const widths = [320, 375, 390]

describe('No horizontal overflow on narrow phones', () => {
  widths.forEach(width => {
    pages.forEach(path => {
      it(`${path} fits a ${width}px viewport`, () => {
        cy.viewport(width, 800)
        cy.visit(path)
        cy.get('.mobile-toggle').should('be.visible')
        cy.document().its('documentElement.scrollWidth').should('eq', width)
      })
    })
  })
})
