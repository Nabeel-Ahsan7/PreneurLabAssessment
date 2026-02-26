

# Full-stack E-Commerce System

## ROLE & EXPECTATIONS

You are a **senior full-stack engineer and system architect**.
You must design and implement a **production-ready simplified e-commerce system** using **clean architecture, TypeScript, best practices, and explainable logic**.

AI-generated code **must be readable, modular, and easy to explain**.
Avoid over-engineering. Avoid unnecessary libraries.

---

## CORE GOAL

Build a **full-stack e-commerce system** with:

* Authentication (JWT: Access + Refresh tokens)
* Role-based authorization (user/admin)
* Product management with images
* Category system (many-to-many)
* Cart system
* Order placement
* Reporting
* Rule-based recommendation engine
* Next.js frontend
* Express backend
* MongoDB (single database)

The project **must run locally without errors**.

---

## TECH STACK (MANDATORY)

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* JWT (Access + Refresh tokens)
* bcrypt
* multer (image upload)
* local `/uploads`

### Frontend

* Next.js
* TypeScript
* Fetch or Axios
* JWT storage (localStorage or cookies)

---

## SYSTEM ARCHITECTURE

```
Frontend (Next.js + TS)
        |
        | REST API (JWT)
        |
Backend (Express + TS)
        |
MongoDB (Users, Products, Categories, Carts, Orders, Searches)
```

Frontend handles **UI only**
Backend handles **ALL business logic**

---

## DATABASE MODELS (MANDATORY)

### User

```ts
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'user' | 'admin',
  purchasedProducts: ObjectId[]
}
```

---

### Category

```ts
{
  name: string,
  slug: string (unique),
  createdAt: Date
}
```

---

### Product

```ts
{
  name: string,
  price: number,
  stock: number,
  description: string,
  images: string[],
  categories: ObjectId[]
}
```

---

### Cart

```ts
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: number
    }
  ]
}
```

---

### Order

```ts
{
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      quantity: number,
      price: number
    }
  ],
  totalAmount: number,
  createdAt: Date
}
```

---

### SearchHistory

```ts
{
  user: ObjectId,
  keyword: string,
  count: number,
  lastSearchedAt: Date
}
```

---

## AUTHENTICATION REQUIREMENTS

### Endpoints

```
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
```

### Rules

* Hash passwords using bcrypt
* Generate **Access Token (short-lived)**
* Generate **Refresh Token (long-lived)**
* Middleware:

  * `authMiddleware`
  * `adminMiddleware`

---

## PRODUCT MANAGEMENT (ADMIN ONLY)

```
POST    /products        (multipart/form-data)
GET     /products        (pagination + search + category filter)
GET     /products/:id
PUT     /products/:id
DELETE  /products/:id
```

### Rules

* Validate inputs
* Images uploaded via multer
* Store image URLs only
* Products can belong to multiple categories

---

## CATEGORY MANAGEMENT

```
POST    /categories      (admin)
GET     /categories
GET     /categories/:slug
PUT     /categories/:id  (admin)
DELETE  /categories/:id  (admin)
```

---

## CART SYSTEM (USER)

```
POST   /cart
GET    /cart
DELETE /cart/:productId
```

### Rules

* One cart per user
* If product exists → increase quantity
* Quantity ≤ product stock

---

## ORDER SYSTEM

```
POST /orders
```

### Order Logic

1. Fetch user cart
2. Validate stock
3. Deduct product stock
4. Create order
5. Save purchased products to user
6. Clear cart

---

## REPORTING (ADMIN)

```
GET /reports/summary
```

### Returns

* Total orders
* Total revenue
* Top 3 best-selling products

Use **MongoDB aggregation**
No hardcoded values

---

## RECOMMENDATION ENGINE (RULE-BASED)

```
GET /recommendations
```

### Recommendation Priority

1. Products from categories user purchased
2. Products matching frequent searches
3. Products matching recent searches
4. Top-selling products (fallback)

### Constraints

* No machine learning
* No external APIs
* Fully explainable logic

---

## FRONTEND REQUIREMENTS

### Pages

* Register
* Login
* Product List (pagination + category filter)
* Cart
* Admin Panel (protected)

### Rules

* Protect admin routes
* Store tokens securely
* Handle API errors gracefully
* Simple UI is sufficient

---

## DEPLOYMENT REQUIREMENTS

* Backend: Render / Railway
* Frontend: Vercel
* MongoDB Atlas
* `.env` for secrets
* Dockerfile (backend or both)

---

## TESTING

* Jest + Supertest
* Auth tests
* Product CRUD tests
* Order flow test

---

## DOCUMENTATION OUTPUT

Generate:

* README.md
* Setup instructions
* Environment variables list
* API documentation
* Postman collection
* AI usage prompt log

---

## CODING RULES

* Use TypeScript everywhere
* Modular folder structure
* Clear naming
* No unused code
* No unnecessary dependencies
* Must be explainable line-by-line

---

## FINAL INSTRUCTION

Before coding:

1. Plan folder structure
2. Define models
3. Define middleware
4. Define routes
5. Implement controllers
6. Implement frontend pages
7. Add tests
8. Validate local run

**Do NOT skip steps.
Do NOT hallucinate APIs.
Do NOT break architecture.**

