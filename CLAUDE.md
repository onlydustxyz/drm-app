# Development Commands

-   `npm run dev`: Start development server
-   `npm run build`: Build the application for production
-   `npm run start`: Start production server
-   `npm run lint`: Run ESLint for code quality checks

# Code Style Guidelines

-   **Components**: Use PascalCase for component names, kebab-case for UI component files
-   **TypeScript**: Use strict mode, prefer explicit types over `any`
-   **Imports**: Sort imports by external → internal, group related imports
-   **Styling**: Use Tailwind CSS with the `cn` utility for conditional classes
-   **Client Components**: Mark with "use client" directive at the top of the file
-   **Props**: Define explicit interfaces for component props
-   **Errors**: Use try/catch blocks and proper error handling patterns
-   **UI Components**: Follow shadcn/ui patterns with React.forwardRef

# Project Structure

-   `/app`: Next.js App Router pages and routes
-   `/components`: Reusable UI components
-   `/lib`: Utility functions and services
-   `/hooks`: Custom React hooks
