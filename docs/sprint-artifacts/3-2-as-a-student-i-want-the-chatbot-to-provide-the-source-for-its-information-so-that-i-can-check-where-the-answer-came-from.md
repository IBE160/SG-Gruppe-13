# Story 3.2: As a student, I want the chatbot to provide the source for its information, so that I can check where the answer came from

Status: review

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

- [x] Implement UI to display source link within chat bubble (AC: 2)
  - [x] Style source link to be clearly distinguishable and clickable
  - [x] Ensure source link opens in a new tab
- [x] Backend: Modify chat API to return source references (AC: 1)
  - [x] Update `chat_messages` data model to store `source_references`
  - [x] Integrate RAG process to extract and provide relevant source URLs
  - [x] Update `/api/chat` endpoint to include `sourceReferences` in response
- [x] Frontend: Process `sourceReferences` from API and render in UI (AC: 2, 3)
  - [x] Add logic to `ChatBubble` component to conditionally render source link
  - [x] Implement click handler for source link to navigate to URL

### Review Follow-ups (AI)
- [x] [AI-Review][Medium] Enhance Source Link Label (AC 2.3): Modify the backend API (`sentiabot/app/api/chat/route.ts`) to return a `sourceReferences` array of objects, each containing a `label` and `url` (e.g., `[{ label: "Wikipedia", url: "http://..." }]`). Subsequently, update `sentiabot/types/index.ts`, `app/page.tsx`, `ChatInterface.tsx`, `ChatHistory.tsx`, and `SourcedLink.tsx` to handle and display this dynamic label. [file: `sentiabot/app/api/chat/route.ts`, `sentiabot/types/index.ts`, `sentiabot/app/page.tsx`, `sentiabot/components/ChatBubble.tsx`, `sentiabot/components/SourcedLink.tsx`]

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
- 2025-12-06: Senior Developer Review notes appended.
- 2025-12-06: Second Senior Developer Review (Approve) notes appended.

## Dev Agent Record

### Context Reference

- [docs/sprint-artifacts/3-2-as-a-student-i-want-the-chatbot-to-provide-the-source-for-its-information-so-that-i-can-check-where-the-answer-came-from.context.xml]

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List
- sentiabot/types/index.ts
- sentiabot/app/api/chat/route.ts
- sentiabot/components/SourcedLink.tsx
- sentiabot/components/ChatBubble.tsx
- sentiabot/app/page.tsx
- sentiabot/components/ChatInterface.tsx
- sentiabot/components/ChatHistory.tsx
- sentiabot/components/__tests__/ChatBubble.test.tsx
- sentiabot/components/__tests__/SourcedLink.test.tsx
- sentiabot/app/page.test.tsx

## Senior Developer Review (AI)
- **Reviewer**: BIP
- **Date**: 2025-12-06
- **Outcome**: Changes Requested
- **Summary**: The story successfully implements the core functionality of displaying clickable source links based on knowledge base content. All ACs are met, except for the full clarity of the source label (AC 2.3), which is partially implemented due to limitations in the current API's data structure. All tasks are completed as claimed.

### Key Findings
- **[Medium] AC 2.3 (Source Link Label) - Partial Implementation**: The source link currently displays a generic "Source" label. The UX Design Specification implies a more descriptive label (e.g., "🔗 Source: Encyclopedia Britannica"). This is a clarity and usability issue. The backend API currently returns `sourceReferences: string[]` (URLs only), not a richer object with `label` and `url`.
    - **Severity**: Medium
    - **Evidence**: `sentiabot/components/SourcedLink.tsx` line 12; `sentiabot/app/api/chat/route.ts` line 107.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :-- | :---------- | :----- | :------- |
| 2.1 | Chatbot provides answer based on KB, "Source" link displayed | IMPLEMENTED | `sentiabot/app/api/chat/route.ts` (lines 105-107); `sentiabot/app/page.tsx` (line 64); `sentiabot/components/ChatBubble.tsx` (lines 29-35); `sentiabot/components/SourcedLink.tsx` (line 10); `sentiabot/components/__tests__/ChatBubble.test.tsx`; `sentiabot/components/__tests__/SourcedLink.test.tsx`; `sentiabot/app/page.test.tsx` |
| 2.2 | Clicking link navigates to original source in new tab | IMPLEMENTED | `sentiabot/components/SourcedLink.tsx` (lines 9-10); `sentiabot/components/__tests__/SourcedLink.test.tsx` |
| 2.3 | "Source" link label clearly indicates origin | PARTIAL | `sentiabot/components/SourcedLink.tsx` (line 12); `sentiabot/app/api/chat/route.ts` (line 107) |

