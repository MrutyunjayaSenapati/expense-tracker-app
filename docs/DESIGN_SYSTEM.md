# DESIGN_SYSTEM.md

## Expense Tracker --- Mobile Design System

**Status:** UI implementation specification\
**Platform:** React Native + Expo + TypeScript\
**Initial data source:** Mock JSON\
**Target:** Production-quality mobile UI that can later connect to
FastAPI, Node.js, or Firebase without redesigning the frontend.

------------------------------------------------------------------------

## 1. Purpose

This document defines the visual language, reusable UI rules,
interaction patterns, accessibility requirements, and implementation
constraints for the expense-tracking application.

The goal is not merely to make screens functional. Every screen must
feel like part of the same product.

### Design priorities

1.  Clarity
2.  Fast expense entry
3.  Financial information hierarchy
4.  Consistency
5.  Accessibility
6.  Minimal cognitive load
7.  Premium but practical visual quality
8.  Reusable components
9.  Responsive behavior across common phone sizes
10. Backend-independent UI architecture

------------------------------------------------------------------------

# 2. Design Principles

## 2.1 Finance first

Money values are the most important information.

Use strong visual hierarchy for:

-   Total spending
-   Remaining budget
-   Account balance
-   Income
-   Expense
-   Budget progress

Do not visually compete with the primary financial information using
excessive decoration.

## 2.2 One primary action per screen

Every screen should have a clearly identifiable primary action.

Examples:

-   Dashboard → Add Expense
-   Transactions → Filter/Search
-   Add Expense → Save Expense
-   Budgets → Add Budget
-   Settings → relevant setting action

## 2.3 Fast entry

Adding an expense should require minimal interaction.

The most common path should be:

``` text
Tap Add
→ Enter amount
→ Select category
→ Select account/payment method
→ Save
```

Optional fields such as notes and receipts should never block the
primary flow.

## 2.4 Progressive disclosure

Do not expose every advanced option immediately.

Show common information first.

Reveal advanced information through:

-   Bottom sheets
-   "More"
-   Filters
-   Detail screens
-   Settings

## 2.5 Consistency over novelty

Do not create a unique UI pattern for every screen.

Reuse:

-   Buttons
-   Cards
-   Inputs
-   List rows
-   Headers
-   Bottom sheets
-   Chips
-   Empty states
-   Loading states
-   Error states

------------------------------------------------------------------------

# 3. Visual Direction

## 3.1 Overall style

The product should feel:

-   Modern
-   Clean
-   Calm
-   Trustworthy
-   Financial
-   Lightweight
-   Premium
-   Friendly

Avoid:

-   Excessive gradients
-   Excessive glassmorphism
-   Heavy shadows
-   Crowded dashboards
-   Too many colors
-   Decorative animations
-   Tiny text
-   Excessive rounded containers

## 3.2 Visual hierarchy

Use this hierarchy:

``` text
Primary financial value
        ↓
Supporting financial context
        ↓
Section heading
        ↓
Transaction/category information
        ↓
Secondary metadata
```

------------------------------------------------------------------------

# 4. Color System

The application should use semantic color tokens instead of hardcoded
colors inside screens.

## 4.1 Core palette

### Brand

``` text
Primary:        #5B5CE2
Primary Dark:   #4647B8
Primary Light:  #E9E9FF
```

### Background

``` text
Background:     #F8F9FC
Surface:        #FFFFFF
SurfaceMuted:   #F1F2F6
```

### Text

``` text
TextPrimary:    #17181C
TextSecondary:  #686B76
TextTertiary:   #9699A3
TextDisabled:   #B8BAC2
```

### Financial semantic colors

``` text
Expense:        #E05252
ExpenseSoft:    #FCECEC

Income:         #2E9B68
IncomeSoft:     #E8F6EF

Warning:        #D99120
WarningSoft:    #FFF4DD

Info:           #4D7FE8
InfoSoft:       #EAF0FF

Success:        #2E9B68
SuccessSoft:    #E8F6EF

Error:          #D64545
ErrorSoft:      #FDECEC
```

### Borders

``` text
Border:         #E5E6EB
BorderStrong:   #D3D5DC
```

