# Epic Technical Specification: {{epic_title}}

Date: 2025-12-02
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This technical specification outlines the implementation details for Epic 3: "Enhanced User Experience and Features" of the Sentiabot application. Sentiabot is an AI-powered educational tool for elementary school students, designed to provide safe, reliable, and easy-to-understand answers. The primary goal of this epic is to significantly improve the user interface and integrate key features that enhance the student's learning experience, making the tool more engaging and useful. The focus is on creating a trustworthy, engaging, and minimalist web application that fosters feelings of efficiency, productivity, and curiosity.

## Objectives and Scope

**In-Scope:**
- Implement a simple, colorful, and easy-to-navigate user interface, adhering to the UX Design Specification's chosen theme ("Trustworthy Learner") and design direction ("Source-Integrated Chat with Clean Header Options").
- Integrate a mechanism for the chatbot to display the source of its information, ensuring transparency and building trust.
- Develop multi-language support, allowing users to interact with the chatbot in both Norwegian and English.
- Implement a feature for users to download their chat history in a `.txt` file format.

**Out-of-Scope:**
- Significant changes to the core AI model logic or knowledge base integration beyond providing source links.
- Implementation of advanced user authentication or profiles beyond the scope of administrator login (Epic 4).
- Complex animation or visual effects not explicitly defined in the UX Design Specification.
- Real-time chat export/share functionality (beyond simple download).

## System Architecture Alignment

The implementation of Epic 3 will align closely with the established system architecture and UX design principles. The frontend will continue to leverage Next.js and Tailwind CSS, with Shadcn UI forming the core component library. This ensures a consistent, flexible, and accessible user interface as detailed in the UX Design Specification. The changes will primarily impact the frontend presentation layer and integration with existing backend services for language processing and chat history management. Architectural decisions will prioritize a minimalist, conversation-focused UI, ensuring that new features like source display and multilingualism integrate seamlessly without introducing visual clutter or performance bottlenecks. Responsive design principles will be maintained across all implemented features, ensuring usability on desktop, laptop, and tablet devices.

## Detailed Design

### Services and Modules
This epic primarily impacts the frontend application (`sentiabot` Next.js project) and its interaction with existing backend services.

-   **Frontend (Next.js Application - `sentiabot`)**:
    -   **`ChatInterfaceModule`**: Manages the display of chat messages, user input, and interactive elements.
        -   **Responsibility**: Rendering `ChatBubble` components, handling user input via `Input` component, displaying `TypingIndicator`.
        -   **Inputs**: User text input, AI responses (text, source), language selection, grade level selection.
        -   **Outputs**: API requests for chat messages, language/grade level updates.
        -   **Owner**: Frontend Team
    -   **`WelcomeScreenModule`**: Handles the initial user interaction for subject and grade selection.
        -   **Responsibility**: Displaying `Select` components for configuration, initiating chat session.
        -   **Inputs**: User selected subject and grade level.
        -   **Outputs**: Initial configuration for `ChatInterfaceModule`.
        -   **Owner**: Frontend Team
    -   **`OptionsModalModule`**: Manages the display and functionality of settings like language selection and chat history download.
        -   **Responsibility**: Rendering `Dialog`/`Modal` for options, handling language change and chat download actions.
        -   **Inputs**: User selection for language, download chat trigger.
        -   **Outputs**: Language preference update to backend/context, trigger for chat history download.
        -   **Owner**: Frontend Team
    -   **`ChatBubbleComponent`**: (Custom) Displays individual messages with integrated source links and copy functionality.
        -   **Responsibility**: Render user/bot messages, handle source link clicks, enable text copying.
        -   **Inputs**: Message content, sender (user/bot), source URL (for bot messages).
        -   **Outputs**: Event for opening source link, event for copying text.
        -   **Owner**: Frontend Team
    -   **`SourcedLinkComponent`**: (Custom) Renders the clickable source link within a `ChatBubble`.
        -   **Responsibility**: Displaying and handling clicks on source URLs.
        -   **Inputs**: Source URL, display text.
        -   **Outputs**: Opens new browser tab with source URL.
        -   **Owner**: Frontend Team
    -   **`LanguageService`**: Manages application-wide language state and content localization.
        -   **Responsibility**: Provide current language, translate UI elements and potentially chat responses.
        -   **Inputs**: User language selection.
        -   **Outputs**: Localized strings.
        -   **Owner**: Frontend Team

-   **Backend (`backend` Node.js application)**:
    -   **`ChatService`**: Enhancements to process multilingual input and potentially store chat history for download.
        -   **Responsibility**: Receive user input, interact with AI model, provide source information, manage chat history persistence.
        -   **Inputs**: User question, selected language, grade level.
        -   **Outputs**: AI response (text, source), chat history data.
        -   **Owner**: Backend Team
    -   **`LocalizationService`**: (Potentially new or enhanced) Handles the detection and management of supported languages for AI interaction.
        -   **Responsibility**: Identify input language, ensure AI model processing in correct language.
        -   **Inputs**: User message.
        -   **Outputs**: Language context for AI model.
        -   **Owner**: Backend Team

