# SmartSeason Backend (CropLens) Walkthrough

The backend for the **SmartSeason Field Monitoring System** (CropLens) is now fully implemented and ready for frontend integration. This system provides a robust API for managing agricultural fields, tracking periodic updates from field agents, and generating real-time dashboard analytics.

## Key Backend Features

### 1. Role-Based Access Control (RBAC)
- **Admin (Coordinator)**: Full access to create, update, and delete fields. Can view all fields and updates across the system.
- **Field Agent**: Can view only their assigned fields and log updates (observations and stage changes) for those fields.
- **RoleMiddleware**: A custom middleware that restricts access based on user roles (`admin` or `agent`).

### 2. Field Management
- **Structured Tracking**: Fields store detailed information including name, crop type, planting date, and current lifecycle stage.
- **Assignment**: Admins can assign specific fields to specific agents for accountability.
- **Relationships**: A field belongs to a creator (Admin) and an assigned agent (Agent), and it has many updates.

### 3. Field Updates & History
- **Stage Progression**: Agents update field stages through a defined lifecycle: `Planted` → `Growing` → `Ready` → `Harvested`.
- **Observations**: Each update allows agents to add text-based notes/observations for context.
- **History Tracking**: The system maintains a complete audit trail of all updates made to each field.

### 4. Smart Computed Status (Logic)
The system automatically calculates a "Field Status" based on data patterns:
- **Completed**: If the stage is set to `Harvested`.
- **At Risk**: 
  - If no updates have been logged for more than **7 days**.
  - If a field remains in the initial state for more than **14 days** without any updates.
- **Active**: Normal progression with recent updates.

### 5. Multi-User Dashboards
- **Admin Dashboard**: High-level metrics showing total fields, stage breakdowns, status distributions, and recent system-wide updates.
- **Agent Dashboard**: A personalized view for agents showing their specific assigned workload and a status overview of their fields.

---

## Postman Testing Guide

### Prerequisites
1. Ensure the Laravel server is running: `php artisan serve` (typically at `http://localhost:8000`).
2. Add `Accept: application/json` to your request headers.
3. For protected routes, you'll need an authentication token (Sanctum).

### Authentication Setup
Since we use Laravel Sanctum for API tokens, you must authenticate to retrieve your `Bearer` token.

#### [POST] /api/login
**Body (JSON):**
```json
{
    "email": "admin@test.com",
    "password": "password"
}
```
**Response Sample:**
```json
{
    "message": "Authenticated",
    "token": "4|abc123xyz...", 
    "user": { "id": 1, "name": "Admin User", "role": "admin", ... }
}
```

---

### How to use the Token
For all endpoints below, you must include the token in the **Authorization** header as a **Bearer Token**:

**Header:** `Authorization: Bearer 4|abc123xyz...`

---

### Admin Endpoints

#### 1. Create a New Field
`POST /api/fields`
- **Role Requirement**: Admin
- **Payload**:
```json
{
    "name": "Northern Valley Corn",
    "crop_type": "Corn",
    "planting_date": "2024-04-15",
    "assigned_agent_id": 2
}
```
- **Expected Result**: `201 Created` with the field object.

#### 2. Get All Fields
`GET /api/fields`
- **Admin Result**: Returns all fields in the system.
- **Agent Result**: Returns only fields assigned to them.

---

### User Management Endpoints (Admin Only)

#### 1. Create a New User (Agent/Admin)
`POST /api/users`
- **Payload**:
```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "role": "agent"
}
```
- **Description**: Allows an admin to register new field agents or additional coordinators.

#### 2. List All Agents
`GET /api/agents`
- **Description**: Returns a list of all users with the `agent` role. Useful for assigning fields in the frontend.

#### 3. List All Admins
`GET /api/admins`
- **Description**: Returns a list of all users with the `admin` role. Useful for administrative overview.

---

### Agent Endpoints

#### 1. Log a Field Update
`POST /api/fields/{id}/updates`
- **Payload**:
```json
{
    "stage": "Growing",
    "notes": "Crops are looking healthy after the recent rain."
}
```
- **Expected Result**: `201 Created`. The parent field's stage will also be updated to "Growing".

#### 2. Get Field History
`GET /api/fields/{id}/updates`
- **Result Sample**:
```json
[
    {
        "id": 5,
        "stage": "Growing",
        "notes": "Crops are looking healthy after the recent rain.",
        "updater": { "name": "Agent User" },
        "created_at": "2024-04-21T10:00:00Z"
    }
]
```

---

### Dashboard Statistics

#### [GET] /api/dashboard/stats
**Admin Response Sample:**
```json
{
    "total_fields": 10,
    "fields_per_stage": {
        "Planted": 2,
        "Growing": 5,
        "Ready": 2,
        "Harvested": 1
    },
    "fields_per_status": {
        "Active": 7,
        "At Risk": 2,
        "Completed": 1
    },
    "recent_updates": [ ... ]
}
```

---

The Backend Is Complete WIth The Following Key Features
All core business logic defined in the SmartSeason assessment has been implemented:
- [x] Authentication & RBAC.
- [x] Field CRUD and Assignment.
- [x] Field Update Logging & History.
- [x] Computed status logic (Active, At Risk, Completed).
- [x] Dashboard stats APIs.

