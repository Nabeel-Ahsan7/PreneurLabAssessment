# Full-Stack E-Commerce System

A production-ready simplified e-commerce system built with Express.js + TypeScript (backend) and Next.js + TypeScript (frontend), with MongoDB as the database.

---

## Features

- **Authentication** – JWT access + refresh tokens, bcrypt password hashing
- **Role-based Authorization** – User and Admin roles
- **Product Management** – CRUD with image upload (multer), pagination, search, category filter
- **Category System** – Many-to-many relationship with products
- **Cart System** – One cart per user, quantity validation against stock
- **Order Placement** – Atomic transaction with stock deduction, cart clearing, purchase history tracking
- **Reporting** – Aggregation-based summary (total orders, revenue, top products)
- **Recommendation Engine** – Rule-based, 4-tier priority (purchased categories → frequent searches → recent searches → top sellers)
- **Admin Panel** – Dashboard, product CRUD, category management, reports
- **Database Seeding** – Auto-seeds admin user, sample categories & products on first Docker start

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Backend    | Node.js 20, Express.js 5, TypeScript            |
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS  |
| Database   | MongoDB 7 + Mongoose 9                          |
| Auth       | JWT (access + refresh), bcryptjs                |
| Upload     | multer (local `/uploads` directory)             |
| Testing    | Jest, Supertest, mongodb-memory-server          |
| Container  | Docker, Docker Compose                          |

---

## Project Structure

```
PreneurLabAssessment/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment config & DB connection
│   │   ├── models/          # Mongoose models (User, Product, Category, Cart, Order, SearchHistory)
│   │   ├── middleware/      # Auth middleware, multer upload config
│   │   ├── controllers/     # Business logic for all endpoints
│   │   ├── routes/          # Express route definitions
│   │   ├── types/           # TypeScript interfaces
│   │   ├── __tests__/       # Jest test suites
│   │   ├── seed.ts          # Database seed script
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── entrypoint.sh        # Docker entrypoint (seed → start)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable UI & layout components
│   │   ├── lib/             # API client, auth context, design tokens
│   │   └── types/           # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── E-Commerce-API.postman_collection.json
└── README.md
```

---

## Prerequisites

- **Node.js 20+** and **npm**
- **MongoDB** (local instance or Atlas) — *only needed for local development without Docker*
- **Docker** and **Docker Compose** — *for containerized setup*

---

## Quick Start with Docker (Recommended)

This is the easiest way to get the full stack running. Docker Compose will start MongoDB, the backend, and the frontend — and **automatically seed the database** on first run.

### 1. Clone the repository

```bash
git clone https://github.com/Nabeel-Ahsan7/PreneurLabAssessment.git
cd PreneurLabAssessment
```

### 2. Build and start all services

```bash
docker compose up --build -d
```

This will:
- Pull and start **MongoDB 7** on port `27018` (external) / `27017` (internal)
- Build and start the **backend** on port `5000`
- Build and start the **frontend** on port `3000`
- **Automatically seed** the database with sample data on first start

### 3. Open the application

| Service   | URL                          |
| --------- | ---------------------------- |
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:5000        |
| MongoDB   | `localhost:27018`            |

### 4. Login with seeded accounts

| Role  | Email                | Password   |
| ----- | -------------------- | ---------- |
| Admin | `admin@example.com`  | `admin123` |
| User  | `user@example.com`   | `user123`  |

The seed also creates **5 categories** and **12 products** so you can explore immediately.

### 5. Stop all services

```bash
# Stop containers (data is preserved)
docker compose down

# Stop containers and wipe all data (MongoDB volume removed)
docker compose down -v
```

### 6. View logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Check seed output
docker compose logs backend | head -20
```

---

## Local Development Setup (Without Docker)

Use this if you want hot-reload and direct control over each service.

### Prerequisites

- Node.js 20+
- MongoDB running locally on `localhost:27017`

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/preneur-ecommerce
JWT_ACCESS_SECRET=your-access-secret-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
```

Seed the database (optional, run once):

```bash
npm run build
npm run seed
```

Start the backend in development mode:

```bash
npm run dev
```

The backend will start on **http://localhost:5000** with hot-reload.

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend in development mode:

```bash
npm run dev
```

The frontend will start on **http://localhost:3000**.

---

## Available Scripts

### Backend (`backend/`)

| Script          | Command                | Description                              |
| --------------- | ---------------------- | ---------------------------------------- |
| `npm run dev`   | `ts-node-dev ...`      | Start with hot-reload (development)      |
| `npm run build` | `tsc`                  | Compile TypeScript to `dist/`            |
| `npm start`     | `node dist/server.js`  | Start compiled production server         |
| `npm run seed`  | `node dist/seed.js`    | Seed database (run `build` first)        |
| `npm test`      | `jest`                 | Run test suites                          |

### Frontend (`frontend/`)

| Script          | Command          | Description                          |
| --------------- | ---------------- | ------------------------------------ |
| `npm run dev`   | `next dev`       | Start with hot-reload (development)  |
| `npm run build` | `next build`     | Build for production                 |
| `npm start`     | `next start`     | Start production build               |
| `npm run lint`  | `next lint`      | Run ESLint                           |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                  | Default / Example                            |
| -------------------- | ---------------------------- | -------------------------------------------- |
| `PORT`               | Server port                  | `5000`                                       |
| `MONGODB_URI`        | MongoDB connection string    | `mongodb://localhost:27017/preneur-ecommerce`|
| `JWT_ACCESS_SECRET`  | Access token signing secret  | *(required — set a strong random string)*    |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | *(required — set a strong random string)*    |
| `JWT_ACCESS_EXPIRY`  | Access token lifetime        | `15m`                                        |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime       | `7d`                                         |
| `FRONTEND_URL`       | CORS allowed origin          | `http://localhost:3000`                      |

