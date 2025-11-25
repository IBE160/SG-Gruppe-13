# Epic Technical Specification: Foundational End-to-End Chat

Date: 2025-11-25
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This technical specification details the Foundational End-to-End Chat epic for Sentiabot, an educational chatbot designed for elementary school students (ages 6-12). Sentiabot aims to provide a trustworthy and user-friendly tool for schoolwork, starting with science curriculum (Biology & Geology). The initial focus is on establishing the core technical infrastructure and delivering a basic, functional end-to-end chat experience, allowing students to ask questions and receive basic responses. The system will prioritize a minimalist, conversation-focused UI and will be built upon a React frontend, Node.js backend with Google Gemini AI, and Supabase for data management.

## Objectives and Scope

**In-Scope:**
*   Establish the foundational technical infrastructure for Sentiabot, including a deployed React frontend and a Node.js backend capable of basic communication.
*   Implement a minimalist, conversation-focused user interface for the chat.
*   Enable the chatbot to process user questions via an AI model (Google Gemini) and return generated responses, providing a basic end-to-end chat experience.
*   Ensure the application is accessible on desktops, laptops, and tablets with a focus on simplicity and ease of use for elementary students.

**Out-of-Scope (for this Epic):**
*   Integration with a dedicated knowledge base and contextual filtering (e.g., subject/grade level selection).
*   Advanced user experience features such as displaying sources, multilingual support, or chat history download.
*   Any administrative functionality, such as knowledge base management or system prompt modification.

## System Architecture Alignment

This epic aligns with the established architecture utilizing a **React frontend (Vite)** and a **Node.js backend (Vercel Serverless Functions)**. Core chat functionality will map to `frontend/src/pages/ChatPage.tsx`, `frontend/src/components/ChatWindow.tsx`, `frontend/src/store/chatStore.ts` on the frontend, and `api/chat.ts` on the backend, which will integrate with **Google Gemini (2.5 Pro)** for AI responses. Data persistence will be provisioned using **Supabase PostgreSQL** (specifically `pgvector` for future knowledge base use). Styling will be managed via **Shadcn UI** and state with **Zustand**. The foundational deployment will target **Vercel**.

## Detailed Design

### Services and Modules

**Frontend (React/Vite)**
*   `App.tsx`: Main application component, entry point for the React application.
*   `main.tsx`: Renders the `App` component.
*   `pages/ChatPage.tsx`: Handles the primary chat interaction, displaying messages and managing user input.
*   `components/ChatWindow.tsx`: Renders the chat message history.
*   `components/ChatInput.tsx`: Component for user text input and sending messages.
*   `store/chatStore.ts` (Zustand): Manages the state of chat messages, loading indicators, and user input.
*   `api/chatClient.ts`: Client-side module for interacting with the backend `/api/chat` endpoint.

**Backend (Node.js/Vercel Serverless Functions)**
*   `api/chat.ts`: Serverless function that receives user questions, interfaces with the Google Gemini API, and returns AI-generated responses.
*   `_lib/geminiClient.ts`: Utility for initializing and interacting with the Google Gemini API.

### Data Models and Contracts

For Epic 1, the primary data model will be for `ChatMessage` which will include:
*   `id`: Unique identifier (string)
*   `sender`: 'user' or 'bot' (string)
*   `message`: The content of the message (string)
*   `timestamp`: Time the message was sent/received (ISO 8601 string)

This will primarily reside in the frontend `chatStore.ts` for managing the conversational flow. A provisioned Supabase PostgreSQL database will be ready for future data integration but not actively used for chat message persistence in this initial epic.

### APIs and Interfaces

**Frontend to Backend API:**
*   **Endpoint:** `POST /api/chat`
    *   **Description:** Sends a user's question to the backend for AI processing.
    *   **Request Body (JSON):**
        ```json
        {
          "message": "string"
        }
        ```
    *   **Response Body (JSON):
        ```json
        {
          "data": {
            "reply": "string"
          }
        }
        ```
    *   **Error Response (JSON):**
        ```json
        {
          "error": {
            "message": "string"
          }
        }
        ```

**Backend to Google Gemini API:**
*   Utilizes the Google AI SDK for TypeScript/JavaScript to interact with the Gemini 2.5 Pro model. This interface is abstracted by `api/_lib/geminiClient.ts`.

