# Technical Specification: Epic 4 - Administration and System Management

## 1. Overview and Scope

### 1.1. Overview

This document outlines the technical design for Epic 4: Administration and System Management. The primary goal is to create a secure and intuitive set of tools for administrators to manage the Sentiabot application's content and behavior. This includes a secure login, an interface to manage the knowledge base, and a way to modify the chatbot's core system prompt. This epic is critical for the long-term maintenance and quality assurance of the Sentiabot platform.

### 1.2. Objectives and Scope

**In Scope:**

-   **Story 4.1:** A secure login mechanism for administrators.
-   **Story 4.2:** A user interface for administrators to perform CRUD (Create, Read, Update, Delete) operations on the knowledge base entries.
-   **Story 4.3:** A user interface for administrators to view and update the chatbot's system prompt.
-   Backend APIs to support the above functionalities.
-   Restricting access to these features to authenticated administrators only.

**Out of Scope:**

-   Role management for users (i.e., promoting a student to an admin).
-   Bulk import/export of knowledge base content.
-   Versioning or history for system prompt changes.
-   User analytics or dashboards.

### 1.3. System Architecture Alignment

This epic will heavily leverage the existing architecture:

-   **Authentication:** Supabase Auth will be used to manage administrator accounts and secure the admin routes.
-   **Data Persistence:** Supabase PostgreSQL will store administrator credentials (managed by Supabase Auth), the `knowledge_base_entries` table, and a new `system_prompts` table.
-   **API Layer:** New RESTful API endpoints will be created using Next.js API Routes to handle admin-specific actions.
-   **Frontend:** The admin dashboard will be a new set of pages and components within the existing Next.js application, likely under an `/admin` route.

## 2. Detailed Design

### 2.1. Services and Modules

| Service/Module | Responsibilities | Inputs/Outputs | Owner |
| :--- | :--- | :--- | :--- |
| **Admin Authentication Service** | Handles admin login, logout, and session management. | **In:** Credentials. **Out:** JWT/Session token. | Backend |
| **Knowledge Base API** | Exposes CRUD operations for knowledge base entries. | **In:** Entry data. **Out:** JSON responses. | Backend |
| **System Prompt API** | Exposes read and update operations for the system prompt. | **In:** Prompt text. **Out:** JSON response. | Backend |
| **Admin Dashboard UI** | Provides the user interface for all admin functionalities. | **In:** User interactions. **Out:** API requests. | Frontend|

### 2-2. Data Models

This epic introduces one new table and heavily interacts with an existing one.

| Table | Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`knowledge_base_entries`**| `id` | `UUID` | `PK` | Unique identifier for the entry. |
| | `title` | `text` | `NOT NULL` | The title of the knowledge base entry. |
| | `content` | `text` | `NOT NULL` | The main body of the content. |
| | `embedding` | `vector` | | Vector embedding for semantic search. |
| | `subject` | `text` | | The subject category (e.g., "Biology"). |
| | `grade_level` | `text` | | The target grade level. |
| | `source_url` | `text` | | The URL for the source of the information. |
| **`system_prompts`** | `id` | `UUID` | `PK` | Unique identifier for the prompt. |
| | `name` | `text` | `UNIQUE, NOT NULL`| A unique name for the prompt (e.g., "main_prompt").|
| | `prompt_text` | `text` | `NOT NULL` | The actual text of the system prompt. |
| | `updated_at` | `timestamp`| `NOT NULL` | Timestamp of the last update. |

### 2.3. APIs and Interfaces

New API endpoints will be added under the `/api/admin` scope.

-   **`POST /api/admin/login`**: Authenticates an administrator.
-   **`GET /api/admin/knowledge-base`**: Lists all knowledge base entries.
-   **`POST /api/admin/knowledge-base`**: Creates a new knowledge base entry.
-   **`PUT /api/admin/knowledge-base/{id}`**: Updates an existing knowledge base entry.
-   **`DELETE /api/admin/knowledge-base/{id}`**: Deletes a knowledge base entry.
-   **`GET /api/admin/system-prompt`**: Retrieves the current system prompt.
-   **`PUT /api/admin/system-prompt`**: Updates the system prompt.

### 2.4. Workflows and Sequencing

