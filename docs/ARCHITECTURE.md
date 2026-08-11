# ARCHITECTURE.md

## Expense Tracker --- React Native / Expo Architecture

**Status:** UI-first implementation specification\
**Platform:** React Native + Expo + TypeScript\
**Current data source:** Mock JSON\
**Future backend:** FastAPI, Node.js, or Firebase\
**Primary goal:** Build a production-quality frontend that can switch
from mock data to a real backend with minimal UI changes.

------------------------------------------------------------------------

# 1. Architecture Goals

The application must be:

-   Modular
-   Feature-oriented
-   Type-safe
-   Testable
-   Easy to maintain
-   Easy for AI coding agents to understand
-   Independent of the eventual backend technology
-   Suitable for offline-first behavior later
-   Designed for incremental development

The most important architectural rule is:

> Screens must not depend directly on mock JSON, API clients, Firebase
> SDKs, or backend-specific implementation details.

The UI communicates through application-level hooks and repositories.

------------------------------------------------------------------------

# 2. Technology Stack

## 2.1 Current frontend stack

``` text
React Native
Expo
TypeScript
Expo Router or React Navigation
Zustand
TanStack Query
React Hook Form
Zod
React Native Reanimated
React Native Gesture Handler
react-native-safe-area-context
```

Only add a dependency when it provides a clear benefit.

Do not introduce a large UI framework unless explicitly approved.

## 2.2 Data during UI development

``` text
Mock JSON
Mock Repository
Local in-memory state where appropriate
```

No real backend is required during the initial UI phase.

## 2.3 Future backend options

The frontend must remain compatible with:

``` text
Option A:
React Native
      ↓
FastAPI
      ↓
PostgreSQL

Option B:
React Native
      ↓
Node.js / Express
      ↓
PostgreSQL

Option C:
React Native
      ↓
Firebase
      ↓
Firestore / Firebase services
```

The frontend should not be architected around any one of these choices.

------------------------------------------------------------------------

# 3. High-Level Architecture

Use a layered architecture:

``` text
┌──────────────────────────────────────┐
│              Screens                 │
│   Home / Transactions / Reports      │
│   Add Expense / Budgets / Settings   │
└───────────────────┬──────────────────┘
                    │
                    ↓
┌──────────────────────────────────────┐
│         Feature Components           │
│ TransactionRow / BudgetCard / etc.   │
└───────────────────┬──────────────────┘
                    │
                    ↓
┌──────────────────────────────────────┐
│              Hooks                   │
│ useTransactions / useBudgets / etc.  │
└───────────────────┬──────────────────┘
                    │
                    ↓
┌──────────────────────────────────────┐
│            Repository                │
│ TransactionRepository                │
│ BudgetRepository                     │
│ AccountRepository                    │
└───────────────────┬──────────────────┘
                    │
             ┌──────┴──────┐
             ↓             ↓
┌─────────────────┐  ┌─────────────────┐
│ Mock Repository │  │  API Repository │
│ JSON / local    │  │ FastAPI/Node/   │
│ data            │  │ Firebase        │
└─────────────────┘  └─────────────────┘
```

------------------------------------------------------------------------

# 4. Project Structure

Recommended structure:

``` text
expense-tracker/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── transactions.tsx
│   │   ├── add.tsx
│   │   ├── reports.tsx
│   │   └── settings.tsx
│   │
│   ├── transactions/
│   │   ├── [id].tsx
│   │   └── edit.tsx
│   │
│   ├── budgets/
│   │   ├── index.tsx
│   │   └── create.tsx
│   │
│   ├── accounts/
│   │   ├── index.tsx
│   │   └── create.tsx
│   │
│   ├── categories/
│   │   └── index.tsx
│   │
│   └── onboarding/
│       └── index.tsx
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   ├── accounts/
│   │   ├── categories/
│   │   ├── reports/
│   │   └── dashboard/
│   │
│   ├── hooks/
│   │
│   ├── repositories/
│   │   ├── interfaces/
│   │   ├── mock/
│   │   └── api/
│   │
│   ├── services/
│   │
│   ├── store/
│   │
│   ├── data/
│   │   └── mock/
│   │
│   ├── types/
│   │
│   ├── schemas/
│   │
│   ├── theme/
│   │
│   ├── utils/
│   │
│   └── constants/
│
├── assets/
│
├── docs/
│   ├── PRD.md
│   ├── DESIGN_REFERENCE.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── NAVIGATION.md
│   ├── MOCK_DATA.md
│   └── AI_DEVELOPMENT_GUIDE.md
│
├── AGENTS.md
├── package.json
├── tsconfig.json
└── app.json
```

