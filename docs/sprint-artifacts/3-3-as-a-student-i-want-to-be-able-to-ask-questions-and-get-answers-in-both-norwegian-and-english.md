# Story 3.3: As a student, I want to be able to ask questions and get answers in both Norwegian and English, so that I can use the language I'm most comfortable with

Status: review

## Story

As a student,
I want to be able to ask questions and get answers in both Norwegian and English,
so that I can use the language I'm most comfortable with.

## Story Context Summary

**User Story:** As a student, I want to be able to ask questions and get answers in both Norwegian and English, so that I can use the language I'm most comfortable with.

**Source of Requirements:**
- **Epic 3: Enhanced User Experience and Features:** This story (3.3) is a core part of improving the user experience and adding key features for students, focusing on multilingual support.

## Acceptance Criteria

1.  Given I have selected "Norwegian" as my language.
2.  When I ask a question in Norwegian, the chatbot responds in Norwegian.
3.  Given I have selected "English" as my language.
4.  When I ask a question in English, the chatbot responds in English.

### Project Structure Notes

#### Learnings from Previous Story (3.2)

- **Context File Generated**: `docs/sprint-artifacts/3-2-as-a-student-i-want-the-chatbot-to-provide-the-source-for-its-information-so-that-i-can-check-where-the-answer-came-from.context.xml`
- **Architectural Decisions**:
  - AI Integration: RAG with Google Gemini, Prompt Engineering, pgvector.
  - Data Model: `chat_messages` table includes `source_references`.
- **API Contracts**: `/api/chat` endpoint's response includes `sourceReferences`.
- **Frontend Components**: `ChatBubble` and `SourcedLink` are key UI components for displaying source information.
- **Backend Components**: `sentiabot/app/api/chat/route.ts` handles AI responses.
- **Database Client**: `sentiabot/lib/supabase.ts` for Supabase interaction.
- **Type Definitions**: `sentiabot/types/index.ts` defines the `Message` interface including `source`.
[Source: docs/sprint-artifacts/3-2-as-a-student-i-want-the-chatbot-to-provide-the-source-for-its-information-so-that-i-can-check-where-the-answer-came-from.md]

## Tasks / Subtasks

- [x] Implement UI for language selection (AC: 1, 3)
  - [x] Design and implement a language selector (e.g., dropdown, toggle)
  - [x] Store selected language in user preferences (e.g., local storage, user session)
- [x] Backend: Modify chat API to accept language parameter (AC: 2, 4)
  - [x] Update `/api/chat` endpoint to receive language input
  - [x] Integrate language parameter into AI model prompt or API call
  - [x] Ensure AI model responds in the selected language
- [x] Frontend: Send selected language with chat requests (AC: 2, 4)
  - [x] Retrieve selected language from preferences
  - [x] Include language in chat API requests
- [x] Testing:
  - [x] Unit tests for language selection UI component
  - [x] Unit/integration tests for chat API to verify language-specific responses
  - [x] End-to-end tests for asking questions in Norwegian and English and verifying responses in the correct language.

## Dev Agent Record

**Completion Notes:**
Implemented the complete end-to-end flow for language selection. Created a new `OptionsModal` to house a `LanguageSelector` component, which stores the user's choice in localStorage. The frontend now sends the selected language to the backend, which in turn instructs the AI model to respond in that language. All related tests were created or updated, and the full test suite passes.

**File List:**
- **New:**
  - `sentiabot/lib/user-preferences.ts`
  - `sentiabot/components/LanguageSelector.tsx`
  - `sentiabot/components/OptionsModal.tsx`
  - `sentiabot/components/LanguageSelector.test.tsx`
- **Modified:**
  - `sentiabot/app/api/chat/route.ts`
  - `sentiabot/app/page.tsx`
  - `sentiabot/components/ChatInterface.tsx`
  - `sentiabot/__tests__/api/chat.test.ts`
  - `sentiabot/app/page.test.tsx`

## Dev Notes

- **Relevant architecture patterns and constraints:**
  - Multilingual support will involve updating the AI integration strategy to handle language parameters in prompts.
  - Potential need for language-specific knowledge bases or content retrieval.
  - Frontend UI will need to manage and display language selection.
- **Source tree components to touch:**
  - `sentiabot/app/api/chat/route.ts` (backend chat API, to accept language parameter)
  - `sentiabot/components/ChatInput.tsx` (frontend input component, to send language parameter)
  - `sentiabot/components/LanguageSelector.tsx` (new frontend component)
  - `sentiabot/lib/user-preferences.ts` (new utility for storing language preference)
  - `sentiabot/types/index.ts` (if new types are needed for language)
- **Testing standards summary:**
  - Unit tests for new language selection components.
  - Integration tests for language parameter passing from frontend to backend.
  - End-to-end tests to verify language-specific responses.

