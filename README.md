# DRM App

A Next.js application.

## Features

-   Next.js 15.2.1 with App Router
-   TypeScript
-   Tailwind CSS for styling
-   Server-side rendering with proper cookie handling
-   Drizzle ORM for database management and migrations

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env.local` file based on `.env.local.example` and add your Database credentials:
    ```
    DATABASE_URL=your-database-url
    ```
4. Initialize the database schema and migrations:
    ```bash
    npm run db:init
    ```
5. Run the development server:
    ```bash
    npm run dev
    ```

## Database Migrations

This project uses Drizzle ORM to manage database schemas and migrations:

1. Initialize the migration system (first time only):
    ```bash
    npm run db:init
    ```

2. Generate migrations from schema changes:
    ```bash
    npm run db:generate
    ```

3. Apply migrations to your database:
    ```bash
    npm run db:migrate
    ```

4. Generate and apply migrations in one step:
    ```bash
    npm run db:migrate:run
    ```

5. For development/prototyping (bypasses migration files):
    ```bash
    npm run db:push
    ```

6. View and manage your database with Drizzle Studio:
    ```bash
    npm run db:studio
    ```

## Folder Structure

-   `/app` - Next.js App Router pages and layouts
-   `/components` - React components
-   `/lib` - Utility functions
-   `/lib/drizzle` - Database schema and Drizzle ORM setup
