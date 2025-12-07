# Story 4.1: As an administrator, I need a secure way to log in, so that only authorized users can manage the system

Status: ready-for-dev

## Story

As a administrator,
I want need a secure way to log in,
so that only authorized users can manage the system.

## Acceptance Criteria

*Source: [Epics](docs/fase-2-plan/epics.md) - Epic 4, Story 1*

1.  There is a separate login page for administrators.
2.  Given I enter valid administrator credentials, I am granted access to the admin dashboard.
3.  Given I enter invalid credentials, I am shown an error message and denied access.

## Tasks / Subtasks

- [ ] **Task 1: Set up Supabase Authentication** (AC: #1, #2, #3)
    - [ ] Subtask 1.1: Enable and configure Supabase Auth in the Supabase project.
    - [ ] Subtask 1.2: Create a new 'admin' role in Supabase.
    - [ ] Subtask 1.3: Create at least one admin user for testing.
- [ ] **Task 2: Create Admin Login Page** (AC: #1)
    - [ ] Subtask 2.1: Create a new route for the admin login page (e.g., `/admin/login`).
    - [ ] Subtask 2.2: Design a simple login form with email and password fields.
- [ ] **Task 3: Implement Login Logic** (AC: #2, #3)
    - [ ] Subtask 3.1: Create a Next.js API route to handle login requests.
    - [ ] Subtask 3.2: Use the Supabase client library to sign in the user.
    - [ ] Subtask 3.3: On successful login, redirect the user to a placeholder admin dashboard page.
    - [ ] Subtask 3.4: On failed login, display an error message on the login page.
- [ ] **Task 4: Create Placeholder Admin Dashboard** (AC: #2)
    - [ ] Subtask 4.1: Create a new protected route for the admin dashboard (e.g., `/admin/dashboard`).
    - [ ] Subtask 4.2: Add a message to the dashboard page confirming successful login.
- [ ] **Task 5: Testing** (AC: #1, #2, #3)
    - [ ] Subtask 5.1: Write a test to verify that the admin login page is accessible.
    - [ ] Subtask 5.2: Write a test to verify that a user with valid credentials can log in successfully.
    - [ ] Subtask 5.3: Write a test to verify that a user with invalid credentials receives an error message.

## Dev Notes

### Architecture patterns and constraints
- **Authentication:** Use Supabase Auth for user authentication and authorization.
- **API:** Implement a RESTful API using Next.js API Routes for the login functionality. The endpoint should be under `/api/auth`.
- **Admin Role:** The 'admin' role should be used to protect the admin routes.

### Project Structure Notes

- **Project Structure:**
    - The login page should be located at `sentiabot/src/app/admin/login/page.tsx`.
    - The admin dashboard page should be at `sentiabot/src/app/admin/dashboard/page.tsx`.
    - The login API route should be at `sentiabot/src/app/api/auth/login/route.ts`.
- Alignment with the existing Next.js project structure.
- New components for the login form should be placed in `sentiabot/src/components/admin/`.

### References
- [Source: Supabase Auth](https://supabase.com/docs/guides/auth)
- [Source: Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Source: Architecture](docs/fase-3-solutioning/architecture.md)
- [Source: Epics](docs/fase-2-plan/epics.md)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-1-as-an-administrator-i-need-a-secure-way-to-log-in-so-that-only-authorized-users-can-manage-the-system.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-12-07: Bob (Scrum Master) - Addressed major validation issues: Added AC source, testing tasks, restructured Dev Notes, and added Change Log.
