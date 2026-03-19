# Inventory Management System

A full-stack inventory management application built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

The system provides inventory tracking, order management, customer/revenue dashboard views, and product value insights.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Summary](#api-summary)
- [Sample Data Files](#sample-data-files)
- [Troubleshooting](#troubleshooting)

## Project Overview

This repository contains:

- **Frontend app** (`e-commerce-inventory-system/`): React UI, routing, charts, and inventory/order screens.
- **Backend API** (`Server/`): Express REST API with MongoDB persistence for products and orders.
- **Root workspace**: convenience scripts and shared repository metadata.

## Tech Stack

### Frontend

- React 18
- Vite
- Material UI (MUI)
- React Router
- ApexCharts
- Axios

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- cors

## Repository Structure

```text
Inventory_Management_System/
├── README.md
├── package.json
├── Server/
│   ├── index.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── e-commerce-inventory-system/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── test.products.csv
└── test.orders.csv
```

## Getting Started

### Prerequisites

- Node.js (project contains engine hints for Node 16.x and 20.x in subprojects)
- npm
- A MongoDB instance (local or MongoDB Atlas)

### 1) Clone and install dependencies

From the repository root:

```bash
npm install
npm install --prefix Server
npm install --prefix e-commerce-inventory-system
```

### 2) Configure environment variables (backend)

Create a `.env` file in `Server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> Recommended: keep `MONGO_URI` in `.env` and avoid hardcoding credentials.

### 3) Run the application

Run backend and frontend in separate terminals:

**Terminal A (Backend):**

```bash
npm run dev --prefix Server
```

**Terminal B (Frontend):**

```bash
npm run dev --prefix e-commerce-inventory-system
```

Default URLs:

- Frontend: `http://localhost:5173` (Vite default)
- Backend: `http://localhost:5000`

## Available Scripts

### Root (`/`)

- `npm start` – starts frontend and backend concurrently (uses repository scripts)
- `npm test` – placeholder script (no automated root tests configured)

### Backend (`/Server`)

- `npm start --prefix Server` – run server once with Node
- `npm run dev --prefix Server` – run server in watch mode with Nodemon
- `npm test --prefix Server` – placeholder script

### Frontend (`/e-commerce-inventory-system`)

- `npm run dev --prefix e-commerce-inventory-system` – start Vite dev server
- `npm run build --prefix e-commerce-inventory-system` – production build
- `npm run preview --prefix e-commerce-inventory-system` – preview production build
- `npm run lint --prefix e-commerce-inventory-system` – run ESLint

## API Summary

Base API URL: `http://localhost:5000`

### Health / Welcome

- `GET /` – welcome message

### Product endpoints

- `GET /api/products` – list all products
- `POST /api/products` – add a new product
- `GET /api/products/total-value` – get total inventory value

### Order endpoints

- `POST /api/orders` – create order
- `GET /api/orders` – list all orders
- `GET /api/orders/:id` – get order by ID
- `PUT /api/orders/:id` – update order
- `DELETE /api/orders/:id` – delete order

## Sample Data Files

The repository includes CSV files that can be used for manual testing or imports:

- `test.products.csv`
- `test.orders.csv`

## Troubleshooting

- If frontend lint/build commands fail with `eslint: not found` or `vite: not found`, install frontend dependencies:

  ```bash
  npm install --prefix e-commerce-inventory-system
  ```

- If backend fails to connect to MongoDB, verify `Server/.env` values (`MONGO_URI`, `PORT`) and network access to your MongoDB instance.
