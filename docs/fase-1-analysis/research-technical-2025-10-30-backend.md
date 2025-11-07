# Technical Research Report: Backend Specification for Sentiabot

## 1. Executive Summary

This report evaluates the proposed backend technology stack for the "Sentiabot" project, a web application designed to provide elementary school students with curriculum-relevant information via a chatbot. The core functionality relies heavily on AI integration and a vector database for semantic search.

The proposed backend stack, featuring FastAPI (Python), Supabase (Postgres Vector database), and Google Gemini 2.5 Pro API, has been assessed as sound and well-aligned with the project's goals. A key decision has been made to commit to Supabase for the database and vector database components due to its integrated features and suitability for the project's requirements.

## 2. Requirements and Constraints

Based on the `proposal.md`, the key requirements and constraints for the backend include:

### Functional Requirements:
*   Working chatbot that answers curriculum-relevant questions.
*   Chatbot uses a knowledge base (Supabase vector database) to prevent hallucination.
*   Chatbot provides sources for answers.
*   Support for Norwegian and English languages.
*   Admin site for knowledge base updates and system prompt debugging.
*   RESTful API design with versioning.
*   Live chat functionality using Supabase Realtime.
*   AI integration with Google Gemini 2.5 Pro API, including custom prompt engineering and fallback logic.
*   Automatic API documentation (FastAPI OpenAPI/Swagger).
*   Unit and integration testing with Pytest.

### Non-Functional Requirements:
*   95% accuracy on curriculum-related questions.
*   Response time under 10 seconds.
*   High-performance API.
*   Managed database with automatic backups, scaling, and monitoring.
*   Rate limiting, request queuing, caching, and cost management for AI integration.
*   Retry logic with exponential backoff for AI calls.

### Constraints:
*   **Framework**: FastAPI (Python)
*   **Language**: Python
*   **Database**: Supabase (Postgres Vector database)
*   **Authentication**: Supabase Auth
*   **Authorization**: Supabase RLS + role-based middleware
*   **Database Migrations**: Alembic
*   **AI Integration**: Google Gemini 2.5 Pro API
*   **Build Tool**: UV
*   **Deployment**: Vercel

## 3. Technology Options (Database/Vector Database)

During the research phase, several leading vector database options were identified as alternatives to Supabase/pgvector:

*   **Pinecone**: Fully managed, cloud-native, high-performance for scalable similarity searches.
*   **Milvus**: Open-source, massive-scale vector data, distributed architecture, enterprise-grade.
*   **Qdrant**: Open-source, high-performance, scalable, efficient Rust implementation.
*   **Weaviate**: Open-source, cloud-native, GraphQL-based, excellent hybrid search capabilities.
*   **Chroma**: Open-source, AI-native, developer-centric, good for rapid prototyping.
*   **pgvector (PostgreSQL extension)**: Integrated with existing PostgreSQL, suitable for modest data volumes.

While these alternatives offer various strengths, the project has committed to Supabase, which leverages `pgvector`.

## 4. Recommendation

The recommendation is to proceed with the proposed backend technology stack, with a firm commitment to **Supabase (Postgres Vector database)** for the Sentiabot project.

**Rationale for Supabase:**

*   **Direct Alignment**: Supabase directly meets the project's need for a managed vector database to power the AI chatbot's knowledge base and semantic search capabilities.
*   **Integrated Ecosystem**: It provides a comprehensive suite of features including authentication (Supabase Auth) and real-time functionality (Supabase Realtime), which are critical for user management and interactive chat.
*   **Python Compatibility**: Its PostgreSQL foundation, enhanced with `pgvector`, integrates seamlessly with the chosen Python/FastAPI backend, leveraging a familiar and robust database environment.
*   **Operational Efficiency**: As a managed service, Supabase reduces the operational burden of database management, allowing the development team to concentrate on core application logic and AI integration.
*   **Initial Scalability**: For the initial scope targeting elementary school students, `pgvector` is expected to handle the data volume effectively, providing a solid foundation for future growth.

## 5. Next Steps

*   Review this technical research report.
*   Consider generating an Architecture Decision Record (ADR) for the chosen backend stack to formally document the decision and its rationale.
*   Proceed with detailed design and implementation planning for the backend components.