## 4.2 Rules

-   Never use expense red for decorative purposes.
-   Never use income green merely because it looks attractive.
-   Red means expense, warning, destructive action, or error.
-   Green means income, success, or positive financial status.
-   Primary purple/indigo is reserved for brand and primary actions.
-   Secondary text must not be used for important financial values.

------------------------------------------------------------------------

# 5. Typography

Use the platform's native system font through React Native.

Do not bundle a custom font unless the product specification explicitly
changes.

## 5.1 Type scale

``` text
Display:
32 / 38

Heading XL:
28 / 34

Heading L:
24 / 30

Heading M:
20 / 26

Heading S:
18 / 24

Body Large:
16 / 24

Body:
15 / 22

Body Small:
14 / 20

Caption:
12 / 18

Label:
13 / 18
```

## 5.2 Font weights

``` text
Regular:     400
Medium:      500
Semibold:    600
Bold:        700
```

## 5.3 Financial values

Large financial values should normally use:

``` text
Heading XL / Bold
```

or

``` text
Display / Bold
```

Example:

``` text
₹12,450
```

The currency symbol may be slightly smaller than the numeric value if
implemented as separate text elements.

------------------------------------------------------------------------

# 6. Spacing System

Use a 4-point base system with 8-point rhythm for major layout spacing.

``` text
space.1   = 4
space.2   = 8
space.3   = 12
space.4   = 16
space.5   = 20
space.6   = 24
space.8   = 32
space.10  = 40
space.12  = 48
space.16  = 64
```

## Common usage

``` text
Screen horizontal padding: 16
Card internal padding:     16
Section gap:               24
List row vertical padding: 12
Small icon/text gap:       8
Major section separation:  32
```

Do not randomly use values such as 13, 17, 19, or 27 unless there is a
documented visual reason.

------------------------------------------------------------------------

# 7. Border Radius

``` text
radius.xs = 6
radius.sm = 8
radius.md = 12
radius.lg = 16
radius.xl = 24
radius.full = 999
```

## Usage

``` text
Inputs:       12
Buttons:      12
Cards:        16
Bottom sheet: 24
Chips:        full
Avatars:      full
```

Avoid excessive rounded containers.

------------------------------------------------------------------------

# 8. Elevation and Shadows

The default design should be relatively flat.

Use borders before shadows.

## Shadow levels

### Level 0

No shadow.

Used for:

-   Main page
-   Flat lists
-   Standard surfaces

### Level 1

Subtle shadow.

Used for:

-   Cards
-   Floating controls

### Level 2

Medium shadow.

Used for:

-   Bottom sheets
-   Important floating elements

### Level 3

Strong shadow.

Use sparingly for:

-   Modal surfaces
-   Elevated navigation elements

Do not add shadows to every component.

------------------------------------------------------------------------

# 9. Layout

## 9.1 Screen padding

Default:

``` text
Horizontal: 16
```

Use:

``` text
24
```

only for special hero/empty-state layouts.

## 9.2 Safe areas

Every screen must respect:

-   Top safe area
-   Bottom safe area
-   Keyboard area
-   Device navigation area

Use `react-native-safe-area-context`.

## 9.3 Scroll behavior

Long screens should scroll.

Do not create nested vertical ScrollViews unnecessarily.

Preferred:

``` text
FlatList
SectionList
ScrollView
```

depending on the data structure.

------------------------------------------------------------------------

# 10. Bottom Navigation

Primary navigation:

``` text
Home
Transactions
Add
Reports
Settings
```

## 10.1 Add button

The Add action should visually stand out from normal navigation items.

Recommended:

``` text
Home       Transactions       +       Reports       Settings
```

The Add button may use a raised circular/rounded control.

## 10.2 Rules

-   Navigation labels must be readable.
-   Active tab uses the primary brand color.
-   Inactive tabs use muted text/icon color.
-   Do not rely on color alone to indicate state.
-   Tab touch areas should be comfortably tappable.

------------------------------------------------------------------------

# 11. App Header

Standard header contains:

``` text
[Optional Back] [Screen Title] [Optional Action]
```

Examples:

