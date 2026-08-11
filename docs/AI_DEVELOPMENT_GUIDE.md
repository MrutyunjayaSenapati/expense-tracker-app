# AI_DEVELOPMENT_GUIDE.md

## Expense Tracker --- AI-Assisted Development Guide

**Purpose:** Define how AI coding agents such as Google Antigravity,
Codex, Claude Code, and OpenCode should work on this project.

**Primary goal:** Use AI to accelerate development without sacrificing
architecture, visual quality, maintainability, or developer
understanding.

------------------------------------------------------------------------

# 1. AI Development Philosophy

AI is an implementation assistant, not the product architect.

The AI must:

-   Follow the existing specifications.
-   Inspect the repository before changing code.
-   Reuse existing architecture.
-   Make small, reviewable changes.
-   Avoid unnecessary dependencies.
-   Preserve existing behavior.
-   Verify its work.
-   Explain important architectural decisions.
-   Never assume that generated code is correct.

The developer remains responsible for:

-   Product decisions
-   Architecture decisions
-   Security decisions
-   Backend decisions
-   Final UI quality
-   Code review
-   Release decisions

------------------------------------------------------------------------

# 2. Source-of-Truth Hierarchy

When instructions conflict, use this order:

``` text
1. Current user/developer instruction
2. PRD.md
3. DESIGN_SYSTEM.md
4. ARCHITECTURE.md
5. NAVIGATION.md
6. MOCK_DATA.md
7. AI_DEVELOPMENT_GUIDE.md
8. Existing implementation
```

If a change would contradict a higher-priority specification, stop and
explain the conflict rather than silently changing the architecture.

------------------------------------------------------------------------

# 3. Required Documentation Reading

Before implementing a feature, the AI must read:

``` text
docs/PRD.md
docs/DESIGN_SYSTEM.md
docs/ARCHITECTURE.md
docs/NAVIGATION.md
docs/MOCK_DATA.md
```

Then inspect:

``` text
Relevant screen
Relevant feature folder
Existing shared components
Theme tokens
Hooks
Repository interfaces
Navigation
Tests
```

Do not start coding based only on the user's short request if the
project documentation contains the required context.

------------------------------------------------------------------------

# 4. Inspect Before Modify

Before editing:

``` text
1. Locate the target screen.
2. Locate related components.
3. Locate related hooks.
4. Locate repository interface.
5. Locate mock repository.
6. Locate relevant types.
7. Check existing tests.
8. Check navigation dependencies.
```

The AI should understand the current implementation before introducing a
new pattern.

------------------------------------------------------------------------

# 5. Task Size

Work on one coherent feature at a time.

Good:

``` text
Implement the Home Dashboard using the existing design system and mock repository.
```

Good:

``` text
Implement transaction filtering on the Transactions screen.
```

Bad:

``` text
Build the entire expense app.
```

Large tasks increase the risk of:

-   Duplicated components
-   Inconsistent styling
-   Broken navigation
-   Unnecessary dependencies
-   Architecture drift
-   Hard-to-review changes

------------------------------------------------------------------------

# 6. Standard AI Task Workflow

Every implementation task should follow:

``` text
Understand
   ↓
Inspect
   ↓
Plan
   ↓
Implement
   ↓
Type-check
   ↓
Lint
   ↓
Test
   ↓
Run app
   ↓
Visual QA
   ↓
Review diff
   ↓
Report result
```

------------------------------------------------------------------------

# 7. Step 1 --- Understand

The AI should identify:

``` text
What feature is being built?
Which screen is affected?
Which user flow is affected?
Which data models are involved?
Which components already exist?
Which documentation rules apply?
```

Before coding, provide a short implementation plan.

Example:

``` text
Plan:
1. Add TransactionList component.
2. Connect useTransactions hook.
3. Add filter state.
4. Reuse existing FilterSheet.
5. Add empty/loading/error states.
6. Run type-check and lint.
7. Verify the screen visually.
```

------------------------------------------------------------------------

# 8. Step 2 --- Inspect

Search the repository before creating files.

Look for:

``` text
Existing Button
Existing Card
Existing Input
Existing BottomSheet
Existing TransactionRow
Existing formatting utilities
Existing theme tokens
Existing repository interfaces
```

Do not create a new component simply because the agent cannot
immediately find the existing one.