### Frontend (`frontend/.env.local`)

| Variable              | Description      | Default / Example           |
| --------------------- | ---------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:5000`     |

---

## Database Seeding

The seed script creates initial data so you can start using the app immediately.

**What gets seeded:**

| Data       | Details                                                              |
| ---------- | -------------------------------------------------------------------- |
| Admin user | `admin@example.com` / `admin123` (role: admin)                      |
| Regular user | `user@example.com` / `user123` (role: user)                       |
| Categories | Electronics, Clothing, Books, Home & Kitchen, Sports & Outdoors     |
| Products   | 12 products distributed across categories                           |

**The seed is idempotent** — it checks if users already exist and skips if the database has been seeded before.

### Run seed manually (local development)

```bash
cd backend
npm run build
npm run seed
```

### Docker

The seed runs **automatically** on every container start via `entrypoint.sh`. On the first run it seeds the data; on subsequent restarts it detects existing data and skips.

---

## Testing

Tests use **mongodb-memory-server** for isolated in-memory database testing — no real MongoDB instance needed.

```bash
cd backend
npm test
```

**Test suites:**

| Suite              | What it tests                                          |
| ------------------ | ------------------------------------------------------ |
| `auth.test.ts`     | Register, login, token refresh, logout                 |
| `product.test.ts`  | Create, read, update, delete products (admin)          |
| `order.test.ts`    | Add to cart → place order → stock deduction            |

---

## API Documentation

A **Postman collection** is included at the project root: `E-Commerce-API.postman_collection.json`

Import it into Postman to get all endpoints pre-configured with variables for `baseUrl`, `accessToken`, and `refreshToken` (auto-populated on login).

### Endpoints Summary

#### Authentication

| Method | Endpoint              | Auth | Description               |
| ------ | --------------------- | ---- | ------------------------- |
| POST   | `/auth/register`      | No   | Register a new user       |
| POST   | `/auth/login`         | No   | Login, returns tokens     |
| POST   | `/auth/refresh-token` | No   | Refresh access token      |
| POST   | `/auth/logout`        | Yes  | Logout, clear tokens      |

#### Categories

| Method | Endpoint             | Auth  | Description         |
| ------ | -------------------- | ----- | ------------------- |
| POST   | `/categories`        | Admin | Create category     |
| GET    | `/categories`        | No    | List all categories |
| GET    | `/categories/:slug`  | No    | Get by slug         |
| PUT    | `/categories/:id`    | Admin | Update category     |
| DELETE | `/categories/:id`    | Admin | Delete category     |

#### Products

| Method | Endpoint         | Auth  | Description                           |
| ------ | ---------------- | ----- | ------------------------------------- |
| POST   | `/products`      | Admin | Create product (multipart/form-data)  |
| GET    | `/products`      | No\*  | List with pagination/search/filter    |
| GET    | `/products/:id`  | No    | Get product by ID                     |
| PUT    | `/products/:id`  | Admin | Update product                        |
| DELETE | `/products/:id`  | Admin | Delete product                        |

\* Auth is optional — if authenticated, search queries are tracked for recommendations.

**Query params:** `page`, `limit`, `search`, `category`

#### Cart

| Method | Endpoint           | Auth | Description           |
| ------ | ------------------ | ---- | --------------------- |
| POST   | `/cart`            | Yes  | Add item to cart      |
| GET    | `/cart`            | Yes  | Get user cart         |
| DELETE | `/cart/:productId` | Yes  | Remove item from cart |

#### Orders

| Method | Endpoint  | Auth | Description                   |
| ------ | --------- | ---- | ----------------------------- |
| POST   | `/orders` | Yes  | Place order (from cart)       |
| GET    | `/orders` | Yes  | Get user's order history      |

#### Reports (Admin)

| Method | Endpoint           | Auth  | Description                        |
| ------ | ------------------ | ----- | ---------------------------------- |
| GET    | `/reports/summary` | Admin | Total orders, revenue, top products|

#### Recommendations

| Method | Endpoint           | Auth | Description                          |
| ------ | ------------------ | ---- | ------------------------------------ |
| GET    | `/recommendations` | Yes  | Personalized product recommendations |

---

## Recommendation Engine

The recommendation engine uses a **rule-based, 4-tier priority system**:

1. **Purchased Categories** – Products from categories the user has previously purchased from
2. **Frequent Searches** – Products matching the user's most-searched keywords
3. **Recent Searches** – Products matching the user's most recent search keywords
4. **Top Sellers / Newest** – Fallback: best-selling products, then newest products

No machine learning. No external APIs. Fully explainable logic.

---

## Deployment

| Service  | Recommended Platform |
| -------- | -------------------- |
| Backend  | Render / Railway     |
| Frontend | Vercel               |
| Database | MongoDB Atlas        |

Both `backend/Dockerfile` and `frontend/Dockerfile` are included for containerized deployment.

**Deployment checklist:**
1. Set all environment variables in your deployment platform
2. Update `NEXT_PUBLIC_API_URL` to point to the deployed backend URL
3. Update `FRONTEND_URL` to the deployed frontend URL (for CORS)
4. Use a MongoDB Atlas connection string for `MONGODB_URI`
5. Set strong, unique values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`

---

## License

MIT
