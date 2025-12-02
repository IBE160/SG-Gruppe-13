# Epic Technical Specification: Knowledge-Driven, Contextual Chat

Date: 2025-12-02
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic aims to enhance the Sentiabot chatbot by connecting it to a dedicated knowledge base and allowing users to specify their context. This ensures that the answers provided are both relevant and accurate, moving beyond generic responses to domain-specific, trustworthy information.

## Objectives and Scope

The primary objective is to enable Sentiabot to provide answers grounded in a dedicated knowledge base and to allow users to influence the relevance of these answers by providing context.

**Key Objectives:**
- Integrate a robust knowledge base (vector database) to serve as the authoritative source for chatbot responses (FR007).
- Implement functionality for users to select a subject category (e.g., "Biology", "Geology") to narrow the AI's contextual understanding (FR004).
- Ensure the AI's responses accurately reflect the chosen subject context, improving relevance.
- Lay the groundwork for future contextual enhancements, such as grade level adaptation.

**In Scope:**
- Setup and population of a vector database for knowledge retrieval.
- Development of UI elements for subject category selection.
- Modification of backend chat API to incorporate subject context into knowledge base queries.
- Adaptation of AI response generation based on provided subject context.
- Recording of subject selection in chat session logs.

**Out of Scope (for this epic):**
- Implementation of grade level selection (planned for future stories within this epic).
- Admin interfaces for knowledge base management (covered in Epic 4).
- Complex UI enhancements beyond basic selection mechanisms.


## System Architecture Alignment

{{system_arch_alignment}}

## Detailed Design

### Services and Modules

{{services_modules}}

### Data Models and Contracts

{{data_models}}

### APIs and Interfaces

{{apis_interfaces}}

### Workflows and Sequencing

{{workflows_sequencing}}

## Non-Functional Requirements

### Performance

{{nfr_performance}}

### Security

{{nfr_security}}

### Reliability/Availability

{{nfr_reliability}}

### Observability

{{nfr_observability}}

## Dependencies and Integrations

{{dependencies_integrations}}

## Acceptance Criteria (Authoritative)

### Story 2.2: As a student, I want to choose a subject category before chatting, so that the answers I get are more relevant to what I'm studying.

1.  **UI for Subject Selection:**
    *   **Given** the user is on the initial application screen (e.g., `WelcomeScreen`).
    *   **When** the user needs to choose a subject category.
    *   **Then** the UI includes a visible and selectable element (e.g., dropdown, buttons) for choosing a subject category (e.g., "Biology", "Geology").
    *   *(Corresponds to Epic AC 2 and Story AC 1)*

2.  **Frontend State Management:**
    *   **Given** the user selects a subject category via the UI element.
    *   **When** the selection is made.
    *   **Then** this selection is accurately stored in the frontend state.
    *   *(Corresponds to Epic AC 3 and Story AC 2)*

3.  **Backend API Context Integration:**
    *   **Given** a subject category is selected and stored in the frontend state.
    *   **When** a chat message is sent to the backend via the `/api/chat` endpoint.
    *   **Then** the selected subject category is included as `context.subject` in the request body.
    *   *(Corresponds to Epic AC 4 (partially) and Story AC 3)*

4.  **Knowledge Base Filtering:**
    *   **Given** a chat request with a `context.subject` is received by the backend.
    *   **When** the backend performs a semantic search on the `knowledge_base_entries` table.
    *   **Then** the `subject` from the request context is successfully used to filter the search, ensuring subject-relevant results.
    *   *(Corresponds to Epic AC 4 (partially) and Story AC 4)*

5.  **AI Response Relevance:**
    *   **Given** the knowledge base search has been filtered by the chosen subject category.
    *   **When** the AI generates its response.
    *   **Then** the generated response reflects and is demonstrably more relevant to the chosen subject category.
    *   *(Corresponds to Story AC 5)*

6.  **Session Subject Recording:**
    *   **Given** a chat session is active and a subject has been selected.
    *   **When** the chat message is processed.
    *   **Then** the `chat_sessions` table records the chosen `subject` for that session, enabling historical context and analysis.
    *   *(Corresponds to Story AC 6)*

## Traceability Mapping

{{traceability_mapping}}

## Risks, Assumptions, Open Questions

{{risks_assumptions_questions}}

## Test Strategy Summary

{{test_strategy}}