------------------------------------------------------------------------

# 5. Feature-Based Organization

Features should own feature-specific code.

Example:

``` text
src/features/transactions/

├── components/
│   ├── TransactionRow.tsx
│   ├── TransactionList.tsx
│   ├── TransactionFilters.tsx
│   └── TransactionSummary.tsx
│
├── hooks/
│   ├── useTransactions.ts
│   ├── useTransaction.ts
│   └── useTransactionFilters.ts
│
├── utils/
│   └── transactionUtils.ts
│
└── types.ts
```

Do not put everything into a single global `components` directory.

Use:

``` text
components/ui
```

for genuinely reusable primitives.

Use:

``` text
features/transactions/components
```

for transaction-specific components.

------------------------------------------------------------------------

# 6. UI Layer

Screens should primarily compose components.

Good:

``` tsx
export default function TransactionsScreen() {
  const { transactions, isLoading } = useTransactions();

  return (
    <Screen>
      <TransactionsHeader />
      <TransactionFilters />
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
      />
    </Screen>
  );
}
```

Avoid:

``` tsx
export default function TransactionsScreen() {
  // hundreds of lines
  // API calls
  // JSON parsing
  // filtering
  // business calculations
  // styles
  // navigation
  // validation
}
```

A screen should orchestrate the UI, not become the application's entire
architecture.

------------------------------------------------------------------------

# 7. Repository Pattern

Repositories are the primary abstraction between the frontend and data
source.

Example:

``` ts
export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(
    input: CreateTransactionInput
  ): Promise<Transaction>;
  updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
```

The UI should depend on this interface.

------------------------------------------------------------------------

# 8. Mock Repository

During UI development:

``` text
TransactionRepository
        ↓
MockTransactionRepository
        ↓
transactions.json
```

Example:

``` ts
export class MockTransactionRepository
  implements TransactionRepository {

  async getTransactions(): Promise<Transaction[]> {
    return mockTransactions;
  }

  async getTransactionById(
    id: string
  ): Promise<Transaction | null> {
    return (
      mockTransactions.find(
        transaction => transaction.id === id
      ) ?? null
    );
  }

  async createTransaction(
    input: CreateTransactionInput
  ): Promise<Transaction> {
    // mock implementation
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction> {
    // mock implementation
  }

  async deleteTransaction(
    id: string
  ): Promise<void> {
    // mock implementation
  }
}
```

------------------------------------------------------------------------

# 9. Future API Repository

Later:

``` text
TransactionRepository
        ↓
ApiTransactionRepository
        ↓
API Client
        ↓
FastAPI / Node.js
```

Example:

``` ts
export class ApiTransactionRepository
  implements TransactionRepository {

  async getTransactions() {
    return apiClient.get("/transactions");
  }

  async getTransactionById(id: string) {
    return apiClient.get(`/transactions/${id}`);
  }

  async createTransaction(input) {
    return apiClient.post("/transactions", input);
  }

  async updateTransaction(id, input) {
    return apiClient.patch(
      `/transactions/${id}`,
      input
    );
  }

  async deleteTransaction(id) {
    return apiClient.delete(`/transactions/${id}`);
  }
}
```

The screen should not change.

------------------------------------------------------------------------

# 10. Firebase Repository

If Firebase is selected later:

``` text
TransactionRepository
        ↓
FirebaseTransactionRepository
        ↓
Firestore
```

The same interface should be implemented.

This is why repository contracts must be backend-agnostic.

------------------------------------------------------------------------

# 11. Repository Selection

