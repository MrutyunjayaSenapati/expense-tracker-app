# AGENTS.md
Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
## Expense Tracker --- AI Agent Instructions

This file is the primary instruction set for AI coding agents working in
this repository.

Agents may include:

-   Google Antigravity
-   Codex
-   Claude Code
-   OpenCode
-   Other coding agents

------------------------------------------------------------------------

# 1. Read the Documentation First

Before making implementation changes, read:

``` text
docs/PRD.md
docs/DESIGN_SYSTEM.md
docs/ARCHITECTURE.md
docs/MOCK_DATA.md
docs/NAVIGATION.md
docs/AI_DEVELOPMENT_GUIDE.md
```

These documents are the project's source of truth.

Do not invent requirements that are already defined in the
documentation.

------------------------------------------------------------------------

# 2. Product Goal

This project is a modern personal expense-tracking mobile application.

Current development phase:

``` text
React Native
Expo
TypeScript
Mock JSON data
Production-quality UI
```

The backend is intentionally not implemented yet.

Future backend options may include:

``` text
FastAPI
Node.js
Firebase
```

The frontend must remain backend-independent.

------------------------------------------------------------------------

# 3. Core Architecture Rule

Use this data flow:

``` text
Screen
  ↓
Feature Component
  ↓
Hook
  ↓
Repository Interface
  ↓
Mock Repository
  ↓
Mock JSON
```

Later:

``` text
Screen
  ↓
Feature Component
  ↓
Hook
  ↓
Repository Interface
  ↓
API/Firebase Repository
  ↓
Backend
```

Never bypass the repository layer from screens.

------------------------------------------------------------------------

# 4. Do Not Import Mock JSON Directly Into Screens

Never write:

``` tsx
import transactions from "@/data/mock/transactions.json";
```

inside screens.

Use:

``` text
useTransactions()
```

through the repository abstraction.

This is required so the mock source can later be replaced without
rewriting the UI.

------------------------------------------------------------------------

# 5. Follow the Design System

Use the tokens defined in:

``` text
docs/DESIGN_SYSTEM.md
```

Do not randomly introduce:

``` text
Colors
Font sizes
Spacing
Border radii
Shadows
Dimensions
```

when an existing design token already exists.

Prefer:

``` tsx
colors.primary
spacing.md
radius.md
```

over arbitrary values.

------------------------------------------------------------------------

# 6. Reuse Components

Before creating a component:

1.  Search for an existing equivalent.
2.  Check whether it can accept a new prop.
3.  Check whether the functionality belongs in an existing feature
    component.
4.  Create a new component only when necessary.

Avoid duplicate components such as:

``` text
Button
PrimaryButton
MainButton
SaveButton
SubmitButton
```

when one configurable component is sufficient.

------------------------------------------------------------------------

# 7. Feature Organization

Feature-specific code belongs under:

``` text
src/features/
```

Examples:

``` text
src/features/transactions/
src/features/budgets/
src/features/accounts/
src/features/categories/
src/features/reports/
src/features/dashboard/
```

Reusable primitives belong under:

``` text
src/components/ui/
```

------------------------------------------------------------------------

# 8. State Management

Follow these rules:

``` text
Server/cache data → TanStack Query
Local component state → useState
Global client state → Zustand
Form state → React Hook Form
Validation → Zod
```

Do not put every piece of application data into Zustand.

Do not duplicate TanStack Query data in Zustand without a clear reason.

------------------------------------------------------------------------

# 9. Navigation

Follow:

``` text
docs/NAVIGATION.md
```

Do not invent new routes when an existing route should be reused.

Use stable IDs:

``` text
/transactions/txn_001
```

Do not pass entire domain objects through route parameters.

------------------------------------------------------------------------

# 10. Backend Independence

Do not add:

``` text
FastAPI-specific logic
Node.js-specific logic
Firebase-specific logic
Database-specific logic
```

to screens or reusable UI components.

Backend-specific code belongs behind:

``` text
repositories
services
mappers
```

------------------------------------------------------------------------

# 11. UI Quality

A screen is not complete simply because it renders.

Verify:

``` text
Layout
Spacing
Typography
Colors
Icons
Safe areas
Keyboard behavior
Scrolling
Loading
Empty state
Error state
Success feedback
Accessibility
Navigation
```

Follow the pixel-perfect QA process in:

``` text
docs/DESIGN_SYSTEM.md
docs/AI_DEVELOPMENT_GUIDE.md
```

------------------------------------------------------------------------

# 12. Responsive Design

Do not hardcode a single device size.

Avoid:

``` tsx
width: 390
height: 844
```

Use responsive layout techniques.

The UI should work on:

``` text
Small Android phones
Standard Android phones
Large Android phones
iPhones
```

------------------------------------------------------------------------

# 13. Financial Data

Store money as numbers:

``` ts
amount: 2500
```

not:

``` ts
amount: "₹2,500"
```

Format currency only at the presentation layer.

Use the centralized currency formatter.

------------------------------------------------------------------------

# 14. Domain Models

Use the models defined in:

``` text
docs/MOCK_DATA.md
```

Do not create competing versions of:

``` text
Transaction
Category
Account
Budget
User
Receipt
```

Use IDs for relationships.

------------------------------------------------------------------------

# 15. Forms

Use:

``` text
React Hook Form
+
Zod
```

for complex forms.

The Add Expense and Edit Transaction forms should share the same form
architecture.

Do not maintain two unrelated implementations.

------------------------------------------------------------------------

# 16. Loading, Empty, and Error States

Every data-driven screen must intentionally handle:

``` text
Loading
Empty
Error
Success
```

Do not leave blank screens.

