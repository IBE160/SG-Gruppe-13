# Story 1.3: send-question-receive-ai-response

Status: ready-for-dev

## Story

As a student,
I want to send a question to the AI chatbot and receive an answer, so that I can get help with my schoolwork.

## Requirements Context Summary

This story focuses on the core interaction of the Sentiabot application, as described in the UX Design Specification. The primary user journey involves a student asking a science question and receiving a simple, sourced answer from the AI chatbot. The design emphasizes a minimalist, conversation-focused interface with effortless input and clear presentation of information.

The interaction flow is:
1. User types a question into the prominent text input field.
2. User clicks "Send" or presses Enter.
3. A typing indicator appears.
4. Sentiabot's answer appears in a chat bubble with an integrated, clickable source.

### Key UX Design Principles Applied:
- **Speed & Responsiveness:** The interaction should feel quick and immediate.
- **Clarity & Guidance:** Answers should be simple, easy to understand, and age-appropriate.
- **Trust & Reliability:** Answers must be factually accurate and clearly linked to sources.
- **Engagement & Simplicity:** Visually appealing yet uncluttered interface.

### Component Focus:
- `ChatBubble`: Displays messages from user and bot, integrating sourced links.
- `TypingIndicator`: Communicates AI processing.
- `Input` component: For user question entry.

### Source Reference:
- UX Design Specification: `docs/ux-design-specification.md`

## Acceptance Criteria

1.  The user can type a question into a dedicated input field on the chat screen.
2.  The user can submit their question using a "Send" button or by pressing Enter.
3.  Upon submission, the user's question is displayed in a chat bubble.
4.  A visual indicator (e.g., typing animation) is shown while Sentiabot is processing the request.
5.  Sentiabot's response is displayed in a chat bubble.
6.  The response includes a clearly labeled and clickable source for the information.

## Tasks / Subtasks

- [ ] **Task 1: Implement Chat Input and Submission (AC: #1, #2)**
  - [ ] Subtask 1.1: Develop a text input component for user questions.
  - [ ] Subtask 1.2: Implement "Send" button functionality.
  - [ ] Subtask 1.3: Implement submission on "Enter" key press.
  - [ ] Subtask 1.4: Integrate with backend API for question submission.
- [ ] **Task 2: Display User Question (AC: #3)**
  - [ ] Subtask 2.1: Create a `ChatBubble` variant for user questions.
  - [ ] Subtask 2.2: Display submitted user questions in the chat history.
- [ ] **Task 3: Implement Sentiabot Thinking Indicator (AC: #4)**
  - [ ] Subtask 3.1: Integrate `TypingIndicator` component during AI processing.
- [ ] **Task 4: Display Sentiabot Response (AC: #5, #6)**
  - [ ] Subtask 4.1: Create a `ChatBubble` variant for Sentiabot responses.
  - [ ] Subtask 4.2: Display received AI responses in the chat history.
  - [ ] Subtask 4.3: Integrate `SourcedLink` component within Sentiabot's response bubble.
- [ ] **Task 5: Integrate with AI Model (AC: #5)**
  - [ ] Subtask 5.1: Implement backend logic to call the Google Gemini API with the user's question.
  - [ ] Subtask 5.2: Process the AI model's response and extract relevant answer and source information.
- [ ] **Task 6: Test Coverage**
  - [ ] Subtask 6.1: Write unit/integration tests for chat input and submission.
  - [ ] Subtask 6.2: Write unit/integration tests for displaying chat bubbles and indicators.
  - [ ] Subtask 6.3: Write integration tests for AI model integration and response handling.

## Dev Notes

- Relevant architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming)
- Detected conflicts or variances (with rationale)

### Learnings from Previous Story

**From Story 1-1-frontend-backend-deployed (Status: done)**

- **New Functionalities**: `/api/hello` endpoint (returns "Hello World"), Supabase client (`sentiabot/lib/supabase.ts`).
- **Architectural Alignment**: Confirmed use of Next.js 14+ App Router, Supabase, REST API patterns. These patterns should be followed for current story development.
- **New Files Created**: `sentiabot/app/page.tsx`, `sentiabot/app/api/hello/route.ts`, `sentiabot/lib/supabase.ts`, `.env.local`, `sentiabot/app/api/hello/route.test.ts`, `sentiabot/lib/supabase.test.ts`, `sentiabot/vitest.config.ts`, `sentiabot/vitest.setup.ts`. These files provide examples of how new features and tests are structured within the project.
- **Advisory Notes**: Consider the lifecycle and exposure of `sentiabot/app/api/check-db/route.ts`. While not directly relevant to this story's implementation, it's a general project consideration.
- **Testing Emphasis**: Previous story's review highlighted the importance of unit/integration tests for core functionalities. Ensure adequate test coverage for this story.

### References

- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-3-send-question-receive-ai-response.context.xml`

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log
- **2025-12-01**: Initial draft of story based on UX Design Specification and previous story learnings.