Use a single composition/configuration point.

Example:

``` ts
export const transactionRepository =
  isDevelopment
    ? new MockTransactionRepository()
    : new ApiTransactionRepository();
```

Prefer dependency injection or a repository factory as the application
grows.

Do not scatter:

``` ts
if (USE_MOCK_DATA)
```

throughout screens.

------------------------------------------------------------------------

# 12. Data Access Hooks

Hooks expose application data to the UI.

Example:

``` ts
export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      transactionRepository.getTransactions(),
  });
}
```

The screen does not need to know:

-   JSON location
-   API URL
-   Firebase
-   Axios
-   fetch
-   database
-   authentication implementation

------------------------------------------------------------------------

# 13. TanStack Query

Use TanStack Query for server-like data.

Recommended query examples:

``` text
["transactions"]

["transactions", transactionId]

["transactions", filters]

["budgets"]

["accounts"]

["categories"]

["reports", period]
```

Use mutations for:

``` text
create transaction
update transaction
delete transaction
create budget
update budget
create account
```

After mutation, invalidate the relevant query.

Example:

``` ts
queryClient.invalidateQueries({
  queryKey: ["transactions"],
});
```

------------------------------------------------------------------------

# 14. Zustand

Use Zustand for client-side application state.

Good candidates:

``` text
Theme
Onboarding state
Selected filters
Temporary UI state
User preferences
App-level settings
```

Do not automatically put every API response into Zustand.

Server/cache state belongs in TanStack Query.

------------------------------------------------------------------------

# 15. State Ownership

Use this rule:

``` text
Server / repository data
        ↓
TanStack Query

Local UI state
        ↓
React useState

Global client state
        ↓
Zustand

Form state
        ↓
React Hook Form

Validation
        ↓
Zod
```

This avoids unnecessary state duplication.

------------------------------------------------------------------------

# 16. Forms

Use React Hook Form for complex forms.

Example:

``` text
Add Expense
```

Form fields:

``` text
type
amount
categoryId
accountId
date
note
receipt
```

Validation should use Zod.

Example:

``` ts
const expenseSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  date: z.string(),
});
```

------------------------------------------------------------------------

# 17. Domain Types

Keep domain types independent of UI components.

Example:

``` ts
export type TransactionType =
  | "expense"
  | "income";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
  merchant?: string;
  createdAt: string;
  updatedAt: string;
}
```

Do not create slightly different versions of the same domain object
across screens.

------------------------------------------------------------------------

# 18. Input vs Domain Types

Separate creation/update inputs from persisted models.

Example:

``` ts
export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
}
```

The database/API may eventually return:

``` ts
interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  ...
}
```

The UI should not be forced to manufacture server-generated fields.

------------------------------------------------------------------------

# 19. Data Mapping

If backend response formats differ from frontend domain models, use
mappers.

``` text
API response
    ↓
Mapper
    ↓
Domain model
    ↓
UI
```

Example:

``` ts
mapTransactionResponse(
  response
): Transaction
```

This prevents backend-specific response formats from leaking into the
UI.

------------------------------------------------------------------------

# 20. Mock Data

Mock data should resemble realistic production data.

Do not use:

``` text
Expense 1
Expense 2
Expense 3
```

Use realistic examples:

``` text
Lunch at Cafe
Uber to office
Electricity bill
Monthly rent
Amazon purchase
Salary
Grocery shopping
UPI payment
```

Mock data should cover:

-   Small amounts
-   Large amounts
-   Income
-   Expenses
-   Different dates
-   Different categories
-   Different accounts
-   Missing optional fields
-   Long merchant names
-   Long notes
-   Many transactions
-   Empty lists
-   Budget exceeded
-   Budget nearly exceeded

------------------------------------------------------------------------

# 21. Mock Data Scenarios

Create scenario datasets where useful.

``` text
default.json
empty.json
large.json
budget-warning.json
budget-exceeded.json
```

This allows UI testing without changing production code.

------------------------------------------------------------------------

# 22. Navigation Architecture

Recommended structure:

``` text
Root Stack
│
├── Onboarding
│
└── Main Tabs
    │
    ├── Home
    ├── Transactions
    ├── Add Expense
    ├── Reports
    └── Settings
```

Secondary flows:

``` text
Transactions
   ├── Transaction Detail
   └── Edit Transaction

Budgets
   ├── Budget List
   └── Create/Edit Budget

Accounts
   ├── Account List
   └── Create/Edit Account
```

Navigation details should be maintained in `NAVIGATION.md`.

------------------------------------------------------------------------

# 23. Navigation Rules

Do not navigate directly from deeply nested components unless necessary.

Prefer:

``` text
Screen
  ↓
navigation
```

Components should communicate intent through callbacks when practical.

Example:

``` tsx
<TransactionRow
  transaction={transaction}
  onPress={() =>
    router.push(`/transactions/${transaction.id}`)
  }
/>
```

------------------------------------------------------------------------

# 24. Theme Architecture

Theme should be centralized.

``` text
src/theme/

colors.ts
typography.ts
spacing.ts
radius.ts
shadows.ts
animations.ts
index.ts
```

Components must consume theme tokens.

Bad:

``` tsx
backgroundColor: "#FFFFFF"
```

Preferred:

``` tsx
backgroundColor: colors.surface
```

------------------------------------------------------------------------

# 25. Services

Services contain infrastructure-level concerns.

Examples:

``` text
apiClient
storage
analytics
notifications
image upload
receipt processing
authentication
```

Repositories should use services rather than screens calling
infrastructure directly.

Bad:

``` text
Screen → Axios
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
API
```

------------------------------------------------------------------------

# 26. Storage

During UI development, persistent storage is optional.

If local persistence is required, abstract it.

``` ts
interface StorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

Possible future implementations:

``` text
AsyncStorage
MMKV
SecureStore
```

Sensitive credentials must not be stored in ordinary unencrypted
storage.

------------------------------------------------------------------------

# 27. Offline-First Preparation

The initial UI does not need full offline synchronization.

However, architecture should not prevent it.

Future architecture:

``` text
UI
 ↓
TanStack Query
 ↓
Repository
 ↓
Local Cache / Database
 ↓
Sync Engine
 ↓
Remote API
```

This can be introduced later without replacing screen components.

------------------------------------------------------------------------

# 28. Error Handling

Create a consistent application error model.

Example:

``` ts
type AppError = {
  code: string;
  message: string;
  userMessage: string;
  retryable?: boolean;
};
```

The UI should display `userMessage`, not raw backend errors.

Bad:

``` text
AxiosError: Request failed with status code 500
```

Good:

``` text
We couldn't load your transactions.
Please try again.
```

------------------------------------------------------------------------

# 29. Loading State Architecture

Hooks should expose:

``` ts
{
  data,
  isLoading,
  isFetching,
  isError,
  error,
  refetch
}
```

Screens/components decide how to visually represent those states.

The repository should not know how the UI displays loading.

------------------------------------------------------------------------

# 30. Empty State Architecture

Empty state should be part of feature UI.

Example:

``` text
TransactionList
├── Loading
├── Error
├── Empty
└── Data
```

Do not handle all states through deeply nested conditions in the screen.

------------------------------------------------------------------------

# 31. Component Rules

## UI components

Should be:

-   Reusable
-   Predictable
-   Mostly presentational
-   Theme-aware
-   Accessible

## Feature components

May contain:

-   Feature-specific behavior
-   Formatting
-   Event handling
-   Feature-level state

## Screens

Should:

-   Compose features
-   Connect hooks
-   Handle navigation
-   Coordinate screen-level behavior

------------------------------------------------------------------------

# 32. File Naming

Use PascalCase for components:

``` text
TransactionRow.tsx
BudgetCard.tsx
PrimaryButton.tsx
```

Use camelCase for hooks/utilities:

``` text
useTransactions.ts
formatCurrency.ts
transactionUtils.ts
```

Types:

``` text
transaction.ts
budget.ts
account.ts
```

------------------------------------------------------------------------

# 33. Import Rules

Prefer aliases:

``` ts
import { Button } from "@/components/ui/Button";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
```

Avoid long relative imports:

``` ts
../../../../components/...
```

Configure TypeScript path aliases consistently.

------------------------------------------------------------------------

# 34. Styling Rules

Use StyleSheet or the project's chosen styling approach consistently.

Do not mix multiple styling systems without a clear reason.

Preferred:

``` tsx
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
```

Use theme tokens.

Avoid giant inline style objects repeated across components.

------------------------------------------------------------------------

# 35. Performance Rules

Do not optimize prematurely.

However:

-   Use `FlatList` for large lists.
-   Use stable keys.
-   Avoid unnecessary anonymous expensive computations.
-   Memoize only where profiling or component behavior justifies it.
-   Avoid rendering large datasets unnecessarily.
-   Optimize images.
-   Avoid unnecessary global state updates.

For transactions, prefer virtualized lists over rendering every
transaction in a ScrollView.

------------------------------------------------------------------------

# 36. Accessibility Architecture

Reusable components must expose accessibility properties.

Example:

``` tsx
<IconButton
  accessibilityLabel="Filter transactions"
  accessibilityRole="button"
