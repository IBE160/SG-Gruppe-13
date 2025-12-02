# Epic Technical Specification: Knowledge-Driven, Contextual Chat

Date: tirsdag 2. desember 2025
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

The Sentiabot project aims to develop a trustworthy and user-friendly AI chatbot designed for elementary school students (ages 6-12). Its primary goal is to provide curriculum-relevant answers in an understandable and concise manner, with easily accessible sources. This addresses the challenge students face in finding age-appropriate and credible online educational content, fostering a safe and curated learning environment.

## Objectives and Scope

### In-Scope (MVP)

*   **FR001:** Relevant and accurate knowledge base.
*   **FR002:** User-friendly interface (minimalistic, clear, colorful).
*   **FR003:** A working chatbot that can answer questions.
*   **FR004:** User can choose a science category (Biology & Geology) for AI context.
*   **FR005:** User can select grade level for language adaptation.
*   **FR006:** Chatbot provides sources for answers.
*   **FR007:** Chatbot uses a dedicated knowledge base.
*   **FR008:** Answers in both Norwegian and English.
*   **FR009:** User can download chatlog locally.
*   **FR010:** Admin interface to update the knowledge base.
*   **FR011:** Admin can modify the chatbot's system prompt.

### Out-of-Scope (for MVP)

*   **FR012:** Expand the amount of subjects.
*   **FR013:** Ability to show users images.
*   **FR014:** Ability to log unanswered questions to a text file.
*   **FR015:** Text-to-speech for younger students.
*   **FR016:** Expand logging anonymized questions.
*   **FR017:** Separate interface for parents and students.
*   **FR018:** Ability for students to upload previous chatlogs.
*   **FR019:** Ability for parents to give feedback on answers.

## System Architecture Alignment

The Sentiabot architecture is built to support core AI chatbot functionality with a focus on educational content and contextualized, sourced responses. Key architectural decisions, such as using Supabase with PostgreSQL (including `pgvector`) for data persistence and Google Gemini for AI integration with a Retrieval-Augmented Generation (RAG) strategy, directly align with the goals of providing accurate, age-appropriate, and multilingual answers. The project structure, leveraging Next.js and its API Routes, facilitates the development of both user-facing features and administrative interfaces for knowledge base management and system prompt modification. The commitment to a user-friendly UI, responsiveness, and accessibility is also reflected in the frontend component development guidelines.

## Detailed Design

### Services and Modules

| Service/Module         | Responsibilities                                                                                                            | Inputs/Outputs                                                                            | Owner |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :---- |
| **Frontend UI**        | User interaction, display chat, context selection (subject, grade), download chatlog.                                       | User input (questions, selections) / AI responses, UI updates.                            | Dev   |
| **Next.js API Routes** | Backend endpoints for `/api/chat`, `/api/knowledgebase`, `/api/system-prompts`. Integrates with Supabase & Gemini.          | HTTP requests (JSON) / HTTP responses (JSON).                                             | Dev   |
| **Supabase PostgreSQL**| Persistent storage for `users`, `knowledge_base_entries`, `chat_sessions`, `chat_messages`, `system_prompts`.                 | SQL queries, data modifications / Query results.                                          | Dev   |
| **Supabase Auth**      | User authentication (for admins). Manages JWTs and session.                                                                 | Login credentials / Auth tokens.                                                          | Dev   |
| **Supabase Realtime**  | Real-time updates for chat.                                                                                                 | Database changes / Real-time events to frontend.                                          | Dev   |
| **Google Gemini API**  | Large Language Model for generating AI responses.                                                                           | Prompts (user question + KB context) / AI-generated text.                                 | Dev   |
| **`pgvector` Extension**| Enables vector embeddings for semantic search on `knowledge_base_entries`.                                                | Vector similarity queries / Relevant document IDs.                                        | Dev   |

### Data Models and Contracts

The Sentiabot application leverages PostgreSQL within Supabase to manage its data, including a specialized knowledge base with vector embeddings.

#### 1. `users` Table (Supabase Auth)
-   **Purpose:** Stores user authentication information, managed by Supabase Auth.
-   **Fields:** `id` (UUID, PK), `email` (text, unique), `created_at` (timestamp), `role` (text, e.g., 'admin', 'student' - for RLS).
-   **Relationships:** One-to-many with `chat_sessions` (a user can have multiple chat sessions).