``` text
Transactions                         [Filter]
Budgets                              [Add]
Settings
```

## Dashboard header

The Dashboard can use a custom header:

``` text
Good morning, Jay
August 2026                         [Profile]
```

The greeting should remain secondary to the financial summary.

------------------------------------------------------------------------

# 12. Buttons

## 12.1 Primary button

Used for the main action.

Example:

``` text
Save Expense
Add Budget
Continue
```

Rules:

``` text
Height: 48–52
Radius: 12
Horizontal padding: 16–20
Text: 15–16 / Semibold
```

## 12.2 Secondary button

Used for non-primary actions.

Examples:

``` text
Cancel
View Details
```

Use a neutral surface/border treatment.

## 12.3 Destructive button

Used for:

``` text
Delete
Remove
Clear data
```

Must clearly communicate destructive behavior.

Never make destructive actions look identical to the primary action.

## 12.4 Icon button

Used for:

-   Filter
-   Search
-   Edit
-   More
-   Close

Provide sufficient invisible touch padding around the icon.

------------------------------------------------------------------------

# 13. Inputs

## 13.1 Standard input

Structure:

``` text
Label
Input
Helper/Error text
```

Example:

``` text
Amount

₹
2,500
```

## 13.2 Amount input

The amount field is the most important field in Add Expense.

Requirements:

-   Large numeric typography
-   Numeric keyboard
-   Currency indicator
-   Clear validation
-   Easy editing
-   No unnecessary decoration

## 13.3 Validation

Examples:

``` text
Amount is required.
Enter an amount greater than ₹0.
Category is required.
```

Error messages must appear close to the affected field.

------------------------------------------------------------------------

# 14. Cards

Cards should group related financial information.

## 14.1 Summary card

Example:

``` text
Spent this month

₹12,450

↓ 8.4% vs last month
```

Hierarchy:

``` text
Label
Primary amount
Comparison/context
```

## 14.2 Budget card

Example:

``` text
Food

₹4,200 / ₹10,000

████████░░░░░░░░ 42%

₹5,800 remaining
```

The progress indicator must communicate status clearly.

## 14.3 Account card

Example:

``` text
UPI Wallet

₹4,820

Paytm
```

------------------------------------------------------------------------

# 15. Transaction Row

Transaction rows are one of the most frequently repeated components.

Structure:

``` text
[Category Icon]  Merchant / Note
                 Category · Payment method

                              -₹350
                              Today
```

For income:

``` text
+₹50,000
```

## Rules

-   Amount is right aligned.
-   Expense amount uses expense semantic color only when helpful.
-   Income amount uses income semantic color.
-   Category icon is visually recognizable.
-   Secondary metadata should not overpower the transaction name.
-   Rows should have consistent height and spacing.

------------------------------------------------------------------------

# 16. Category Icons

Categories should have consistent icon containers.

Example categories:

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
Salary
Other
```

Each category should have:

``` text
id
name
icon
type
```

The icon system must use one consistent icon family.

Do not mix unrelated icon libraries unless necessary.

------------------------------------------------------------------------

# 17. Add Expense Screen

This is the most important interaction screen.

Recommended structure:

``` text
Header
   ↓
Expense / Income selector
   ↓
Large Amount
   ↓
Category
   ↓
Account / Payment Method
   ↓
Date
   ↓
Note
   ↓
Receipt
   ↓
Save button
```

## Expense / Income selector

Two states:

``` text
Expense | Income
```

The active state should be obvious without relying solely on color.

## Save behavior

After successful save:

``` text
Visual confirmation
↓
Return to previous screen
↓
Updated transaction list/dashboard
```

Do not leave the user wondering whether the expense was saved.

------------------------------------------------------------------------

# 18. Dashboard

The Dashboard should answer three questions quickly:

1.  How much did I spend?
2.  Where did I spend it?
3.  Am I within my budget?

Recommended hierarchy:

``` text
Header
↓
Total Balance / Monthly Summary
↓
Income vs Expense
↓
Budget Summary
↓
Spending by Category
↓
Recent Transactions
```

Do not overload the dashboard with every available metric.

------------------------------------------------------------------------

# 19. Transactions Screen

Features:

``` text
Search
Filter
Date grouping
Transaction list
```

Example:

``` text
August 10