**Summary**: 2 of 3 acceptance criteria fully implemented, 1 partially implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :-------- | :---------- | :------- |
| Implement UI to display source link within chat bubble (AC: 2) | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatBubble.tsx` (lines 29-35); `sentiabot/components/SourcedLink.tsx` (lines 9-13); `sentiabot/components/__tests__/ChatBubble.test.tsx`; `sentiabot/components/__tests__/SourcedLink.test.tsx` |
| ↳ Style source link to be clearly distinguishable and clickable | [x] | VERIFIED COMPLETE | `sentiabot/components/SourcedLink.tsx` (line 10) |
| ↳ Ensure source link opens in a new tab | [x] | VERIFIED COMPLETE | `sentiabot/components/SourcedLink.tsx` (lines 9-10) |
| Backend: Modify chat API to return source references (AC: 1) | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` (lines 105-107) |
| ↳ Update `chat_messages` data model to store `source_references` | [x] | VERIFIED COMPLETE | `sentiabot/supabase/migrations/20251203170000_create_chat_tables.sql` (lines 20-21) |
| ↳ Integrate RAG process to extract and provide relevant source URLs | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` (lines 65-79) |
| ↳ Update `/api/chat` endpoint to include `sourceReferences` in response | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` (line 107) |
| Frontend: Process `sourceReferences` from API and render in UI (AC: 2, 3) | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` (line 64); `sentiabot/components/ChatInterface.tsx` (line 10); `sentiabot/components/ChatHistory.tsx` (line 6); `sentiabot/components/ChatBubble.tsx` (lines 29-35) |
| ↳ Add logic to `ChatBubble` component to conditionally render source link | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatBubble.tsx` (lines 29-35) |
| ↳ Implement click handler for source link to navigate to URL | [x] | VERIFIED COMPLETE | `sentiabot/components/SourcedLink.tsx` (lines 9-10) |

**Summary**: 10 of 10 completed tasks verified, 0 questionable, 0 falsely marked complete.

### Test Coverage and Gaps
- Unit tests (`ChatBubble.test.tsx`, `SourcedLink.test.tsx`) provide good coverage for component rendering, props handling, and link attributes.
- E2E test (`app/page.test.tsx`) validates the full flow, including the presence of the source link.
- **Gap**: No specific test verifies that the source *label* is dynamic or derived from the origin, aligning with the partial implementation of AC 2.3.

### Architectural Alignment
- The implementation aligns with the RAG strategy, Next.js API Routes, and Supabase usage.
- The discrepancy in AC 2.3 (dynamic label vs. URL-only) highlights a potential misalignment between the detailed UX spec's `ChatMessage` interface and the current backend API/database schema for source handling.

### Security Notes
- `target="_blank" rel="noopener noreferrer"` is correctly used for external links, preventing `tabnabbing` vulnerabilities.
- Input validation for message length is present in the API route.

### Best-Practices and References
- Uses standard Next.js, React, Tailwind CSS, TypeScript, and Vitest conventions.
- Component-based development is evident.
- Code is generally clean and readable.

### Action Items

**Code Changes Required:**
- [x] [Medium] Enhance Source Link Label (AC 2.3): Modify the backend API (`sentiabot/app/api/chat/route.ts`) to return a `sourceReferences` array of objects, each containing a `label` and `url` (e.g., `[{ label: "Wikipedia", url: "http://..." }]`). Subsequently, update `sentiabot/types/index.ts`, `app/page.tsx`, `ChatInterface.tsx`, `ChatHistory.tsx`, and `SourcedLink.tsx` to handle and display this dynamic label. [file: `sentiabot/app/api/chat/route.ts`, `sentiabot/types/index.ts`, `sentiabot/app/page.tsx`, `sentiabot/components/ChatBubble.tsx`, `sentiabot/components/SourcedLink.tsx`]

## Senior Developer Review (AI) - Round 2
- **Reviewer**: BIP
- **Date**: 2025-12-06
- **Outcome**: Approve
- **Summary**: The follow-up changes have been implemented successfully. All acceptance criteria, including the dynamic display of source labels (AC 2.3), are now fully met. The code is clean, tested, and ready for completion.

### Key Findings
- None.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :-- | :---------- | :----- | :------- |
| 2.3 | "Source" link label clearly indicates origin | IMPLEMENTED | `sentiabot/app/api/chat/route.ts` (lines 81-83); `sentiabot/components/SourcedLink.tsx` (lines 11-13); `sentiabot/app/page.test.tsx` |

**Summary**: 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation
- All review follow-up tasks are now marked as complete and verified.

### Test Coverage and Gaps
- All tests are passing, including the E2E test which now validates the dynamic source label.