#### 2. `knowledge_base_entries` Table
-   **Purpose:** Stores curated educational content used for RAG.
-   **Fields:** `id` (UUID, PK), `title` (text), `content` (text), `embedding` (vector, for `pgvector`), `subject` (text), `grade_level` (text), `source_url` (text), `created_at` (timestamp), `updated_at` (timestamp).
-   **Relationships:** No direct foreign key relationships with other tables, but conceptually linked to `chat_sessions` through the RAG process.

#### 3. `chat_sessions` Table
-   **Purpose:** Stores metadata for each chat conversation.
-   **Fields:** `id` (UUID, PK), `user_id` (UUID, FK to `users.id`), `started_at` (timestamp), `ended_at` (timestamp, nullable), `subject` (text, from context), `grade_level` (text, from context), `language` (text, e.g., 'en', 'no').
-   **Relationships:** One-to-many with `chat_messages` (a session contains multiple messages).

#### 4. `chat_messages` Table
-   **Purpose:** Stores individual messages within a chat session.
-   **Fields:** `id` (UUID, PK), `session_id` (UUID, FK to `chat_sessions.id`), `sender` (text, e.g., 'user', 'ai'), `content` (text), `timestamp` (timestamp), `source_references` (text array, nullable, referencing `knowledge_base_entries.source_url`).
-   **Relationships:** Many-to-one with `chat_sessions`.

#### 5. `system_prompts` Table (for admin configuration)
-   **Purpose:** Stores configurable system prompts for the AI.
-   **Fields:** `id` (UUID, PK), `name` (text, e.g., 'base_prompt', 'safety_prompt'), `prompt_text` (text), `description` (text, nullable), `created_at` (timestamp), `updated_at` (timestamp).
-   **Relationships:** None.

### APIs and Interfaces

The Sentiabot application will expose RESTful API endpoints via Next.js API Routes. All requests and responses will utilize JSON format.

#### 1. Chat API (`/api/chat`)
-   **Purpose:** Handles user chat interactions with the AI.
-   **Endpoint:** `/api/chat`
-   **Method:** `POST`
-   **Request Body:**
    ```json
    {
      "sessionId": "string", // Optional, for continuing a conversation
      "message": "string",   // User's message
      "context": {           // Optional, for providing additional context
        "subject": "string",
        "gradeLevel": "string",
        "language": "string"
      }
    }
    ```
-   **Response Body (Success - 200 OK):**
    ```json
    {
      "sessionId": "string",
      "aiResponse": "string",
      "sourceReferences": ["string"] // URLs from knowledge base
    }
    ```
-   **Response Body (Error - 400 Bad Request, 500 Internal Server Error):**
    ```json
    {
      "errorCode": "string",
      "message": "string"
    }
    ```

#### 2. Knowledge Base API (`/api/knowledgebase`)
-   **Purpose:** Provides administrative endpoints for managing knowledge base entries.
-   **Endpoints & Methods:**
    -   `GET /api/knowledgebase`: Retrieve all entries (admin only).
    -   `GET /api/knowledgebase/{id}`: Retrieve a single entry by ID (admin only).
    -   `POST /api/knowledgebase`: Create a new entry (admin only).
        -   **Request Body:**
            ```json
            {
              "title": "string",
              "content": "string",
              "subject": "string",
              "gradeLevel": "string",
              "sourceUrl": "string"
            }
            ```
    -   `PUT /api/knowledgebase/{id}`: Update an existing entry (admin only).
        -   **Request Body:** (same as POST, include ID in path)
    -   `DELETE /api/knowledgebase/{id}`: Delete an entry (admin only).
-   **Response Bodies:**
    -   **Success (200 OK, 201 Created):** Varies based on operation (e.g., list of entries, single entry object, success message).
    -   **Error (400, 401, 403, 404, 500):** Consistent error format as Chat API.

#### 3. System Prompts API (`/api/system-prompts`)
-   **Purpose:** Provides administrative endpoints for managing system prompts.
-   **Endpoints & Methods:**
    -   `GET /api/system-prompts`: Retrieve all system prompts (admin only).
    -   `GET /api/system-prompts/{id}`: Retrieve a single prompt by ID (admin only).
    -   `PUT /api/system-prompts/{id}`: Update an existing system prompt (admin only).
        -   **Request Body:**
            ```json
            {
              "name": "string",
              "promptText": "string",
              "description": "string"
            }
            ```
    -   `DELETE /api/system-prompts/{id}`: Delete an entry (admin only).
-   **Response Bodies:**
    -   **Success (200 OK):** Varies based on operation.
    -   **Error (400, 401, 403, 404, 500):** Consistent error format.