------------------------------------------------------------------------

# 9. Step 3 --- Plan

The plan must identify:

``` text
Files to create
Files to modify
Files that should remain untouched
Potential dependencies
Potential architectural impact
```

If architecture must change, explain why before making the change.

------------------------------------------------------------------------

# 10. Step 4 --- Implement

Follow:

``` text
PRD
DESIGN_SYSTEM
ARCHITECTURE
NAVIGATION
MOCK_DATA
```

The implementation must use:

``` text
Theme tokens
Reusable components
Typed domain models
Repository interfaces
Hooks
Existing navigation
```

Do not bypass these layers for convenience.

------------------------------------------------------------------------

# 11. Screen Implementation Pattern

Preferred:

``` text
Screen
 ↓
Feature Hook
 ↓
Repository
 ↓
Mock Data
```

Example:

``` tsx
export default function TransactionsScreen() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTransactions();

  return (
    <Screen>
      <TransactionsHeader />
      <TransactionList
        transactions={data ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
    </Screen>
  );
}
```

Avoid putting repository calls directly inside the screen.

------------------------------------------------------------------------

# 12. Do Not Import Mock JSON Into Screens

Never:

``` tsx
import transactions from "@/data/mock/transactions.json";
```

inside a screen.

Use:

``` text
useTransactions()
```

which uses the repository abstraction.

This is required because the mock source will later be replaced.

------------------------------------------------------------------------

# 13. Component Reuse Rules

Before creating a component, ask:

``` text
Does an equivalent component already exist?
Can an existing component accept a new prop?
Is this component reusable?
Is the behavior specific to one feature?
```

Use:

``` text
src/components/ui/
```

for reusable primitives.

Use:

``` text
src/features/<feature>/components/
```

for feature-specific components.

------------------------------------------------------------------------

# 14. Avoid Component Duplication

Do not create:

``` text
PrimaryButton.tsx
SaveButton.tsx
SubmitButton.tsx
MainButton.tsx
```

if one configurable Button component is sufficient.

Prefer:

``` tsx
<Button
  variant="primary"
  loading={isSaving}
  onPress={handleSave}
>
  Save Expense
</Button>
```

------------------------------------------------------------------------

# 15. Design System Rules

Never invent visual values unnecessarily.

Bad:

``` tsx
padding: 17
borderRadius: 13
color: "#6439E8"
```

Preferred:

``` tsx
padding: spacing.md
borderRadius: radius.md
color: colors.primary
```

The AI must use the design tokens from `DESIGN_SYSTEM.md`.

------------------------------------------------------------------------

# 16. Pixel-Perfect Workflow

A screen is not finished after compilation.

The AI-assisted workflow should be:

``` text
Implement
 ↓
Run Expo
 ↓
Open screen
 ↓
Take screenshot
 ↓
Compare against design specification/reference
 ↓
Identify differences
 ↓
Fix spacing/typography/layout
 ↓
Repeat
```

Check:

``` text
Spacing
Alignment
Typography
Colors
Icon size
Card dimensions
Border radius
Shadows
Safe area
Keyboard behavior
Scrolling
```

------------------------------------------------------------------------

# 17. Visual QA Checklist

For every important screen:

``` text
[ ] Header alignment
[ ] Screen horizontal padding
[ ] Section spacing
[ ] Typography hierarchy
[ ] Financial number formatting
[ ] Icon sizing
[ ] Button height
[ ] Input height
[ ] Card radius
[ ] Borders
[ ] Shadows
[ ] Bottom navigation
[ ] Safe areas
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Keyboard behavior
[ ] Android back behavior
```

------------------------------------------------------------------------

# 18. Responsive UI

Never design around one device.

Do not hardcode:

``` tsx
width: 390
height: 844
```

Test at least:

``` text
Small Android
Standard Android
Large Android
iPhone
```

Use:

``` text
flex
percentage widths
maxWidth
useWindowDimensions
safe-area insets
```

where appropriate.

------------------------------------------------------------------------

# 19. Data Rules

Use domain types from `MOCK_DATA.md`.

Do not create screen-specific versions of:

``` text
Transaction
Account
Budget
Category
```

unless the model is explicitly a view model.

Keep:

``` text
Domain Model
```

separate from:

