# CropLens Frontend: Next.js Implementation Walkthrough

We have successfully built a premium, role-based frontend for the **CropLens (SmartSeason) Monitoring System**. The application is designed to be intuitive, visually stunning, and strictly governed by user roles.

## 🎨 Design & Aesthetic
- **Glassmorphism**: We used backdrop blurs and semi-transparent layers for a modern, high-end feel.
- **Brand Palette**: Deep Greens (#16A34A, #062D14) chosen to represent agricultural growth and professional stability.
- **Typography**: **Poppins** integrated throughout for a clean, tech-forward reading experience.
- **Animations**: Subtle `animate-in` transitions for page entries and hover effects on all interactive cards.

## 🏗️ Architecture
- **Framework**: Next.js 16 (App Router) with Tailwind CSS v4.
- **Auth Management**: `AuthContext` provides global access to the current user, role, and auth status.
- **Service Layer**: Dedicated services in `src/lib/services` decouple API logic from UI components.
- **Route Protection**: Automatic redirection to `/login` if no session is found, and `403` handling for restricted pages.

## 🚀 Key Features

### 1. Unified Dashboard
- **Admin View**: Global metrics across all fields and agents. Includes a quick overview of "At Risk" fields.
- **Agent View**: Summary of personally assigned fields and immediate access to log progress updates.

### 2. Field Management
- **Creation**: Admins can create fields and assign them to specific agents via a sleek dialog.
- **Monitoring**: Real-time status badges (Active, At Risk, Completed) based on the backend's computed logic.
- **Updates**: Agents can log progress with stage selection (Growing, Ready, etc.) and observational notes.

### 3. User Administration
- **Directory**: A searchable table of all staff members.
- **Role Assignment**: Admins can register new staff as either "Administrator" or "Field Agent".

## 🛠️ How to Run
1. Ensure the Laravel backend is running at `http://localhost:8000`.
2. In the `frontend/next-app` directory, run:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` and login with:
   - **Admin**: `admin@test.com` / `password`
   - **Agent**: `agent@test.com` / `password`

---

> [!TIP]
> **Next Steps**: We can now proceed to build the **React.js** version (Vite-based) or focus on mobile-specific enhancements for the Next.js app.
