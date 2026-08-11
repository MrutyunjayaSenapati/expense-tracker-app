# Executive Summary  
We propose building an **offline-first Expo/React Native expense tracker** targeting general Indian users. Core MVP features include manual expense/income entry with categories and accounts, a transaction history (daily/weekly/monthly views), and simple dashboards (summaries and charts). Budgets and reporting are “must-have” features; recurring expenses, receipt photos, and SMS parsing (à la Moneyview) are *nice-to-have*； future enhancements could include bank/UPI integrations, AI categorization, and multi-user sharing. The UI will follow Material Design/Human Interface guidelines (8dp grid, ≥24px touch targets) with clear typography and accessible contrast. Data will initially be mocked via JSON; later a FastAPI/Node/Firebase backend will be added. State can be managed with lightweight libraries (e.g. [Zustand](https://zustand.pmnd.rs/) or Context) and TanStack Query for cached API calls. Local persistence will use **expo-sqlite** (or MMKV) for offline storage. Testing will employ Jest/React Testing Library for unit tests and Expo/Detox for E2E. CI/CD will leverage Expo’s EAS Workflows to build and distribute the app. Analytics and errors can be captured with tools like Sentry and EAS Insights/Observe. Security measures include encrypted storage via `expo-secure-store` for credentials and HTTPS communication. We will use AI assistants (Claude/Codex) with careful prompt engineering for component scaffolding, test generation, and code review – but all outputs will be manually validated. The plan below details features, screens, UI specs, tech stack choices, development workflow, timeline, and handoff requirements.

## Core Features & Priorities  
We categorize features as **Must-Have, Nice-to-Have, Future**. Key features from top apps inform our scope: Indian apps often auto-parse SMS or bank feeds, but our MVP will start with manual entry.  

| Category          | Feature                                | Priority          | Notes (Examples)                                  |
|-------------------|----------------------------------------|-------------------|---------------------------------------------------|
| **Entry & Tracking** | Add Expense/Income (form: amount, date, category, account, method, note) | **Must**          | Basic fields; dropdowns for category/account.     |
|                   | Transaction List (grouped by date)       | **Must**          | FlatList/SectionList to browse history. |
|                   | Summary Dashboard (month/weekly totals) | **Must**          | Cards or charts showing total spent vs. budget.   |
|                   | Budgeting (monthly/category limits)     | **Must**          | Visual budget bars (progress bars).               |
|                   | Category & Account Management           | **Nice**          | CRUD for categories, accounts (Cash, UPI, etc.).  |
| **Reporting**     | Charts (pie/bar for spending breakdown) | **Nice**          | Library like Victory or React Native Chart Kit.   |
|                   | Export (CSV/Excel)                      | **Nice**          | For expense data export/share.                    |
|                   | Multi-currency support                  | **Nice** (future) | Indian focus: maybe initial target ₹ only.        |
| **Conveniences**  | Recurring Transactions                 | **Nice**          | Auto-add monthly bills/income.                    |
|                   | Reminders/Notifications (bill alerts)    | **Nice**          | Push reminders for bills (requires Push setup).   |
|                   | Data Backup/Sync (Google Drive, cloud)   | **Future**        | Sync across devices; offline fallback (MMKV).     |
| **Advanced**      | SMS/Bank Parsing (auto-import)          | **Future**        | Similar to Moneyview’s SMS import.  |
|                   | Receipt Photo Capture                   | **Future**        | Attach images (via `expo-camera`/file upload).    |
|                   | AI Assistant (voice entry, chat)        | **Future**        | Natural-language expense queries (e.g. Alexa).    |
|                   | Social/Shared budgets                   | **Future**        | Invite family, share group budgets.               |
|                   | Multi-language (Indian locales)         | **Nice** (future) | ET Money has 8 Indian languages.    |

## Screen List & Flow  

| Screen           | Purpose                                            | Key Components & Layout                           | Data Fields / Interactions                       | Navigation Links                       |
|------------------|----------------------------------------------------|---------------------------------------------------|--------------------------------------------------|----------------------------------------|
| **Splash/Onboard**  | Intro/tutorial (optional)                         | Logo, progress dots, **Get Started** button        | -                                                | → Welcome/Login or Home                |
| **Welcome/Login**   | (If used) User auth via email/Google/Phone        | Text fields, **Login/Register** buttons            | Email, password, Google-Auth                     | → Register / PasswordReset / Home (if guest) |
| **Home Dashboard**  | Overview of balances and recent expenses          | Top summary cards (Total Expenses, Budgets),   FlatList of Recent Txns, charts (pie/bar) | Display total spent (month, week), charts by category | **Tabs**: Home, Transactions, Add, Reports, Settings |
| **Transactions**    | Full list of transactions                         | **SectionList** grouped by date (e.g. Today, Yesterday), each item with amt, category, account icon | Date, amount, category, account, payment method. Swipe-to-delete via Gesture Handler. Pull-to-refresh (if backend). | Tap item: → *Edit Transaction*. Back to Dashboard. |
| **Add/Edit Expense**| Form to create or edit an expense/income          | `<Modal>` or full screen form: TextInput, dropdowns, DatePicker, currency selector, **Save/Cancel** buttons | Fields: Amount, Category, Account, Date/Time, Payment Method (cash/card/UPI), Note, optional Receipt photo. | Save → back to list/Dashboard; Cancel → back. |
| **Transaction Detail**| View details of a single transaction (optional)   | Details View or Modal: shows fields, photo (if any), edit button, delete icon.   | Displays all fields from Add form.              | Edit icon: → *Edit Expense*. Delete prompts confirm. |
| **Budgets**        | Set and view budgets                              | List of budget items by category: category icon, progress bar (spent/goal), edit button | Fields: Category, Monthly limit, Spent to date (calc). | “Add Budget” button: opens a form. (Link to Categories for choices.) |
| **Categories**     | Manage expense categories                         | FlatList of categories, each with icon/name, edit & delete.   Floating “+” to add.   | Category name, icon.                             | Back: settings or parent nav.         |
| **Accounts**       | Manage accounts (Cash, Bank, UPI, Card)           | FlatList of accounts: icon, name, balance. “+” add account form. | Fields: Account name, type, opening balance.     | Back: settings or parent nav.         |
| **Reports**        | Visual spending reports                           | Charts (bar, line) for Income vs Expense, spending trends. Filter controls (month/year) | Filters: date range; output: chart data.        | Back to Dashboard or Reports tab.     |
| **Settings**       | App settings                                      | Toggle switches (e.g. notifications, dark mode), Profile info, Currency, Data backup | Options: Theme, language, default currency, export data. | -                                    |
| **Help/About**    | Support and app info                              | Text and links                                    | -                                                | Linked from Settings.                 |

Each screen will use React Navigation (bottom tabs + stack). The bottom tab bar might include Home, Transactions, Add (+FAB), Reports, Settings. “Add Expense” could be a floating action button on every screen. All touch targets will be ≥48×48px for accessibility. Animations (via Reanimated) should be subtle: e.g. fade or slide transitions between screens, button touch ripple, and swipe-to-delete animations on lists.

## UI/UX Specifications  

- **Layout & Grid:** Follow an 8 dp spacing grid (padding/margins 8,16,24,32…). For example, use 16dp left/right page padding, 12–16dp between list items, 24dp between sections. Safe-area insets respected.  
- **Color Palette (Material-like):** Primary color (e.g. Indigo: `#3F51B5`), secondary accent (Teal: `#009688`), background (`#FFFFFF`), surface cards (`#F5F5F5`), text primary (`#212121`), text secondary (`#757575`), error (red: `#B00020`). Ensure WCAG AA contrast for text. For example, white text on primary meets 4.5:1 (touch targets on colored backgrounds have larger icons/text).  
- **Typography:** Use a legible sans-serif (e.g. Roboto on Android, SF Pro on iOS). Font sizes: Title (24sp), Subtitle (20sp), Body (16sp), Small (14sp). Maintain line-heights at multiples of 4dp (e.g. 24dp line height for 16sp text). Headings and body text should stick to an 8dp vertical rhythm.  
- **Iconography:** Use a consistent icon set (Material Icons or FontAwesome). Example icons: 🍔 Food, 💡 Bills, 🏠 Home, 💳 Accounts, 📊 Reports. Icons should have 24×24dp or larger canvas, aligned to the grid. Provide ample touch padding (at least 8dp around 24dp icon) per accessibility.  
- **Color Tokens:** Define global theme tokens (e.g. `primary`, `onPrimary`, `background`, `surface`, `error`, `textPrimary`, `textSecondary`). Use these consistently for theming. Support Dark Mode as a future toggle (optional).  
- **Accessibility:** Ensure all interactive elements (buttons, inputs) are ≥48×48dp. Use color contrast ≥4.5:1 for text and important icons. Allow larger text via device settings. Provide meaningful labels for screen readers on buttons and inputs.  
- **Animations/Microinteractions:** Use Reanimated for subtle UX polish: e.g. animate FAB to scale on press, list items to fade/slip out on deletion. Highlighting selections (ripple effect) via `TouchableNativeFeedback` (Android) or opacity (iOS). Loading indicators for async data fetches. Ensure animations are short (<300ms) and disable/reduce motion for accessibility settings.

 *Figure: Example of a modern mobile finance UI (contactless payment view), illustrating use of card layouts and clear iconography. Such clean, minimal design cues can guide our app’s look.*  

## Data Models & Mock JSON  
We define JSON schemas for *users, transactions, categories, accounts, budgets, receipts*. Below are schemas and example records (6 entries each). In a real app these would come from API; for now we'll mock them.  

```json
// Users schema & samples
{
  "users": [
    {"id": "user1", "name": "Rahul",     "email": "rahul@example.com",    "currency": "INR"},
    {"id": "user2", "name": "Asha",      "email": "asha@example.com",     "currency": "INR"},
    {"id": "user3", "name": "Priya",     "email": "priya@example.com",    "currency": "INR"},
    {"id": "user4", "name": "Dev",       "email": "dev@example.com",      "currency": "INR"},
    {"id": "user5", "name": "Rekha",     "email": "rekha@example.com",    "currency": "INR"},
    {"id": "user6", "name": "Vikram",    "email": "vikram@example.com",   "currency": "INR"}
  ]
}
```
```json
// Categories schema & samples
{
  "categories": [
    {"id": "cat_food",       "name": "Food & Dining",   "type": "expense", "icon": "restaurant"},
    {"id": "cat_travel",     "name": "Travel",         "type": "expense", "icon": "flight"},
    {"id": "cat_shopping",   "name": "Shopping",       "type": "expense", "icon": "shopping_cart"},
    {"id": "cat_entertain",  "name": "Entertainment",  "type": "expense", "icon": "movie"},
    {"id": "cat_bills",      "name": "Bills",          "type": "expense", "icon": "receipt"},
    {"id": "cat_salary",     "name": "Salary",         "type": "income",  "icon": "attach_money"}
  ]
}
```
```json
// Accounts schema & samples
{
  "accounts": [
    {"id": "acc_cash",    "userId": "user1", "name": "Wallet Cash",   "type": "Cash",     "balance": 5000.00},
    {"id": "acc_bank",    "userId": "user1", "name": "Bank A/C",      "type": "Bank",     "balance": 15000.00},
    {"id": "acc_upi",     "userId": "user1", "name": "Paytm UPI",     "type": "UPI",      "balance": 1200.00},
    {"id": "acc_credit",  "userId": "user1", "name": "Credit Card",   "type": "Credit",   "balance": -2000.00},
    {"id": "acc_savings", "userId": "user2", "name": "Savings A/C",   "type": "Bank",     "balance": 8000.00},
    {"id": "acc_cash2",   "userId": "user3", "name": "Wallet Cash",   "type": "Cash",     "balance": 300.00}
  ]
}
```
```json
// Budgets schema & samples (monthly budgets)
{
  "budgets": [
    {"id": "budg_aug_food",   "userId": "user1", "categoryId": "cat_food",       "amount": 10000,  "period": "2026-08"},
    {"id": "budg_aug_travel", "userId": "user1", "categoryId": "cat_travel",     "amount": 5000,   "period": "2026-08"},
    {"id": "budg_aug_bills",  "userId": "user1", "categoryId": "cat_bills",      "amount": 8000,   "period": "2026-08"},
    {"id": "budg_aug_ent",    "userId": "user1", "categoryId": "cat_entertain",  "amount": 3000,   "period": "2026-08"},
    {"id": "budg_aug_shopping","userId": "user1","categoryId": "cat_shopping",  "amount": 7000,   "period": "2026-08"},
    {"id": "budg_aug_savings","userId": "user1", "categoryId": "cat_salary",     "amount": 0,      "period": "2026-08"}
  ]
}
```
```json
// Transactions schema & samples
{
  "transactions": [
    {"id": "txn1", "userId": "user1", "accountId": "acc_cash",   "categoryId": "cat_food",       "amount": 350.00,  "currency": "INR", "date": "2026-08-10", "paymentMethod": "Cash", "note": "Lunch at Cafe"},
    {"id": "txn2", "userId": "user1", "accountId": "acc_bank",   "categoryId": "cat_bills",      "amount": 1200.00, "currency": "INR", "date": "2026-08-09", "paymentMethod": "Bank Transfer", "note": "Electricity bill"},
    {"id": "txn3", "userId": "user1", "accountId": "acc_upi",    "categoryId": "cat_shopping",   "amount": 2300.00, "currency": "INR", "date": "2026-08-08", "paymentMethod": "UPI", "note": "Electronics purchase"},
    {"id": "txn4", "userId": "user1", "accountId": "acc_credit", "categoryId": "cat_entertain",  "amount": 800.00,  "currency": "INR", "date": "2026-08-07", "paymentMethod": "Card", "note": "Movie tickets"},
    {"id": "txn5", "userId": "user1", "accountId": "acc_bank",   "categoryId": "cat_salary",     "amount": 50000.00,"currency": "INR", "date": "2026-08-01", "paymentMethod": "Bank Transfer", "note": "August Salary"},
    {"id": "txn6", "userId": "user1", "accountId": "acc_cash",   "categoryId": "cat_travel",     "amount": 150.00,  "currency": "INR", "date": "2026-07-31", "paymentMethod": "Cash", "note": "Bus fare"}
  ]
}
```
```json
// Receipts schema & samples (optional photos)
{
  "receipts": [
    {"id": "rcpt1", "transactionId": "txn1", "uri": "https://example.com/receipts/rcpt1.jpg", "note": "KFC Lunch"},
    {"id": "rcpt2", "transactionId": "txn2", "uri": "https://example.com/receipts/rcpt2.jpg", "note": "Bill receipt"},
    {"id": "rcpt3", "transactionId": "txn3", "uri": "https://example.com/receipts/rcpt3.jpg", "note": ""},
    {"id": "rcpt4", "transactionId": "txn4", "uri": "https://example.com/receipts/rcpt4.jpg", "note": ""},
    {"id": "rcpt5", "transactionId": "txn5", "uri": "",                           "note": ""},
    {"id": "rcpt6", "transactionId": "txn6", "uri": "https://example.com/receipts/rcpt6.jpg", "note": "Bus ticket"}
  ]
}
```

These schemas can evolve once the backend is defined. Use these to mock API responses and populate UI during prototyping.

## Component & Library Mapping  

We’ll leverage built-in and popular React Native/Expo components:

- **Lists:** Use [`FlatList`](https://reactnative.dev/docs/flatlist) for lists of items (e.g. categories, budgets) and [`SectionList`](https://reactnative.dev/docs/sectionlist) for grouped transactions by date. These support headers, pull-to-refresh, separators, etc.
- **Forms/Inputs:** `<TextInput>`, `<Picker>` or `<react-native-picker>`, `<DateTimePicker>` (from `@react-native-community/datetimepicker`), and buttons (`<Button>` or custom `<TouchableOpacity>`).
- **Modals/Sheets:** Use [`<Modal>`](https://reactnative.dev/docs/modal) for full-screen forms, and libraries like [@gorhom/bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet/) or `react-native-modal` for bottom sheets (e.g. on selecting payment method or category). 
- **Gesture Handling:** [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler) for swipe-to-delete (using `Swipeable`), draggable FAB, etc. 
- **Animations:** [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated) for performant animations (e.g. animated flatlist items, button presses).
- **Navigation:** [`@react-navigation/native`](https://reactnavigation.org/) with bottom-tabs (`@react-navigation/bottom-tabs`) and stack navigators.
- **UI Kit (optional):** Consider UI libraries like [React Native Paper](https://callstack.github.io/react-native-paper/) (Material theming) or [UI Kitten](https://akveo.github.io/react-native-ui-kitten/) to speed up development of cards, dialogs, etc.
- **Charts:** A library like [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) or [Victory Native](https://formidable.com/open-source/victory/docs/native/) for pie/bar charts in Reports.

## State Management & Data Fetching  

- **Local State:** Simple UI state (e.g. form inputs, selected filters) can use React `useState` or Context.  
- **Global State:** For app-wide state (user profile, offline cache), options include Redux (with Redux Toolkit), MobX, or [Zustand](https://zustand.pmnd.rs/). Developers note *“Zustand is simpler and easy to use, but not as powerful”* as Redux Toolkit; for a small app Zustand or Context is attractive, but RTK is robust (especially if expanding later).  
- **Server State / Queries:** Use **TanStack Query (React Query)** for async data fetching and caching. It can auto-retry, cache results, and even persist to local storage. For offline support, we can use `@tanstack/query-sync-storage-persister` with MMKV or AsyncStorage (see example using MMKV below). This way, on regaining connectivity, queued mutations can sync with backend.  

Example (MMKV + TanStack Query persistence): 
```ts
const mmkv = new MMKV();
const persister = createSyncStoragePersister({
  storage: {
    getItem: (key) => mmkv.getString(key) ?? null,
    setItem: (key, value) => mmkv.set(key, value),
    removeItem: (key) => mmkv.delete(key),
  },
  key: "tanstack-query-cache",
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 300000, networkMode: 'offlineFirst' } }
});
// Use persistQueryClient with this persister...
```

- **Offline Strategy:** Use `expo-sqlite` for local DB storage of transactions, categories, etc. The SQLite DB persists across app restarts. For simple caching/queue, one could use MMKV or `@react-native-async-storage/async-storage`, but a real DB (like SQLite or WatermelonDB) scales better. Consider [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/) or [MMKV](https://github.com/mrousavy/react-native-mmkv) for key-value. We can queue mutations when offline and sync when online (as shown in).  
- **Choice:** For MVP, SQLite via `expo-sqlite` is straightforward (persistent, relational). Combine with React Query to invalidate/refetch data after sync.

## Testing Strategy  

- **Unit & Component Tests:** Use **Jest** (included by default with RN) for unit tests. Use [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) to render components and assert UI behavior. Example: snapshot or render tests for form and list components. For instance, verifying the `ExpenseItem` renders correct amount and category.  
- **Integration Tests:** Test logic modules separately (e.g. utilities, hooks). Mock async storage or SQLite.  
- **End-to-End (E2E):** Use **Detox** or the Expo [Maestro](https://maestro.dev/) tool to script user flows (open app, add expense, check it appears in list). These simulate real user taps. EAS Workflows offers a prebuilt Maestro job.  
- **CI Testing:** Run lint, unit tests, and E2E tests on each commit (GitHub Actions + EAS Workflow or Firebase Test Lab for Android).

 *“At Facebook, we use Jest to test React Native applications.”* We’ll adopt this by testing components (snapshot tests for static render, assertion tests for behavior). All generated code from AI assistants will be validated with tests.

## CI/CD & Deployment  

- **Builds:** Use **Expo Application Services (EAS)** for builds. EAS Build can produce Android APKs/AABs and iOS IPAs from the Expo project.  
- **Release Pipelines:** Adopt **EAS Workflows** (Expo’s CI/CD) to automate the pipeline. Workflows can run on GitHub events: lint, test, `eas build`, and (with **EAS Submit**) publish to App Store / Play Store.  
- **Expo Publish:** For OTA updates of JS code (React Native JS bundle), use `expo update` with EAS Update to push changes to users without full app store updates.  
- **Version Control:** Store keys and config securely (EAS environment variables). Maintain separate env for dev/prod builds.  
- **Code Signing:** iOS requires provisioning profiles; use EAS’s credentials manager or manual profiles.  
- **Doc:** Include a scriptable `app.json/app.config.js` with bundle identifiers and permissions (e.g. notifications).  
- **CI Tools:** If not using EAS Workflows, GitHub Actions can trigger `eas build`, run tests, and upload artifacts.

 *“EAS Workflows is a React Native CI/CD service… automate delivering your app to users, creating previews of every PR, [and] creating development builds.”* We’ll use this for streamlined Expo CI/CD.

## Analytics & Error Tracking  

- **Analytics:** Use **Firebase Analytics** (compatible with Expo via `expo-firebase-analytics`) or **Amplitude/Mixpanel** for usage tracking (e.g. user retention, screen views). For a quick solution, **EAS Insights** can aggregate OTA update usage.  
- **Performance Monitoring:** Expo’s **EAS Observe** can collect startup and render metrics.  
- **Error Reporting:** Integrate **Sentry** (or Bugsnag) to capture crashes and JS errors. Sentry automatically captures stack traces, device info, and lets you tag releases. Setup involves adding the Sentry SDK and DSN.  
- **Session Recording:** (optional) Use **LogRocket** or **Sentry Session Replay** to see user sessions and identify UI issues.  
- **Privacy:** Ensure analytics are opt-in as per Indian regulations; anonymize data (no PII).  

 *“Sentry is a crash reporting platform… It notifies you of exceptions or errors that your users run into while using your app.”* We will link Sentry for error tracking.  

## Security & Privacy  

- **Authentication:** If user accounts are used, implement secure auth (e.g. OAuth via Firebase Auth or JWT). Use **expo-secure-store** for tokens so credentials are encrypted.  
- **Local Data:** Encrypt sensitive fields (maybe for local DB) if needed. Restrict export/import to ensure data privacy.  
- **Network:** Use HTTPS (TLS) for all backend calls.  
- **Permissions:** Request only necessary permissions (CAMERA for receipts, NOTIFICATIONS for reminders). Clearly explain why (privacy).  
- **Compliance:** Since targeted to India, consider regulatory norms (although a personal finance app mainly stores user’s own data). Provide privacy policy (clear data use, no 3rd-party selling).  
- **SecureStore:** For any small secret (API keys, login tokens), use **Expo SecureStore** which encrypts on device.  

No sensitive PII (like Aadhaar) should be collected. Data at rest (local DB) should be sandboxed (React Native apps are sandboxed by OS).

## AI-Assisted Development Workflow  

We will leverage AI coding tools (Codex/GPT, Claude) to accelerate UI coding and tests, with human oversight:

- **Prompt Templates:** Predefine prompts for common tasks, e.g. “Generate a React Native component for an expense entry form with amount, date, category.” Or “Write Jest tests for the ExpenseForm component validating input fields.”  
- **Generating Mock Data:** Use AI to create realistic JSON transactions for prototyping: e.g. “Produce 10 mock JSON records for user expenses with categories and amounts.”  
- **Component Stubs:** Use GPT/Codex to scaffold boilerplate (e.g. navigation setup, Redux store).  
- **Code Review:** Always review and refactor AI-generated code. Tools may hallucinate or use outdated patterns; checks required.  
- **Pair Programming:** Treat AI as a pair: ask clarifying questions to refine prompts. For example, “Refine the prompt to include i18n support” if needed.  
- **Testing Assistance:** AI can help generate unit tests; e.g. prompt “Write @testing-library/react-native tests for checking that the AddExpense form shows an error when amount is empty.”  
- **Knowledge Base:** Save useful prompts (e.g. “list React Native icons for common expense categories”).

 *OpenAI notes Codex is “most often used by engineers to offload repetitive, well-scoped tasks, like refactoring, renaming, and writing tests”*.* We will similarly use AI to scaffold code/tests, but **always verify** the output. For example:  
> **Prompt (UI component):** *“Create a React Native functional component named `ExpenseList` that takes an array of transaction objects (id, amount, category, date) and displays them in a scrollable list grouped by date.”*  
> **Prompt (Test):** *“Generate a Jest test for `ExpenseList` that checks it renders a transaction with correct amount and date.”*  

All AI outputs will be validated and adjusted to match our style and requirements.

## Timeline & Milestones (UI-only MVP)  

| Milestone                 | Tasks                                                             | Est. Days | Deliverables                                    |
|---------------------------|-------------------------------------------------------------------|-----------|-------------------------------------------------|
| **1. Discovery & Design** | Research UI patterns, define feature set, create wireframes/mockups | 3 days    | Wireframes for each screen, UI spec sheet.       |
| **2. Project Setup**      | Initialize Expo project, configure navigation, state management     | 1 day     | Boilerplate Expo app, navigation stub.           |
| **3. Home/Dashboard**     | Build dashboard screen with summary cards and chart placeholder     | 2 days    | Home screen UI with static data.                |
| **4. Transactions List**  | Implement FlatList of transactions, swipe-to-delete action          | 2 days    | Transactions screen with mock JSON data.        |
| **5. Add Expense Form**   | Build add/edit expense screen (form with validation)                | 3 days    | ExpenseForm component, saves to local state/DB. |
| **6. Budgets Screen**     | Create budget list and progress bars                                | 2 days    | Budgets screen with adjustable budget entries.  |
| **7. Other Screens**      | Categories, Accounts, Settings forms, navigation linking            | 3 days    | Settings screen, category/account CRUD screens. |
| **8. UI Polish & Animations** | Apply theming, spacing, icons; add microinteractions           | 2 days    | Consistent styling, transitions, tested interactions. |
| **9. Testing & Bugfixes** | Write unit tests for key components; perform manual QA             | 2 days    | Passing tests, resolved UI bugs.                |
| **10. CI/CD Setup**       | Configure EAS build, GitHub Actions for lint/tests                 | 1 day     | Automated build pipeline ready.                 |
| **Total**                 |                                                                   | **18 days** |                                                 |

This ~3-week timeline covers the UI-only MVP. Deliverables: clickable prototype (Expo Go), code repository, and documentation for each milestone. After UI MVP, integration with the backend API will follow (see Handoff).

## Handoff Checklist (Backend Integration)  

When connecting to the backend (FastAPI/Node/Firebase), ensure the following:

- **API Contracts:** Define endpoints and request/response schemas for all entities (users, transactions, categories, budgets, accounts, receipts). E.g.  
  - `POST /users/login`, `GET /users/me`  
  - `GET /transactions?userId=...`, `POST /transactions`, `PUT /transactions/{id}`, `DELETE /transactions/{id}`  
  - Similar CRUD for categories, accounts, budgets.  
  - Authentication endpoints (login, refresh).  
- **Mock Data:** Provide example JSON responses (as above) and schema docs (JSON Schema or OpenAPI).  
- **Auth Tokens:** Document how to handle tokens (e.g. JWT in Authorization header).  
- **Error Codes:** Define standard error responses (400 for validation, 401 unauthorized, etc.).  
- **Data Sync:** Document when to call sync APIs (e.g. on App open, when coming online, or pull-to-refresh).  
- **Real-time (Optional):** If using WebSockets or Firebase listeners, specify those channels (not needed for MVP).  
- **Integration Tests:** Write a small test API client to simulate login and fetching data; provide this for frontend devs.  
- **Deliverables:** API spec (OpenAPI/Swagger), endpoint list (table), example curl commands or Postman collection.  

Ensure all endpoints allow CORS and are reachable from mobile. The frontend UI should have placeholders for success/failure states of API calls (e.g. snackbars on save success or failure).

## Summary  

This document lays out a comprehensive plan for an Expo React Native expense tracker: core & advanced features, detailed screen flows, UI/UX specs with Material design principles, data schemas with sample JSON, tech stack choices, and development workflow including AI assistance. By following the prioritized features, timeline, and checklists above, we ensure a pixel-perfect UI-only MVP is built efficiently, with a clear path for subsequent backend integration. All recommendations (e.g. using FlatList for performance, Expo’s SQLite and EAS pipelines) are based on current best practices.  

**Sources:** Material Design & HIG guidelines, Expo docs, React Native docs, and industry articles/blogs. These informed our design decisions and tech recommendations.  

