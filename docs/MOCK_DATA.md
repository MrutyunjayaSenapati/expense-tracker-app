# MOCK_DATA.md

## Expense Tracker --- Mock Data Contract

**Purpose:** Define the stable data contracts used by the React
Native/Expo UI before backend integration.

**Current source:** Mock JSON

**Future sources:** FastAPI, Node.js, or Firebase

------------------------------------------------------------------------

# 1. Purpose

The frontend must be developed against stable domain models rather than
arbitrary screen-specific JSON.

The mock data layer must:

-   Represent realistic user behavior.
-   Cover normal and edge cases.
-   Be strongly typed.
-   Remain stable while screens are being developed.
-   Be replaceable by a real repository later.
-   Never be imported directly into screens.

Architecture:

``` text
Screen
  ↓
Hook
  ↓
Repository interface
  ↓
Mock repository
  ↓
Mock JSON
```

Later:

``` text
Screen
  ↓
Hook
  ↓
Repository interface
  ↓
API/Firebase repository
  ↓
Backend
```

------------------------------------------------------------------------

# 2. Domain Entities

Initial entities:

``` text
User
Transaction
Category
Account
Budget
RecurringTransaction
Receipt
ReportSummary
```

------------------------------------------------------------------------

# 3. User

``` ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currency: CurrencyCode;
  locale: string;
  createdAt: string;
}
```

Example:

``` json
{
  "id": "user_001",
  "name": "Jay",
  "email": "jay@example.com",
  "avatarUrl": null,
  "currency": "INR",
  "locale": "en-IN",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

------------------------------------------------------------------------

# 4. Currency

Initial currency:

``` ts
export type CurrencyCode = "INR";
```

Future:

``` text
USD
EUR
GBP
AED
etc.
```

Currency formatting must be centralized.

Do not store formatted values such as:

``` text
"₹12,450"
```

Store:

``` text
12450
```

and format it at the presentation layer.

------------------------------------------------------------------------

# 5. Transaction

## 5.1 Type

``` ts
export type TransactionType =
  | "expense"
  | "income";
```

## 5.2 Model

``` ts
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
  recurringTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 5.3 Example expense

``` json
{
  "id": "txn_001",
  "type": "expense",
  "amount": 350,
  "categoryId": "cat_food",
  "accountId": "acc_upi",
  "date": "2026-08-10T13:30:00.000Z",
  "merchant": "Cafe Coffee Day",
  "note": "Lunch",
  "createdAt": "2026-08-10T13:31:00.000Z",
  "updatedAt": "2026-08-10T13:31:00.000Z"
}
```

## 5.4 Example income

``` json
{
  "id": "txn_002",
  "type": "income",
  "amount": 50000,
  "categoryId": "cat_salary",
  "accountId": "acc_bank",
  "date": "2026-08-01T09:00:00.000Z",
  "merchant": "Company Salary",
  "note": "August salary",
  "createdAt": "2026-08-01T09:01:00.000Z",
  "updatedAt": "2026-08-01T09:01:00.000Z"
}
```

------------------------------------------------------------------------

# 6. Transaction Input Models

Creating a transaction should not require server-generated fields.

``` ts
export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
}
```

Updating:

``` ts
export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  categoryId?: string;
  accountId?: string;
  date?: string;
  merchant?: string;
  note?: string;
  receiptId?: string;
}
```

------------------------------------------------------------------------

# 7. Category

## 7.1 Type

``` ts
export type CategoryType =
  | "expense"
  | "income";
```

## 7.2 Model

``` ts
export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  colorToken: string;
  isDefault: boolean;
  isActive: boolean;
}
```

Do not store arbitrary UI color hex values inside individual
transactions.

Use semantic/category tokens.

## 7.3 Initial expense categories

``` text
Food
Travel
Shopping
Bills
Entertainment
Health
Education
Rent
Subscriptions
Personal Care
Groceries
Other
```

## 7.4 Initial income categories

``` text
Salary
Freelance
Business
Investment
Gift
Other Income
```

------------------------------------------------------------------------

# 8. Account

## 8.1 Account type

``` ts
export type AccountType =
  | "cash"
  | "bank"
  | "upi"
  | "credit_card"
  | "debit_card"
  | "other";
```

## 8.2 Model

