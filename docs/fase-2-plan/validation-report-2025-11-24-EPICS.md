# Validation Report

**Document:** docs/fase-2-plan/epics.md
**Checklist:** .bmad/bmm/workflows/2-plan-workflows/prd/checklist.md
**Date:** 2025-11-24

## Summary
- Overall: 0/8 critical failures passed (0%)
- Critical Issues: 2

## Section Results

### Critical Failures (Auto-Fail)
Pass Rate: 6/8 (75%)

❌ **No epics.md file exists**
Evidence: The document `docs/fase-2-plan/epics.md` was provided and exists.

✓ **Epic 1 doesn't establish foundation**
Evidence: Epic 1's goal is to "Establish the core technical infrastructure and deliver the simplest possible end-to-end user experience." The stories (1.1, 1.2, 1.3) detail setting up frontend, backend, deployment, database, and basic chat functionality with hardcoded and AI responses, which clearly forms a foundational layer.

✓ **Stories have forward dependencies**
Evidence: Analysis of all epics and stories shows a logical progression of dependencies flowing from earlier epics/stories to later ones, or independent features (like admin functions). No stories were found to depend on work from a later story or epic.

✓ **Stories not vertically sliced**
Evidence: Each story and its acceptance criteria describe a complete, testable piece of functionality that integrates across relevant layers (UI, backend, AI, DB), rather than isolated horizontal layers of work.

✓ **Epics don't cover all FRs**
Evidence: Upon review of `PRD.md` (`docs/fase-2-plan/PRD.md`) and `epics.md` (`docs/fase-2-plan/epics.md`), all Functional Requirements (FRs) listed in the MVP section of `PRD.md` (FR001-FR011) are covered by the goals and stories within the four epics in `epics.md`.
- FR001, FR007 (Knowledge base): Covered by Epic 2 Goal, Story 2.1, Epic 4 Story 4.2.
- FR002 (User-friendly interface): Covered by Epic 3 Goal, Story 3.1.
- FR003 (Working chatbot): Covered by Epic 1 Goal, Stories 1.2, 1.3.
- FR004 (Choose category): Covered by Epic 2 Goal, Story 2.2.
- FR005 (Choose grade level): Covered by Epic 2 Goal, Story 2.3.
- FR006 (Provides sources): Covered by Epic 3 Goal, Story 3.2.
- FR008 (Multilingual): Covered by Epic 3 Goal, Story 3.3.
- FR009 (Download chatlog): Covered by Epic 3 Goal, Story 3.4.
- FR010 (Admin interface for KB): Covered by Epic 4 Goal, Stories 4.1, 4.2.
- FR011 (Modify system prompt): Covered by Epic 4 Goal, Story 4.3.

❌ **FRs contain technical implementation details**
Evidence: While the FRs in `PRD.md` are high-level and appropriate, the acceptance criteria within `epics.md` for several stories include specific technical implementation details. These should ideally be part of a technical design document, not embedded in functional stories or their acceptance criteria:
- Story 1.1, Acceptance Criteria 1: "A Next.js frontend and FastAPI backend are initialized..." - Specifies technologies.
- Story 1.1, Acceptance Criteria 3: "The application includes a provisioned database..." - Specifies an architectural component.
- Story 2.1, Acceptance Criteria 1: "A vector database is set up..." - Specifies a technology.
- Story 2.3, Acceptance Criteria 4: "Then the chatbot's system prompt is updated..." - Specifies an internal mechanism.
Impact: Potential for over-constraining technical solutions prematurely, reducing architectural flexibility, and obscuring the core functional intent of the stories.

❌ **No FR traceability to stories**
Evidence: The `epics.md` document does not explicitly reference the Functional Requirements (FR) numbers (e.g., FR001, FR002) from the `PRD.md` within the stories or their acceptance criteria. While an implicit mapping can be inferred, explicit traceability is required for clear validation and future development.
Impact: Lack of clear traceability makes it difficult to verify that all functional requirements are covered, to understand the scope of each story in relation to the PRD, and to manage changes effectively throughout the development lifecycle.

✓ **Template variables unfilled**
Evidence: No `{{variable}}` or similar placeholder text was found in the `docs/fase-2-plan/epics.md` document.

## Failed Items

*   **Critical Failure: FRs contain technical implementation details**
    *   **Recommendations:**
        1.  **Must Fix:** Review all stories and their acceptance criteria in `epics.md`.
        2.  **Must Fix:** Refactor acceptance criteria to describe the functional outcome or verifiable behavior, rather than specifying particular technologies (e.g., "Next.js," "FastAPI," "vector database") or internal implementation details (e.g., "system prompt update"). These details belong in technical design documents or architectural specifications.
        3.  **Should Improve:** If specific technologies are truly non-negotiable early decisions, consider moving such declarations to a separate 'Technical Constraints' section in the PRD or a dedicated architectural overview, rather than embedding them in functional acceptance criteria.

*   **Critical Failure: No FR traceability to stories**
    *   **Recommendations:**
        1.  **Must Fix:** Update `epics.md` to explicitly link each story and/or its acceptance criteria to the Functional Requirements (FRs) they fulfill from `PRD.md`. This can be done by referencing FR IDs within the story description or acceptance criteria (e.g., "As a student, I want to access a deployed application... (FR003)").

## Recommendations
1.  **Must Fix:** Refactor the acceptance criteria in `epics.md` to remove specific technical implementation details and focus on verifiable functional outcomes.
2.  **Must Fix:** Update `epics.md` to establish clear, explicit traceability by referencing Functional Requirement (FR) IDs from `PRD.md` within the stories or their acceptance criteria.

## Validation Execution Notes

With the `PRD.md` now available, the validation for FR coverage was successful. However, the validation still identified two critical failures. The acceptance criteria in `epics.md` include technical implementation details that should be deferred to more appropriate technical documentation. More importantly, the `epics.md` lacks explicit traceability to the Functional Requirements outlined in `PRD.md`, making it challenging to unequivocally link stories to their corresponding requirements.

---

**Summary for User:**

The validation of `docs/fase-2-plan/epics.md`, with `docs/fase-2-plan/PRD.md` provided, still resulted in **2 critical failures**.

**Critical Issues Highlighted:**
-   **Technical Details in Stories:** Acceptance criteria for several stories in `epics.md` continue to specify technologies (e.g., Next.js, FastAPI, vector database) and internal mechanisms (e.g., system prompt update). These details should be moved to technical design documents.
-   **No FR Traceability:** While all FRs are covered, the `epics.md` document does not explicitly reference the Functional Requirement (FR) IDs from the `PRD.md` within the stories or their acceptance criteria. This explicit linking is crucial for clear traceability.

The updated validation report has been saved to `docs/fase-2-plan/validation-report-2025-11-24-EPICS.md`. Please address the "Must Fix" recommendations in the report, particularly regarding the removal of technical details from stories and the addition of FR traceability, then I can re-validate.