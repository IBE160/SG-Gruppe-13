# Story 2.1: As a student, I want the chatbot to use a dedicated knowledge base for its answers so that I receive trustworthy information instead of made-up answers.

Status: ready-for-dev

## Story

As a student,
I want the chatbot to use a dedicated knowledge base for its answers,
so that I receive trustworthy information instead of made-up answers.

## Acceptance Criteria

1.  A vector database is set up and populated with at least one sample document.
2.  Given a user asks a question related to the sample document.
3.  Then the backend performs a search on the vector database.
4.  The search results are used by the AI to generate the answer.

## Tasks / Subtasks

- [ ] **Task 2.1.1: Configure Supabase `pgvector` extension and `knowledge_base_entries` table (AC: 1)**
  - [ ] Enable `pgvector` extension in Supabase project.
  - [ ] Create `knowledge_base_entries` table with specified columns (`id`, `title`, `content`, `embedding`, `subject`, `grade_level`, `source_url`, `created_at`, `updated_at`).
  - [ ] Define appropriate Row Level Security (RLS) policies for `knowledge_base_entries` table.
- [ ] **Task 2.1.2: Populate `knowledge_base_entries` with sample data (AC: 1)**
  - [ ] Select or create a sample educational document.
  - [ ] Generate vector embedding for the sample document's content.
  - [ ] Insert the document and its embedding into the `knowledge_base_entries` table.
  - [ ] Ensure `subject` and `grade_level` fields are populated for the sample.
- [ ] **Task 2.1.3: Implement backend semantic search logic (AC: 3)**
  - [ ] Develop a utility function to generate vector embeddings for user queries.
  - [ ] Implement a function to perform semantic search on the `knowledge_base_entries` table using the user query embedding.
  - [ ] Ensure the search can filter by `subject` and `grade_level` (from chat context).
  - [ ] Integrate this search logic into the `/api/chat` API route.
  - [ ] Add unit tests for embedding generation and semantic search functions.
- [ ] **Task 2.1.4: Integrate retrieved KB content into AI prompt (AC: 4)**
  - [ ] Modify the `/api/chat` route to take retrieved KB content and user query to form a comprehensive prompt for Gemini.
  - [ ] Implement dynamic prompt construction within the AI Context Service (as identified in Tech Spec).
  - [ ] Ensure the prompt clearly instructs Gemini to use the provided context.
- [ ] **Task 2.1.5: Validate AI response is KB-based (AC: 4)**
  - [ ] Implement logic to extract source references from the retrieved KB content or Gemini's response (if provided by Gemini).
  - [ ] Conduct functional tests to verify AI responses are grounded in the KB and not "hallucinating" or providing generic answers when specific KB content is available.
- [ ] **Task 2.1.6: Update chat UI to display source references (AC: 4)**
  - [ ] Enhance `ChatBubble` component to display clickable source links (`SourcedLink` component) when `sourceReferences` are present in the AI response.

## Dev Notes

### Project Structure Notes

- This story will introduce significant changes to the backend API layer within `sentiabot/app/api/chat/route.ts` for integrating knowledge base search and prompt construction.
- New database schema changes for `knowledge_base_entries` will be managed via Supabase migrations.
- Frontend UI changes will involve enhancing the `ChatBubble` component and potentially the `WelcomeScreen` and `ChatHeader` (if not done in a preceding story) to handle context selection.
- All new code should adhere to the naming conventions and code organization principles outlined in `docs/fase-3-solutioning/architecture.md`.

### References

- [Source: docs/fase-2-plan/epics.md]
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models-and-Contracts] - Data model for `knowledge_base_entries` table.
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Services-and-Modules] - Details on Knowledge Base Service and AI Context Service.
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#APIs-and-Interfaces] - Updated `/api/chat` contract.
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Non-Functional-Requirements] - Performance, Security, Reliability considerations.
- [Source: docs/fase-3-solutioning/architecture.md#AI-Integration-Strategy] - RAG strategy and use of Google Gemini.
- [Source: docs/fase-3-solutioning/architecture.md#Data-Architecture] - Overall data models and Supabase usage.
- [Source: docs/ux-design-specification.md#6-1-Component-Strategy] - `ChatBubble` and `SourcedLink` components.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-2.5-flash

### Debug Log References

### Completion Notes List

### File List
