# CropLens: Smart Season Field Monitoring System

CropLens is a dual-frontend agricultural management system designed to monitor field growth, manage agent assignments, and provide real-time agricultural analytics. This repository features two distinct frontend implementations (Next.js and React SPA) connected to a unified Laravel API.

## 🚀 Project Overview

The system is designed to bridge the gap between agricultural administrators and field agents. It provides a "Command Center" for admins to oversee operations and a "Field Toolkit" for agents to log progress updates on the move.

---

## 🏛️ Architectural Choice: Dual-Frontend Strategy

This project was intentionally built using two different frontend technologies to demonstrate versatility and specific use-case optimizations.

### Option 1: Next.js (The Primary Choice)
**Why it was chosen first:** Next.js was selected as the foundational frontend due to its robust ecosystem, built-in optimization, and hybrid rendering capabilities.
- **Advantages:**
  - **SEO & Performance:** Superior server-side rendering (SSR) for fast initial loads.
  - **File-based Routing:** Simplifies complex navigation structures.
  - **Image Optimization:** Automated handling of high-resolution agricultural site images.
- **Disadvantages:**
  - Higher initial complexity compared to a standard SPA.
  - Requires more specific server configuration for deployment (e.g., Vercel or Node server).

### Option 2: React Vite SPA (The Second Choice)
**Why it was chosen second:** A standalone React Single Page Application (SPA) was implemented to provide a lightweight, lightning-fast alternative specifically for internal monitoring dashboards.
- **Advantages:**
  - **Speed:** Extremely fast client-side transitions after the initial load.
  - **Simplicity:** Easier to deploy as static files to any CDN or basic web server.
  - **State Management:** Deep integration with React Query for real-time background data synchronization.
- **Disadvantages:**
  - Client-side only rendering (not ideal for public-facing SEO content).
  - Large initial bundle size compared to optimized Next.js pages.

---

## ✨ Core Features

- **Authenticated Dashboard:** Personalized welcome screens and role-based metrics.
- **Field Management:** Full CRUD operations for field units, including crop tracking and planting dates.
- **Real-time Analytics:** Interactive growth distribution charts and seasonal status reports.
- **Agent Assignment:** Admin capability to delegate specific fields to agents.
- **Progress Logging:** Historical update tracking with notes and growth stage transitions.
- **Dual-Mode UI:** Premium Dark/Light mode support with glassmorphism design.

---

## 🛠️ Setup Instructions

### 1. Backend Configuration (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure your DB in .env then:
php artisan migrate --seed
php artisan serve # Runs on http://localhost:8000
```

### 2. Next.js Frontend
```bash
cd frontend/next-app
npm install
npm run dev # Runs on http://localhost:3000
```

### 3. React SPA Frontend
```bash
cd frontend/react-app
npm install
npm run dev # Runs on http://localhost:5173
```

---

## 🎨 Design Decisions & Assumptions

### Design Decisions
- **Brand Identity:** Used `brand-green` (#16A34A) and `brand-dark` (#062D14) to evoke a sense of organic growth and professional stability.
- **Shadcn UI:** Leveraged headless UI components for accessibility and a premium, state-of-the-art aesthetic.
- **Glassmorphism:** Implemented semi-transparent surfaces to give the application a modern, "App-like" feel.

### Assumptions Made
- **API Availability:** The application assumes the backend is running at `http://localhost:8000/api`.
- **User Roles:** We assume two primary user roles: `admin` (management focus) and `agent` (operations focus).
- **Update Frequency:** We assume field agents will update crop status at least once every 7 days; otherwise, the system flags the field as "At Risk."

---

##  Live links Credentials
Nexy js application :https://smart-season-field-monitoring-syste-orpin.vercel.app/login

React SPA application:
https://crop-lens.vercel.app/login

##  Demo Credentials

Use these credentials to explore the system during the demonstration:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@test.com` | `password` |
| **Field Agent** | `agent@test.com` | `password` |

---

# SmartSeason Backend: End-to-End Testing Sequence

Follow these steps in order to verify that all components (Auth, RBAC, Fields, and Computed Logic) are working correctly using Postman.

---

## Phase 1: Admin Setup & Management

### 1. Authenticate as Admin
- **Endpoint**: `POST /api/login`
- **Body (JSON)**:
  ```json
  {
      "email": "admin@test.com",
      "password": "password"
  }
  ```
- **Action**: Copy the `token` value from the response. 
- **Next Step**: In Postman, go to the **Authorization** tab, select **Bearer Token**, and paste the token.

### 2. Verify Initial Dashboard (Empty)
- **Endpoint**: `GET /api/dashboard/stats`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Expected Result**: `total_fields` should be `0` (or `2` if you ran the seeder manually with data).

### 3. [NEW] Create a New User (Admin or Agent)
- **Endpoint**: `POST /api/users`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Body (JSON)**:
  ```json
  {
      "name": "Jane Agent",
      "email": "jane@example.com",
      "password": "Password123!",
      "password_confirmation": "Password123!",
      "role": "agent" 
  }
  ```
  *(Change `role` to `"admin"` if you want to create another coordinator).*

### 4. Fetch Agents List
- **Endpoint**: `GET /api/agents`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Expected Result**: A list of users with the `agent` role. Note the `id` of the user you just created.

### 5. Create a New Field
- **Endpoint**: `POST /api/fields`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Body (JSON)**:
  ```json
  {
      "name": "Central Valley Field",
      "crop_type": "Corn",
      "planting_date": "2024-04-20",
      "assigned_agent_id": 2
  }
  ```
- **Action**: Note the `id` of the created field (e.g., `1`).

---

## Phase 2: Field Agent Workflow

### 1. Authenticate as Agent
- **Endpoint**: `POST /api/login`
- **Body (JSON)**:
  ```json
  {
      "email": "agent@test.com",
      "password": "password"
  }
  ```
- **Action**: Copy the **agent's** `token` and update your Postman Authorization tab.

### 2. View Assigned Fields
- **Endpoint**: `GET /api/fields`
- **Headers**: `Authorization: Bearer <AGENT_TOKEN>`
- **Expected Result**: Only the "Central Valley Field" should appear.

### 3. Log a Growth Update
- **Endpoint**: `POST /api/fields/1/updates`
- **Headers**: `Authorization: Bearer <AGENT_TOKEN>`
- **Body (JSON)**:
  ```json
  {
      "stage": "Growing",
      "notes": "First signs of sprouting after the rain."
  }
  ```
- **Expected Result**: `201 Created`.

---

## Phase 3: Verification & Analytics

### 1. Verify Status Update (Admin View)
- **Endpoint**: `GET /api/fields/1`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>` (Switch back to Admin token)
- **Expected Result**: The field `stage` should now be `Growing`, and the `status` should be `Active`.

### 2. Verify Dashboard Insight
- **Endpoint**: `GET /api/dashboard/stats`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Expected Result**: 
  - `total_fields`: `1`
  - `fields_per_stage`: `{"Growing": 1}`
  - `fields_per_status`: `{"Active": 1}`

---

## Troubleshooting Tips

> [!IMPORTANT]
> **Authentication**: If you get a `401 Unauthorized`, ensure your **Bearer Token** is correctly set in the Authorization header.
>
> **Permissions**: If you get a `403 Forbidden`, you are likely trying to perform an Admin action (like creating a user) with an Agent token.
>
> **Data Integrity**: If a field shows `At Risk`, it means either the `planting_date` is very old or no updates have been logged for 7+ days. Log a new update to return it to `Active` status.


© 2026 CropLens Systems • Smart Season Field Monitoring