**Admin Login:**
1.  Admin navigates to `/admin/login`.
2.  Enters credentials.
3.  Frontend sends credentials to `POST /api/admin/login`.
4.  Backend verifies credentials with Supabase Auth.
5.  On success, a session is created, and the admin is redirected to `/admin/dashboard`.

**Knowledge Base Management:**
1.  Admin navigates to `/admin/knowledge-base`.
2.  Frontend calls `GET /api/admin/knowledge-base` to display entries.
3.  Admin can click "Add", "Edit", or "Delete" on entries, triggering the respective API calls.

## 3. Non-Functional Requirements

-   **Security:** All admin endpoints must be protected and only accessible to authenticated administrators. RLS policies on Supabase tables will enforce this at the data layer.
-   **Usability:** The admin interface should be simple and intuitive, allowing for efficient content management.
-   **Performance:** API responses for admin actions should be completed within 500ms.

## 4. Dependencies and Integrations

| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **next** | `16.0.6` | Core framework for the application. |
| **react** | `19.2.0` | UI library. |
| **@supabase/supabase-js**| `^2.86.0` | Client for interacting with Supabase services. |
| **@radix-ui/react-*** | `*` | Used for building UI components like forms and dialogs. |

## 5. Acceptance Criteria and Traceability

### 5.1. Acceptance Criteria

**Story 4.1:**
1.  A dedicated login page exists at `/admin/login`.
2.  Submitting valid admin credentials grants access to the `/admin` routes.
3.  Submitting invalid credentials displays an error message.
4.  Non-authenticated users attempting to access `/admin` routes are redirected to the login page.

**Story 4.2:**
1.  An admin dashboard at `/admin/knowledge-base` displays a list of all current knowledge base entries.
2.  The interface includes a form to add a new entry.
3.  Each entry in the list has an "Edit" and "Delete" button.
4.  Clicking "Edit" opens a form pre-filled with the entry's data.
5.  Clicking "Delete" removes the entry after a confirmation prompt.

**Story 4.3:**
1.  An admin page at `/admin/system-prompt` displays the current system prompt in a text area.
2.  The admin can edit the text and save the changes.
3.  Upon saving, the new prompt is stored in the database and used for subsequent chat sessions.

### 5.2. Traceability Mapping

| AC ID | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| **4.1.1** | 2.4 | `AdminLoginPage` | Navigate to `/admin/login` and verify page content. |
| **4.1.2** | 2.3, 2.4 | `POST /api/admin/login` | E2E test: Successful login redirects to dashboard. |
| **4.2.1** | 2.2, 2.3 | `GET /api/admin/knowledge-base`| Unit test: Fetch and display a list of mock entries. |
| **4.2.3** | 2.3 | `DELETE /api/admin/knowledge-base/{id}`| Integration test: Deleting an entry removes it from the list.|
| **4.3.1** | 2.2, 2.3 | `GET /api/admin/system-prompt`| Unit test: Fetch and display the system prompt. |
| **4.3.2** | 2.3 | `PUT /api/admin/system-prompt`| E2E test: Edit, save, and then start a new chat to verify new behavior.|

## 6. Risks, Assumptions, and Test Strategy

### 6.1. Risks, Assumptions, and Questions

-   **Risk:** Security vulnerability in the admin authentication flow could expose sensitive controls. **Mitigation:** Rely on Supabase's battle-tested authentication and follow security best practices for session management.
-   **Assumption:** Administrators are trusted users and will not intentionally input malicious data.
-   **Question:** What is the expected format for the knowledge base content? (e.g., Markdown, plain text). For now, we will assume plain text.

### 6.2. Test Strategy

-   **Unit Tests:** Test individual React components for the admin UI and individual API route handlers with mocked data.
-   **Integration Tests:** Test the interaction between the frontend components and the backend APIs (e.g., submitting a form and verifying the data is saved).
-   **E2E Tests:** Simulate a full administrator workflow: login, add a new knowledge base entry, edit it, change the system prompt, and then verify the chatbot's behavior reflects these changes from a student's perspective.
-   **Security Testing:** Perform basic penetration testing on the admin routes to ensure they are not accessible without authentication.
-   **Manual Testing:** Manually verify all admin functionalities in a local environment.