/>
```

Domain components should provide meaningful context.

Example:

``` text
"Expense: Lunch at Cafe, ₹350, August 10"
```

------------------------------------------------------------------------

# 37. Testing Strategy

Use multiple levels.

## Unit tests

Test:

-   Currency formatting
-   Date formatting
-   Budget calculations
-   Transaction filtering
-   Category totals
-   Report calculations

## Component tests

Test:

-   Button behavior
-   Input validation
-   Transaction row rendering
-   Budget progress
-   Empty states

## Integration tests

Test:

``` text
Add Expense
→ Save
→ Transaction appears
```

## End-to-end tests

Later test critical flows:

``` text
Onboarding
Add Expense
Edit Expense
Delete Expense
Create Budget
View Report
```

------------------------------------------------------------------------

# 38. Financial Calculation Rules

Never rely on formatted strings for calculations.

Bad:

``` ts
"₹12,450"
```

Good:

``` ts
12450
```

Formatting should happen only at the presentation boundary.

Example:

``` text
Domain:
12450

UI:
₹12,450
```

Use consistent rounding rules.

------------------------------------------------------------------------

# 39. Currency

Initial currency:

``` text
INR
```

Formatting should be centralized.

Example:

``` ts
formatCurrency(12450)
→ ₹12,450
```

Do not manually concatenate currency symbols throughout the app.

Future support can include:

``` text
USD
EUR
GBP
etc.
```

without changing domain calculations.

------------------------------------------------------------------------

# 40. Date Handling

Store dates in a consistent machine-readable format.

Prefer ISO-style values:

``` text
2026-08-10T18:30:00.000Z
```

Display formatting should happen through a utility.

Examples:

``` text
Today
Yesterday
Aug 10
Aug 10, 2026
```

Do not hardcode display date strings in mock data when the date itself
is the domain value.

------------------------------------------------------------------------

# 41. Backend Migration Strategy

When the frontend is complete:

### Step 1

Keep the existing repository interface.

### Step 2

Create API client.

### Step 3

Create API repositories.

### Step 4

Add authentication.

### Step 5

Replace mock repository with API repository.

### Step 6

Handle real loading/error states.

### Step 7

Add persistence/cache.

### Step 8

Add synchronization/offline behavior if required.

The UI components should require minimal changes.

------------------------------------------------------------------------

# 42. Backend-Agnostic Rules

The frontend must not contain:

``` text
FastAPI-specific logic
Node-specific logic
Firebase-specific logic
PostgreSQL-specific logic
```

inside:

``` text
screens
UI components
domain components
```

Backend-specific code belongs behind:

``` text
repositories
services
mappers
```

------------------------------------------------------------------------

# 43. AI Coding Agent Rules

AI agents such as Antigravity, Codex, Claude Code, or OpenCode must
follow the architecture.

Before making changes:

``` text
1. Read PRD.md.
2. Read DESIGN_SYSTEM.md.
3. Read ARCHITECTURE.md.
4. Inspect existing files.
5. Identify reusable components.
6. Identify the correct feature directory.
7. Determine whether the change affects navigation.
```

Before creating a component:

``` text
Ask:
Does this already exist?
Can an existing component be extended?
Is this component truly reusable?
```

Do not create:

``` text
Button.tsx
PrimaryButton.tsx
MainButton.tsx
SaveButton.tsx
```

when one configurable button component can handle the use cases.

------------------------------------------------------------------------

# 44. AI Change Scope

When implementing a feature, the AI agent should modify only relevant
files.

Example request:

``` text
Implement the Transactions screen.