### Data Models and Contracts

-   **`ChatMessage` (Frontend/Backend Contract)**:
    ```typescript
    interface ChatMessage {
        id: string; // Unique identifier for the message
        sender: 'user' | 'bot';
        text: string;
        timestamp: string; // ISO 8601 format
        source?: {      // Optional for bot messages
            label: string;
            url: string;
        };
        language?: 'en' | 'no'; // Optional, to track per-message language or current session language
    }
    ```
    -   **Purpose**: Represents a single message in the chat conversation. `source` field is crucial for Story 3.2. `language` is added for potential future per-message language tracking (Story 3.3).
    -   **Relationships**: Stored as a sequence to form `ChatHistory`.

-   **`ChatSession` (Frontend/Backend Context)**:
    ```typescript
    interface ChatSession {
        id: string; // Unique session identifier
        userId: string; // User identifier (if authenticated, otherwise session ID)
        subject: string; // e.g., 'Science', 'Biology'
        gradeLevel: number; // e.g., 1, 2, 3...
        language: 'en' | 'no'; // Current session language (Story 3.3)
        messages: ChatMessage[]; // Array of chat messages
    }
    ```
    -   **Purpose**: Represents the entire context of a user's conversation with Sentiabot. This will be the primary data structure for downloading chat history (Story 3.4).

-   **`AppSettings` (Frontend State/Local Storage)**:
    ```typescript
    interface AppSettings {
        selectedSubject: string;
        selectedGradeLevel: number;
        preferredLanguage: 'en' | 'no'; // Story 3.3
    }
    ```
    -   **Purpose**: Stores user preferences for initial setup.

### APIs and Interfaces

-   **`POST /api/chat`**: Send a user message and receive an AI response.
    -   **Request**:
        ```json
        {
            "sessionId": "string",
            "userId": "string",
            "message": "string",
            "context": {
                "subject": "string",
                "gradeLevel": "number",
                "language": "en" | "no"
            }
        }
        ```
    -   **Response**:
        ```json
        {
            "sessionId": "string",
            "botResponse": {
                "id": "string",
                "text": "string",
                "timestamp": "string",
                "source": {
                    "label": "string",
                    "url": "string"
                }
            }
        }
        ```
    -   **Purpose**: This existing API will be enhanced to accept language context for Story 3.3 and to return source information for Story 3.2.

-   **`GET /api/chat/history/{sessionId}`**: Retrieve full chat history for download.
    -   **Request**: `GET /api/chat/history/abc-123-def`
    -   **Response**: `ChatMessage[]` (array of `ChatMessage` objects as defined above)
    -   **Purpose**: New endpoint for Story 3.4, enabling the download of the complete conversation.

-   **`POST /api/settings/language`**: Update user's preferred language.
    -   **Request**:
        ```json
        {
            "userId": "string", // Optional, if authenticated
            "language": "en" | "no"
        }
        ```
    -   **Response**: `200 OK`
    -   **Purpose**: New endpoint for Story 3.3, to persist user's language preference.

### Workflows and Sequencing

The core user workflow remains "Asking a Science Question", as detailed in the UX Design Specification, with enhancements for new features.

1.  **User Onboarding (Welcome Screen)**:
    -   User lands on the application.
    -   `WelcomeScreenModule` presents Subject and Grade Level selectors.
    -   User selects `subject` and `gradeLevel` and `preferredLanguage` (new for Story 3.3).
    -   `Start Chatting` button enabled; user clicks it.
    -   Frontend initializes `ChatSession` in memory and (optionally) sends initial `preferredLanguage` to backend `POST /api/settings/language`.

2.  **Interactive Chat Session**:
    -   `ChatInterfaceModule` displays initial Sentiabot welcome message.
    -   User types message into `Input` component.
    -   User clicks `Send` or presses Enter.
    -   User message added to `ChatHistory` and `ChatBubbleComponent` renders it.
    -   `TypingIndicatorComponent` is displayed.
    -   Frontend sends `POST /api/chat` request with `sessionId`, user `message`, and `context` (including `subject`, `gradeLevel`, `language`).
    -   Backend `ChatService` processes request, interacts with AI, and retrieves source information.
    -   Backend `ChatService` returns `botResponse` including `text` and `source`.
    -   `TypingIndicatorComponent` is hidden.
    -   `ChatBubbleComponent` (bot variant) renders the `botResponse`, including the `SourcedLinkComponent`.
    -   If user clicks `SourcedLinkComponent`, opens `source.url` in new tab.

