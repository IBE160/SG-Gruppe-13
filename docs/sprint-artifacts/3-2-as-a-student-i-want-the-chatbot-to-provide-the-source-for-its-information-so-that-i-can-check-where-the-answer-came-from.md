# Story 3.2: As a student, I want the chatbot to provide the source for its information, so that I can check where the answer came from

Status: ready-for-dev

## Story Context Summary

**User Story:** As a student, I want the chatbot to provide the source for its information, so that I can check where the answer came from.

**Source of Requirements:**
- **Epic 3: Enhanced User Experience and Features:** This story (3.2) is a core part of improving the user interface and adding key features for students.
- **PRD (FR006):** "The chatbot provides sources for the answers it gives the students."
- **PRD (User Journey 1):** Student gets help with homework, and the chatbot provides a link to the source material.
- **PRD (Metric 3):** "Source Attribution: The chatbot provides accurate and accessible source links for its answers."
- **Architecture (ADR 004):** AI Integration Strategy - RAG with Google Gemini, Prompt Engineering, and pgvector facilitates source attribution.
- **Architecture (Data Models):** `chat_messages` table includes `source_references` (text array, nullable, referencing `knowledge_base_entries.source_url`).
- **Architecture (API Contracts):** Chat API (`/api/chat`) response body includes `sourceReferences: ["string"] // URLs from knowledge base`.

## Acceptance Criteria

1.  Given the chatbot provides an answer based on the knowledge base.
2.  Then a "Source" link is displayed beneath the answer.
3.  When I click the link, I am taken to the original source document or page.

## Tasks / Subtasks

- [ ] Implement UI to display source link within chat bubble (AC: 2)
  - [ ] Style source link to be clearly distinguishable and clickable
  - [ ] Ensure source link opens in a new tab
- [ ] Backend: Modify chat API to return source references (AC: 1)
  - [ ] Update `chat_messages` data model to store `source_references`
  - [ ] Integrate RAG process to extract and provide relevant source URLs
  - [ ] Update `/api/chat` endpoint to include `sourceReferences` in response
- [ ] Frontend: Process `sourceReferences` from API and render in UI (AC: 2, 3)
  - [ ] Add logic to `ChatBubble` component to conditionally render source link
  - [ ] Implement click handler for source link to navigate to URL

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - AI Integration Strategy: RAG with Google Gemini, Prompt Engineering, and `pgvector`
  - Data Model: `chat_messages` table with `source_references`
  - API Contract: `/api/chat` endpoint to return `sourceReferences`
  - Frontend: Shadcn UI for component base, Tailwind CSS for styling.
- **Source tree components to touch:**
  - `sentiabot/app/api/chat/route.ts` (backend chat API)
  - `sentiabot/components/ChatBubble.tsx` (frontend UI component)
  - `sentiabot/lib/supabase.ts` (Supabase client for data model)
  - `sentiabot/types/index.ts` (for message types, if applicable)
- **Testing standards summary:**
  - Unit tests for backend API logic, ensuring source references are correctly extracted and returned.
  - Unit/integration tests for frontend `ChatBubble` component, verifying correct rendering and link behavior.
  - End-to-end tests to confirm full user journey of asking question and seeing clickable source.

### Project Structure Notes

No previous story learnings or unified project structure document found.

### References

- [Source: docs/fase-2-plan/epics.md#Epic-3-Enhanced-User-Experience-and-Features]
- [Source: docs/fase-2-plan/PRD.md#FR006]
- [Source: docs/fase-3-solutioning/architecture.md#ADR-004-AI-Integration-Strategy]
- [Source: docs/fase-3-solutioning/architecture.md#Data-Models-and-Relationships]
- [Source: docs/fase-3-solutioning/architecture.md#API-Contracts]

## Change Log

- 2025-12-02: Story drafted.

## Dev Agent Record

### Context Reference

- [docs/sprint-artifacts/3-2-as-a-student-i-want-the-chatbot-to-provide-the-source-for-its-information-so-that-i-can-check-where-the-answer-came-from.context.xml]

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List