``` text
Presentation/View Model
```

when necessary.

------------------------------------------------------------------------

# 20. Financial Data Rules

Never format data before calculation.

Bad:

``` ts
const amount = "₹12,450";
```

Good:

``` ts
const amount = 12450;
```

Then:

``` ts
formatCurrency(amount);
```

Calculations must use numbers.

------------------------------------------------------------------------

# 21. Backend Independence

The AI must never put backend-specific logic inside screens.

Bad:

``` text
Screen → Firebase
```

or:

``` text
Screen → Axios → FastAPI
```

Preferred:

``` text
Screen
 ↓
Hook
 ↓
Repository
 ↓
Service
 ↓
Backend
```

------------------------------------------------------------------------

# 22. Mock Repository Rules

Mock repositories should behave similarly to real repositories.

They should support:

``` text
Read
Create
Update
Delete
Loading
Error
```

where the relevant feature requires them.

If adding an expense, the mock data should update so that:

``` text
Dashboard
Transactions
Budgets
Reports
```

can reflect the change.

------------------------------------------------------------------------

# 23. Mock Network Delay

Use a small optional artificial delay.

Example:

``` text
100–500ms
```

This allows loading states to be tested.

Do not make every UI interaction artificially slow.

------------------------------------------------------------------------

# 24. Error Simulation

The AI should implement error states even before the real backend
exists.

Optional configuration:

``` ts
MOCK_ERROR_MODE = false;
```

Possible simulated errors:

``` text
Network error
Server error
Not found
Validation error
```

The UI should show useful recovery actions.

------------------------------------------------------------------------

# 25. Loading States

Avoid blank screens.

Use:

``` text
Skeleton
Placeholder
Progress indicator
```

depending on context.

For lists:

``` text
List skeleton
```

For dashboard:

``` text
Summary skeleton
Chart skeleton
Transaction skeleton
```

------------------------------------------------------------------------

# 26. Empty States

Every list must have an intentional empty state.

Example:

``` text
No transactions yet

Start tracking your spending.

[Add Expense]
```

The AI must not simply render an empty `FlatList`.

------------------------------------------------------------------------

# 27. Error States

Errors must be actionable.

Example:

``` text
Unable to load transactions.

Please try again.

[Try Again]
```

Do not display raw exceptions to users.

------------------------------------------------------------------------

# 28. Accessibility

Every interactive element must have an accessible role/label where
needed.

Icon-only button:

``` tsx
<IconButton
  accessibilityLabel="Filter transactions"
/>
```

Transaction:

``` text
Expense: Lunch at Cafe, ₹350, today
```

Do not rely only on color to communicate:

``` text
Expense
Income
Warning
Error
```

------------------------------------------------------------------------

# 29. Navigation Rules

Before adding a route:

``` text
Check NAVIGATION.md.
```

Do not invent route structures.

Use stable IDs:

``` text
/transactions/txn_001
```

Do not pass entire domain objects through navigation params.

------------------------------------------------------------------------

# 30. State Management Rules

Follow:

``` text
Server/cache data → TanStack Query
Local component state → useState
Global client state → Zustand
Form state → React Hook Form
Validation → Zod
```

Do not put everything into Zustand.

Do not duplicate TanStack Query data in Zustand unless there is a clear
reason.

------------------------------------------------------------------------

# 31. Dependency Rules

Before adding a package:

1.  Check whether an existing package already solves the problem.
2.  Check whether React Native/Expo already provides the capability.
3.  Check whether the dependency is compatible with the current Expo
    SDK.
4.  Explain why it is needed.
5.  Avoid adding large libraries for small features.

Never silently install several packages to solve one small UI problem.

------------------------------------------------------------------------

# 32. Styling Rules

Use one consistent styling approach.

Do not introduce a new styling framework just for one screen.

Theme values belong in:

``` text
src/theme/
```

Shared styles should not be copied across multiple screens.

------------------------------------------------------------------------

# 33. Business Logic Rules

Business logic should not live inside JSX.

Bad:

``` tsx
{transactions
  .filter(...)
  .sort(...)
  .map(...)}
```

when the logic is complex.

Move complex logic into:

``` text
hooks
utils
selectors
repositories
```

depending on responsibility.

------------------------------------------------------------------------

# 34. Derived Financial Data

