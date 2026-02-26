# Full-Stack E-Commerce System

A production-ready simplified e-commerce system built with Express.js + TypeScript (backend) and Next.js + TypeScript (frontend), with MongoDB as the database.

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

---

## Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Backend  | Node.js, Express.js, TypeScript         |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Database | MongoDB + Mongoose                      |
| Auth     | JWT (access + refresh), bcryptjs        |
| Upload   | multer (local `/uploads` directory)     |
| Testing  | Jest, Supertest, mongodb-memory-server  |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Environment config & DB connection
│   │   ├── models/          # Mongoose models (User, Product, Category, Cart, Order, SearchHistory)
│   │   ├── middleware/      # Auth middleware, multer upload config
│   │   ├── controllers/     # Business logic for all endpoints
│   │   ├── routes/          # Express route definitions
│   │   ├── types/           # TypeScript interfaces
│   │   ├── __tests__/       # Jest test suites
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API client, auth context, design tokens
│   │   └── types/           # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
├── Code_Instructions.md
└── UI_Instructions.md
```

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd Preneur-Lab
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-jwt-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm run build
npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

### 4. Run tests

```bash
cd backend
npm test
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                  | Default                                  |
| -------------------- | ---------------------------- | ---------------------------------------- |
| `PORT`               | Server port                  | `5000`                                   |
| `MONGODB_URI`        | MongoDB connection string    | `mongodb://localhost:27017/ecommerce`    |
| `JWT_SECRET`         | Access token signing secret  | —                                        |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | —                                        |
| `JWT_EXPIRES_IN`     | Access token TTL             | `15m`                                    |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL        | `7d`                                     |
| `NODE_ENV`           | Environment                  | `development`                            |

### Frontend (`frontend/.env.local`)

| Variable               | Description       | Default                   |
| ---------------------- | ----------------- | ------------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend base URL  | `http://localhost:5000`   |

---

## API Documentation

### Authentication

| Method | Endpoint               | Auth | Description                |
| ------ | ---------------------- | ---- | -------------------------- |
| POST   | `/auth/register`       | No   | Register a new user        |
| POST   | `/auth/login`          | No   | Login, returns tokens      |
| POST   | `/auth/refresh-token`  | No   | Refresh access token       |
| POST   | `/auth/logout`         | Yes  | Logout, clear refresh token |

**Register** `POST /auth/register`
```json
{ "name": "John", "email": "john@example.com", "password": "password123" }
```

**Login** `POST /auth/login`
```json
{ "email": "john@example.com", "password": "password123" }
```
Returns: `{ user, accessToken, refreshToken }`

---

### Categories

| Method | Endpoint               | Auth  | Description          |
| ------ | ---------------------- | ----- | -------------------- |
| POST   | `/categories`          | Admin | Create category      |
| GET    | `/categories`          | No    | List all categories  |
| GET    | `/categories/:slug`    | No    | Get by slug          |
| PUT    | `/categories/:id`      | Admin | Update category      |
| DELETE | `/categories/:id`      | Admin | Delete category      |

---

### Products

| Method | Endpoint            | Auth  | Description                          |
| ------ | ------------------- | ----- | ------------------------------------ |
| POST   | `/products`         | Admin | Create product (multipart/form-data) |
| GET    | `/products`         | No*   | List with pagination/search/filter   |
| GET    | `/products/:id`     | No    | Get product by ID                    |
| PUT    | `/products/:id`     | Admin | Update product                       |
| DELETE | `/products/:id`     | Admin | Delete product                       |

\* Auth is optional on GET `/products` — if authenticated, search queries are tracked for recommendations.

**Query parameters:** `page`, `limit`, `search`, `category`

---

### Cart

| Method | Endpoint              | Auth | Description            |
| ------ | --------------------- | ---- | ---------------------- |
| POST   | `/cart`               | Yes  | Add item to cart       |
| GET    | `/cart`               | Yes  | Get user cart          |
| DELETE | `/cart/:productId`    | Yes  | Remove item from cart  |

---

### Orders

| Method | Endpoint   | Auth | Description                    |
| ------ | ---------- | ---- | ------------------------------ |
| POST   | `/orders`  | Yes  | Place order (from cart)        |
| GET    | `/orders`  | Yes  | Get user's order history       |

---

### Reports (Admin)

| Method | Endpoint            | Auth  | Description                         |
| ------ | ------------------- | ----- | ----------------------------------- |
| GET    | `/reports/summary`  | Admin | Total orders, revenue, top products |

---

### Recommendations

| Method | Endpoint            | Auth | Description                           |
| ------ | ------------------- | ---- | ------------------------------------- |
| GET    | `/recommendations`  | Yes  | Personalized product recommendations  |

---

## Recommendation Engine Logic

The recommendation engine uses a **rule-based, 4-tier priority system**:

1. **Purchased Categories** – Products from categories the user has previously purchased from
2. **Frequent Searches** – Products matching the user's most-searched keywords
3. **Recent Searches** – Products matching the user's most recent search keywords
4. **Top Sellers / Newest** – Fallback: best-selling products, then newest products

No machine learning. Fully explainable logic.

---

## Testing

Tests use **mongodb-memory-server** for isolated in-memory database testing.

```bash
cd backend
npm test
```

Test suites:
- **Auth tests** – Register, login, token refresh, logout
- **Product CRUD tests** – Create, read, update, delete products (admin)
- **Order flow tests** – Cart → order placement → stock deduction

---

## Deployment

| Service  | Platform          |
| -------- | ----------------- |
| Backend  | Render / Railway  |
| Frontend | Vercel            |
| Database | MongoDB Atlas     |

### Backend Dockerfile

See `backend/Dockerfile` for containerized deployment.

### Environment

- Set all environment variables in your deployment platform
- Update `NEXT_PUBLIC_API_URL` to point to the deployed backend URL
- Use MongoDB Atlas connection string for `MONGODB_URI`

---

## Default Admin Account

There is no seeded admin account. To create an admin:

1. Register a normal user via the API or frontend
2. Update the user's role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## License

MIT
