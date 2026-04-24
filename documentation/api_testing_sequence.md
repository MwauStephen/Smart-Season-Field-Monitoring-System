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