Lunch                         -₹350
Auto                          -₹120

August 9

Electricity                   -₹1,200
```

Filters:

``` text
Date
Category
Account
Type
Amount range
```

Use a bottom sheet for filters where practical.

------------------------------------------------------------------------

# 20. Reports

Reports should prioritize useful insights over decorative charts.

Recommended:

### Summary

``` text
Total Income
Total Expenses
Net Savings
```

### Spending trend

Line/bar chart.

### Category breakdown

Donut/pie chart.

### Comparison

``` text
This month
vs
Last month
```

### Time filter

``` text
Week
Month
Year
Custom
```

Charts must have:

-   Accessible labels
-   Clear legends
-   Empty states
-   Meaningful units
-   Touch/selection feedback where appropriate

------------------------------------------------------------------------

# 21. Budgets

Budget screen:

``` text
Monthly budget
↓
Overall progress
↓
Category budgets
↓
Remaining amount
```

Budget statuses:

``` text
Healthy
Approaching limit
Over budget
```

Do not communicate status using color alone.

Include text such as:

``` text
₹2,300 remaining
```

or:

``` text
₹450 over budget
```

------------------------------------------------------------------------

# 22. Accounts

Supported initial account types:

``` text
Cash
Bank
UPI
Credit Card
Debit Card
Other
```

Account row:

``` text
[Icon]  HDFC Bank
        Bank

                    ₹42,500
```

The UI must separate account balance from expense totals.

------------------------------------------------------------------------

# 23. Categories

Category management should support:

``` text
View
Add
Edit
Delete
```

Avoid allowing deletion of a category that is referenced by existing
transactions without a clear replacement flow.

------------------------------------------------------------------------

# 24. Bottom Sheets

Use bottom sheets for:

-   Category selection
-   Account selection
-   Filters
-   Date selection
-   Quick actions
-   Sort options

Structure:

``` text
Handle
Title
Optional description
Options/content
Close/Done action
```

Bottom sheets should not become miniature screens containing excessive
functionality.

------------------------------------------------------------------------

# 25. Modals

Use modals for:

-   Confirmation
-   Destructive actions
-   Important short decisions

Example:

``` text
Delete transaction?

This transaction will be permanently removed.

Cancel        Delete
```

Do not use a modal for every interaction.

------------------------------------------------------------------------

# 26. Empty States

Every list-based screen must have an intentional empty state.

Example:

``` text
No expenses yet

Start tracking your spending
to understand where your money goes.

[Add Expense]
```

Empty states should explain:

1.  What is empty?
2.  Why it matters?
3.  What should the user do next?

------------------------------------------------------------------------

# 27. Loading States

Do not show a blank screen while data is loading.

Use:

-   Skeletons
-   Placeholder rows
-   Loading indicators for short operations

Avoid excessive spinners.

For the Dashboard, use skeleton placeholders for:

-   Summary card
-   Budget card
-   Chart
-   Transaction rows

------------------------------------------------------------------------

# 28. Error States

Errors must be actionable.

Bad:

``` text
Something went wrong.
```

Better:

``` text
We couldn't load your transactions.

Check your connection and try again.

