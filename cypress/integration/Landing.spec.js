const productsBackendAPIBaseUrl =
  "https://ancient-athens-hiib8yznxwbz.vapor-farm-b1.com/api";

describe("Landing Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("fetches product(s) informations", () => {
    cy.intercept(`${productsBackendAPIBaseUrl}/products`);
  });

  it("Loads the header brands logos", () => {
    cy.get('[data-testid="header-brands"] .header-brands__logo > img').each(
      (image) => {
        cy.wrap(image)
          .should("be.visible")
          .and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
          });
      }
    );
  });

  it("should populate the footer with text", () => {
    cy.get('[data-testid="footer"] .footer__content').should(($el) => {
      expect($el.text().trim()).not.equal("");
    });
  });
});