#### Authentication
-   All administrative APIs (`/api/knowledgebase`, `/api/system-prompts`) will require authenticated users with appropriate roles (e.g., 'admin'). Supabase Auth will be used for token verification.

### Workflows and Sequencing

The core chat workflow involves a Retrieval-Augmented Generation (RAG) pattern:

1.  **User Input:** Student enters a question into the chat UI.
2.  **Context Selection (Optional):** Student selects subject and grade level, which are passed as part of the chat context.
3.  **Next.js API Route (`/api/chat`):**
    *   Receives user's question and context.
    *   **Embedding Generation:** The user's question (and potentially context) is converted into a vector embedding.
    *   **Semantic Search:** The embedding is used to perform a similarity search against the `knowledge_base_entries` table in Supabase PostgreSQL (using `pgvector`), filtered by selected subject and grade level if provided.
    *   **Retrieval:** Relevant knowledge base entries are retrieved.
    *   **Prompt Construction:** The retrieved knowledge base content, user's question, selected subject/grade level, and system prompt are combined to form a comprehensive prompt for the Google Gemini API. This prompt explicitly instructs Gemini to use the provided context and tailor its response (e.g., language for grade level).
    *   **Gemini API Call:** The constructed prompt is sent to the Google Gemini API.
    *   **AI Response Processing:** Gemini's response is received, parsed, and potentially enhanced (e.g., extracting source references).
    *   **Database Storage:** The user's message, AI response, and associated metadata (session ID, subject, grade level, source references) are stored in `chat_messages` and `chat_sessions` tables.
4.  **Frontend Display:** The AI-generated response and source references are displayed to the user in the chat UI.

Administrative workflows involve direct interaction with `/api/knowledgebase` and `/api/system-prompts` for CRUD operations on their respective data models, secured by Supabase Auth and RLS.

## Non-Functional Requirements

### Performance

#### Performance Strategies

*   **Optimized Data Retrieval:** Implement database indexing (e.g., on `pgvector`) for faster queries.
*   **AI Interaction Optimization:** Use concise prompts for Google Gemini and manage chat history to minimize token usage and processing time. Handle AI calls asynchronously.
*   **Frontend Rendering:** Utilize React component memoization, virtualization for lists, and image optimization.
*   **Real-time Efficiency:** Apply precise filters to Supabase Realtime subscriptions.

#### Measurable Targets

*   **AI Response Time:** Under 10 seconds for a typical query (PRD Metric 5).
*   **Database Latency:** Optimize queries to ensure sub-second response times for data retrieval operations.
*   **UI Responsiveness:** Maintain smooth 60 FPS for animations and scrolling.

### Security

#### Security Approach

The security architecture leverages Supabase, Next.js, and standard web security practices.

*   **Authentication and Authorization:** Supabase Auth for user authentication (JWTs, RBAC). Row Level Security (RLS) in PostgreSQL for fine-grained access control on critical tables.
*   **API Security:** HTTPS/TLS for all communication. Strict input validation on API Routes to prevent vulnerabilities (SQL injection, XSS). Sensitive information stored as environment variables.
*   **Frontend Security:** Avoid sensitive data in client storage. (Future consideration: CSP).
*   **Data Encryption:** Encryption at rest for PostgreSQL data, encryption in transit via TLS.
   *   **Auditing and Logging:** Audit logs for administrative actions.

### Reliability/Availability

The system's reliability and availability are designed with the local development environment scope in mind.

*   **Supabase Managed Services:** Leverages Supabase's managed PostgreSQL, Auth, and Realtime for inherent reliability in these components.
*   **Error Handling:** Standardized API error responses and frontend error handling to provide graceful degradation. Global error boundaries will prevent application crashes.
*   **Data Integrity:** PostgreSQL with RLS and schema enforcement ensures data integrity.
*   **Local Scope:** Given the local-only deployment (ADR 005), high availability configurations like redundant servers or load balancing are not applicable in this phase. Recovery is primarily through local development environment restarts or database resets.

### Observability

Observability is focused on providing insights within the local development environment for debugging and understanding system behavior.

*   **Structured Logging:** Events will be written to structured log files (e.g., JSON) on the local disk for post-mortem analysis.
*   **Console Logging:** Informative messages, warnings, and errors will be output to the developer console for immediate feedback.
*   **Log Content:** Logs will include timestamps, severity levels (INFO, WARN, ERROR), source component, and relevant context (user ID, request ID).
*   **Tooling:** Standard text editors or command-line tools for viewing and filtering logs.
*   **System Metrics:** Developers can monitor local system resources (CPU, memory, network) during execution to identify performance bottlenecks.


