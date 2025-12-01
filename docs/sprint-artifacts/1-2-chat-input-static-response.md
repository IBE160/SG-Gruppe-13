# Story 1.2: Chat Input Static Response

Status: in-progress

## Story

As a student,
I want to see a single page with an input field and receive a hardcoded response,
so that I can see the most basic chat functionality working.

## Acceptance Criteria

1. Given I am on the main page.
2. When I type any question into the chat input and press enter.
3. Then I see a static, pre-written answer appear on the screen.

## Tasks / Subtasks

- [x] Implement the main application page (AC: 1)
  - [x] Set up Next.js page for the main application.
  - [x] Implement basic layout as per UX Design Specification (Source: docs/ux-design-specification.md).
  - [x] Write a test to verify the main page loads correctly.
- [x] Develop the chat input component (AC: 2)
  - [x] Implement input field for user questions using Shadcn UI components.
  - [x] Handle user input on 'Enter' key press.
  - [x] Integrate with basic backend endpoint for static response.
  - [x] Write a test to simulate typing in the input field and pressing enter, verifying the input is captured.
- [x] Display static response in chat interface (AC: 3)
  - [x] Create a `ChatBubble` component for bot responses.
  - [x] Display a hardcoded static response from the backend.
  - [x] Ensure the UI updates to show the bot's response.
  - [x] Write a test to verify the static response appears correctly after user input.
- [x] Set up Supabase client in frontend (Foundational Task).
- [x] Create a basic backend API route (`/api/chat`) that returns a static response (Foundational Task).

### Review Follow-ups (AI)
- [ ] [AI-Review][Low] Enhance error handling in `sentiabot/app/page.tsx` `handleSendMessage` to display user-friendly error messages. [file: sentiabot/app/page.tsx]

## Dev Notes

### Architectural Considerations:
- Frontend UI developed with Next.js components and styled using Shadcn UI/Tailwind CSS.
- Communication with a backend chat endpoint via Next.js API Routes.
- Emphasis on component-based development and atomic design principles.

### Project Structure Alignment Summary:
- As this is the first story in the epic, there are no previous story learnings or file changes to align. The project will adhere to the defined architecture and coding standards for new components.

### References