[Try Again]
```

For mock-data mode, error states should still be implemented so backend
integration later does not require UI redesign.

------------------------------------------------------------------------

# 29. Success Feedback

Use lightweight feedback:

-   Toast/snackbar
-   Inline success state
-   Button state
-   Small confirmation animation

Avoid full-screen success screens for simple operations.

Examples:

``` text
Expense added
Budget updated
Transaction deleted
```

------------------------------------------------------------------------

# 30. Swipe Actions

Transaction rows may support swipe actions.

Allowed:

``` text
Edit
Delete
```

Delete must have confirmation unless the interaction provides a reliable
undo mechanism.

Do not make swipe actions the only way to access important operations.

------------------------------------------------------------------------

# 31. Animation

Animations should improve understanding, not distract.

Recommended duration:

``` text
Micro interaction: 100–180ms
Standard transition: 180–250ms
Complex transition: 250–350ms
```

Use React Native Reanimated when animation performance matters.

Examples:

-   Button press scale
-   Card appearance
-   Bottom sheet
-   List item insertion/removal
-   Progress bar
-   Chart reveal

Avoid:

-   Constant bouncing
-   Long entrance animations
-   Decorative animations on every component

Respect reduced-motion preferences where practical.

------------------------------------------------------------------------

# 32. Accessibility

Accessibility is part of the design system, not a later feature.

Requirements:

-   Interactive controls must have comfortable touch targets.
-   Screen-reader labels must describe icon-only actions.
-   Do not communicate state through color alone.
-   Maintain strong text contrast.
-   Support dynamic text sizing where possible.
-   Focus order must be logical.
-   Error messages must be understandable.
-   Inputs must have meaningful labels.

Examples:

``` text
Accessible label:
"Delete transaction: Lunch, ₹350"

Not:
"Delete"
```

------------------------------------------------------------------------

# 33. Keyboard Behavior

For forms:

-   Use the correct keyboard type.
-   Amount → numeric/decimal keyboard.
-   Email → email keyboard.
-   Search → search keyboard.
-   Keyboard should not cover the active field.
-   Submit/Next behavior should be predictable.

Add Expense should remain comfortable on smaller devices.

------------------------------------------------------------------------

# 34. Dark Mode

Dark mode should be supported architecturally even if it is not
implemented in the first UI milestone.

Never hardcode:

``` tsx
backgroundColor: "#FFFFFF"
```

inside screens.

Use semantic tokens:

``` tsx
backgroundColor: colors.background
```

This allows future themes without rewriting screens.

------------------------------------------------------------------------

# 35. Responsive Rules

The application must work on:

-   Small Android phones
-   Standard Android phones
-   Large Android phones
-   iPhones with notches
-   iPhones with Dynamic Island
-   Devices with gesture navigation
-   Devices with three-button navigation

Do not hardcode screen dimensions.

Avoid:

``` tsx
width: 390
height: 844
```

Use:

``` tsx
flex
width: "100%"
maxWidth
useWindowDimensions()
```

where appropriate.

------------------------------------------------------------------------

# 36. Component Architecture

Use three component levels.

## Level 1 --- Primitive UI

``` text
Button
Text
IconButton
Input
Card
Divider
Badge
Chip
Avatar
```

## Level 2 --- Domain UI

``` text
TransactionRow
BudgetCard
AccountCard
CategoryItem
SpendingChart
SummaryCard
```

## Level 3 --- Screens

``` text
HomeScreen
TransactionsScreen
AddExpenseScreen
ReportsScreen
BudgetsScreen
SettingsScreen
```

Screens should compose components rather than contain huge blocks of
styling and business logic.

------------------------------------------------------------------------

# 37. Theme Architecture

Recommended structure:

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

Example:

``` ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

Components should consume these tokens.

------------------------------------------------------------------------

# 38. Mock Data Architecture

Screens must not import raw JSON directly.

Bad:

``` tsx
import transactions from "../data/transactions.json";
```

inside every screen.

Preferred:

``` text
Screen
  ↓
useTransactions()
  ↓
transactionRepository
  ↓
mockTransactionRepository
  ↓
transactions.json
```

Later:

``` text
Screen
  ↓
useTransactions()
  ↓
transactionRepository
  ↓
apiTransactionRepository
  ↓
FastAPI / Node / Firebase
```

This is mandatory for the UI-first development phase.

------------------------------------------------------------------------

# 39. Pixel-Perfect Implementation Rules

A screen is not considered complete because it works.

Before marking a screen complete, verify:

### Layout

-   Horizontal padding
-   Vertical spacing
-   Alignment
-   Safe area
-   Scroll behavior

### Typography

-   Font size
-   Weight
-   Line height
-   Letter spacing where necessary

### Components

-   Height
-   Width
-   Radius
-   Border
-   Shadow
-   Icon size

### Color

-   Background
-   Surface
-   Primary
-   Semantic colors
-   Disabled states

### Interaction

-   Press state
-   Loading state
-   Error state
-   Empty state
-   Keyboard behavior
-   Navigation transition

