## Product Requirements Document: Sentiabot

### Goals

The primary goal of Sentiabot is to create a trustworthy and user-friendly educational tool that helps elementary school students with their schoolwork. The web application will be capable of answering curriculum-relevant questions in an understandable and concise manner, while providing easily accessible sources for its information.

### Background Context

Elementary school students (ages 6-12) need a safe, reliable, and easy-to-understand source for curriculum-related information. They often struggle to find age-appropriate content and evaluate the credibility of online sources. Sentiabot aims to address this by providing a curated and safe environment for learning.

### Functional Requirements (MVP)

- **FR001:** Relevant and accurate knowledge base.
- **FR002:** User-friendly interface. Must be minimalistic, clear & easy to navigate with a colorful design.
- **FR003:** A working chatbot that can answer questions asked by students.
- **FR004:** The user can choose a category within science (Biology & Geology) to help narrow the context for the AI.
- **FR005:** The user is able to choose their grade level, so the chatbot can adapt its language to the student’s reading level.
- **FR006:** The chatbot provides sources for the answers it gives the students.
- **FR007:** The chatbot uses a dedicated knowledge base to ensure answers are based on approved content.
- **FR008:** The ability to answer questions in both Norwegian and English.
- **FR009:** The ability for students to download their chatlog locally.
- **FR010:** A separate interface for admins to update the knowledge base.
- **FR011:** The system prompt can be easily accessed and modified for debugging and refinement by an admin.

### Non-Functional Requirements (Nice to Have)

- **FR012:** Expand the amount of subjects.
- **FR013:** Ability to show users images. These would be curriculum diagrams.
- **FR014:** Ability to log unanswered questions to a text file.
- **FR015:** Text-to-speech for younger students.
- **FR016:** Expand logging anonymized questions to find common patterns in unanswered questions for knowledgebase expansion.
- **FR017:** Separate interface for parents and students.
- **FR018:** The ability for students to upload their previous chatlogs into the chatbot to resume previous conversation.
- **FR019:** The ability for parents to give feedback on whether an answer was good or not.

### Epics

This project will be delivered across four major epics:

-   **Epic 1: Foundational End-to-End Chat:** Establish the core technical infrastructure and deliver the simplest possible end-to-end user experience.
-   **Epic 2: Knowledge-Driven, Contextual Chat:** Enhance the chatbot by connecting it to a dedicated knowledge base and allowing users to specify their context.
-   **Epic 3: Enhanced User Experience and Features:** Improve the user interface and add key features that make the tool more useful and engaging.
-   **Epic 4: Administration and System Management:** Create the necessary tools for administrators to manage the application's content and behavior.

### User Journeys

**Journey 1: Student Gets Help with Homework**

1.  A 4th-grade student lands on the Sentiabot homepage.
2.  They see a simple, colorful interface (**FR002**).
3.  They select their grade level ("4th Grade") and subject ("Biology") from a dropdown menu (**FR004**, **FR005**).
4.  They are taken to the chat screen and type a question: "what is photosynthesis?" (**FR003**).
5.  The chatbot processes the question, consulting its curated knowledge base (**FR007**).
6.  The chatbot provides a clear, age-appropriate answer in English (**FR003**, **FR005**).
7.  Below the answer, the chatbot includes a link to the source material it used (**FR006**).
8.  The student is satisfied and downloads the chat conversation to save for later (**FR009**).

**Journey 2: Admin Updates the Knowledge Base**

1.  An administrator logs into the secure admin portal.
2.  They navigate to the "Knowledge Base Management" section (**FR010**).
3.  They search for the entry on "mitochondria" and find it's too complex for younger students.
4.  They edit the entry to simplify the language and add a new, more appropriate source link.
5.  They save the changes, instantly updating the information available to the chatbot (**FR001**).

**Journey 3: Admin Refines Chatbot Behavior**

1.  An administrator logs into the secure admin portal.
2.  They navigate to a "System Prompt" configuration area.
3.  They modify the prompt to encourage the chatbot to use more analogies when explaining complex topics (**FR011**).
4.  They save the new system prompt and run a few test questions to see the change in the chatbot's behavior.

### Success Metrics

- **Metric 1: Learning Efficacy:** Students can successfully learn about Science topics through chatbot interaction.
- **Metric 2: Knowledgebase Adherence:** The chatbot's responses are consistently grounded in the provided knowledge base, with no unapproved external information (hallucinations).
- **Metric 3: Source Attribution:** The chatbot provides accurate and accessible source links for its answers.
- **Metric 4: Accuracy Rate:** The chatbot achieves at least 95% accuracy on curriculum-related questions.
- **Metric 5: Performance:** The chatbot's response time is under 10 seconds for a typical query.
- **Metric 6: Usability:** The user interface is rated as "user-friendly," "minimalistic," and "easy to navigate" in user feedback.
- **Metric 7: Language Adaptation:** The chatbot correctly adjusts its language complexity based on the student's selected grade level.
- **Metric 8: Multilingual Support:** The chatbot can accurately and fluently respond in both Norwegian and English.