Errors should provide recovery where possible:

``` text
Try Again
Go Back
```

------------------------------------------------------------------------

# 17. Accessibility

Interactive components must have meaningful accessibility information.

Icon-only controls need labels.

Do not rely on color alone to communicate:

``` text
Income
Expense
Warning
Error
Success
```

------------------------------------------------------------------------

# 18. Dependencies

Do not install a dependency without first checking:

1.  Whether Expo/React Native already provides the capability.
2.  Whether an existing project dependency solves it.
3.  Whether the package is compatible with the current Expo version.
4.  Whether the dependency is genuinely necessary.

If a major dependency is required, explain why before introducing it.

------------------------------------------------------------------------

# 19. Scope Control

When asked to implement a feature:

-   Modify only relevant files.
-   Do not refactor unrelated code.
-   Do not redesign unrelated screens.
-   Do not change global architecture without approval.
-   Do not modify the design system globally for a local problem.

If a broader change is genuinely necessary, explain it first.

------------------------------------------------------------------------

# 20. Before Creating a File

Ask:

``` text
Does this functionality already exist?
Can it be added to an existing file?
Is this a reusable component?
Is this feature-specific?
Does the architecture require a new layer?
```

Do not create files merely because it makes the current task easier.

------------------------------------------------------------------------

# 21. Before Changing Architecture

Stop and ask for approval before:

``` text
Changing state management
Changing navigation architecture
Replacing the repository pattern
Replacing the styling system
Adding a major framework
Changing domain models
Changing repository contracts
Changing authentication architecture
Adding backend-specific coupling
```

Small implementation details do not require approval.

------------------------------------------------------------------------

# 22. AI Implementation Workflow

For each task:

``` text
1. Read relevant documentation.
2. Inspect existing code.
3. Identify reusable components.
4. Create a short implementation plan.
5. Implement the smallest coherent change.
6. Run TypeScript.
7. Run lint.
8. Run tests.
9. Run Expo.
10. Perform visual QA.
11. Review the diff.
12. Report what changed.
```

------------------------------------------------------------------------

# 23. Preferred Task Size

Good:

``` text
Implement the Dashboard.
```

Good:

``` text
Add transaction filtering.
```

Good:

``` text
Create the Category selection bottom sheet.
```

Avoid:

``` text
Build the complete application.
```

Large tasks should be broken into smaller tasks.

------------------------------------------------------------------------

# 24. Visual QA

After UI changes, inspect the actual running application.

Check:

``` text
Spacing
Alignment
Typography
Color
Icon size
Card size
Border radius
Shadows
Safe area
Keyboard
Scrolling
Loading
Empty
Error
```

Do not declare a screen complete based only on source code.

------------------------------------------------------------------------

# 25. Testing

At minimum, run:

``` text
TypeScript
Lint
Relevant tests
```

For important flows, verify:

``` text
Add Expense
Edit Transaction
Delete Transaction
Filter Transactions
Create Budget
```

------------------------------------------------------------------------

# 26. Code Quality

Prefer:

``` text
Simple
Explicit
Typed
Reusable
Readable
```

Avoid unnecessary abstraction.

Do not create complex architecture merely to make the project look
sophisticated.

------------------------------------------------------------------------

# 27. No AI Spaghetti Code

Do not produce:

``` text
Huge screen files
Duplicated calculations
Duplicated components
Repeated styles
Direct API calls in UI
Direct JSON imports in screens
Unnecessary global state
Unnecessary dependencies
Copy-pasted business logic
```

Extract logic according to responsibility:

``` text
Component
Hook
Utility
Selector
Repository
Service
```

------------------------------------------------------------------------

# 28. Console and Temporary Code

Remove unnecessary:

``` ts
console.log()
```

before completing a task.

Do not leave:

``` text
TODO
FIXME
temporary mock hacks
debug UI
```

unless intentionally documented.

Never log:

``` text
Passwords
Tokens
Sensitive financial information
Private user data
```

------------------------------------------------------------------------

# 29. Git

Prefer focused commits.

Examples:

``` text
feat: add dashboard
feat: add transaction filters
feat: implement add expense form
fix: correct budget calculation
refactor: extract transaction row
test: add transaction filtering tests
```

Avoid meaningless commit messages:

``` text
update
changes
stuff
final
done
```

------------------------------------------------------------------------

# 30. Completion Report

After a task, report:

``` text
Implemented:
- ...

Files changed:
- ...

Verification:
- TypeScript: PASS
- Lint: PASS
- Tests: PASS
- Visual QA: PASS

Notes:
- ...
```

Keep the report concise.

------------------------------------------------------------------------

# 31. Current Development Phase

The project is currently:

``` text
PHASE 1 — FRONTEND UI
```

Focus on:

``` text
Expo
React Native
TypeScript
Mock JSON
Navigation
Design system
Reusable components
Pixel-perfect UI
Animations
Accessibility
Testing
```

Do NOT implement yet:

``` text
Real authentication
Real backend
Bank integration
UPI integration
SMS parsing
OCR
AI categorization
Cloud synchronization
Production payments
```

unless explicitly requested.

------------------------------------------------------------------------

# 32. Backend Preparation

The frontend must be designed so that later:

``` text
MockRepository
```

can become:

``` text
ApiRepository
```

without rewriting:

``` text
Screens
Feature components
Forms
Navigation
Design system
```

------------------------------------------------------------------------

# 33. Final Rule

The goal is not:

``` text
Generate as much code as possible.
```

The goal is:

``` text
Build a high-quality,
maintainable,
well-designed,
backend-independent
React Native application.
```

AI should accelerate development while preserving human-readable
architecture and product quality.
