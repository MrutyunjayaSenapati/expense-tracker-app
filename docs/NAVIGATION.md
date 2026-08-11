# NAVIGATION.md

## Expense Tracker --- Navigation & User Flow Specification

**Platform:** React Native + Expo + TypeScript\
**Navigation approach:** Expo Router recommended\
**Purpose:** Define the complete navigation hierarchy, routes,
modal/bottom-sheet behavior, and primary user flows before UI
implementation.

------------------------------------------------------------------------

# 1. Navigation Principles

The navigation system must be:

-   Simple
-   Predictable
-   Shallow where possible
-   Fast for common actions
-   Consistent with the design system
-   Accessible
-   Deep-linkable in the future
-   Independent from backend implementation

The most important user action is:

``` text
Add Expense
```

It should always be easy to reach.

------------------------------------------------------------------------

# 2. Primary Navigation

Use five primary destinations:

``` text
Home
Transactions
Add
Reports
Settings
```

Recommended structure:

``` text
┌─────────────────────────────────────────┐
│                                         │
│              Current Screen             │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Home │ Transactions │ + │ Reports │ Settings │
└─────────────────────────────────────────┘
```

The center Add action should be visually prominent.

------------------------------------------------------------------------

# 3. Route Tree

Recommended Expo Router structure:

``` text
app/
│
├── _layout.tsx
├── index.tsx
│
├── onboarding/
│   └── index.tsx
│
├── (tabs)/
│   ├── _layout.tsx
│   ├── home.tsx
│   ├── transactions.tsx
│   ├── add.tsx
│   ├── reports.tsx
│   └── settings.tsx
│
├── transactions/
│   ├── [id].tsx
│   └── edit.tsx
│
├── budgets/
│   ├── index.tsx
│   ├── create.tsx
│   └── [id].tsx
│
├── accounts/
│   ├── index.tsx
│   ├── create.tsx
│   └── [id].tsx
│
├── categories/
│   └── index.tsx
│
├── recurring/
│   ├── index.tsx
│   ├── create.tsx
│   └── [id].tsx
│
└── profile/
    └── index.tsx
```

Not every route needs to be implemented in the first UI milestone.

------------------------------------------------------------------------

# 4. Route Groups

## Root

``` text
/
```

Responsible for deciding whether to show:

``` text
Onboarding
or
Main Application
```

------------------------------------------------------------------------

# 5. Onboarding

Route:

``` text
/onboarding
```

Initial UI can be simple.

Purpose:

-   Introduce the application.
-   Explain the value.
-   Set basic preferences.
-   Enter the main app.

Future onboarding may include:

``` text
Currency
Name
Monthly budget
Default account
```

For the first UI milestone, avoid making onboarding unnecessarily long.

------------------------------------------------------------------------

# 6. Main Tab Navigation

Routes:

``` text
/(tabs)/home
/(tabs)/transactions
/(tabs)/add
/(tabs)/reports
/(tabs)/settings
```

These represent the primary app areas.

------------------------------------------------------------------------

# 7. Home

Route:

``` text
/(tabs)/home
```

Purpose:

Provide an immediate financial overview.

Contains:

``` text
Header
↓
Balance / monthly summary
↓
Income vs Expense
↓
Budget summary
↓
Spending categories
↓
Recent transactions
```

Primary actions:

``` text
Add Expense
View Transactions
View Reports
View Budgets
```

Secondary actions:

``` text
View Account
View Transaction
```

------------------------------------------------------------------------

# 8. Home → Transaction Detail

Flow:

``` text
Home
 ↓
Recent Transaction
 ↓
Transaction Detail
```

Route:

``` text
/transactions/[id]
```

Actions:

``` text
Edit
Delete
```

Optional future:

``` text
Duplicate
Share
```

------------------------------------------------------------------------

# 9. Transactions

Route:

``` text
/(tabs)/transactions
```

Purpose:

View and manage all transactions.

Structure:

``` text
Header
↓
Search
↓
Filter / Sort
↓
Transaction List
```

Actions:

``` text
Search
Filter
Sort
Open transaction
Add transaction
```

------------------------------------------------------------------------

# 10. Transactions → Detail

Flow:

``` text
Transactions
 ↓
Tap transaction
 ↓
Transaction Detail
```

Route:

``` text
/transactions/[id]
```

Transaction detail contains:

``` text
Category
Amount
Merchant
Date
Account
Note
Receipt
Created date
```

Actions:

``` text
Edit
Delete
```

------------------------------------------------------------------------

# 11. Transaction Detail → Edit

Flow:

``` text
Transaction Detail
 ↓
Edit
 ↓
Edit Transaction
 ↓
Save
 ↓
Transaction Detail
```

The edit screen may reuse the same form component as Add Expense.

Important:

``` text
AddExpenseForm
```

should support:

``` text
create mode
edit mode
```

rather than maintaining two unrelated forms.

------------------------------------------------------------------------

# 12. Delete Transaction

Flow:

``` text
Transaction Detail
 ↓
Delete
 ↓
Confirmation Modal
```

Modal:

``` text
Delete transaction?

This action cannot be undone.

Cancel
Delete
```

After successful deletion:

``` text
Delete
 ↓
Success feedback
 ↓
Previous screen
```

The previous list/dashboard should refresh.

------------------------------------------------------------------------

# 13. Add Expense

Route:

``` text
/(tabs)/add
```

This is a primary action.

Recommended flow:

``` text
Tap +
 ↓
Add Expense
 ↓
Expense / Income
 ↓
Amount
 ↓
Category
 ↓
Account
 ↓
Date
 ↓
Optional details
 ↓
Save
```

Required:

``` text
Type
Amount
Category
Account
Date
```

Optional:

``` text
Merchant
Note
Receipt
```

------------------------------------------------------------------------

# 14. Add Expense --- Category Selection

Selecting Category should open a bottom sheet.

Flow:

``` text
Add Expense
 ↓
Category
 ↓
Category Bottom Sheet
```

Example:

``` text
Food
Groceries
Travel
Shopping
Bills
Entertainment
Health
...
```

Actions:

``` text
Select category
Close
```

After selection:

``` text
Bottom Sheet
 ↓
Add Expense
```

------------------------------------------------------------------------

# 15. Add Expense --- Account Selection

Flow:

``` text
Add Expense
 ↓
Account
 ↓
Account Bottom Sheet
```

Example:

``` text
HDFC Bank
UPI
Cash
Credit Card
```

After selection:

``` text
Bottom Sheet
 ↓
Add Expense
```

------------------------------------------------------------------------

# 16. Add Expense --- Date Selection

Use a date picker.

Flow:

``` text
Add Expense
 ↓
Date
 ↓
Date Picker
 ↓
Select Date
 ↓
Add Expense
```

Default:

``` text
Today
```

------------------------------------------------------------------------

# 17. Add Expense --- Receipt

Initial UI:

``` text
Add Receipt
```

Options:

``` text
Take Photo
Choose Photo
Remove
```

For the first UI milestone, actual OCR is not required.

The UI should be ready for future receipt processing.

------------------------------------------------------------------------

# 18. Add Expense --- Save

Flow:

``` text
Save
 ↓
Validate
 ↓
Create Transaction
 ↓
Success
 ↓
Previous screen
```

After saving:

``` text
Dashboard totals update
Transaction list updates
Budget values update
```

Mock repository behavior should simulate this.

------------------------------------------------------------------------

# 19. Add Expense Validation

Validation errors should appear near fields.

Examples:

``` text
Amount is required.

Enter an amount greater than ₹0.

Please select a category.

Please select an account.
```

The Save button should not submit invalid data.

------------------------------------------------------------------------

# 20. Reports

Route:

``` text
/(tabs)/reports
```

Purpose:

Help users understand spending patterns.

Structure:

``` text
Header
↓
Period selector
↓
Summary
↓
Spending trend
↓
Category breakdown
↓
Comparison
```

Period selector:

``` text
Week
Month
Year
Custom
```

------------------------------------------------------------------------

# 21. Reports → Date Range

For custom reports:

``` text
Reports
 ↓
Custom
 ↓
Date Range Bottom Sheet / Screen
 ↓
Start Date
 ↓
End Date
 ↓
Apply
 ↓
Reports
```

------------------------------------------------------------------------

# 22. Reports → Category Detail

Optional route:

``` text
/reports/category/[id]
```

Flow:

``` text
Reports
 ↓
Category
 ↓
Category Spending Detail
```

Can show:

``` text
Total spent
Transaction count
Average transaction
Transactions
Trend
```

This can be a later milestone.

------------------------------------------------------------------------

# 23. Budgets

Budgets are not a primary tab in the initial five-tab navigation.

Access:

``` text
Home
 ↓
Budget Summary
 ↓
Budgets
```

or:

``` text
Settings
 ↓
Budgets
```

Recommended:

``` text
Home → View All Budgets
```

Route:

``` text
/budgets
```

------------------------------------------------------------------------

# 24. Budget List

Route:

``` text
/budgets
```

Structure:

``` text
Header
Add Budget
↓
Overall Budget
↓
Category Budgets
```

Actions:

``` text
Add
Edit
Delete
Open detail
```

------------------------------------------------------------------------

# 25. Create Budget

Route:

``` text
/budgets/create
```

Flow:

``` text
Budget List
 ↓
Add
 ↓
Create Budget
 ↓
Name
 ↓
Amount
 ↓
Category
 ↓
Period
 ↓
Start / End
 ↓
Save
```