``` ts
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institutionName?: string;
  balance: number;
  currency: CurrencyCode;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 8.3 Example

``` json
{
  "id": "acc_bank",
  "name": "HDFC Bank",
  "type": "bank",
  "institutionName": "HDFC Bank",
  "balance": 42500,
  "currency": "INR",
  "icon": "building-bank",
  "isActive": true,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-08-10T08:00:00.000Z"
}
```

------------------------------------------------------------------------

# 9. Budget

## 9.1 Budget period

``` ts
export type BudgetPeriod =
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";
```

## 9.2 Model

``` ts
export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId?: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

`spent` is useful for the current mock UI but should eventually be
derived from transactions where appropriate.

## 9.3 Example

``` json
{
  "id": "budget_food_aug_2026",
  "name": "Food",
  "amount": 10000,
  "spent": 4200,
  "categoryId": "cat_food",
  "period": "monthly",
  "startDate": "2026-08-01T00:00:00.000Z",
  "endDate": "2026-08-31T23:59:59.999Z",
  "isActive": true,
  "createdAt": "2026-08-01T08:00:00.000Z",
  "updatedAt": "2026-08-10T08:00:00.000Z"
}
```

------------------------------------------------------------------------

# 10. Recurring Transaction

This supports future recurring bills/subscriptions.

## 10.1 Frequency

``` ts
export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";
```

## 10.2 Model

``` ts
export interface RecurringTransaction {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: RecurrenceFrequency;
  nextOccurrence: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
```

## 10.3 Examples

``` text
Netflix
Rent
Internet
Gym membership
Insurance
Salary
```

------------------------------------------------------------------------

# 11. Receipt

Receipt support is initially UI-only.

``` ts
export interface Receipt {
  id: string;
  transactionId: string;
  imageUrl: string;
  fileName?: string;
  createdAt: string;
}
```

The mock application may use placeholder image URLs.

Receipt OCR/AI extraction is a future feature.

------------------------------------------------------------------------

# 12. Report Summary

Reports should consume derived data rather than storing every chart
value as a permanent domain object.

``` ts
export interface ReportSummary {
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  previousPeriodExpense?: number;
}
```

------------------------------------------------------------------------

# 13. Category Spending

``` ts
export interface CategorySpending {
  categoryId: string;
  amount: number;
  transactionCount: number;
  percentage: number;
}
```

Example:

``` json
{
  "categoryId": "cat_food",
  "amount": 4200,
  "transactionCount": 18,
  "percentage": 33.7
}
```

Percentages may be derived rather than persisted.

------------------------------------------------------------------------

# 14. Dashboard Data

The dashboard should preferably consume a view model rather than
directly knowing every raw data source.

Example:

``` ts
export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  monthlyBudget: number;
  monthlyBudgetSpent: number;
  recentTransactions: Transaction[];
  categorySpending: CategorySpending[];
}
```

This is a presentation-oriented model.

------------------------------------------------------------------------

# 15. Filter Models

Transactions:

``` ts
export interface TransactionFilters {
  search?: string;
  type?: TransactionType | "all";
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}
```

Default:

``` json
{
  "type": "all"
}
```

------------------------------------------------------------------------

# 16. Sort Models

``` ts
export type TransactionSort =
  | "date_desc"
  | "date_asc"
  | "amount_high"
  | "amount_low";
```

Default:

``` text
date_desc
```

------------------------------------------------------------------------

# 17. Mock Data Files

Recommended:

``` text
src/data/mock/

users.json
transactions.json
categories.json
accounts.json
budgets.json
recurring-transactions.json
receipts.json
```

Optional scenario files:

``` text
scenarios/
├── empty.json
├── large.json
├── budget-warning.json
└── budget-exceeded.json
```

------------------------------------------------------------------------

# 18. Mock Data Requirements

The default dataset must be large enough to make the UI realistic.

Recommended initial dataset:

``` text
Users:                    1
Accounts:                 5–7
Categories:               15–20
Transactions:             40–60
Budgets:                  4–6
Recurring transactions:   3–5
Receipts:                 3–5
```

Transactions should span at least:

``` text
Current day
Previous day
Current week
Previous week
Current month
Previous month
```

------------------------------------------------------------------------

# 19. Realistic Transaction Distribution

The dataset should include:

``` text
Food
Groceries
Travel
Shopping
Bills
Entertainment
Health
Rent
Subscriptions
Salary
Freelance
Other
```

Use realistic INR amounts.

Examples:

``` text
₹50
₹120
₹250
₹350
₹799
₹1,200
₹2,500
₹8,000
₹15,000
₹50,000
```

Avoid making every amount round.

------------------------------------------------------------------------

# 20. Edge Cases

Mock data must deliberately include:

### Long merchant

``` text
The Extremely Long Restaurant and Food Services Pvt Ltd
```

### Long note

A transaction with a long note to test wrapping/truncation.

### Small amount

``` text
₹10
```

### Large amount

``` text
₹125,000
```

### No merchant

``` json
{
  "merchant": null
}
```

### No note

``` json
{
  "note": null
}
```

### Receipt attached

Transaction with `receiptId`.

### No receipt

Transaction without `receiptId`.

------------------------------------------------------------------------

# 21. Budget Edge Cases

Include:

### Healthy

``` text
spent = 30%
```

### Normal

``` text
spent = 60%
```

### Warning

``` text
spent = 85%
```

### Almost full

``` text
spent = 95%
```

### Over budget

``` text
spent = 115%
```

The UI must not assume the percentage is always between 0 and 100.

------------------------------------------------------------------------

# 22. Account Edge Cases

Include:

``` text
Cash balance
Bank balance
UPI balance
Credit card with negative/owed amount if the UI supports it
Zero balance
Large balance
```

Account semantics must be clarified before implementing
credit-card-specific calculations.

------------------------------------------------------------------------

# 23. Data Relationships

Relationships:

``` text
User
 │
 ├── Accounts
 │
 ├── Transactions
 │       ├── Category
 │       ├── Account
 │       └── Receipt
 │
 ├── Budgets
 │       └── Category
 │
 └── Recurring Transactions
         ├── Category
         └── Account
```

Use IDs for relationships.

Example:

``` text
transaction.categoryId
transaction.accountId
budget.categoryId
recurringTransaction.categoryId
```

Do not duplicate the complete category object inside every transaction.

------------------------------------------------------------------------

# 24. Derived Values

The following should normally be calculated:

``` text
Total expense
Total income
Net savings
Category percentage
Budget percentage
Remaining budget
Transaction count
Monthly comparison
```

Example:

``` ts
netSavings = totalIncome - totalExpense;
```

Do not manually maintain multiple inconsistent versions of the same
calculation.

------------------------------------------------------------------------

# 25. Financial Calculation Rules

Use numeric values internally.

Bad:

``` ts
amount: "₹2,500"
```

Good:

``` ts
amount: 2500
```

Formatting:

``` ts
formatCurrency(2500)
→ "₹2,500"
```

Never parse formatted currency strings to perform calculations.

------------------------------------------------------------------------

# 26. Date Rules

Store dates as ISO strings.

Example:

``` text
2026-08-10T13:30:00.000Z
```

Display formatting must happen through utilities.

Examples:

``` text
Today
Yesterday
Aug 10
Aug 10, 2026
```

------------------------------------------------------------------------

# 27. Mock Repository Contracts

Repositories should expose stable methods.

## Transactions

``` ts
interface TransactionRepository {
  getTransactions(
    filters?: TransactionFilters
  ): Promise<Transaction[]>;

  getTransactionById(
    id: string
  ): Promise<Transaction | null>;

  createTransaction(
    input: CreateTransactionInput
  ): Promise<Transaction>;

  updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction>;

  deleteTransaction(
    id: string
  ): Promise<void>;
}
```

## Categories

``` ts
interface CategoryRepository {
  getCategories(
    type?: CategoryType
  ): Promise<Category[]>;

  getCategoryById(
    id: string
  ): Promise<Category | null>;
}
```

## Accounts

``` ts
interface AccountRepository {
  getAccounts(): Promise<Account[]>;

  getAccountById(
    id: string
  ): Promise<Account | null>;
}
```

## Budgets

``` ts
interface BudgetRepository {
  getBudgets(): Promise<Budget[]>;

  getBudgetById(
    id: string
  ): Promise<Budget | null>;

  createBudget(
    input: CreateBudgetInput
  ): Promise<Budget>;

  updateBudget(
    id: string,
    input: UpdateBudgetInput
  ): Promise<Budget>;

  deleteBudget(
    id: string
  ): Promise<void>;
}
```

------------------------------------------------------------------------

# 28. Mock Mutation Behavior

Mock repositories should behave enough like a real backend to test UI
flows.

For example:

``` text
Add Expense
  ↓
Mock repository stores transaction
  ↓
Query invalidation/refetch
  ↓
Dashboard updates
  ↓
Transactions list updates
```

Do not simply show a toast without updating application state.

The UI should behave as though a real backend exists.

------------------------------------------------------------------------

# 29. Artificial Delay

To test loading states, the mock repository may simulate network
latency.

Example:

``` text
100–500ms
```

Do not make every interaction artificially slow.

Provide a simple configuration:

``` ts
MOCK_API_DELAY = 300;
```

This should be easy to disable.

------------------------------------------------------------------------

# 30. Mock Error Simulation

The mock repository should optionally simulate:

``` text
Network failure
Server error
Not found
Validation failure
```

Example:

``` ts
MOCK_ERROR_MODE = false;
```

This makes it possible to test real error UI before a backend exists.

------------------------------------------------------------------------

# 31. What Mock Data Must NOT Do

Do not:

-   Put JSX inside JSON.
-   Put formatted currency strings into domain models.
-   Put navigation routes into domain models.
-   Put React component names into domain models.
-   Put screen-specific flags into core transaction models without a
    clear reason.
-   Duplicate category/account objects inside transactions.
-   Hardcode UI-only text inside the domain model.

------------------------------------------------------------------------

# 32. Future Backend Mapping

The frontend domain model should remain stable.

Example:

``` text
FastAPI response
       ↓
API mapper
       ↓
Transaction
       ↓
useTransactions()
       ↓
TransactionsScreen
```

If the backend returns:

``` json
{
  "transaction_id": "txn_001",
  "total_amount": 350
}
```

the mapper converts it to:

``` ts
{
  id: "txn_001",
  amount: 350
}
```

The UI does not need to know the backend field names.

------------------------------------------------------------------------

# 33. Authentication Preparation

The initial UI may use a mock user.

Do not hardcode the current user into every screen.

Use:

``` ts
useCurrentUser()
```

Later this hook can read from:

``` text
Authentication provider
```

instead of mock data.

------------------------------------------------------------------------

# 34. Receipt Preparation

Initial:

``` text
receiptId
imageUrl
```

Future:

``` text
Upload image
↓
Cloud storage
↓
OCR
↓
AI extraction
↓
Transaction suggestion
```

Do not implement OCR or AI during the first UI milestone.

------------------------------------------------------------------------

# 35. AI Categorization Preparation

Future transaction suggestion:

``` ts
interface TransactionSuggestion {
  amount?: number;
  merchant?: string;
  categoryId?: string;
  confidence?: number;
}
```

This should be treated as a suggestion, not automatically trusted
financial data.

------------------------------------------------------------------------

# 36. SMS Parsing Preparation

SMS parsing is a future feature.

Possible future pipeline:

``` text
SMS
 ↓
Parser
 ↓
TransactionSuggestion
 ↓
User confirmation
 ↓
Create Transaction
```

The current UI can later reuse the Add Expense form for confirmation.

Do not couple the current transaction model to Android SMS
implementation.

------------------------------------------------------------------------

# 37. Data Privacy

The mock data must not contain real:

-   Bank account numbers
-   Credit card numbers
-   OTPs
-   Authentication tokens
-   Private financial records
-   Personal identifiers

Use fictional data only.

------------------------------------------------------------------------

# 38. Definition of Done

Mock data is ready when:

-   [ ] All core entities have TypeScript models.
-   [ ] Relationships use stable IDs.
-   [ ] JSON matches TypeScript models.
-   [ ] Realistic INR data exists.
-   [ ] Current and previous periods are represented.
-   [ ] Empty states can be tested.
-   [ ] Loading states can be tested.
-   [ ] Error states can be tested.
-   [ ] Budget warning/over-budget states exist.
-   [ ] Long text is represented.
-   [ ] Large and small monetary values exist.
-   [ ] Mock repositories expose stable interfaces.
-   [ ] Screens do not import raw JSON directly.
-   [ ] Mock mutations update application state.
-   [ ] Backend-specific concepts are absent.

------------------------------------------------------------------------

# 39. Final Rule

The mock data layer is a **temporary implementation of permanent domain
contracts**.

The goal is:

``` text
Mock JSON
   ↓
Mock Repository
   ↓
Application Hooks
   ↓
UI
```

and later:

``` text
Backend
   ↓
API/Firebase Repository
   ↓
Application Hooks
   ↓
Same UI
```

The UI should not care which data source is underneath it.