Examples:

``` text
Total expense
Total income
Net savings
Budget percentage
Remaining budget
Category percentage
```

should be derived consistently.

Create reusable utilities/selectors instead of duplicating calculations
across screens.

------------------------------------------------------------------------

# 35. Forms

Use:

``` text
React Hook Form
+
Zod
```

for complex forms.

The Add Expense and Edit Transaction screens should reuse the same form
architecture.

Avoid maintaining two independent implementations.

------------------------------------------------------------------------

# 36. Testing Before Completion

At minimum:

``` text
TypeScript
Lint
Relevant unit tests
Relevant component tests
```

For important user flows:

``` text
Add Expense
Edit Expense
Delete Expense
Create Budget
Filter Transactions
```

Add integration/E2E coverage progressively.

------------------------------------------------------------------------

# 37. AI Self-Review

Before declaring a task complete, the AI should ask itself:

``` text
Did I follow the PRD?
Did I follow the design system?
Did I reuse existing components?
Did I bypass the repository?
Did I add unnecessary dependencies?
Did I change unrelated files?
Did I introduce duplicated logic?
Did I handle loading?
Did I handle empty state?
Did I handle errors?
Did I verify navigation?
Did I verify accessibility?
Did I visually inspect the screen?
```

------------------------------------------------------------------------

# 38. Diff Review

Before finishing, inspect the final diff.

Look for:

``` text
Unexpected files
Unused imports
Duplicate components
Hardcoded colors
Hardcoded dimensions
Debug logs
Temporary code
Dead code
Unnecessary dependencies
Unrelated modifications
```

Remove temporary code.

------------------------------------------------------------------------

# 39. Console Logs

Development logs are acceptable when useful.

Do not leave unnecessary:

``` ts
console.log(...)
```

in production-facing code.

Never log:

``` text
Passwords
Tokens
Sensitive financial information
Private user data
```

------------------------------------------------------------------------

# 40. Git Rules

Use focused commits.

Examples:

``` text
feat: add design tokens
feat: add app navigation
feat: implement dashboard
feat: implement add expense form
feat: implement transaction list
fix: correct budget progress
refactor: extract transaction row
test: add transaction filtering tests
```

Avoid:

``` text
update
changes
final
done
```

as meaningful feature commits.

------------------------------------------------------------------------

# 41. Recommended Prompt Structure

When asking an AI agent to implement a feature, use:

``` text
CONTEXT
Read:
- docs/PRD.md
- docs/DESIGN_SYSTEM.md
- docs/ARCHITECTURE.md
- docs/NAVIGATION.md
- docs/MOCK_DATA.md

TASK
Implement: [specific feature]

REQUIREMENTS
- [requirement]
- [requirement]
- [requirement]

CONSTRAINTS
- Do not modify unrelated screens.
- Reuse existing components.
- Use mock repository.
- Follow design tokens.
- Do not add dependencies without justification.

VERIFICATION
- TypeScript
- Lint
- Tests
- Visual QA
```

------------------------------------------------------------------------

# 42. Example Antigravity Prompt --- Dashboard

``` text
Read the project documentation before making changes:

- docs/PRD.md
- docs/DESIGN_SYSTEM.md
- docs/ARCHITECTURE.md
- docs/NAVIGATION.md
- docs/MOCK_DATA.md

Implement only the Home Dashboard.

Requirements:
- Follow the dashboard requirements in PRD.md.
- Use the existing design tokens.
- Use the existing transaction/account/budget repositories.
- Use hooks for data access.
- Do not import JSON directly into the screen.
- Reuse existing UI components.
- Implement loading, empty, error, and populated states.
- Make the dashboard responsive on small and large phones.
- Do not modify Transactions, Reports, or Settings.

After implementation:
1. Run TypeScript.
2. Run lint.
3. Run relevant tests.
4. Run the Expo app.
5. Visually inspect the dashboard.
6. Fix obvious spacing, typography, alignment, and safe-area issues.
7. Review the git diff.
```

------------------------------------------------------------------------

# 43. Example Antigravity Prompt --- Add Expense