3.  **Accessing Options (Options Modal)**:
    -   User clicks "Options" button in header (tertiary action button).
    -   `OptionsModalModule` displays a `Dialog` containing options.
    -   **Language Selection (Story 3.3)**:
        -   User selects a new `preferredLanguage` from a `Select` component.
        -   Frontend updates `AppSettings` and sends `POST /api/settings/language` to backend.
        -   Application UI re-renders with new language.
    -   **Download Chat History (Story 3.4)**:
        -   User clicks "Download Chat" button (secondary action button).
        -   Frontend sends `GET /api/chat/history/{sessionId}` request.
        -   Backend `ChatService` retrieves all `ChatMessage` for `sessionId`.
        -   Frontend receives `ChatMessage[]` and generates a `.txt` file, then triggers a download in the user's browser.
    -   User closes modal.

## Non-Functional Requirements

### Performance
-   **Chat Response Latency**: AI-generated responses (including source retrieval) should be displayed within 5 seconds from the user submitting a query. (Refer to Epic 1, Story 1.3 AC)
-   **UI Responsiveness**: All interactive UI elements (buttons, selectors, modals) should respond within 100ms to user input.
-   **Page Load Time**: Initial load of the chat interface should be under 3 seconds on a typical broadband connection.

### Security
-   **Data Handling**: User chat history will be stored securely (encrypted at rest and in transit) if persistence is enabled. Access to chat history data via API (`GET /api/chat/history/{sessionId}`) will require appropriate authentication/authorization, to be defined in subsequent epics (e.g., Administrator login in Epic 4).
-   **Third-Party Integrations**: All third-party services (AI models, external APIs) will be vetted for security compliance. Data transmitted to/from these services will be vetted for security compliance. Data transmitted to/from these services will be anonymized where possible and encrypted.
-   **OWASP Top 10**: The application will adhere to best practices to mitigate common web application vulnerabilities as outlined in the OWASP Top 10.
-   **Input Validation**: All user inputs will be rigorously validated on both client and server sides to prevent injection attacks (e.g., XSS, SQL injection).

### Reliability/Availability
-   **Uptime**: The application (frontend and backend) should maintain an uptime of 99.5% excluding planned maintenance.
-   **Error Handling**: The application should gracefully handle errors (e.g., AI model unavailable, network issues) and provide user-friendly feedback without crashing.
-   **Data Durability**: Stored chat history (for download) must be durable and retrievable, with appropriate backup and recovery mechanisms.

### Observability
-   **Logging**: Comprehensive logging will be implemented for all critical application components (frontend, backend, AI integrations) to track user interactions, system events, and errors.
    -   **Signals**: Request/response logs, error logs, performance metrics.
-   **Monitoring**: Key performance indicators (KPIs) such as response latency, error rates, and uptime will be monitored using established tools.
-   **Tracing**: Distributed tracing will be implemented to provide end-to-end visibility of requests across microservices (frontend, backend, AI).

## Dependencies and Integrations

This epic relies on the following key dependencies and integration points:

-   **Frontend Framework**:
    -   `next`: ^16.0.6 (Next.js)
    -   `react`: ^19.2.0 (React)
    -   `react-dom`: ^19.2.0 (React DOM)
-   **UI/Styling**:
    -   `tailwindcss`: ^4 (Tailwind CSS)
    -   `class-variance-authority`: ^0.7.1 (for conditional styling)
    -   `clsx`: ^2.1.1 (for conditional styling)
    -   `tailwind-merge`: ^3.4.0 (for merging Tailwind classes)
    -   `lucide-react`: ^0.555.0 (Icon library for UI elements)
    -   `Shadcn UI` (derived from `package.json` dependencies like `@radix-ui/react-slot` and the UX spec)
-   **AI Integration**:
    -   `@google/generative-ai`: ^0.24.1 (Likely used for interaction with AI models)
-   **Backend Services**:
    -   `@supabase/supabase-js`: ^2.86.0 (For interaction with Supabase services, including database and potentially authentication/storage)
    -   `supabase` (CLI tool): ^2.63.1 (Used for local development and management of Supabase services)

**Integration Points**:
-   **AI Model**: The frontend `ChatService` (or similar component) will integrate with an AI model via the `@google/generative-ai` library. The backend `ChatService` will communicate with this AI model to generate responses and potentially retrieve source information.
-   **Supabase**: `supabase-js` will be used for database interactions (e.g., storing chat history, user settings) and potentially authentication if integrated in future epics.
-   **Localization**: The application will integrate with browser-level language detection and potentially a localization library (not explicitly listed as a dependency, but implied by Story 3.3) to provide multilingual support.

# Epic Technical Specification: {{epic_title}}