## Dependencies and Integrations

#### **Core Technologies (from `package.json` and Architecture Document):**

*   **Frontend Framework:** Next.js (v16.0.6)
*   **Programming Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Component Library:** Shadcn UI (implemented using `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`)
*   **Database:** PostgreSQL (managed by Supabase, including `pgvector` extension)
*   **Backend-as-a-Service (BaaS):** Supabase (Auth, Storage, Realtime, PostgreSQL)
    *   `@supabase/supabase-js`: ^2.86.0
*   **Large Language Model (LLM):** Google Gemini API
    *   `@google/generative-ai`: ^0.24.1
*   **API Pattern:** REST
*   **Icons:** `lucide-react`: ^0.555.0
*   **UI Utilities:**
    *   `class-variance-authority`: ^0.7.1
    *   `clsx`: ^2.1.1
    *   `tailwind-merge`: ^3.4.0`
    *   `@radix-ui/react-slot`: ^1.2.4`
    *   `tw-animate-css`: ^1.4.0`

#### **Development Dependencies (from `package.json`):**

*   `@tailwindcss/postcss`: ^4
*   `@testing-library/jest-dom`: ^6.9.1
*   `@testing-library/react`: ^16.3.0`
*   `@testing-library/user-event`: ^14.6.1`
*   `@types/node`: ^20`
*   `@types/react`: ^19`
*   `@types/react-dom`: ^19`
*   `@vitejs/plugin-react`: ^5.1.1`
*   `@vitest/coverage-v8`: ^4.0.14`
*   `eslint`: ^9`
*   `eslint-config-next`: 16.0.6`
*   `jsdom`: ^27.2.0`
*   `tailwindcss`: ^4`
*   `typescript`: ^5`
*   `vitest`: ^4.0.14`


## Risks, Assumptions, Open Questions

### Risks
*   **LLM Hallucinations:** The risk of the AI generating factually incorrect or ungrounded information, mitigated by the RAG approach using a curated knowledge base.
*   **Knowledge Base Management:** Ensuring the accuracy, completeness, and age-appropriateness of knowledge base content, which requires robust administrative tools and content curation processes.
*   **Performance of Semantic Search:** Potential latency or inefficiency in vector similarity searches, especially as the knowledge base grows, requiring optimized `pgvector` indexing and query strategies.

### Assumptions
*   **Local Deployment Sufficiency:** The local development environment is adequate for all current testing and demonstration needs, with no immediate need for cloud deployment.
*   **Google Gemini API Reliability:** The Google Gemini API will remain consistently available and performant within expected usage limits.
*   **Supabase Service Suitability:** Supabase's managed services (PostgreSQL, Auth, Realtime) will effectively meet the performance and scalability needs for the Minimum Viable Product.
*   **Content Availability:** Sufficient and relevant curriculum-based knowledge base content will be available for ingestion and population.

### Open Questions
*   What are the specific plans for scaling the application if it needs to move beyond a local development environment in the future?
*   What is the detailed strategy for initial knowledge base population, including content sourcing, formatting, and embedding generation? How will ongoing content updates and curation be managed?
*   Are there any specific preferences or requirements for tooling to manage `pgvector` indexes or automate the embedding generation process?

## Test Strategy Summary

The testing strategy will focus on ensuring the quality, accuracy, and functionality of Epic 2's features.

*   **Test Levels:**
    *   **Unit Tests:** For individual functions and components (e.g., embedding generation, API utility functions, UI components).
    *   **Integration Tests:** For interactions between modules (e.g., Next.js API Routes integrating with Supabase and Google Gemini).
    *   **Functional/End-to-End Tests:** To verify user flows and acceptance criteria (e.g., asking a question and verifying a sourced, contextual answer).

*   **Frameworks:**
    *   `Vitest` (for unit and integration tests).
    *   `@testing-library/react` and `jsdom` (for UI component testing).

*   **Coverage of ACs:** All acceptance criteria (FR001, FR004, FR005, FR006, FR007) will have corresponding test cases.

*   **Edge Cases:**
    *   Empty user queries.
    *   Questions entirely outside the knowledge base scope (verify graceful fallback/no answer).
    *   Invalid subject or grade level selections (if not handled by UI validation).
    *   Administrative actions with malformed or invalid knowledge base data.
    *   Network errors or API timeouts during calls to Google Gemini or Supabase.
    *   Testing of Row Level Security (RLS) policies for admin functions.