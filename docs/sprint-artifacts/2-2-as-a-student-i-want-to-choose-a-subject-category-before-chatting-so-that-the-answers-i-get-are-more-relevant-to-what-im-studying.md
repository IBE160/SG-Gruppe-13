# Story 2.2: As a student, I want to choose a subject category before chatting so that the answers I get are more relevant to what I'm studying.

Status: drafted

## Story

As a student,
I want to choose a subject category before chatting,
so that the answers I get are more relevant to what I'm studying.

## Acceptance Criteria

1.  The `WelcomeScreen` (or equivalent initial UI) includes a visible and selectable UI element (e.g., dropdown, buttons) for choosing a subject category (e.g., "Biology", "Geology").
2.  When a user selects a subject category, this selection is stored in the frontend state.
3.  Given a subject category is selected,
    When a chat message is sent to the backend,
    Then the selected subject category is included in the `context` of the `/api/chat` request.
4.  The backend successfully uses the `subject` from the request context to filter semantic searches on the `knowledge_base_entries` table.
5.  The AI's generated response reflects the chosen subject category, making the answer more relevant.
6.  The `chat_sessions` table records the `subject` for the session.

## Tasks / Subtasks

- [ ] **Task 2.2.1: Implement Subject Selection UI (AC: 1)**
  - [ ] Add a subject selection component (e.g., dropdown from Shadcn UI) to the `WelcomeScreen`.
  - [ ] Populate subject options (e.g., "Biology", "Geology").
  - [ ] Ensure the component is clearly visible and selectable.
- [ ] **Task 2.2.2: Store Subject Selection in Frontend State (AC: 2)**
  - [ ] Implement state management (e.g., React Context, Zustand) to store the user's selected subject.
  - [ ] Update the state when the user makes a selection.
- [ ] **Task 2.2.3: Pass Subject to Backend Chat API (AC: 3)**
  - [ ] Modify the frontend logic that sends chat messages to the `/api/chat` endpoint.
  - [ ] Include the selected subject in the `context` object of the request body.
- [ ] **Task 2.2.4: Backend Logic to Filter KB Search by Subject (AC: 4)**
  - [ ] Enhance the knowledge base search logic in the backend (Knowledge Base Service) to accept a `subject` parameter.
  - [ ] Use the `subject` parameter to filter the `pgvector` semantic search on the `knowledge_base_entries` table.
  - [ ] Add unit tests to verify subject-based filtering.
- [ ] **Task 2.2.5: AI Response Reflects Subject (AC: 5)**
  - [ ] Verify that the AI's generated response in the `/api/chat` endpoint is influenced by the subject context provided (e.g., by logging the final prompt sent to Gemini).
  - [ ] Conduct functional tests to ensure asking a subject-specific question with the correct subject selected yields a more relevant answer.
- [ ] **Task 2.2.6: Record Subject in `chat_sessions` Table (AC: 6)**
  - [ ] Modify the `/api/chat` endpoint to update the `chat_sessions` table with the selected `subject` for the current conversation.
  - [ ] Add integration tests to confirm the `subject` is correctly stored in the database.

## Dev Notes

### Project Structure Notes

- This story will involve modifications to the frontend UI components, primarily `WelcomeScreen` and the chat messaging logic.
- The `/api/chat` route in `sentiabot/app/api/chat/route.ts` will be updated to handle the new `subject` context.
- The Knowledge Base Service (backend utility) will be enhanced for subject-based filtering.
- Database schema for `chat_sessions` might require an update if the `subject` column does not already exist, or for ensuring proper indexing for filtering.
- Adhere to the `Component-Based Development` and `Atomic Design Principles` from `docs/ux-design-specification.md`.

### References

<<<<<<< HEAD
- [Source: docs/fase-2-plan/epics.md#story-22-as-a-student-i-want-to-choose-a-subject-category-before-chatting-so-that-the-answers-i-get-are-more-relevant-to-what-im-studying] - Epic 2 definition and Acceptance Criteria for Story 2.2.
=======
>>>>>>> 16d0cb00a55b6a983e50da969b2a086d336172b6
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces] - Updated `/api/chat` contract for `context`.
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models-and-Contracts] - `chat_sessions` table and `knowledge_base_entries` table.
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Services-and-Modules] - Details on Knowledge Base Service and AI Context Service.
- [Source: docs/ux-design-specification.md#5-1-Critical-User-Paths] - User flow for subject selection.
- [Source: docs/ux-design-specification.md#6-1-Component-Strategy] - UI components for selection.
- [Source: docs/fase-3-solutioning/architecture.md#API-Pattern] - REST API standards.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-2.5-flash

### Debug Log References

### Completion Notes List

### File List
