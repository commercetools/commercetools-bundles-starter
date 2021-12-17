import { entryPointUriPath } from '../support/constants';

describe('Health', () => {
  const initialUri = 'bundles-test';

  it(`should open the accounts url and show the profile`, () => {
    cy.loginByOidc({ entryPointUriPath });

    cy.url().should('include', 'bundles-test');

    // cy.findByRole('main').within(() => {
    //   cy.findByText(/^My profile$/i).should('be.visible');
    // });
  });
});
