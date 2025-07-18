# Frontend Application

This is a React + TypeScript frontend application with TailwindCSS and React Query for state management.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductForm.tsx  # Product creation/editing form
│   ├── ProductList.tsx  # Product list with search and actions
│   ├── ProtectedRoute.tsx # Route protection component
│   └── index.ts        # Component exports
├── views/              # Page-level components
│   ├── LoginPage.tsx   # Login page
│   ├── Dashboard.tsx   # Main dashboard
│   └── index.ts        # View exports
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── utils/              # Utility functions
├── api.ts              # API client configuration
├── ollamaApi.ts        # Ollama API client
├── types/              # TypeScript type definitions
│   └── index.ts        # Type exports
└── App.tsx             # Main application component
```

## Features

- **Authentication**: Token-based authentication with sessionStorage
- **Product Management**: CRUD operations for products
- **Search & Filter**: Search products by name or tags
- **Responsive Design**: Mobile-first design with TailwindCSS
- **State Management**: React Query for server state management
- **Type Safety**: Full TypeScript support

## Components

### Views
- **LoginPage**: Handles user authentication
- **Dashboard**: Main application interface

### Components
- **ProductList**: Displays products with search, filtering, and actions
- **ProductForm**: Modal form for creating/editing products
- **ProtectedRoute**: Route protection for authenticated users

### Hooks
- **useAuth**: Authentication state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   VITE_API_HOST=http://localhost:3000/api/v1
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The application follows React best practices:
- Component composition and reusability
- Custom hooks for logic extraction
- TypeScript for type safety
- React Query for server state management
- TailwindCSS for styling
