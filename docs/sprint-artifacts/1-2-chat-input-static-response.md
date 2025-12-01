# Story 1.2: Chat Input Static Response

Status: ready-for-dev

## Story

As a student,
I want to see a single page with an input field and receive a hardcoded response,
so that I can see the most basic chat functionality working.

## Acceptance Criteria

1. Given I am on the main page.
2. When I type any question into the chat input and press enter.
3. Then I see a static, pre-written answer appear on the screen.

## Tasks / Subtasks

- [ ] Implement the main application page (AC: 1)
  - [ ] Set up Next.js page for the main application.
  - [ ] Implement basic layout as per UX Design Specification (Source: docs/ux-design-specification.md).
  - [ ] Write a test to verify the main page loads correctly.
- [ ] Develop the chat input component (AC: 2)
  - [ ] Implement input field for user questions using Shadcn UI components.
  - [ ] Handle user input on 'Enter' key press.
  - [ ] Integrate with basic backend endpoint for static response.
  - [ ] Write a test to simulate typing in the input field and pressing enter, verifying the input is captured.
- [ ] Display static response in chat interface (AC: 3)
  - [ ] Create a `ChatBubble` component for bot responses.
  - [ ] Display a hardcoded static response from the backend.
  - [ ] Ensure the UI updates to show the bot's response.
  - [ ] Write a test to verify the static response appears correctly after user input.
- [ ] Set up Supabase client in frontend (Foundational Task).
- [ ] Create a basic backend API route (`/api/chat`) that returns a static response (Foundational Task).

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


## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- To be filled by agent -->

### Debug Log References

### Completion Notes List

### File List
