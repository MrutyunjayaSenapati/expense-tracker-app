# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Everyday individuals, young professionals, and conscious savers who need an effortless, friction-free way to log daily spending, manage bank & UPI wallets, maintain habit streaks, and stay within their monthly budgets on mobile.

## Product Purpose

Provide a personal finance companion that transforms daily expense tracking from a chore into a rewarding habit. Success means a user can log an expense in under 5 seconds, understand their net savings and budget health at a glance, and stay motivated through daily streaks and milestone achievements.

## Positioning

Unlike bloated, ad-ridden accounting apps or overly complex spreadsheets, this Expense Tracker pairs minimalist mobile ergonomics with built-in habit gamification and secure cloud synchronization (FastAPI + Supabase PostgreSQL).

## Operating Context

- **Primary Device**: Mobile phones (Android and iOS) used on-the-go (at checkout, dining out, paying bills via UPI, commuting).
- **Secondary Device**: Web browser for desktop review and monthly reporting.
- **Usage Rituals**: 
  - Quick 5-second expense entry right after making a payment.
  - Morning/evening check-in to preserve daily habit streaks.
  - Monthly budget reviews and category breakdown analysis.

## Capabilities and Constraints

- **Multi-Wallet Management**: Track separate balances across Bank Accounts, UPI Wallets, Cash, and Cards.
- **Budgeting**: Real-time spending limits with automated health alerts (*Healthy*, *Near Limit*, *Over Budget*).
- **Gamification**: Daily transaction streak tracking and monthly savings achievement milestones.
- **Category Breakdown**: Interactive donut charts and period-based spending distribution analytics.
- **Security & Privacy**: Authenticated JWT sessions backed by Supabase PostgreSQL database storage.
- **Zero Mock Data**: 100% live database data flow.

## Brand Commitments

- **Tone & Personality**: Encouraging, crisp, modern, trustworthy, and distraction-free.
- **Palette & Contrast**: Vibrant accent colors for categories, distinct emerald green for income, coral/rose for expenses, and purple/indigo brand accents.
- **Currency Agnostic**: Native support for INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), CAD, AUD.

## Evidence on Hand

- Live FastAPI backend deployed on Render.
- Connected Supabase PostgreSQL database with migrations.
- Working Expo React Native frontend with tab navigation, interactive charts, and secure storage.

## Product Principles

1. **Effortless Mobile Ergonomics**: Core actions (logging expenses, switching categories, checking balance) must be within natural thumb reach and require minimal taps.
2. **Rewarding Financial Habits**: Gamification (streaks, saving badges) should motivate mindful spending without feeling gimmicky.
3. **Clarity Over Clutter**: Financial summaries must be legible instantly at high contrast with zero visual cognitive overload.
4. **Honest, Real-Time Data**: No fake estimates or confusing placeholders; every metric reflects real database transactions accurately.

## Accessibility & Inclusion

- Dynamic text scaling and high contrast compliance for outdoor/sunlight legibility.
- Support for system Light and Dark themes.
- Touch targets sized to at least 44x44 points for effortless mobile tapping.