Date: 2025-12-02
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This technical specification outlines the implementation details for Epic 3: "Enhanced User Experience and Features" of the Sentiabot application. Sentiabot is an AI-powered educational tool for elementary school students, designed to provide safe, reliable, and easy-to-understand answers. The primary goal of this epic is to significantly improve the user interface and integrate key features that enhance the student's learning experience, making the tool more engaging and useful. The focus is on creating a trustworthy, engaging, and minimalist web application that fosters feelings of efficiency, productivity, and curiosity.

## Objectives and Scope

**In-Scope:**
- Implement a simple, colorful, and easy-to-navigate user interface, adhering to the UX Design Specification's chosen theme ("Trustworthy Learner") and design direction ("Source-Integrated Chat with Clean Header Options").
- Integrate a mechanism for the chatbot to display the source of its information, ensuring transparency and building trust.
- Develop multi-language support, allowing users to interact with the chatbot in both Norwegian and English.
- Implement a feature for users to download their chat history in a `.txt` file format.

**Out-of-Scope:**
- Significant changes to the core AI model logic or knowledge base integration beyond providing source links.
- Implementation of advanced user authentication or profiles beyond the scope of administrator login (Epic 4).
- Complex animation or visual effects not explicitly defined in the UX Design Specification.
- Real-time chat export/share functionality (beyond simple download).

## System Architecture Alignment

The implementation of Epic 3 will align closely with the established system architecture and UX design principles. The frontend will continue to leverage Next.js and Tailwind CSS, with Shadcn UI forming the core component library. This ensures a consistent, flexible, and accessible user interface as detailed in the UX Design Specification. The changes will primarily impact the frontend presentation layer and integration with existing backend services for language processing and chat history management. Architectural decisions will prioritize a minimalist, conversation-focused UI, ensuring that new features like source display and multilingualism integrate seamlessly without introducing visual clutter or performance bottlenecks. Responsive design principles will be maintained across all implemented features, ensuring usability on desktop, laptop, and tablet devices.

## Detailed Design

### Services and Modules
This epic primarily impacts the frontend application (`sentiabot` Next.js project) and its interaction with existing backend services.

-   **Frontend (Next.js Application - `sentiabot`)**:
    -   **`ChatInterfaceModule`**: Manages the display of chat messages, user input, and interactive elements.
        -   **Responsibility**: Rendering `ChatBubble` components, handling user input via `Input` component, displaying `TypingIndicator`.
        -   **Inputs**: User text input, AI responses (text, source), language selection, grade level selection.
        -   **Outputs**: API requests for chat messages, language/grade level updates.
        -   **Owner**: Frontend Team
    -   **`WelcomeScreenModule`**: Handles the initial user interaction for subject and grade selection.
        -   **Responsibility**: Displaying `Select` components for configuration, initiating chat session.
        -   **Inputs**: User selected subject and grade level.
        -   **Outputs**: Initial configuration for `ChatInterfaceModule`.
        -   **Owner**: Frontend Team
    -   **`OptionsModalModule`**: Manages the display and functionality of settings like language selection and chat history download.
        -   **Responsibility**: Rendering `Dialog`/`Modal` for options, handling language change and chat download actions.
        -   **Inputs**: User selection for language, download chat trigger.
        -   **Outputs**: Language preference update to backend/context, trigger for chat history download.
        -   **Owner**: Frontend Team
    -   **`ChatBubbleComponent`**: (Custom) Displays individual messages with integrated source links and copy functionality.
        -   **Responsibility**: Render user/bot messages, handle source link clicks, enable text copying.
        -   **Inputs**: Message content, sender (user/bot), source URL (for bot messages).
        -   **Outputs**: Event for opening source link, event for copying text.
        -   **Owner**: Frontend Team
    -   **`SourcedLinkComponent`**: (Custom) Renders the clickable source link within a `ChatBubble`.
        -   **Responsibility**: Displaying and handling clicks on source URLs.
        -   **Inputs**: Source URL, display text.
        -   **Outputs**: Opens new browser tab with source URL.
        -   **Owner**: Frontend Team
    -   **`LanguageService`**: Manages application-wide language state and content localization.
        -   **Responsibility**: Provide current language, translate UI elements and potentially chat responses.
        -   **Inputs**: User language selection.
        -   **Outputs**: Localized strings.
        -   **Owner**: Frontend Team

-   **Backend (`backend` Node.js application)**:
    -   **`ChatService`**: Enhancements to process multilingual input and potentially store chat history for download.
        -   **Responsibility**: Receive user input, interact with AI model, provide source information, manage chat history persistence.
        -   **Inputs**: User question, selected language, grade level.
        -   **Outputs**: AI response (text, source), chat history data.
        -   **Owner**: Backend Team
    -   **`LocalizationService`**: (Potentially new or enhanced) Handles the detection and management of supported languages for AI interaction.
        -   **Responsibility**: Identify input language, ensure AI model processing in correct language.
        -   **Inputs**: User message.
        -   **Outputs**: Language context for AI model.
        -   **Owner**: Backend Team

