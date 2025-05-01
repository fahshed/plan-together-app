# PlanTogether

Deployed URL: http://34.49.45.45/ (creds: lina799@gmail.com/Sign1234)

<p align="center">
  <img src="https://github.com/user-attachments/assets/caef3fb2-ea0c-4bcc-a91c-09835647b13f" width="350" border="1px solid #ccc"/>
  <img src="https://github.com/user-attachments/assets/52892ef4-12fa-4d8e-9e32-08f8c46bf419" width="350"/>
  <img src="https://github.com/user-attachments/assets/7330fe74-183c-4466-86d2-244b735acad2" width="350"/>
  <img src="https://github.com/user-attachments/assets/1804a414-1355-49b2-886b-4eda6249f2b6" width="350"/>
  <img src="https://github.com/user-attachments/assets/eab16382-6d53-46c9-8300-5440e38f68c3" width="350"/>
  <img src="https://github.com/user-attachments/assets/6974317f-3529-438a-be77-79ba4ccd7f0e" width="350"/>
</p>

### Repositories

- Frontend Application: https://github.com/fahshed/plan-together-app
- Auth Service: https://github.com/fahshed/plan-together-auth-service
- Trip Service: https://github.com/fahshed/plan-together-trip-service
- Transaction Servie: https://github.com/fahshed/plan-together-transaction-service

### TechStack

- Frontend: Next.js 15 (Page Router) + ChakraUI V3, Cypress
- Backend: Node.js, Express, JWT, Jest
- Datastore: Firebase, Cloud Storage Bucket
- Cloud: Docker, GCP (GKE, Cloud Build, Ingress)

### Testing

- Unit Test: `computeLedger()` method in transaction-service has a test suite with 4 unit tests with `Jest`. To run do `npm install`, and then `npm test`.
- E2E Test: Trip and event flow is tested with `cypress` in the front end. To run:
  - do `npm install`
  - have `.env` file setup
  - start the app with `npm run dev`
  - then do `npx cypress open`.
  - click on the `trip_flow.cy.js` file on cypress browser window.
