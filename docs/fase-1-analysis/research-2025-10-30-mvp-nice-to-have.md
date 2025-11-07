# Research: MVP and Nice-to-Have Feature Analysis (2025-10-30)

## Introduction
This document provides an analysis of the Minimum Viable Product (MVP) features and "Nice-to-Have" optional extensions for the Sentiabot project, as outlined in the `proposal.md` file. The assessment focuses on the soundness, feasibility, value, and alignment with the project's background, purpose, and target users (elementary school students aged 6-12).

## MVP (Must Have) Features Analysis

The MVP features are generally well-defined and appear to cover the essential functionalities required to deliver initial value and achieve the project's core purpose. They are focused and address key challenges related to providing an understandable and reliable information source for young students.

*   **Feature 1: Relevant and accurate knowledge base.**
    *   **Assessment:** Sound. This is the foundational element for the chatbot's utility and credibility.
*   **Feature 2: User friendly interface. Must be minimalistic, clear & easy to navigate with colorful design.**
    *   **Assessment:** Sound. Crucial for the target age group to ensure engagement and ease of use.
*   **Feature 3: Working chatbot that can answer questions asked by students.**
    *   **Assessment:** Sound. This is the primary function of the application.
*   **Feature 4: Make the user choose a category within science (Biology & Geology) - to help make the context smaller for the AI.**
    *   **Assessment:** Sound. A pragmatic approach to manage AI scope, improve contextual accuracy, and reduce hallucination risk for an MVP.
*   **Feature 5: The user is able to choose what class they’re taking, so the chatbot can adapt its language to the student’s reading level.**
    *   **Assessment:** Sound. Directly addresses the diverse needs of the target age group and enhances personalization and comprehension.
*   **Feature 6: The chatbot provides sources for the answers it gives the students.**
    *   **Assessment:** Sound. Essential for fostering critical thinking skills in young learners and validating the information provided, aligning with the project's background.
*   **Feature 7: The chatbot uses the knowledgebase instead of hallucinating. The knowledgebase is hosted as a Supabase vector database.**
    *   **Assessment:** Sound. Critical for ensuring the reliability and trustworthiness of the AI, directly mitigating a common AI limitation.
*   **Feature 8: The ability to answer questions in both Norwegian and English.**
    *   **Assessment:** Sound. Significantly expands the accessibility and potential user base.
*   **Feature 9: The ability for students to download their chatlog locally.**
    *   **Assessment:** Sound. Provides practical benefits for students, parents, and teachers for review, sharing, or personal learning records.
*   **Feature 10: A separate site for admins to update the knowledgebase.**
    *   **Assessment:** Sound. Absolutely necessary for the ongoing maintenance, expansion, and quality control of the knowledge base, ensuring the long-term viability of Feature 1.
*   **Feature 11: System prompt in its own database field, so that an admin can debug it.**
    *   **Assessment:** Sound. Crucial for effective AI management, debugging, and iterative improvement of the chatbot's behavior and responses.

## Nice-to-Have (Optional Extensions) Features Analysis

These features represent logical and valuable extensions that can significantly enhance the Sentiabot experience beyond the MVP. Many directly improve the learning experience or provide mechanisms for continuous product improvement.

*   **Feature 12: Expand the amount of subjects.**
    *   **Assessment:** Sound. A natural and valuable future growth path once the initial science subjects are stable and proven.
*   **Feature 13: Ability to show users images. These would be curriculum diagrams.**
    *   **Assessment:** Sound. Highly beneficial for visual learners and for explaining complex scientific concepts to children. This could significantly enhance comprehension and engagement.
*   **Feature 14: Ability to log unanswered questions to a text file.**
    *   **Assessment:** Sound. Provides valuable data for identifying gaps in the knowledge base and prioritizing content creation or refinement.
*   **Feature 15: Text-to-speech for younger students.**
    *   **Assessment:** Sound. Excellent for younger students or those with reading difficulties, significantly enhancing accessibility and inclusivity.
*   **Feature 16: Expand logging anonymized questions to find common patterns in unanswered questions for knowledgebase expansion.**
    *   **Assessment:** Sound. An advanced and more analytical version of Feature 14, offering deeper insights for strategic knowledge base development.
*   **Feature 17: Separate interface for parents and students.**
    *   **Assessment:** Sound. Could offer tailored experiences and controls for different user roles, but would add complexity to the development. Appropriate as a "nice-to-have."
*   **Feature 18: The ability for students to upload their previous chatlogs into the chatbot to resume previous conversation.**
    *   **Assessment:** Sound. Improves continuity and user experience by allowing students to pick up where they left off, though it may introduce state management complexities.
*   **Feature 19: The ability for parents to give feedback on whether an answer was good or not.**
    *   **Assessment:** Sound. Provides a direct and invaluable feedback loop for continuous quality improvement and content validation.

## Recommendations

1.  **Re-evaluate Feature 13 (Images) for earlier prioritization:** Given the visual learning preferences of the target age group, integrating curriculum diagrams could provide a substantial boost to the educational value and user engagement. Consider if a simplified version could be included in a post-MVP but pre-full "nice-to-have" phase.
2.  **Prioritize Feature 14/16 (Logging Unanswered Questions):** Implementing a mechanism to log unanswered questions (even a basic text file initially) is a low-cost, high-value feature. It directly supports the continuous improvement of the core knowledge base by highlighting areas needing attention.
3.  **Robust Knowledge Base Strategy:** The success criterion of "95% accuracy on curriculum related questions" is ambitious. Ensure that the strategy for building, curating, and maintaining the "Relevant and accurate knowledge base" (Feature 1) is comprehensive and sustainable to meet this high standard.

Overall, the feature breakdown is logical and well-aligned with the project's objectives. The MVP is focused, and the "nice-to-have" features offer clear paths for future enhancement.