### Workflows and Sequencing

**Primary Chat Flow:**
1.  **User Input:** Student types a question into the `ChatInput` component on `ChatPage.tsx`.
2.  **Frontend State Update:** The `chatStore` is updated with the user's message, and a loading indicator is initiated.
3.  **API Call:** `api/chatClient.ts` makes a `POST` request to `/api/chat` with the user's message.
4.  **Backend Processing:**
    *   `api/chat.ts` receives the request.
    *   It calls the `_lib/geminiClient.ts` to send the user's message to the Google Gemini API.
    *   Receives the AI-generated response.
5.  **Backend Response:** `api/chat.ts` sends the AI's reply back to the frontend.
6.  **Frontend State Update:** `chatStore` is updated with the AI's response, and the loading indicator is removed.
7.  **UI Render:** `ChatWindow.tsx` displays the AI's response in a new chat bubble.

## Non-Functional Requirements

### Performance

**Chatbot Response Time:** The AI chatbot's response time should be under 10 seconds for a typical query (FR003, Metric 5). This is heavily dependent on Google Gemini's performance and efficient integration within the `api/chat.ts` serverless function.
**Frontend Responsiveness:** The UI should remain fluid and responsive, leveraging Vite, React, and Shadcn UI. Loading indicators will be used for asynchronous operations to manage user expectations.

### Security

For this foundational epic, security considerations primarily revolve around API endpoint protection.
*   The `/api/chat` endpoint will be public, but rate limiting will be implemented at the Vercel edge to prevent abuse.
*   All data in transit between frontend and backend will use HTTPS.
*   Supabase provides data encryption at rest and in transit for the provisioned database, which will be used in future epics. No sensitive user data is handled in this epic.

### Reliability/Availability

**Deployment Platform:** The application will be deployed on Vercel, which provides high availability and automatic scaling for both the static frontend and serverless functions, contributing to overall system reliability.
**Error Handling:** The system will implement standardized JSON error responses from the API (`{ "error": { "message": "..." } }`) and user-friendly error messages will be displayed in the frontend, preventing application crashes for the end-user.

### Observability

For the MVP, logging will be primarily handled via **console logging** (`console.log`, `console.error`) in both frontend and backend for ease of debugging during development and initial deployment. This will be visible in Vercel logs for serverless functions. More robust logging and monitoring solutions can be integrated in future epics as the application scales.

## Dependencies and Integrations

As the `frontend/` and `api/` project directories and their respective `package.json` files have not yet been initialized, a scan for existing dependency manifests yielded no results. The planned dependencies, as outlined in the Architecture document, include:

**Frontend:**
*   **Framework:** React (with Vite for bundling)
*   **UI Library:** Shadcn UI
*   **State Management:** Zustand
*   **Language:** TypeScript

**Backend:**
*   **Runtime:** Node.js (Vercel Serverless Functions)
*   **AI Model:** Google Gemini (version 2.5 Pro) SDK
*   **Database Client:** Supabase client library for Node.js

## Acceptance Criteria (Authoritative)

**Story 1.1: As a student, I want to access a deployed application and see a 'Hello World' message from the backend, so that I know the core system is operational.**
1.  A frontend and backend are initialized, connected, and deployed to a public URL.
2.  When I navigate to the application's public URL, I see a 'Hello World' message originating from the backend.
3.  The application includes a provisioned database, ready for future data integration.

**Story 1.2: As a student, I want to see a single page with an input field and receive a hardcoded response, so that I can see the most basic chat functionality working.**
1.  Given I am on the main page.
2.  When I type any question into the chat input and press enter.
3.  Then I see a static, pre-written answer appear on the screen.