### Data Models and Contracts

-   **`ChatMessage` (Frontend/Backend Contract)**:
    ```typescript
    interface ChatMessage {
        id: string; // Unique identifier for the message
        sender: 'user' | 'bot';
        text: string;
        timestamp: string; // ISO 8601 format
        source?: {      // Optional for bot messages
            label: string;
            url: string;
        };
        language?: 'en' | 'no'; // Optional, to track per-message language or current session language
    }
    ```
    -   **Purpose**: Represents a single message in the chat conversation. `source` field is crucial for Story 3.2. `language` is added for potential future per-message language tracking (Story 3.3).
    -   **Relationships**: Stored as a sequence to form `ChatHistory`.

-   **`ChatSession` (Frontend/Backend Context)**:
    ```typescript
    interface ChatSession {
        id: string; // Unique session identifier
        userId: string; // User identifier (if authenticated, otherwise session ID)
        subject: string; // e.g., 'Science', 'Biology'
        gradeLevel: number; // e.g., 1, 2, 3...
        language: 'en' | 'no'; // Current session language (Story 3.3)
        messages: ChatMessage[]; // Array of chat messages
    }
    ```
    -   **Purpose**: Represents the entire context of a user's conversation with Sentiabot. This will be the primary data structure for downloading chat history (Story 3.4).

-   **`AppSettings` (Frontend State/Local Storage)**:
    ```typescript
    interface AppSettings {
        selectedSubject: string;
        selectedGradeLevel: number;
        preferredLanguage: 'en' | 'no'; // Story 3.3
    }
    ```
    -   **Purpose**: Stores user preferences for initial setup.

### APIs and Interfaces

-   **`POST /api/chat`**: Send a user message and receive an AI response.
    -   **Request**:
        ```json
        {
            "sessionId": "string",
            "userId": "string",
            "message": "string",
            "context": {
                "subject": "string",
                "gradeLevel": "number",
                "language": "en" | "no"
            }
        }
        ```
    -   **Response**:
        ```json
        {
            "sessionId": "string",
            "botResponse": {
                "id": "string",
                "text": "string",
                "timestamp": "string",
                "source": {
                    "label": "string",
                    "url": "string"
                }
            }
        }
        ```
    -   **Purpose**: This existing API will be enhanced to accept language context for Story 3.3 and to return source information for Story 3.2.

-   **`GET /api/chat/history/{sessionId}`**: Retrieve full chat history for download.
    -   **Request**: `GET /api/chat/history/abc-123-def`
    -   **Response**: `ChatMessage[]` (array of `ChatMessage` objects as defined above)
    -   **Purpose**: New endpoint for Story 3.4, enabling the download of the complete conversation.

-   **`POST /api/settings/language`**: Update user's preferred language.
    -   **Request**:
        ```json
        {
            "userId": "string", // Optional, if authenticated
            "language": "en" | "no"
        }
        ```
    -   **Response**: `200 OK`
    -   **Purpose**: New endpoint for Story 3.3, to persist user's language preference.

### Workflows and Sequencing

The core user workflow remains "Asking a Science Question", as detailed in the UX Design Specification, with enhancements for new features.

1.  **User Onboarding (Welcome Screen)**:
    -   User lands on the application.
    -   `WelcomeScreenModule` presents Subject and Grade Level selectors.
    -   User selects `subject` and `gradeLevel` and `preferredLanguage` (new for Story 3.3).
    -   `Start Chatting` button enabled; user clicks it.
    -   Frontend initializes `ChatSession` in memory and (optionally) sends initial `preferredLanguage` to backend `POST /api/settings/language`.

2.  **Interactive Chat Session**:
    -   `ChatInterfaceModule` displays initial Sentiabot welcome message.
    -   User types message into `Input` component.
    -   User clicks `Send` or presses Enter.
    -   User message added to `ChatHistory` and `ChatBubbleComponent` renders it.
    -   `TypingIndicatorComponent` is displayed.
    -   Frontend sends `POST /api/chat` request with `sessionId`, user `message`, and `context` (including `subject`, `gradeLevel`, `language`).
    -   Backend `ChatService` processes request, interacts with AI, and retrieves source information.
    -   Backend `ChatService` returns `botResponse` including `text` and `source`.
    -   `TypingIndicatorComponent` is hidden.
    -   `ChatBubbleComponent` (bot variant) renders the `botResponse`, including the `SourcedLinkComponent`.
    -   If user clicks `SourcedLinkComponent`, opens `source.url` in new tab.

