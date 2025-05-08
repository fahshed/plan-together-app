# PlanTogether

A web app to make planning group trips easier. It brings together features from different tools like Trello (for tasks), Splitwise (for expenses), and forums (for discussions). The idea is to help friends manage everything about a group trip in one place.

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
- Transaction Service: https://github.com/fahshed/plan-together-transaction-service
- Kubernetes Manifests: https://github.com/fahshed/plan-together-k8s-manifests

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

## GCP Configuration
I used the following 5 GCP services/products:
- I used **Google Kubernetes Engine (GKE)** to deploy my three backend microservices: auth, trip, and transaction. GKE made it easy to manage containers, micro architecture and scale the services.
- To expose all the services under a single public IP, I used a **Cloud Load Balancer** via Kubernetes Ingress. It handles routing based on paths like /auth, /trips, and /transactions. It will also help distribute the load if my pods scale with HPA.
- For data, I used **Firestore** since it’s flexible and easy to use with document data. There isn’t any complex relationship among the data entities I used, so a document database was ideal. It worked well with my microservices and didn’t need much setup.
- I used **Cloud Storage Bucket** to store images, especially for transaction receipts. It's cheap and reliable, and GCP makes it simple to upload and access images securely.
- Finally, I set up **Cloud Build triggers** and connected them to GitHub. It now builds Docker images and deploys them to GKE automatically when I push changes to the main branch of the repos. This made CI/CD really smooth.


### Firebase (Firestore) Setup

- Created a Firebase web app and initialized a **Firestore database**.
- Downloaded the `serviceAccount.json` and used it for local development.

- In production (on GKE), no credentials are needed. The services and Firestore are in the same GCP project, so we can make the default service account have required IAM permissions to connect to Firebase with this:

```bash
gcloud projects add-iam-policy-binding [PROJECT_ID] --member="serviceAccount:[PROJECT_NUMBER]-compute@developer.gserviceaccount.com" --role="roles/datastore.user"
```

---

### Cloud Storage Bucket Setup

- Created a Cloud Storage bucket via GCP Console with appropriate name, location, and region.
- Used the same `serviceAccount.json` for local development to upload files.

```javascript
if (process.env.NODE_ENV !== "production") {
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
  });
} else {
  admin.initializeApp({
    storageBucket: process.env.STORAGE_BUCKET,
  });
}
const db = admin.firestore();
const bucket = admin.storage().bucket();
```

- In production, similar to firebase:

```bash
gcloud projects add-iam-policy-binding [PROJECT_ID] --member="serviceAccount:[PROJECT_NUMBER]-compute@developer.gserviceaccount.com" --role="roles/storage.objectAdmin"
```

- Enabled public access only for specific objects (receipt images) to be accessed via public URL. The bucket itself remains private.

```javascript
await file.makePublic();
receiptUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
```

### GKE Microservices Deployment

- Created a GKE cluster using:

```bash
gcloud container clusters create plan-together-cluster \
  --zone us-central1-a \
  --num-nodes=1 \
  --enable-ip-alias \
  --release-channel=regular \
  --machine-type=e2-medium \
  --scopes=https://www.googleapis.com/auth/cloud-platform
```

- Wrote `Dockerfile` and `.dockerignore` for each service (auth, trip, transaction).
- Created Kubernetes **Deployment** (deploys the image with needed configs and `env` variables) and **Service** (exposes the deployed service) Manifest YAMLs. I used cluster IPs, not public for my services because I want them behind one common Ingress Load Balancer.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth
          image: gcr.io/[PROJECT_ID]/auth-service:latest
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              value: "production"
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP
```

- Manually deployed each service image for verification:

```bash
# Building and Pushing service image
docker build -t auth-service .
docker tag auth-service gcr.io/[PROJECT_ID]/auth-service
docker push gcr.io/[PROJECT_ID]/auth-service

# Deploying the image with k8s manifests and checking the deployed pods
kubectl apply -f k8s/
kubectl get pods
```

- Following commands were used to add credentials to k8s local CLI and reploy a service after fixing errors in the code locally.

```
gcloud container clusters get-credentials plan-together-cluster --zone us-central1-a

kubectl rollout restart deployment auth-service
```


### Ingress with GCP Load Balancing

- Used Kubernetes Ingress to route paths `/auth`, `/trips`, and `/transactions` to their respective services.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: plan-together-ingress
  annotations:
    kubernetes.io/ingress.class: "gce"
spec:
  rules:
    - http:
        paths:
          - path: /auth
            pathType: Prefix
            backend:
              service:
                name: auth-service
                port:
                  number: 80
          - path: /trips
            pathType: Prefix
            backend:
              service:
                name: trip-service
                port:
                  number: 80
          - path: /transactions
            pathType: Prefix
            backend:
              service:
                name: transaction-service
                port:
                  number: 80
```

- Ingress was backed by **Google Cloud HTTP Load Balancer**, which provided a public facing common IP for all services.

```bash
kubectl apply -f ingress.yaml
kubectl get ingress plan-together-ingress
```

- All services share the same Load Balancer IP.


### CI/CD with Cloud Build

- Enabled required APIs:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable container.googleapis.com
```

- Added `cloudbuild.yaml` to each service repo. Steps include building Docker image, pushing to GCR, and updating the corresponding GKE deployment. The $ variables are resolved by GCP Cloud Build.

```yaml
options:
  logging: CLOUD_LOGGING_ONLY

steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/transaction-service:$COMMIT_SHA", "."]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/transaction-service:$COMMIT_SHA"]

  - name: "gcr.io/cloud-builders/kubectl"
    args:
      [
        "set",
        "image",
        "deployment/transaction-service",
        "transaction=gcr.io/$PROJECT_ID/transaction-service:$COMMIT_SHA",
      ]
    env:
      - "CLOUDSDK_COMPUTE_ZONE=us-central1-a"
      - "CLOUDSDK_CONTAINER_CLUSTER=plan-together-cluster"

images:
  - "gcr.io/$PROJECT_ID/transaction-service:$COMMIT_SHA"
```

- Installed **Google Cloud Build GitHub app** in each of the 3 service repos (auth, trip, transaction).
- In GCP console, created **Cloud Build triggers** on push to `main` for each service folder.
- Tested CI/CD by pushing code and watching builds auto-trigger in the Cloud Build History dashboard.
