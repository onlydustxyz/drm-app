# DRM App

A Next.js application with Supabase authentication.

## Features

-   Next.js 14 with App Router
-   TypeScript
-   Tailwind CSS for styling
-   Supabase Authentication
-   Server-side rendering with proper cookie handling

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env.local` file based on `.env.local.example` and add your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
4. Run the development server:
    ```bash
    npm run dev
    ```

## Authentication Flow

This application implements a secure authentication flow using Supabase:

1. Users can log in via the `/login` page
2. Upon successful authentication, they are redirected to the home page
3. A middleware ensures protected routes are only accessible to authenticated users
4. Authentication state is properly maintained using HTTP-only cookies and SSR

## Important Notes

-   The application follows best practices for cookie handling and authentication as recommended by Supabase
-   Authentication is maintained via server-side cookies using the `@supabase/ssr` package
-   The middleware refreshes authentication tokens automatically

## Folder Structure

-   `/app` - Next.js App Router pages and layouts
-   `/components` - React components
-   `/lib` - Utility functions, including Supabase clients