3.  **Accessing Options (Options Modal)**:
    -   User clicks "Options" button in header (tertiary action button).
    -   `OptionsModalModule` displays a `Dialog` containing options.
    -   **Language Selection (Story 3.3)**:
        -   User selects a new `preferredLanguage` from a `Select` component.
        -   Frontend updates `AppSettings` and sends `POST /api/settings/language` to backend.
        -   Application UI re-renders with new language.
    -   **Download Chat History (Story 3.4)**:
        -   User clicks "Download Chat" button (secondary action button).
        -   Frontend sends `GET /api/chat/history/{sessionId}` request.
        -   Backend `ChatService` retrieves all `ChatMessage` for `sessionId`.
        -   Frontend receives `ChatMessage[]` and generates a `.txt` file, then triggers a download in the user's browser.
    -   User closes modal.

## Non-Functional Requirements

### Performance
-   **Chat Response Latency**: AI-generated responses (including source retrieval) should be displayed within 5 seconds from the user submitting a query. (Refer to Epic 1, Story 1.3 AC)
-   **UI Responsiveness**: All interactive UI elements (buttons, selectors, modals) should respond within 100ms to user input.
-   **Page Load Time**: Initial load of the chat interface should be under 3 seconds on a typical broadband connection.

### Security
-   **Data Handling**: User chat history will be stored securely (encrypted at rest and in transit) if persistence is enabled. Access to chat history data via API (`GET /api/chat/history/{sessionId}`) will require appropriate authentication/authorization, to be defined in subsequent epics (e.g., Administrator login in Epic 4).
-   **Third-Party Integrations**: All third-party services (AI models, external APIs) will be vetted for security compliance. Data transmitted to/from these services will be anonymized where possible and encrypted.
-   **OWASP Top 10**: The application will adhere to best practices to mitigate common web application vulnerabilities as outlined in the OWASP Top 10.
-   **Input Validation**: All user inputs will be rigorously validated on both client and server sides to prevent injection attacks (e.g., XSS, SQL injection).

### Reliability/Availability
-   **Uptime**: The application (frontend and backend) should maintain an uptime of 99.5% excluding planned maintenance.
-   **Error Handling**: The application should gracefully handle errors (e.g., AI model unavailable, network issues) and provide user-friendly feedback without crashing.
-   **Data Durability**: Stored chat history (for download) must be durable and retrievable, with appropriate backup and recovery mechanisms.

### Observability
-   **Logging**: Comprehensive logging will be implemented for all critical application components (frontend, backend, AI integrations) to track user interactions, system events, and errors.
    -   **Signals**: Request/response logs, error logs, performance metrics.
-   **Monitoring**: Key performance indicators (KPIs) such as response latency, error rates, and uptime will be monitored using established tools.
-   **Tracing**: Distributed tracing will be implemented to provide end-to-end visibility of requests across microservices (frontend, backend, AI).

## Dependencies and Integrations

This epic relies on the following key dependencies and integration points:

-   **Frontend Framework**:
    -   `next`: ^16.0.6 (Next.js)
    -   `react`: ^19.2.0 (React)
    -   `react-dom`: ^19.2.0 (React DOM)
-   **UI/Styling**:
    -   `tailwindcss`: ^4 (Tailwind CSS)
    -   `class-variance-authority`: ^0.7.1 (for conditional styling)
    -   `clsx`: ^2.1.1 (for conditional styling)
    -   `tailwind-merge`: ^3.4.0 (for merging Tailwind classes)
    -   `lucide-react`: ^0.555.0 (Icon library for UI elements)
    -   `Shadcn UI` (derived from `package.json` dependencies like `@radix-ui/react-slot` and the UX spec)
-   **AI Integration**:
    -   `@google/generative-ai`: ^0.24.1 (Likely used for interaction with AI models)
-   **Backend Services**:
    -   `@supabase/supabase-js`: ^2.86.0 (For interaction with Supabase services, including database and potentially authentication/storage)
    -   `supabase` (CLI tool): ^2.63.1 (Used for local development and management of Supabase services)

**Integration Points**:
-   **AI Model**: The frontend `ChatService` (or similar component) will integrate with an AI model via the `@google/generative-ai` library. The backend `ChatService` will communicate with this AI model to generate responses and potentially retrieve source information.
-   **Supabase**: `supabase-js` will be used for database interactions (e.g., storing chat history, user settings) and potentially authentication if integrated in future epics.
-   **Localization**: The application will integrate with browser-level language detection and potentially a localization library (not explicitly listed as a dependency, but implied by Story 3.3) to provide multilingual support.

## Acceptance Criteria (Authoritative)

**For Story 3.1: Simple, Colorful, Easy-to-Navigate Interface**
1.1. The application's UI consistently applies the "Trustworthy Learner" color palette defined in the UX Design Specification.
1.2. All interactive elements (buttons, input fields, selectors) are clearly labeled and have a minimum touch target size of 44x44 CSS pixels.
1.3. The main chat screen displays no more than 4 primary interactive actions (e.g., chat input, send, options).
1.4. The application layout (chat interface, welcome screen, options modal) adapts correctly and remains fully functional on desktop, laptop, and tablet screen sizes, adhering to defined breakpoints.

