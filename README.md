# Express API with Postgree (TypeScript + Docker)

This project is a RESTful API built with **Express**, **Postgres**, and **TypeScript**.
It includes a **Docker Compose** configuration for running Postgres locally and provides a ready-to-use Postman collection in YAML format for API testing.

---

## Requirements

Before starting, make sure you have installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker & Docker Compose](https://www.docker.com/)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/danbasco/express-api-postgresql.git
   cd express-api-postgresql
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   * Copy the example environment file:

     ```bash
     cp .env.example .env
     ```
   * Edit `.env` to include your JWT secret:

     ```env
      POSTGRES_USER=postgres
      POSTGRES_PASSWORD=postgres
      POSTGRES_DATABASE=postgres
      POSTGRES_HOST=localhost
      POSTGRES_PORT=5432
      JWT_SECRET=your_generated_secret
     ```
   * You can generate a secure key with:

     ```bash
     npm run generate-secret-key
     ```

---

## Run MongoDB with Docker Compose

Start the local database containers:

```bash
npm run start:database
```

This command will:

* Start a **Postgres** container at `localhost:5432`
* Start **PGAdmin** (web UI) at [http://localhost:5050](http://localhost:5050)


To stop the containers:

```bash
docker compose down
```

---

## Run the API Locally

Start the API in development mode:

```bash
npm run dev
```

Or run the compiled version:

```bash
npm run build
npm start
```

By default, the server runs on:

```
http://localhost:3000
```

---

## API Testing

You can test all API routes using Postman, Hoppscotch or Insomnia.

1. Open the file:

   ```
   requests/requests.yaml
   ```
2. Import it into Postman to view all available endpoints.

---

## Deployment

This project includes a **Vercel** configuration file (`vercel.json`) for deployment.
To deploy:

```bash
vercel
```

Vercel will automatically detect the entry point (`api/index.ts`) and deploy it as a serverless function.

---

## Scripts Overview

| Script                        | Description                              |
| ----------------------------- | ---------------------------------------- |
| `npm run dev`                 | Run API in watch mode using `tsx`        |
| `npm start`                   | Start the compiled API                   |
| `npm run build`               | Compile TypeScript to JavaScript         |
| `npm run start:database`      | Run PostgreSQL and PGAdmin via Docker    |
| `npm run generate-secret-key` | Generate a random 32-byte JWT secret     |
| `npm test`                    | Run tests (placeholder)                  |

---

# CRUD

The Books feature provides a personal reading-list resource scoped to authenticated users.

## Overview
Users can create and manage their personal library to track reading progress and organize books.

## Key features
- Create, read, update (PUT/PATCH) and delete books.
- Track reading status (e.g. "reading", "finished", "on list").
- Store metadata: title, author, description, genres, status.
- All records are scoped to the authenticated user.

## Endpoints (summary)
- POST /books — create a book
- GET /books — list books (supports filtering and searching)
- GET /books/:id — retrieve a single book (user-scoped)
- PUT /books/:id — replace a book
- PATCH /books/:id — partial update
- DELETE /books/:id — remove a book

## Filtering & Searching
- Title and author: partial match, case-insensitive
- Genre and status: exact match (case-insensitive)
- Results always restricted to the requesting user's books

## Notes
- Validation enforced on create/update; PATCH accepts partial payloads.
- Genres are normalized for consistent storage and filtering.


## Additional Information

* TypeScript improves code maintainability and type safety.
* Docker Compose ensures consistent local database setup.
* PGAdmin allows you to visually explore your database.

---

## Tutorial Video

A complete walkthrough of the project API and usage is available here:
- [REGISTER/LOGIN](https://youtu.be/MPKciL0R5kQ)
- [CRUD USAGE](https://youtu.be/-m9l17gpwjM)

---
