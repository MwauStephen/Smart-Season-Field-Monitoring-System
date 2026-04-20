# Authorization Architecture & API Testing Guide

## Part 1: Architectural Decisions
During the design of the SmartSeason Field Monitoring System backend, a conscious architectural decision was made to use **Role-Based Data Scoping and Inline Access Checks** instead of integrating popular third-party tools like **Spatie Laravel-Permission**.

### Why Not Spatie Laravel-Permission?
Spatie's package is an industry leader for deeply complex permission matrices where users require granular, dynamically changing permissions (e.g., `edit fields`, `view dashboard`, `delete users`) modeled directly in the database across 5 additional relational tables.

However, the provided technical requirements distinctly note:
> *"You do not need to over-engineer the solution. Keep it simple and functional."*

Integrating Spatie for a binary, static role system (Admin vs. Field Agent) violates this principle. It introduces unnecessary computational overhead, bloated database schemas, and heavier framework abstraction for a problem that can be cleanly solved natively.

### Why Inline Access Checks & Scoping?
Instead, we implemented a lightweight ENUM `role` column directly on the `users` table. 

1. **Simplicity and Speed**: By using simple controller-level logic (e.g., `if ($request->user()->role !== 'admin')`), we instantly guarantee security without the need for additional database lookups or eager-loading permission models.
2. **Role-Based Scoping**: Sharing endpoints between the Agent and Admin results in a unified API contract. We branch the internal Eloquent query (e.g. `$query->where('assigned_agent_id', $user->id)`) depending on the natively fetched user role. This prevents "Unauthorized" errors for agents legitimately visiting proper URLs but strictly bounds what they see to their assigned jurisdiction. 

This approach highlights an ability to utilize Laravel's native Eloquent querying and standard request handling to solve access control creatively, rather than relying unthinkingly on heavy external dependencies.

---

## Part 2: Testing with Postman
To test these features, you must serve the Laravel application.
Run your development server from the `backend/` directory:
```bash
php artisan serve
```
*This typically runs the API on `http://localhost:8000`*.

### 0. Authentication (Logging In)
Laravel Sanctum requires you to send credentials to the standard Breeze login endpoint, which sets stateful cookies, or you can interact dynamically. For simplicity in Postman, ensure "Accept: application/json" is in your Headers for all requests below. *(If your Laravel setup is strictly returning session tokens, Postman will automatically save cookies for `localhost` under the hood).*

- **URL**: `POST http://localhost:8000/login`
- **Headers**:
  - `Accept`: `application/json`
- **Body** (form-data or JSON):
  ```json
  {
      "email": "admin@test.com",
      "password": "password"
  }
  ```
*Repeat this using `agent@test.com` to test agent restrictions.*

### 1. Dashboard Stats
The endpoint automatically adapts what it returns based on who is logged in.
- **URL**: `GET http://localhost:8000/api/dashboard/stats`
- **Expected Admin Response**:
  ```json
  {
      "total_fields": 2,
      "fields_per_stage": {
          "Planted": 1,
          "Harvested": 1
      },
      "fields_per_status": {
          "Active": 1,
          "Completed": 1
      },
      "recent_updates": [...]
  }
  ```
- **Expected Agent Response**: Returns a scoped payload containing `assigned_fields` directly and a `status_overview` isolated only to fields they manage.

### 2. View Fields
- **URL**: `GET http://localhost:8000/api/fields`
- **Description**: If Admin, returns a JSON array of all existing fields. If Agent, strictly returns an array of fields assigned to them.
- **Expected Response**:
  ```json
  [
      {
          "id": 1,
          "name": "North Block",
          "crop_type": "Corn",
          "planting_date": "2026-04-10",
          "stage": "Planted",
          "status": "Active"
      }
  ]
  ```

### 3. Create a New Field (Admin Only)
- **URL**: `POST http://localhost:8000/api/fields`
- **Headers**: `Accept: application/json`
- **Body**: 
  ```json
  {
      "name": "East Block",
      "crop_type": "Wheat",
      "planting_date": "2026-04-20",
      "assigned_agent_id": 2
  }
  ```
- **Expected Response (Admin)**: `201 Created` with the new field JSON data.
- **Expected Response (Agent)**: `403 Forbidden` (`{"message": "Unauthorized"}`).

### 4. Update Field Stage via Log (Agent or Admin)
This endpoint handles both tracking a historical note and updating the base field stage.
- **URL**: `POST http://localhost:8000/api/fields/1/updates` (Replace `1` with an actual Field ID).
- **Body**:
  ```json
  {
      "stage": "Growing",
      "notes": "Sprouts look healthy."
  }
  ```
- **Description**: Verifies that the agent logged in is the one assigned to field `1`. If they are, it logs a new `FieldUpdate` instance and permanently advances the Field stage to "Growing".
- **Expected Response**:
  ```json
  {
      "id": 1,
      "field_id": 1,
      "updated_by": 2,
      "stage": "Growing",
      "notes": "Sprouts look healthy.",
      "created_at": "2026-04-20T12:00:00.000000Z"
  }
  ```

### 5. View Field Update History
- **URL**: `GET http://localhost:8000/api/fields/1/updates`
- **Description**: Returns all historical changes mapped to this specific field in descending chronological order.
- **Expected Response**:
  ```json
  [
      {
          "id": 1,
          "stage": "Growing",
          "notes": "Sprouts look healthy.",
          "updater": {
              "id": 2,
              "name": "Agent User"
          }
      }
  ]
  ```
