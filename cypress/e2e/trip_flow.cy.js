describe("Trip + Event Flow", () => {
  const testTripName = `TEST_Trip_${Date.now()}`;
  const event1 = "Event One";
  const event2 = "Event Two";

  beforeEach(() => {
    cy.visit("/login");
    cy.get('input[name="email"]').type("testUser@gmail.com", { force: true });
    cy.get('input[name="password"]').type("Test1234");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.url().should("include", "/");
    cy.contains("PlanTogether").should("be.visible");
  });

  it("creates a new trip", () => {
    cy.visit("/trips");

    cy.contains("Create Trip").should("be.visible").click({ force: true });

    cy.get('input[placeholder="Trip title"]').type(testTripName);
    cy.get('input[placeholder="Trip summary"]').type("This is a test trip");
    cy.get('input[placeholder="Enter tags separated by commas"]').type(
      "test,e2e"
    );

    cy.get("form").submit();
    cy.contains(testTripName, { timeout: 10000 }).should("exist");
  });

  it("adds the first event", () => {
    cy.visit("/trips");

    cy.contains('[data-cy="trip-card"]', testTripName, { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get('[data-cy="view-trip-btn"]').should("be.visible").click();
      });

    cy.contains("Create Event").should("be.visible").click({ force: true });

    cy.get('input[placeholder="Enter event name"]').type(event1);
    cy.get('input[placeholder="Enter event description"]').type("Test event 1");
    cy.get('input[type="date"]').type("2025-05-01");

    cy.get("form").submit();
    cy.contains(event1, { timeout: 10000 }).should("exist");
  });

  it("adds the second event", () => {
    cy.visit("/trips");

    cy.contains('[data-cy="trip-card"]', testTripName, { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get('[data-cy="view-trip-btn"]').should("be.visible").click();
      });

    cy.contains("Create Event").should("be.visible").click({ force: true });

    cy.get('input[placeholder="Enter event name"]').type(event2);
    cy.get('input[placeholder="Enter event description"]').type("Test event 1");
    cy.get('input[type="date"]').type("2025-05-01");

    cy.get("form").submit();
    cy.contains(event2, { timeout: 10000 }).should("exist");
  });

  it("deletes the first event", () => {
    cy.visit("/trips");

    cy.contains('[data-cy="trip-card"]', testTripName, { timeout: 10000 })
      .should("exist")
      .within(() => {
        cy.get('[data-cy="view-trip-btn"]').should("be.visible").click();
      });

    cy.contains('[data-cy="event-name-link"]', event1)
      .should("be.visible")
      .click();

    cy.contains("Delete Event", { timeout: 10000 }).should("be.visible");

    cy.contains("Delete Event").should("be.visible").click({ force: true });

    cy.get('input[placeholder="Enter name/title"]').type(event1);

    cy.get("form").submit();

    cy.contains(event1, { timeout: 10000 }).should("not.exist");
  });

  it("deletes all trips with name-confirmation", () => {
    cy.visit("/trips");

    cy.get('[data-cy="view-trip-btn"]', { timeout: 10000 }).each(() => {
      cy.get('[data-cy="trip-title"]')
        .first()
        .invoke("text")
        .then((tripName) => {
          cy.get('[data-cy="view-trip-btn"]')
            .first()
            .should("be.visible")
            .click();

          cy.contains("Delete Trip", { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

          cy.get('input[placeholder="Enter name/title"]').type(tripName);

          cy.get("form").submit();

          cy.contains(tripName, { timeout: 10000 }).should("not.exist");

          cy.visit("/trips");
        });
    });
  });
});