**For Story 3.2: Chatbot Provides Source for Information**
2.1. When a chatbot response is based on knowledge base content, a clickable "Source" link is visibly displayed within or immediately beneath the chat bubble.
2.2. Clicking the "Source" link opens the original source document or web page in a new browser tab.
2.3. The "Source" link label clearly indicates the origin (e.g., "🔗 Source: Wikipedia" or "🔗 Source: Document ID-XYZ").

**For Story 3.3: Multilingual Support (Norwegian and English)**
3.1. Users can select either "Norwegian" or "English" as their preferred language from the options modal.
3.2. When "Norwegian" is selected, all static UI text (labels, buttons, prompts) is displayed in Norwegian.
3.3. When "English" is selected, all static UI text is displayed in English.
3.4. When the user asks a question in the selected language, the chatbot responds in the same selected language.

**For Story 3.4: Download Chat History**
4.1. A "Download Chat" button is available within the options modal.
4.2. After a conversation, clicking the "Download Chat" button triggers a download of a `.txt` file containing the full chat log.
4.3. The downloaded `.txt` file includes timestamps and distinguishes between user and bot messages.

## Traceability Mapping

| Acceptance Criteria (AC) | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :----------------------- | :--------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Story 3.1 (UI)**       |                                                                              |                                                                                           |                                                                                                               |
| 1.1 (Color Palette)      | UX Design Spec 3.1 Color System                                              | `Root CSS Variables`, `Shadcn UI Theme Config`                                            | Visual inspection for consistent color usage.                                                                 |
| 1.2 (Interactive Elements) | UX Design Spec 6.1 Component Strategy, 8.2 Accessibility Strategy            | `Button`, `Input`, `Select`, `ChatBubble`                                                 | Manual test: Check labels, keyboard navigation (Tab/Shift+Tab), touch target size.                            |
| 1.3 (Primary Actions)    | UX Design Spec 4.1 Chosen Design Approach                                    | `ChatInterfaceModule`, `WelcomeScreenModule`, `OptionsModalModule`                      | Visual inspection: Verify main screen clutter, count primary actions.                                         |
| 1.4 (Responsive Design)  | UX Design Spec 8.1 Responsive Strategy                                       | `ChatInterfaceModule`, `WelcomeScreenModule`, `OptionsModalModule`                      | Manual test: Resize browser window, test on tablet emulator; verify layout and functionality.                 |
| **Story 3.2 (Sourced)**  |                                                                              |                                                                                           |                                                                                                               |
| 2.1 (Source Link Display)| Detailed Design - `ChatBubbleComponent`                                      | `ChatBubbleComponent`, `SourcedLinkComponent`                                             | Unit test: `ChatBubble` renders `SourcedLink` when `source` prop exists. E2E: Chatbot response includes source. |
| 2.2 (Source Link Click) | Detailed Design - `ChatBubbleComponent`, `SourcedLinkComponent`              | `SourcedLinkComponent`                                                                    | Unit test: `SourcedLink` opens new tab on click. E2E: Click source link, verify new tab with correct URL.     |
| 2.3 (Source Link Label) | Detailed Design - `SourcedLinkComponent`                                     | `SourcedLinkComponent`                                                                    | Visual inspection: Verify source label is clear and matches content.                                          |
| **Story 3.3 (Multilingual)**|                                                                              |                                                                                           |                                                                                                               |
| 3.1 (Language Selection) | Detailed Design - `OptionsModalModule`, `AppSettings`                        | `OptionsModalModule`, `LanguageService`                                                   | Unit test: `OptionsModal` displays language selector. E2E: Select language.                                   |
| 3.2 (UI in Norwegian) | Detailed Design - `LanguageService`, `POST /api/settings/language`           | `LanguageService`                                                                         | Manual test: Select Norwegian, verify UI text.                                                                |
| 3.3 (UI in English) | Detailed Design - `LanguageService`, `POST /api/settings/language`           | `LanguageService`                                                                         | Manual test: Select English, verify UI text.                                                                  |
| 3.4 (Bot Response Language)| Detailed Design - `POST /api/chat`                                           | `ChatService` (backend), `LocalizationService` (backend)                                  | E2E: Ask question in selected language, verify bot response language.                                         |
| **Story 3.4 (Download)** |                                                                              |                                                                                           |                                                                                                               |
| 4.1 (Download Button)    | Detailed Design - `OptionsModalModule`                                       | `OptionsModalModule`                                                                      | Visual inspection: Verify "Download Chat" button presence.                                                    |
| 4.2 (File Download Trigger)| Detailed Design - `GET /api/chat/history/{sessionId}`                      | `OptionsModalModule`, `ChatService` (backend)                                             | E2E: Click button, verify file download prompt.                                                               |
| 4.3 (Downloaded Content) | Detailed Design - `ChatSession`, `ChatMessage`, `GET /api/chat/history/{sessionId}` | `ChatService` (backend)                                                                   | Unit test: Backend history API returns correct format. E2E: Open downloaded file, verify content and format.  |