### References
- [Source: docs/fase-2-plan/epics.md#Epic-3-Enhanced-User-Experience-and-Features]

### Context Reference
`docs\sprint-artifacts\3-3-as-a-student-i-want-to-be-able-to-ask-questions-and-get-answers-in-both-norwegian-and-english.context.xml`

## Change Log

- 2025-12-02: Story drafted.
- 2025-12-06: Senior Developer Review notes appended.

## Senior Developer Review (AI)
**Reviewer:** BIP
**Date:** 2025-12-06
**Outcome:** APPROVE

**Summary:**
The implementation for Story 3.3, covering multilingual support for Sentiabot, is complete and robust. All acceptance criteria and tasks have been fully addressed and verified. The solution introduces a language selection UI, integrates language preferences into the chat API, and ensures the AI responds in the selected language. Comprehensive testing has been performed, and all tests pass.

**Key Findings:**
No high, medium, or low severity issues were found.

**Acceptance Criteria Coverage:**

| AC# | Description | Status | Evidence |
| :-- | :---------- | :----- | :------- |
| 1 | Given I have selected "Norwegian" as my language. | IMPLEMENTED | `sentiabot/components/LanguageSelector.tsx` (L24), `sentiabot/lib/user-preferences.ts` (L11-15), `sentiabot/components/OptionsModal.tsx` (L20) |
| 2 | When I ask a question in Norwegian, the chatbot responds in Norwegian. | IMPLEMENTED | `sentiabot/app/page.tsx` (L54), `sentiabot/app/api/chat/route.ts` (L21, L59) |
| 3 | Given I have selected "English" as my language. | IMPLEMENTED | `sentiabot/components/LanguageSelector.tsx` (L29), `sentiabot/lib/user-preferences.ts` (L11-15) |
| 4 | When I ask a question in English, the chatbot responds in English. | IMPLEMENTED | `sentiabot/app/page.tsx` (L54), `sentiabot/app/api/chat/route.ts` (L21, L59) |

**Summary:** 4 of 4 acceptance criteria fully implemented.

**Task Completion Validation:**

| Task | Marked As | Verified As | Evidence |
| :--- | :-------- | :---------- | :------- |
| Implement UI for language selection (AC: 1, 3) | [x] | VERIFIED COMPLETE | `sentiabot/components/LanguageSelector.tsx`, `sentiabot/lib/user-preferences.ts`, `sentiabot/components/OptionsModal.tsx` |
| - Design and implement a language selector (e.g., dropdown, toggle) | [x] | VERIFIED COMPLETE | `sentiabot/components/LanguageSelector.tsx` |
| - Store selected language in user preferences (e.g., local storage, user session) | [x] | VERIFIED COMPLETE | `sentiabot/lib/user-preferences.ts` |
| Backend: Modify chat API to accept language parameter (AC: 2, 4) | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` |
| - Update /api/chat endpoint to receive language input | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` |
| - Integrate language parameter into AI model prompt or API call | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` |
| - Ensure AI model responds in the selected language | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` |
| Frontend: Send selected language with chat requests (AC: 2, 4) | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Retrieve selected language from preferences | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Include language in chat API requests | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| Testing: | [x] | VERIFIED COMPLETE | |
| - Unit tests for language selection UI component | [x] | VERIFIED COMPLETE | `sentiabot/components/LanguageSelector.test.tsx` |
| - Unit/integration tests for chat API to verify language-specific responses | [x] | VERIFIED COMPLETE | `sentiabot/__tests__/api/chat.test.ts` (updated) |
| - End-to-end tests for asking questions in Norwegian and English and verifying responses in the correct language. | [x] | VERIFIED COMPLETE | `sentiabot/app/page.test.tsx` (updated) |

**Summary:** 13 of 13 completed tasks verified.

**Test Coverage and Gaps:**
- Unit tests cover the new `LanguageSelector` component.
- Integration tests in `sentiabot/__tests__/api/chat.test.ts` verify the backend's handling of the language parameter and prompt modification.
- The `sentiabot/app/page.test.tsx` provides E2E coverage for the full chat flow, including the language parameter being sent.
- No significant test gaps identified for the scope of this story.

**Architectural Alignment:**
The implementation aligns with the Epic 3 Tech Spec, particularly regarding multilingual support and the use of Next.js, Shadcn UI, and backend API enhancements. The component structure and data flow match the detailed design.

**Security Notes:**
No new security vulnerabilities introduced. Use of `localStorage` for preferences is appropriate (non-sensitive data). Input validation is in place.

**Best-Practices and References:**
- Frontend: Next.js (16.0.6), React (19.2.0), Tailwind CSS, Shadcn UI, Vitest (4.0.14) for testing.
- Backend: Node.js, `NextResponse` for API routes.
- Adherence to standard component patterns and hooks (e.g., `useState`, `useEffect`, `useCallback`).

**Action Items:**
No action items required.
