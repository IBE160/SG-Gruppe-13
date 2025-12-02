# Story 2.3: Grade Level Selection

Status: ready-for-dev

## Story

As a student,
I want to select my grade level,
so that the chatbot can use language that is easy for me to understand.

## Acceptance Criteria

1.  Given I am on the home page.
2.  I can select a grade level from a list (e.g., 1-6).
3.  When I select a grade level, my choice is stored.
4.  Then the chatbot's system prompt is updated to instruct the AI to tailor its language for my grade.

## Tasks / Subtasks

- [ ] Implement UI for grade level selection on the home page (AC: 1, 2)
  - [ ] Develop dropdown/buttons for grade levels 1-6
  - [ ] Integrate selection with application state
- [ ] Implement backend logic to store selected grade level (AC: 3)
  - [ ] Create/update user preference storage mechanism
  - [ ] Ensure grade level is associated with user session
- [ ] Implement logic to update chatbot's system prompt based on grade level (AC: 4)
  - [ ] Integrate grade level into prompt generation
  - [ ] Verify AI response tailoring to selected grade
- [ ] Write unit tests for grade level selection component and state management (AC: 1, 2)
- [ ] Write integration tests for storing selected grade level on backend (AC: 3)
- [ ] Write integration tests for system prompt update with grade level context (AC: 4)
- [ ] Write E2E test: Verify grade level selection on homepage (AC: 1, 2)
- [ ] Write E2E test: Verify AI response is tailored to selected grade level (AC: 4)

## Dev Notes

- Relevant architecture patterns and constraints: None specifically identified from loaded documents. Adhere to existing patterns.
- Source tree components to touch:
  - Frontend: Home page components, UI for selection, state management.
  - Backend: API endpoint to receive grade level, logic to store preferences, integration with AI prompt generation.
- Testing standards summary:
  - Unit tests for individual functions and components.
  - Integration tests for API endpoints and data persistence.
  - E2E tests for full user flow and AI response verification.

### Project Structure Notes

- Alignment with unified project structure: Follow existing component and service structure in the `sentiabot` directory.
- Detected conflicts or variances (with rationale): None.

### References

- [Source: docs/fase-2-plan/epics.md#Story-2.3]

## Dev Agent Record

### Context Reference

- D:\Programming-With-AI\SG-Gruppe-13/docs/sprint-artifacts/2-3-as-a-student-i-want-to-select-my-grade-level-so-the-chatbot-can-use-language-that-is-easy-for-me-to-understand.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List