``` text
Read all project documentation first.

Implement the Add Expense flow only.

Requirements:
- Support Expense and Income.
- Use the amount field as the visual focal point.
- Use React Hook Form and Zod.
- Use category and account selection bottom sheets.
- Default date to today.
- Support optional merchant and note.
- Support receipt UI using the existing receipt model.
- Save through the transaction repository.
- After save, invalidate/update relevant queries.
- Show success feedback.
- Handle validation errors.
- Handle save errors.
- Reuse the same form architecture for future Edit Transaction.

Constraints:
- Do not call APIs directly from the screen.
- Do not import JSON directly.
- Do not create duplicate input/button components.
- Do not modify unrelated screens.

Verify:
- TypeScript
- Lint
- Tests
- Android behavior
- Keyboard behavior
- Visual QA
```

------------------------------------------------------------------------

# 44. Example Antigravity Prompt --- Visual QA

``` text
Perform a visual QA pass on the Home Dashboard.

Do not redesign the screen.

Compare the implementation against:
- docs/DESIGN_SYSTEM.md
- docs/PRD.md

Check:
- safe area
- horizontal padding
- vertical spacing
- typography
- financial value hierarchy
- card radius
- borders
- shadows
- icon sizes
- bottom navigation
- loading state
- empty state
- error state
- small-screen layout

Fix only issues that violate the documented design system or create obvious visual defects.

Do not modify unrelated screens.
```

------------------------------------------------------------------------

# 45. When AI Should Ask for Approval

The AI should stop and ask before:

``` text
Changing the architecture
Changing navigation hierarchy
Replacing state-management libraries
Adding a major dependency
Changing the design system globally
Changing domain models
Changing repository contracts
Removing an established component
Changing authentication architecture
Adding backend-specific coupling
```

Small implementation decisions do not require approval.

------------------------------------------------------------------------

# 46. When AI Should Proceed Automatically

The AI can proceed when:

``` text
Creating a feature-specific component
Adding a screen that is already defined in NAVIGATION.md
Adding mock data that follows MOCK_DATA.md
Adding tests
Fixing a TypeScript error
Fixing a clear styling inconsistency
Extracting duplicated code
Adding loading/empty/error states
```

provided the change does not conflict with project specifications.

------------------------------------------------------------------------

# 47. Avoid AI Spaghetti Code

The following are prohibited:

``` text
Huge screen files
Duplicated components
Duplicated calculations
Direct API calls from UI
Direct JSON imports from screens
Repeated hardcoded styles
Unnecessary global state
Unnecessary dependencies
Copy-pasted business logic
Backend-specific UI code
```

If a file becomes difficult to understand, consider extracting:

``` text
Component
Hook
Utility
Selector
Repository
```

based on responsibility.

Do not blindly split every few lines into a component.

------------------------------------------------------------------------

# 48. Code Quality Principle

Prefer:

``` text
Simple + explicit + reusable
```

over:

``` text
Highly abstract + difficult to understand
```

AI should not create abstractions merely to appear architectural.

An abstraction must have a real purpose.

------------------------------------------------------------------------

# 49. Feature Completion Report

After finishing a task, the AI should report:

``` text
Implemented:
- ...

Files changed:
- ...

Tests:
- TypeScript: PASS
- Lint: PASS
- Tests: PASS

Visual QA:
- PASS / Issues found

Notes:
- ...

Potential follow-up:
- ...
```

Keep the report concise.

------------------------------------------------------------------------

# 50. Final AI Rule

The AI must optimize for:

``` text
Correctness
   +
Consistency
   +
Maintainability
   +
Visual quality
   +
Developer understanding
```

not simply:

``` text
Fastest possible code generation
```

The objective is to build a codebase that a human developer can
understand and continue after the AI stops working on it.

------------------------------------------------------------------------

# 51. Final Development Loop

The complete AI-assisted development loop is:

``` text
                    ┌─────────────┐
                    │    PRD      │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Design      │
                    │ System      │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Architecture│
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Navigation  │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ Mock Data   │
                    └──────┬──────┘
                           ↓
                      AI Task
                           ↓
                       Inspect
                           ↓
                        Plan
                           ↓
                      Implement
                           ↓
                  TypeScript + Lint
                           ↓
                        Tests
                           ↓
                     Run Expo
                           ↓
                     Visual QA
                           ↓
                    Review Diff
                           ↓
                    Commit Change
                           ↓
                    Next Task
```

This loop should be followed throughout the UI development phase.