- [Source: docs/fase-2-plan/PRD.md#Functional-Requirements-(MVP)] - FR003, FR002 (relevant to UI)
- [Source: docs/fase-2-plan/epics.md#Epic-1:-Foundational-End-to-End-Chat] - Story 1.2 details
- [Source: docs/fase-3-solutioning/architecture.md#Epic-to-Architecture-Mapping] - Frontend UI, Next.js API Routes
- [Source: docs/fase-3-solutioning/architecture.md#Implementation-Patterns] - Component-Based Development, Atomic Design
- [Source: docs/ux-design-specification.md#5.1-Critical-User-Paths] - Primary User Journey: Asking a Science Question
- [Source: docs/ux-design-specification.md#6.1-Component-Strategy] - `ChatBubble` component, Input field


## Change Log
- 2025-12-01: Senior Developer Review notes appended.

### Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- To be filled by agent -->

### Debug Log References

### Completion Notes List
- Task "Implement the main application page (AC: 1)" completed.
  - Intent: Set up the basic main application page for Sentiabot.
  - Approach: Removed "Hello World" specific code (useEffect, useState, h1 tag) from `sentiabot/app/page.tsx` to establish a clean basic layout. Created `sentiabot/app/__tests__/page.test.tsx` to verify the page loads correctly.
- Task "Develop the chat input component (AC: 2)" completed.
  - Intent: Implement a functional chat input component using Shadcn UI.
  - Approach: Initialized Shadcn UI in the `sentiabot` project and added `Input` and `Button` components. Created `sentiabot/components/ChatInput.tsx` with input handling for text and 'Enter' key press. Integrated `ChatInput` into `sentiabot/app/page.tsx`. Created `sentiabot/components/__tests__/ChatInput.test.tsx` to verify component functionality. Resolved Vitest alias issues and `jest.fn()` reference errors.
  - Subtask "Integrate with basic backend endpoint for static response" completed.
    - Intent: Connect the frontend chat input to the backend API.
    - Approach: Modified `sentiabot/app/page.tsx` to make an asynchronous POST request to `/api/chat` when a message is sent, and log the backend's static response.
- Task "Create a basic backend API route (`/api/chat`)" completed.
  - Intent: Provide a backend endpoint that returns a static response for chat integration.
  - Approach: Created `sentiabot/app/api/chat/route.ts` with a POST handler that returns a hardcoded JSON message.

- Subtask "Create a `ChatBubble` component for bot responses" completed.
  - Intent: Develop a reusable UI component to display individual chat messages.
  - Approach: Created `sentiabot/components/ChatBubble.tsx` using Shadcn UI's `Card` component, styled to differentiate between user and bot messages.

- Subtasks "Display a hardcoded static response from the backend" and "Ensure the UI updates to show the bot's response" completed.
  - Intent: Render the user and bot messages in the chat interface.
  - Approach: Modified `sentiabot/app/page.tsx` to manage chat messages in state and use the `ChatBubble` component to display both user input and the static bot response from the backend. The main chat area was updated with `overflow-auto` and `space-y-4` for scrolling and spacing.

- Task "Display static response in chat interface (AC: 3)" completed.
  - Intent: Render the user and bot messages in the chat interface.
  - Approach: Modified `sentiabot/app/page.tsx` to manage chat messages in state and use the `ChatBubble` component to display both user input and the static bot response from the backend. The main chat area was updated with `overflow-auto` and `space-y-4` for scrolling and spacing.
  - Subtask "Write a test to verify the static response appears correctly after user input" completed.
    - Intent: Ensure the chat interface correctly displays both user and bot messages.
    - Approach: Updated `sentiabot/app/__tests__/page.test.tsx` to use `@testing-library/user-event` for simulating input and verify the presence of both user and bot messages after interaction, including simplifying the `ChatInput` mock for reliable testing.

- Task "Set up Supabase client in frontend (Foundational Task)" completed.
  - Intent: Ensure the Supabase client is correctly initialized for future data integration.
  - Approach: Verified that `sentiabot/lib/supabase.ts` already exists and correctly initializes the Supabase client using environment variables, and its associated test passes.
- Final Story Completion Summary:
  - All Acceptance Criteria for Story 1.2 have been met and verified.
  - The core chat functionality with static response is implemented and tested.
  - Key components (`ChatInput`, `ChatBubble`) and API routes (`/api/chat`) are established.
  - Shadcn UI has been initialized and integrated.
### File List
- Modified: sentiabot/app/page.tsx
- Modified: sentiabot/vitest.config.ts
- Modified: sentiabot/package.json (for Shadcn installation)
- Added: sentiabot/app/__tests__/page.test.tsx
- Added: sentiabot/components/ChatInput.tsx
- Added: sentiabot/components/__tests__/ChatInput.test.tsx
- Added: sentiabot/app/api/chat/route.ts
- Added: sentiabot/components/ChatBubble.tsx
- Added: sentiabot/lib/supabase.ts
- Added Shadcn UI Core Files:
  - sentiabot/components.json
  - sentiabot/lib/utils.ts
  - sentiabot/components/ui/input.tsx
  - sentiabot/components/ui/button.tsx
  - sentiabot/components/ui/card.tsx

### Senior Developer Review (AI)
- **Reviewer:** BIP
- **Date:** 2025-12-01
- **Outcome:** Changes Requested
- **Justification:** While all acceptance criteria are implemented and all tasks are completed, a low-severity finding regarding frontend error handling has been identified. This requires minor changes before approval.

#### Summary
The story "1.2: Chat Input Static Response" delivers the core chat functionality with a static response, meeting all specified acceptance criteria and completing all defined tasks. The implementation leverages Next.js, React, Shadcn UI, and a simple API route. Tests have been added for the main page layout and chat input component, ensuring basic functionality.

#### Key Findings
- **LOW Severity:** Frontend error handling in `sentiabot/app/page.tsx` `handleSendMessage` is basic (`console.error`). This is acceptable for an MVP, but could be improved for production with user-facing error messages.

#### Acceptance Criteria Coverage
| AC# | Description | Status | Evidence |
|---|---|---|---|
| 1 | Given I am on the main page. | IMPLEMENTED | `sentiabot/app/page.tsx` |
| 2 | When I type any question into the chat input and press enter. | IMPLEMENTED | `sentiabot/components/ChatInput.tsx`, `sentiabot/app/page.tsx` |
| 3 | Then I see a static, pre-written answer appear on the screen. | IMPLEMENTED | `sentiabot/app/api/chat/route.ts`, `sentiabot/app/page.tsx`, `sentiabot/components/ChatBubble.tsx` |

**Summary:** 3 of 3 acceptance criteria fully implemented.

#### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
|---|---|---|---|
| Implement the main application page (AC: 1) | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx`, `sentiabot/app/__tests__/page.test.tsx` |
| - Set up Next.js page for the main application. | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Implement basic layout as per UX Design Specification. | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Write a test to verify the main page loads correctly. | [x] | VERIFIED COMPLETE | `sentiabot/app/__tests__/page.test.tsx` |
| Develop the chat input component (AC: 2) | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatInput.tsx`, `sentiabot/components/__tests__/ChatInput.test.tsx` |
| - Implement input field for user questions using Shadcn UI. | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatInput.tsx` |
| - Handle user input on 'Enter' key press. | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatInput.tsx` |
| - Integrate with basic backend endpoint for static response. | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Write a test to simulate typing and pressing enter. | [x] | VERIFIED COMPLETE | `sentiabot/components/__tests__/ChatInput.test.tsx` |
| Display static response in chat interface (AC: 3) | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts`, `sentiabot/app/page.tsx`, `sentiabot/components/ChatBubble.tsx` |
| - Create a `ChatBubble` component. | [x] | VERIFIED COMPLETE | `sentiabot/components/ChatBubble.tsx` |
| - Display a hardcoded static response from the backend. | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts`, `sentiabot/app/page.tsx` |
| - Ensure the UI updates to show the bot's response. | [x] | VERIFIED COMPLETE | `sentiabot/app/page.tsx` |
| - Write a test to verify the static response appears. | [x] | VERIFIED COMPLETE | `sentiabot/app/__tests__/page.test.tsx` |
| Set up Supabase client in frontend (Foundational Task). | [x] | VERIFIED COMPLETE | `sentiabot/lib/supabase.ts` |
| Create a basic backend API route (`/api/chat`). | [x] | VERIFIED COMPLETE | `sentiabot/app/api/chat/route.ts` |

**Summary:** 14 of 14 completed tasks verified, 0 questionable, 0 falsely marked complete.

#### Test Coverage and Gaps
- **`sentiabot/app/__tests__/page.test.tsx`**: Covers AC1 (layout) and AC3 (user/bot message display).
- **`sentiabot/components/__tests__/ChatInput.test.tsx`**: Covers AC2 (chat input functionality).
- **`lib/supabase.test.ts`**: Verifies Supabase client setup.
- Overall test coverage for the implemented features is adequate.

#### Architectural Alignment
- The implementation aligns with the defined architectural decisions, including the use of Next.js API Routes, Shadcn UI, and the REST API pattern.

#### Security Notes
- No immediate security vulnerabilities identified in the implemented code for this story. Best practices for environment variables are followed for API keys.

#### Best-Practices and References
- Next.js development practices (App Router).
- React component-based development.
- Shadcn UI for UI components.
- Tailwind CSS for styling.
- Vitest and React Testing Library for testing.

#### Action Items
**Code Changes Required:**
- [ ] [Low] Enhance error handling in `sentiabot/app/page.tsx` `handleSendMessage` to display user-friendly error messages. [file: sentiabot/app/page.tsx]
