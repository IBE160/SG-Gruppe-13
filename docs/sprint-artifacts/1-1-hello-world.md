# Story 1.1: As a student, I want to access a deployed application and see a 'Hello World' message from the backend, so that I know the core system is operational.

Status: ready-for-dev

## Story

As a student,
I want to access a deployed application and see a 'Hello World' message from the backend,
so that I know the core system is operational.

## Acceptance Criteria

1. A frontend and backend are initialized, connected, and deployed to a public URL.
2. When I navigate to the application's public URL, I see a 'Hello World' message originating from the backend.
3. The application includes a provisioned database, ready for future data integration.

## Tasks / Subtasks

- [x] **Initialize Frontend Project (AC 1.1.1)**
  - [x] Run `npm create vite@7.2.4 sentiabot-frontend -- --template react-ts` (Executed with `vite@latest` due to versioning issues.)
  - [x] Configure `vite.config.ts` for Vercel deployment if needed
- [x] **Initialize Backend Project (AC 1.1.1)**
  - [x] Create `api/package.json` with basic dependencies (e.g., `express`, `typescript`, `vercel`)
  - [x] Create placeholder `api/chat.ts` serverless function
- [x] **Configure and Deploy to Vercel (AC 1.1.1)**
  - [x] Set up a new Vercel project, linking frontend and backend repositories
  - [x] Configure necessary Vercel environment variables
  - [x] Deploy initial application to a public URL
  - [x] **Verify Public URL Accessibility** (Test Idea 1.1.1)
- [x] **Implement Frontend "Hello World" (AC 1.1.2)**
  - [x] Display a "Loading..." or placeholder message in `frontend/src/App.tsx`
  - [x] Modify `frontend/src/App.tsx` to fetch initial message from backend `/api/chat` endpoint
- [x] **Implement Backend "Hello World" Endpoint (AC 1.1.2)**
  - [x] Modify `api/chat.ts` to respond with a simple JSON object containing a "Hello World" message
- [ ] **Verify "Hello World" Message Origin (AC 1.1.2)**
  - [ ] Manually navigate to the public URL and confirm "Hello World" message is displayed, observing network requests to ensure it comes from the backend.
- [ ] **Provision Supabase PostgreSQL (AC 1.1.3)**
  - [ ] Create a new Supabase project and database instance
  - [ ] Obtain Supabase URL and Anon Key for future use
- [ ] **Verify Supabase Accessibility (AC 1.1.3)**
  - [ ] Confirm Supabase instance is active and accessible via Supabase Studio or API endpoint (e.g., `pgvector` extension is enabled).

## Dev Notes

*   **Technology Stack:** React (Vite), Node.js (Vercel Serverless Functions), Google Gemini, Supabase PostgreSQL.
*   **Initial Setup:** Story 1.1 focuses on the initial project setup and "Hello World" functionality. Follow the project initialization command: `npm create vite@7.2.4 sentiabot-frontend -- --template react-ts`. The backend `api/` directory needs to be created manually and configured for Vercel serverless functions.
*   **Project Structure:** Adhere to the defined `frontend/` and `api/` folder structure from the architecture.
*   **Naming Conventions:**
    *   React Components: `PascalCase`
    *   Files (non-component): `kebab-case`
    *   Variables & Functions: `camelCase`
    *   API Endpoints: `kebab-case` for paths.
*   **API Communication:** Frontend to backend will use REST API calls over HTTP/HTTPS. Backend to Google Gemini will use the official Google AI SDK.
*   **Error Handling:** Use standardized JSON (`data` / `error`) for API responses. Frontend should display user-friendly error messages.
*   **Logging:** Console logging for MVP.
*   **Environment Variables:** Manage securely via `.env` files locally and Vercel.
*   **Testing:** Unit tests (Vitest) for core logic and integration tests for API contract validation and end-to-end flow. Manual testing for UI/UX and deployment verification.
*   **Open Questions/Considerations from Epic Tech Spec:**
    *   Specific error handling mechanisms for AI-related failures on the frontend.
    *   Secure management of API keys for Google Gemini and Supabase in Vercel.

### References

*   [Source: docs/fase-3-solutioning/architecture.md#Project-Initialization]
*   [Source: docs/fase-3-solutioning/architecture.md#Project-Structure]
*   [Source: docs/fase-3-solutioning/architecture.md#Implementation-Patterns]
*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Risks,-Assumptions,-Open-Questions]
*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Test-Strategy-Summary]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-1-hello-world.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
