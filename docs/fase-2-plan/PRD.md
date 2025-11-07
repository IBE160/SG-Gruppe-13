## Product Requirements Document: Sentiabot

### Goals

The primary goal of Sentiabot is to create a trustworthy and user-friendly educational tool that helps elementary school students with their schoolwork. The web application will be capable of answering curriculum-relevant questions in an understandable and concise manner, while providing easily accessible sources for its information.

### Background Context

Elementary school students (ages 6-12) need a safe, reliable, and easy-to-understand source for curriculum-related information. They often struggle to find age-appropriate content and evaluate the credibility of online sources. Sentiabot aims to address this by providing a curated and safe environment for learning.

### Functional Requirements (MVP)

- **Feature 1:** Relevant and accurate knowledge base.
- **Feature 2:** User-friendly interface. Must be minimalistic, clear & easy to navigate with a colorful design.
- **Feature 3:** A working chatbot that can answer questions asked by students.
- **Feature 4:** The user can choose a category within science (Biology & Geology) to help narrow the context for the AI.
- **Feature 5:** The user is able to choose their grade level, so the chatbot can adapt its language to the student’s reading level.
- **Feature 6:** The chatbot provides sources for the answers it gives the students.
- **Feature 7:** The chatbot uses the knowledge base instead of hallucinating. The knowledge base is hosted in a Supabase vector database.
- **Feature 8:** The ability to answer questions in both Norwegian and English.
- **Feature 9:** The ability for students to download their chatlog locally.
- **Feature 10:** A separate site for admins to update the knowledge base.
- **Feature 11:** The system prompt is stored in its own database field so that an admin can easily access and modify it for debugging and refinement.