### Device verification

Test at minimum:

``` text
Small Android
Standard Android
Large Android
iPhone
```

------------------------------------------------------------------------

# 40. Visual QA Process

Every completed screen should follow:

``` text
Implement
   ↓
Run on device/emulator
   ↓
Take screenshot
   ↓
Compare against design specification
   ↓
Identify differences
   ↓
Fix
   ↓
Repeat
```

Do not ask an AI agent to implement an entire application and assume the
result is pixel-perfect.

Work screen-by-screen.

------------------------------------------------------------------------

# 41. AI Agent Rules

AI coding agents must follow these rules.

## Before coding

1.  Read `PRD.md`.
2.  Read `DESIGN_SYSTEM.md`.
3.  Read `ARCHITECTURE.md`.
4.  Inspect existing components.
5.  Inspect existing theme tokens.
6.  Inspect navigation before changing navigation.

## During coding

-   Reuse existing components.
-   Do not duplicate UI components.
-   Do not hardcode colors.
-   Do not hardcode spacing values unnecessarily.
-   Do not put raw mock JSON inside screens.
-   Do not introduce dependencies without justification.
-   Do not modify unrelated screens.
-   Keep business logic out of presentational components.
-   Follow TypeScript types.
-   Preserve the existing architecture.

## After coding

Run:

``` text
TypeScript
Lint
Tests
Expo app
```

Then perform visual verification.

------------------------------------------------------------------------

# 42. Definition of Done

A screen is complete only when:

-   [ ] Functional requirements are implemented.
-   [ ] Design tokens are used.
-   [ ] No duplicated components were introduced.
-   [ ] Loading state exists where applicable.
-   [ ] Empty state exists where applicable.
-   [ ] Error state exists where applicable.
-   [ ] Validation exists where applicable.
-   [ ] Accessibility labels exist.
-   [ ] Keyboard behavior is correct.
-   [ ] Safe areas are correct.
-   [ ] Navigation works.
-   [ ] Mock data is accessed through the repository/data layer.
-   [ ] TypeScript passes.
-   [ ] Lint passes.
-   [ ] Relevant tests pass.
-   [ ] Android has been checked.
-   [ ] iOS has been checked when available.
-   [ ] Visual QA has been performed.

------------------------------------------------------------------------

# 43. Initial Screen Priority

Build in this order:

``` text
1. App Shell / Navigation
2. Design Tokens
3. Reusable UI primitives
4. Home Dashboard
5. Add Expense
6. Transactions
7. Transaction Detail/Edit
8. Budgets
9. Reports
10. Accounts
11. Categories
12. Settings
13. Empty / Loading / Error states
14. Animation & visual polish
15. Accessibility pass
16. Final visual QA
```

Do not build advanced AI, SMS parsing, bank integrations, or backend
functionality during the initial UI milestone.

------------------------------------------------------------------------

# 44. Design System Non-Negotiables

The following rules must not be violated without an explicit product
decision:

1.  No arbitrary colors inside screens.
2.  No arbitrary typography values when a token exists.
3.  No duplicate components.
4.  No direct JSON imports inside screens.
5.  No backend-specific UI coupling.
6.  No hardcoded device dimensions.
7.  No giant screen components containing all logic.
8.  No unnecessary third-party UI framework.
9.  No destructive action without clear confirmation/undo.
10. No screen is considered finished without visual QA.

------------------------------------------------------------------------

# 45. Future Theme Extensibility

The architecture should support:

``` text
Light Theme
Dark Theme
Future Custom Themes
```

without changing component APIs.

Example:

``` ts
const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
};
```

Components consume semantic tokens rather than implementation-specific
colors.

------------------------------------------------------------------------

# 46. Final Design Goal

The finished application should feel like a cohesive financial product
rather than a collection of independently generated React Native
screens.

The target experience is:

``` text
Open app
   ↓
Understand financial position immediately
   ↓
Add an expense in seconds
   ↓
Review transactions easily
   ↓
Understand spending visually
   ↓
Know whether budgets are healthy
   ↓
Make better spending decisions
```

The UI should remain simple even as functionality grows.
