# CropLens Frontend Architecture Walkthrough

This guide provides a detailed explanation of the **Smart Season Field Monitoring System (CropLens)** frontend, built with the cutting-edge **Next.js 16**, **React 19**, Tailwind CSS 4, and Shadcn/UI.

---

## 1. Project Directory Structure

The application is structured within the `src/` directory to maintain a clean separation between code and configuration.

### `src/app/` (The Routing Engine)
This is the heart of the Next.js App Router. Each folder here represents a URL path.
- **`layout.tsx`**: The **Global Entry Point**. It wraps the entire app with `ThemeProvider` (for Dark Mode), `AuthProvider` (for security), and `Toaster` (for notifications).
- **`page.tsx`**: The landing/home page logic.
- **`login/`**: Handles user authentication and session initiation.
- **`dashboard/`**:
    - **`layout.tsx`**: Defines the "Protected Shell" (Sidebar + Header) shared by all dashboard pages.
    - **`page.tsx`**: The main overview with analytics charts and the Banner Carousel.
    - **`fields/`**: CRUD management for agricultural units.
    - **`users/`**: Admin-only panel for managing system access.
- **`not-found.tsx`**: Our custom "Field Lost in the Fog" error page.

### `src/components/` (Reusable UI)
Houses the building blocks of the interface.
- **`ui/`**: Low-level Shadcn primitives (Buttons, Cards, Tables, Dialogs).
- **`sidebar.tsx`**: The main navigation component with theme toggling.
- **`BannerCarousel.tsx`**: The premium sliding hero component with Framer Motion.
- **`ThemeProvider.tsx`**: Connects `next-themes` to our CSS variables.

### `src/context/` (State Management)
- **`AuthContext.tsx`**: A Global React Context that manages the user's login state, tokens, and role-based permissions (`isAdmin`). It ensures that only logged-in users can reach the dashboard.

### `src/lib/` (The Engine Room)
- **`api.ts`**: A pre-configured Axios instance that automatically attaches the Bearer Token to every request.
- **`services/`**: Encapsulates all backend API calls (e.g., `fieldService`, `userService`). This keeps the page components clean and focused only on the UI.
- **`utils.ts`**: Tailwind helper functions for conditional class merging.

### `src/types/` (TypeScript definitions)
- Centrally manages interfaces like `User`, `Field`, and `Stats`, ensuring type safety across the whole project.

---

## 2. Application Flow: From Entry to Dashboard

1. **Bootstrap (`src/app/layout.tsx`)**:
   When a user visits the site, the root layout initializes the `ThemeProvider`. It checks for saved theme preferences and applies the `.dark` class to the `<html>` tag if needed.

2. **Security Wall (`src/context/AuthContext.tsx`)**:
   The `AuthProvider` checks `localStorage` for a JWT token. 
   - If found, it validates the user via the `/api/user` endpoint.
   - If missing, it prevents access to the `/dashboard/*` routes via the `DashboardLayout`.

3. **Data Fetching (`src/lib/services/`)**:
   When the Dashboard loads, it triggers multiple API calls:
   - `stats`: Populates the Recharts visualizations.
   - `fields`: Populates the "Recent Fields" list and management tables.

4. **Premium Interactions**:
   - **Sonner**: When an action (like deleting a user) is performed, the service call notifies the UI, which triggers a Toast notification.
   - **Framer Motion**: As the user navigates, the sliding carousel and page transitions provide a high-end feel.

---

## 3. Design System
We use a **Green-Centric CSS Variable System** defined in `src/app/globals.css`. 
- **Light Mode**: Clean, airy, white backgrounds with subtle shadows.
- **Dark Mode**: Deep forest green backgrounds (`#062D14`) with glowing accents.

---

### Key Commands for Development
- `npm run dev`: Start the development server.
- `npm run build`: Generate the production-optimized bundle.
- `npm run lint`: Run code quality checks.