Do not modify:
- Reports
- Settings
- Budgets
- Authentication
- Theme tokens unless required
```

This reduces accidental regressions.

------------------------------------------------------------------------

# 45. AI Development Workflow

Use small implementation tasks.

Good:

``` text
Task 1:
Create theme tokens.

Task 2:
Create base UI components.

Task 3:
Implement navigation shell.

Task 4:
Implement Dashboard.

Task 5:
Implement Add Expense.

Task 6:
Implement Transactions.
```

Avoid:

``` text
Build the complete application.
```

------------------------------------------------------------------------

# 46. AI Verification Workflow

After every significant task:

``` text
1. Run TypeScript.
2. Run lint.
3. Run tests.
4. Start Expo.
5. Verify affected screen.
6. Check navigation.
7. Check Android.
8. Check iOS when available.
9. Review visual consistency.
```

If the agent has browser/device interaction capability, it may inspect
the running app, but it must still follow the project's written design
specifications.

------------------------------------------------------------------------

# 47. Git Strategy

Use small, meaningful commits.

Examples:

``` text
feat: add design tokens
feat: add navigation shell
feat: implement dashboard
feat: implement add expense form
feat: implement transaction list
fix: correct transaction filter state
refactor: extract transaction row
test: add budget calculation tests
```

Avoid giant commits such as:

``` text
finished app
```

------------------------------------------------------------------------

# 48. Branch Strategy

Recommended:

``` text
main
  │
  ├── feature/design-system
  ├── feature/navigation
  ├── feature/dashboard
  ├── feature/add-expense
  ├── feature/transactions
  └── feature/reports
```

For a solo project, simple feature branches are sufficient.

------------------------------------------------------------------------

# 49. Definition of Done

A feature is complete only when:

-   [ ] PRD requirements are satisfied.
-   [ ] Design system is followed.
-   [ ] Correct feature directory is used.
-   [ ] Existing components are reused.
-   [ ] No unnecessary dependencies were added.
-   [ ] Mock data is accessed through repositories.
-   [ ] Loading state exists where relevant.
-   [ ] Empty state exists where relevant.
-   [ ] Error state exists where relevant.
-   [ ] Accessibility is implemented.
-   [ ] TypeScript passes.
-   [ ] Lint passes.
-   [ ] Tests pass where applicable.
-   [ ] Navigation works.
-   [ ] Android UI checked.
-   [ ] iOS UI checked when available.
-   [ ] No unrelated functionality was broken.
-   [ ] Git commit is focused.

------------------------------------------------------------------------

# 50. Final Architecture

The target architecture is:

``` text
                       ┌─────────────────────┐
                       │      Screens        │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │ Feature Components  │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │       Hooks         │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │    Repositories     │
                       └──────────┬──────────┘
                                  │
                   ┌──────────────┴──────────────┐
                   ↓                             ↓
        ┌─────────────────────┐       ┌─────────────────────┐
        │ Mock Repository     │       │ API Repository      │
        │                     │       │                     │
        │ Mock JSON           │       │ API Client          │
        └─────────────────────┘       └──────────┬──────────┘
                                                  ↓
                                  ┌─────────────────────────┐
                                  │ FastAPI / Node /        │
                                  │ Firebase                │
                                  └─────────────────────────┘
```

The central architectural principle is:

> **Build the frontend against contracts, not against the mock data
> source or eventual backend.**

This allows the UI to be developed completely before the backend
decision is finalized.
