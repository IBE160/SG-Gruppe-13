## Case Title
Sentiabot

## Background
Elementary school students need a place to gather information that is easy for them to understand. The chatbot also helps students find good sources, as younger students might not be critical enough with their choice of source. 

## Purpose
Create a web application capable of answering any curriculum relevant questions in an understandable and concise manner, while providing easily accessible sources to its information.

## Target Users
Children from 6 to 12 years old. Primarily elementary school students. 

## Core Functionality

### Must Have (MVP)
- Feature 1: Relevant and accurate knowledge base.
- Feature 2: User friendly interface. Must be minimalistic, clear & easy to navigate with colorful design. 
- Feature 3: Working chatbot that can answer questions asked by students.
- Feature 4: Make the user choose a category within science (Biology & Geology) - to help make the context smaller for the AI.
- Feature 5: The user is able to choose what class they’re taking, so the chatbot can adapt its language to the student’s reading level.
- Feature 6: The chatbot provides sources for the answers it gives the students. 
- Feature 7: The chatbot uses the knowledgebase instead of hallucinating. The knowledgebase is hosted as a Supabase vector database. 
- Feature 8: The ability to answer questions in both Norwegian and English.
- Feature 9: The ability for students to download their chatlog locally.
- Feature 10: A separate site for admins to update the knowledgebase.
- Feature 11: System prompt in its own database field, so that an admin can debug it.

### Nice to Have (Optional Extensions)
- Feature 12: Expand the amount of subjects.
- Feature 13: Ability to show users images. These would be curriculum diagrams.
- Feature 14: Ability to log unanswered questions to a text file.
- Feature 15: Text-to-speech for younger students.
- Feature 16: Expand logging anonymized questions to find common patterns in unanswered questions for knowledgebase expansion.
- Feature 17: Separate interface for parents and students.
- Feature 18: The ability for students to upload their previous chatlogs into the chatbot to resume previous conversation.
- Feature 19: The ability for parents to give feedback on whether an answer was good or not.

## Data Requirements
- Data entity 1: An AI capable of answering relevant questions about Science from grade 1-7.
- Data entity 2: Log of questions that the chatbot was unable to answer, anonymized. This means no identifiable chat logs, no personal data collection. 


## User Stories
1. As a student, I want to ask the chatbot for help with my schoolwork. I expect to get help, but not have the whole task solved. 
2. As a student I want to be able to have a dialogue with the chatbot about course material, so that I can further my understanding of the subject.
3. As a student, I want to get support with the tasks from the textbook, so that I can solve them.
4. As a system admin, I want to be able to see the logs of questions that weren’t answered properly, so that I can update the knowledge base when needed.
5. As a system admin, I want to be able to update the knowledgebase through an admin site.

## Technical Constraints
- Must function in a web-browser.
- Training must be constrained to subject material.
- Front-end in Nextjs and tailwind.
- Back end using Python. 
- Database: Supabase.
- AI-model: The one that the teacher is able to source for us for free. 

## Timeline
Week 1: Analysis & planning.
Week 2-3: Solutions-Architecture.
Week 4-5: Implementation.

## Success Criteria
- Criterion 1: Students can learn about Science through the chatbot.
- Criterion 2: The chatbot uses the knowledgebase instead of hallucinating.
- Criterion 3: The chatbot is able to provide accurate sources to its answers. These should be provided alongside its answer in the form of a link.
- Criterion 4: Chatbot answers with 95% accuracy on curriculum related questions.
- Criterion 5: Response time of less than 10 seconds.
- Criterion 6: User friendly interface. Must be minimalistic, clear & easy to navigate with colorful design. 
- Criterion 7: The user is able to choose what class they’re taking, so the chatbot can adapt its language to the student’s reading level.
- Criterion 8: Must be able to answer students in either Norwegian or English.
