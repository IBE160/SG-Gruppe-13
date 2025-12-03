# Story 3.3: As a student, I want to be able to ask questions and get answers in both Norwegian and English, so that I can use the language I'm most comfortable with

Status: ready-for-dev

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

- [ ] Implement UI for language selection (AC: 1, 3)
  - [ ] Design and implement a language selector (e.g., dropdown, toggle)
  - [ ] Store selected language in user preferences (e.g., local storage, user session)
- [ ] Backend: Modify chat API to accept language parameter (AC: 2, 4)
  - [ ] Update `/api/chat` endpoint to receive language input
  - [ ] Integrate language parameter into AI model prompt or API call
  - [ ] Ensure AI model responds in the selected language
- [ ] Frontend: Send selected language with chat requests (AC: 2, 4)
  - [ ] Retrieve selected language from preferences
  - [ ] Include language in chat API requests
- [ ] Testing:
  - [ ] Unit tests for language selection UI component
  - [ ] Unit/integration tests for chat API to verify language-specific responses
  - [ ] End-to-end tests for asking questions in Norwegian and English and verifying responses in the correct language.

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

## Change Log

- 2025-12-02: Story drafted.