**Story 1.3: As a student, I want my question to be sent to an AI model and get a real, generated response, so that I can have a true conversational experience.**
1.  Given I am on the chat page.
2.  When I type a question, it is sent to the AI API.
3.  Then the response from the AI is displayed back to me.
4.  The response is generated and displayed within 5 seconds.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :------------------- | :-------------- | :------------------ | :-------- |
| **Story 1.1** | | | |
| 1.1.1 Frontend/backend initialized, connected, deployed to public URL | System Arch. Alignment, Deployment Arch. | Frontend, Backend, Vercel | Verify public URL accessibility, inspect network traffic for connectivity. |
| 1.1.2 "Hello World" message from backend on public URL | Services & Modules, Workflows & Sequencing | `App.tsx`, `api/chat.ts` | Access public URL, assert "Hello World" message is displayed and originates from backend. |
| 1.1.3 Provisioned database ready for future data integration | Data Models & Contracts | Supabase PostgreSQL | Verify Supabase instance is running and accessible (e.g., via Supabase Studio). |
| **Story 1.2** | | | |
| 1.2.1 On main page, type question, press enter | Detailed Design, UX Design Spec | `ChatPage.tsx`, `ChatInput.tsx` | UI test: navigate to main page, type, press enter. |
| 1.2.2 See static, pre-written answer on screen | Detailed Design, UX Design Spec | `ChatWindow.tsx` | UI test: assert static response appears after input. |
| **Story 1.3** | | | |
| 1.3.1 On chat page, type question, sent to AI API | Detailed Design, Workflows & Sequencing, APIs & Interfaces | `ChatPage.tsx`, `api/chatClient.ts`, `api/chat.ts` | Network test: assert API call to `/api/chat` is made with user question. |
| 1.3.2 Response from AI displayed back to me | Detailed Design, Workflows & Sequencing, APIs & Interfaces | `api/chat.ts`, `ChatWindow.tsx` | Integration test: mock AI, assert response is correctly displayed. |
| 1.3.3 Response generated and displayed within 5 seconds | Non-Functional Req. (Performance) | `api/chat.ts`, Google Gemini API | Performance test: measure round-trip time for AI response. |

## Risks, Assumptions, Open Questions

**Risks:**
*   **AI Model Performance/Cost:** Dependence on Google Gemini's API performance and associated costs could impact the project. Unforeseen latency or high usage costs could affect budget and user experience.
*   **API Rate Limiting:** The `/api/chat` endpoint, being public, is susceptible to abuse. If rate limiting is not effectively implemented or bypassed, it could lead to service degradation or increased costs.
*   **Frontend/Backend Integration Issues:** As the frontend and backend are separate projects, integration challenges (e.g., CORS, API contract mismatches) could delay development.

**Assumptions:**
*   Google Gemini API will provide consistent and timely responses suitable for elementary school-level interactions.
*   Frontend and backend development can proceed in parallel with well-defined API contracts.
*   Deployment on Vercel will be straightforward and handle scaling for initial usage.

**Open Questions:**
*   What specific error handling mechanisms should be implemented on the frontend for AI-related failures (e.g., AI returns an inappropriate response, API downtime)?
*   Are there any specific UI/UX requirements for "Hello World" or static response stages that go beyond basic text display?
*   How will API keys for Google Gemini and Supabase be securely managed in the Vercel environment variables during development and production?

## Test Strategy Summary

The testing strategy for this epic will focus on ensuring the foundational end-to-end chat functionality is robust and reliable.

**Unit Tests (Vitest):**
*   **Frontend:** Unit tests will cover React components (e.g., `ChatInput`, `ChatWindow`), Zustand stores (`chatStore`), and utility functions.
*   **Backend:** Unit tests will cover the `api/chat.ts` handler logic and the `_lib/geminiClient.ts` integration (mocking external API calls).

**Integration Tests:**
*   **API Contract Validation:** Tests will ensure the frontend correctly consumes the `/api/chat` endpoint and the backend adheres to the defined request/response contract.
*   **End-to-End Chat Flow:** Automated tests will simulate user interaction (typing a question, sending, receiving an AI response) to verify the complete chat pipeline.

**Manual Testing:**
*   **Functionality:** Manual verification of "Hello World" display, static response, and AI-generated responses.
*   **UI/UX:** Confirm the chat interface is minimalist, clear, and easy to use across desktop and tablet devices as per UX Design Specification (2.1 Defining Experience, 2.4 Core Experience Principles).
*   **Performance:** Observe initial response times for AI queries to identify any immediate bottlenecks (Metric 5 from PRD).
*   **Deployment:** Verify successful deployment to Vercel and accessibility of the public URL.
*   **Accessibility (Basic):** Manual keyboard navigation and visual inspection for basic accessibility adherence as per WCAG 2.1 Level AA requirements (e.g., focus indicators, color contrast on core UI elements).