------------------------------------------------------------------------

# 26. Budget Detail

Route:

``` text
/budgets/[id]
```

Contains:

``` text
Budget amount
Spent
Remaining
Progress
Related transactions
```

Actions:

``` text
Edit
Delete
```

------------------------------------------------------------------------

# 27. Accounts

Route:

``` text
/accounts
```

Access from:

``` text
Settings
```

and optionally:

``` text
Dashboard account summary
```

Structure:

``` text
Header
Add Account
↓
Account list
```

------------------------------------------------------------------------

# 28. Create Account

Route:

``` text
/accounts/create
```

Fields:

``` text
Account name
Account type
Institution
Opening balance
```

Types:

``` text
Cash
Bank
UPI
Credit Card
Debit Card
Other
```

------------------------------------------------------------------------

# 29. Account Detail

Route:

``` text
/accounts/[id]
```

Contains:

``` text
Account balance
Account information
Recent transactions
```

Actions:

``` text
Edit
Archive
```

Do not permanently delete accounts that have historical transactions
without a defined migration strategy.

------------------------------------------------------------------------

# 30. Categories

Route:

``` text
/categories
```

Access from:

``` text
Settings
```

Features:

``` text
Expense categories
Income categories
Add
Edit
Deactivate
```

Avoid destructive deletion when historical transactions depend on a
category.

------------------------------------------------------------------------

# 31. Recurring Transactions

Route:

``` text
/recurring
```

This is a later feature.

Structure:

``` text
Recurring Transactions
↓
Subscriptions
Bills
Recurring Income
```

Actions:

``` text
Add
Edit
Pause
Resume
Delete
```

------------------------------------------------------------------------

# 32. Settings

Route:

``` text
/(tabs)/settings
```

Structure:

``` text
Profile
Accounts
Categories
Budgets
Recurring Transactions
Notifications
Appearance
Currency
Security
Data
About
```

Initial UI can expose only features that already exist.

Do not show non-functional settings without a clear placeholder/state.

------------------------------------------------------------------------

# 33. Profile

Route:

``` text
/profile
```

Contains:

``` text
Avatar
Name
Email
Currency
Locale
```

Future:

``` text
Change password
Connected accounts
Account deletion
```

------------------------------------------------------------------------

# 34. Bottom Sheets

Use bottom sheets for short choices.

Recommended:

``` text
Category Selection
Account Selection
Transaction Filters
Sort
Date Selection
Quick Actions
```

Do not use bottom sheets for complex multi-step workflows.

------------------------------------------------------------------------

# 35. Modals

Use modals for:

``` text
Delete confirmation
Discard changes
Important warnings
```

Do not use modals for routine selection when a bottom sheet is more
appropriate.

------------------------------------------------------------------------

# 36. Transaction Filter Flow

``` text
Transactions
 ↓
Filter
 ↓
Filter Bottom Sheet
```

Filters:

``` text
Type
Category
Account
Date
Amount
```

Actions:

``` text
Apply
Reset
Close
```

After Apply:

``` text
Bottom Sheet closes
 ↓
Transaction list updates
```

------------------------------------------------------------------------

# 37. Transaction Search Flow

``` text
Transactions
 ↓
Search
 ↓
Search input
 ↓
Enter query
 ↓
Filtered results
```

Search should support at least:

``` text
Merchant
Note
```

Future:

``` text
Category
Account
```

------------------------------------------------------------------------

# 38. Transaction Sort Flow

``` text
Transactions
 ↓
Sort
 ↓
Sort Bottom Sheet
```

Options:

``` text
Newest first
Oldest first
Highest amount
Lowest amount
```

------------------------------------------------------------------------

# 39. Deep Link Preparation

Future deep links may open:

``` text
expense://transaction/txn_001
expense://budget/budget_001
expense://account/acc_bank
```

Routes should therefore use stable IDs.

Do not depend on array indexes.

Bad:

``` text
/transactions/0
```

Good:

``` text
/transactions/txn_001
```

------------------------------------------------------------------------

# 40. Navigation State Rules

Navigation state must not be used as application data storage.

Do not put full transaction objects into route parameters.

Bad:

``` ts
router.push({
  pathname: "/transactions/detail",
  params: {
    transaction: JSON.stringify(transaction)
  }
});
```

Good:

``` ts
router.push(`/transactions/${transaction.id}`);
```

The destination loads the transaction by ID.

------------------------------------------------------------------------

# 41. Unsaved Form Changes

If the user has modified a form and attempts to leave:

``` text
Discard changes?

Your changes have not been saved.

Keep Editing
Discard
```

This should be implemented for Add/Edit forms when there are meaningful
unsaved changes.

------------------------------------------------------------------------