## Risks, Assumptions, Open Questions

### Risks
-   **Backend Localization Support**: The backend's `LocalizationService` for multilingual AI responses (Story 3.3) might require significant development or integration with a third-party translation API, introducing complexity and potential delays.
    -   **Mitigation**: Prioritize native language support for core responses; explore off-the-shelf solutions for translation APIs if custom implementation is too costly.
-   **Source Accuracy/Reliability**: The quality and trustworthiness of the displayed sources (Story 3.2) depend heavily on the underlying knowledge base and AI's ability to accurately attribute information.
    -   **Mitigation**: Implement robust knowledge base curation processes and explore confidence scoring from AI to filter low-confidence sources.
-   **Chat History Download Security**: If chat history contains sensitive information (though unlikely for this age group), the download feature (Story 3.4) could pose a risk if not handled securely.
    -   **Mitigation**: Ensure all chat data is sanitized before download; for future iterations, consider user authentication for access to personal chat history.

### Assumptions
-   **AI Model Capability**: Assumed that the integrated AI model can generate responses in both Norwegian and English and can effectively utilize provided context (subject, grade level, source information).
-   **Backend API Readiness**: Assumed that the backend `POST /api/chat` endpoint can be readily extended to accept language context and return source metadata without major refactoring.
-   **Supabase Integration**: Assumed that Supabase will be used for any necessary data persistence (e.g., user preferences for language, chat history storage).
-   **Frontend Framework Stability**: Assumed Next.js 16 and React 19 are stable for production use.

### Open Questions
-   **Exact Source Linking Mechanism**: How will the AI determine the most relevant source for a given answer, and what is the technical mechanism for linking to it (e.g., direct URL, document ID lookup)?
-   **Localization Strategy for AI**: Will the AI model itself be fine-tuned for Norwegian, or will a translation layer be used before/after AI processing?
-   **Offline Chat History**: Is there a requirement for users to access downloaded chat history offline? What format other than `.txt` might be needed for this?
-   **Performance Impact of Localization**: What is the expected latency impact of dynamically switching UI language and processing multilingual AI responses?

## Test Strategy Summary

The testing strategy for Epic 3 will focus on ensuring the quality, functionality, and user experience of the enhanced features. Testing will be conducted across multiple levels, including unit, integration, and end-to-end testing, with a strong emphasis on manual UI/UX validation due to the nature of the features.

-   **Test Levels**:
    -   **Unit Tests**: Will be implemented for individual frontend components (e.g., `ChatBubbleComponent`, `SourcedLinkComponent`, `OptionsModalModule`) and backend service functions (e.g., language processing, history retrieval).
    -   **Integration Tests**: Will verify the communication between frontend and backend APIs (e.g., `POST /api/chat` with language/source, `GET /api/chat/history`).
    -   **End-to-End (E2E) Tests**: Will simulate full user journeys (e.g., selecting language, asking questions, checking sources, downloading history) to ensure seamless functionality.
    -   **Manual UI/UX Testing**: Critical for validating visual consistency, responsiveness across devices, accessibility, and the overall user experience.

-   **Test Frameworks/Tools**:
    -   **Frontend**: Vitest, React Testing Library, Playwright/Cypress for E2E tests.
    -   **Backend**: Jest or similar for unit/integration tests.
    -   **Accessibility**: Automated tools like Lighthouse, `axe DevTools` and manual screen reader testing.

-   **Coverage of Acceptance Criteria**:
    -   Each Acceptance Criterion (AC) listed in the "Acceptance Criteria (Authoritative)" section will have at least one corresponding test case.
    -   Specific focus will be on validating:
        -   **Visuals**: Consistent color palette, clear interactive elements, responsive layouts (AC 1.1 - 1.4).
        -   **Source Display**: Correct rendering of source links and their click behavior (AC 2.1 - 2.3).
        -   **Multilingualism**: UI text changes, AI response language (AC 3.1 - 3.4).
        -   **Download History**: Button presence, download trigger, content accuracy (AC 4.1 - 4.3).

-   **Edge Cases**:
    -   **Network Errors**: How the application behaves when API calls fail (e.g., `POST /api/chat`, `GET /api/chat/history`).
    -   **Empty Chat History**: Behavior when trying to download an empty chat.
    -   **Long Messages/Sources**: UI rendering for excessively long chat messages or source URLs.
    -   **Unsupported Language**: User attempting to input a language other than Norwegian or English.
    -   **No Source Available**: How the bot response is displayed if no source is found.
