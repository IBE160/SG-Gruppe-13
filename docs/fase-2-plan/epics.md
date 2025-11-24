## Product Roadmap: Sentiabot

This roadmap outlines the development plan for Sentiabot, an AI-powered chatbot for elementary school students. It has been restructured to prioritize a foundational, vertically-sliced approach to deliver value iteratively.

### Epic 1: Foundational End-to-End Chat

**Goal:** Establish the core technical infrastructure and deliver the simplest possible end-to-end user experience. This provides a working skeleton of the application that can be built upon in subsequent epics.

*   **Story 1.1:** As a student, I want to access a deployed application and see a "Hello World" message from the backend, so that I know the core system is operational.
    *   **Acceptance Criteria:**
        1.  A frontend and backend are initialized, connected, and deployed to a public URL.
        2.  When I navigate to the application's public URL, I see a "Hello World" message originating from the backend.
        3.  The application includes a provisioned database, ready for future data integration.

*   **Story 1.2:** As a student, I want to see a single page with an input field and receive a hardcoded response, so that I can see the most basic chat functionality working.
    *   **Acceptance Criteria:**
        1.  Given I am on the main page.
        2.  When I type any question into the chat input and press enter.
        3.  Then I see a static, pre-written answer appear on the screen.

*   **Story 1.3:** As a student, I want my question to be sent to an AI model and get a real, generated response, so that I can have a true conversational experience.
    *   **Acceptance Criteria:**
        1.  Given I am on the chat page.
        2.  When I type a question, it is sent to the AI API.
        3.  Then the response from the AI is displayed back to me.
        4.  The response is generated and displayed within 5 seconds.

### Epic 2: Knowledge-Driven, Contextual Chat

**Goal:** Enhance the chatbot by connecting it to a dedicated knowledge base and allowing users to specify their context, ensuring answers are relevant and accurate.

*   **Story 2.1:** As a student, I want the chatbot to use a dedicated knowledge base for its answers, so that I receive trustworthy information instead of made-up answers.
    *   **Acceptance Criteria:**
        1.  A vector database is set up and populated with at least one sample document.
        2.  Given a user asks a question related to the sample document.
        3.  Then the backend performs a search on the vector database.
        4.  The search results are used by the AI to generate the answer.

*   **Story 2.2:** As a student, I want to choose a subject category before chatting, so that the answers I get are more relevant to what I'm studying.
    *   **Acceptance Criteria:**
        1.  Given I am on the home page.
        2.  I can see options for "Biology" and "Geology".
        3.  When I select a category, my choice is stored.
        4.  Then the AI uses this category as context when generating answers.

*   **Story 2.3:** As a student, I want to select my grade level, so the chatbot can use language that is easy for me to understand.
    *   **Acceptance Criteria:**
        1.  Given I am on the home page.
        2.  I can select a grade level from a list (e.g., 1-6).
        3.  When I select a grade level, my choice is stored.
        4.  Then the chatbot's system prompt is updated to instruct the AI to tailor its language for my grade.

### Epic 3: Enhanced User Experience and Features

**Goal:** Improve the user interface and add key features that make the tool more useful and engaging for students.

*   **Story 3.1:** As a student, I want to interact with a simple, colorful, and easy-to-navigate interface, so that I can focus on learning without getting distracted.
    *   **Acceptance Criteria:**
        1.  The application uses a consistent, bright color palette.
        2.  All interactive elements (buttons, menus) are clearly labeled and have a large click/tap area.
        3.  The layout is clean and minimalist, with no more than 3-4 primary actions visible on the main screen.
        4.  The design is responsive and usable on both desktop and tablet devices.

*   **Story 3.2:** As a student, I want the chatbot to provide the source for its information, so that I can check where the answer came from.
    *   **Acceptance Criteria:**
        1.  Given the chatbot provides an answer based on the knowledge base.
        2.  Then a "Source" link is displayed beneath the answer.
        3.  When I click the link, I am taken to the original source document or page.

*   **Story 3.3:** As a student, I want to be able to ask questions and get answers in both Norwegian and English, so that I can use the language I'm most comfortable with.
    *   **Acceptance Criteria:**
        1.  Given I have selected "Norwegian" as my language.
        2.  When I ask a question in Norwegian, the chatbot responds in Norwegian.
        3.  Given I have selected "English" as my language.
        4.  When I ask a question in English, the chatbot responds in English.

*   **Story 3.4:** As a student, I want to download my chat history, so that I can save it and look at it later.
    *   **Acceptance Criteria:**
        1.  Given I have had a conversation with the chatbot.
        2.  I can click a "Download" button.
        3.  When I click the button, a .txt file containing the full chat log is downloaded to my computer.

### Epic 4: Administration and System Management

**Goal:** Create the necessary tools for administrators to manage the application's content and behavior securely.

*   **Story 4.1:** As an administrator, I need a secure way to log in, so that only authorized users can manage the system.
    *   **Acceptance Criteria:**
        1.  There is a separate login page for administrators.
        2.  Given I enter valid administrator credentials, I am granted access to the admin dashboard.
        3.  Given I enter invalid credentials, I am shown an error message and denied access.

*   **Story 4.2:** As an administrator, I want an interface to add, edit, and delete content in the knowledge base, so that I can keep the information accurate and up-to-date.
    *   **Acceptance Criteria:**
        1.  Given I am logged in as an administrator.
        2.  I can view a list of all documents in the knowledge base.
        3.  I can create a new document.
        4.  I can edit an existing document.
        5.  I can delete a document.

*   **Story 4.3:** As an administrator, I want to be able to modify the chatbot's system prompt, so that I can refine its behavior and tone without needing to redeploy the application.
    *   **Acceptance Criteria:**
        1.  Given I am logged in as an administrator.
        2.  I can see the current system prompt in a text editor.
        3.  I can modify the prompt and save my changes.
        4.  The next chat session uses the updated system prompt.