# 42. Back Navigation

Rules:

``` text
Primary tab
→ No back button

Secondary screen
→ Back button

Modal/bottom sheet
→ Close/dismiss

Nested detail
→ Back to previous screen
```

Do not create unnecessary navigation depth.

------------------------------------------------------------------------

# 43. Android Back Button

Android back behavior must be intentional.

Examples:

``` text
Transaction Detail
→ Transactions

Edit Transaction with changes
→ Discard confirmation

Bottom Sheet open
→ Close sheet first

Modal open
→ Close modal first
```

Do not unexpectedly exit the application.

------------------------------------------------------------------------

# 44. Loading Navigation

Navigation should not depend on waiting for unnecessary data.

For example:

``` text
Tap transaction
 ↓
Open detail
 ↓
Show skeleton
 ↓
Load data
```

rather than blocking navigation until all data is available.

------------------------------------------------------------------------

# 45. Error Navigation

If a detail item cannot be loaded:

``` text
Transaction Detail

Unable to load this transaction.

[Try Again]
[Go Back]
```

Do not leave the user on an unusable blank screen.

------------------------------------------------------------------------

# 46. First UI Milestone

Implement only:

``` text
Onboarding
Home
Transactions
Add Expense
Transaction Detail
Edit Transaction
Reports
Budgets
Settings
```

Supporting flows:

``` text
Category selection
Account selection
Date selection
Filters
Delete confirmation
```

Do not implement advanced:

``` text
SMS parsing
Bank integration
OCR
AI categorization
Cloud sync
Recurring automation
```

during the initial UI milestone.

------------------------------------------------------------------------

# 47. Recommended Implementation Order

Build navigation in this order:

``` text
1. Root layout
2. Tab layout
3. Home
4. Transactions
5. Add Expense
6. Transaction Detail
7. Edit Transaction
8. Reports
9. Budgets
10. Settings
11. Supporting bottom sheets
12. Supporting modals
13. Accounts
14. Categories
15. Recurring transactions
```

------------------------------------------------------------------------

# 48. Primary User Flows

## Flow A --- Add Expense

``` text
Home
 ↓
+
 ↓
Add Expense
 ↓
Enter Amount
 ↓
Select Category
 ↓
Select Account
 ↓
Select Date
 ↓
Save
 ↓
Success
 ↓
Home
```

## Flow B --- Review Transaction

``` text
Home
 ↓
Recent Transaction
 ↓
Transaction Detail
```

## Flow C --- Edit Transaction

``` text
Transaction Detail
 ↓
Edit
 ↓
Edit Form
 ↓
Save
 ↓
Transaction Detail
```

## Flow D --- Delete Transaction

``` text
Transaction Detail
 ↓
Delete
 ↓
Confirmation
 ↓
Delete
 ↓
Previous Screen
```

## Flow E --- Review Spending

``` text
Home
 ↓
Reports
 ↓
Select Period
 ↓
Review Spending
```

## Flow F --- Create Budget

``` text
Home
 ↓
Budget Summary
 ↓
View All
 ↓
Add Budget
 ↓
Save
 ↓
Budget List
```

------------------------------------------------------------------------

# 49. Navigation Quality Rules

A navigation change is complete only when:

-   [ ] Route exists.
-   [ ] Back behavior works.
-   [ ] Android back behavior works.
-   [ ] Tab behavior works.
-   [ ] Modal dismissal works.
-   [ ] Bottom sheet dismissal works.
-   [ ] Unsaved changes are handled.
-   [ ] Deep-link IDs are stable.
-   [ ] No full objects are passed through route parameters.
-   [ ] Loading state works.
-   [ ] Error state works.
-   [ ] Navigation does not depend on backend availability.

------------------------------------------------------------------------

# 50. Final Navigation Map

``` text
ROOT
│
├── ONBOARDING
│
└── MAIN APP
    │
    ├── HOME
    │   ├── Transaction Detail
    │   ├── Budgets
    │   └── Accounts
    │
    ├── TRANSACTIONS
    │   ├── Filters
    │   ├── Sort
    │   ├── Transaction Detail
    │   │   ├── Edit
    │   │   └── Delete
    │   └── Add Expense
    │
    ├── ADD
    │   ├── Category Sheet
    │   ├── Account Sheet
    │   ├── Date Picker
    │   └── Receipt
    │
    ├── REPORTS
    │   ├── Period
    │   └── Category Detail (future)
    │
    └── SETTINGS
        ├── Profile
        ├── Accounts
        ├── Categories
        ├── Budgets
        ├── Recurring Transactions
        ├── Notifications
        ├── Appearance
        ├── Security
        └── Data
```

The navigation system should remain intentionally simple. The user
should always be able to reach the primary actions without navigating
through multiple levels.
