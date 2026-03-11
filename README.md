# Capera Test App

A Nuxt 4 web app for FX monitoring and transaction flows, including:

- Live FX rate tracker (simulated API)
- Quote to recipient flow with status transitions
- Recent transactions on home
- Full transactions list with pagination and filters
- Light and dark mode support

## Tech Stack

- Nuxt 4 (`nuxt`)
- Vue 3 (`vue`)
- Tailwind CSS via Nuxt module (`@nuxtjs/tailwindcss`, `tailwindcss`)
- Pinia state management (`@pinia/nuxt`, `pinia`)
- Nuxt Icon (`@nuxt/icon`)

## Key Engineering Decisions

1. **Feature separation by responsibility**
	- `services/` hold API-facing logic (simulated network calls, latency, data shaping).
	- `hooks/` hold UI-facing async state and orchestration (`loading`, `error`, `refresh`, view logic).
	- `components/` focus on presentation and user interactions.
	- `types/` centralize contracts between layers.

2. **Composable-first business logic**
	- Quote workflow logic is extracted to a composable (`useQuoteModal`) to keep modal components focused and reusable.
	- Data tables use dedicated hooks (`useFxRates`, `useTransactions`) for predictable async behavior.

3. **Reusable UI building blocks**
	- Shared primitives like modal/input/picker reduce duplication and keep forms consistent.
	- Transaction and FX tables use similar UX patterns (skeleton loading, retry, refresh, pagination).

4. **Simulated API design that behaves like real network calls**
	- Service functions return Promises with artificial latency.
	- This allows development and UI testing of loading/error/polling states without backend dependency.

5. **Prop-driven component behavior**
	- Components support summary/full views through props instead of duplicate pages.
	- Example: transactions table can hide or show filters based on context (home vs transactions page).

## Project Structure

```text
app/
  assets/
	 css/                  # Tailwind entry and global styles
  components/
	 fx/                   # FX tracker components
	 quote/                # Quote, recipient, transaction-status modals
	 shared/               # Reusable UI components
	 transactions/         # Transactions table component
  config/                 # App-level constants (example: quote expiry)
  hooks/                  # Composables for async/state orchestration
  layouts/                # Global app layouts
  pages/                  # Route pages
  services/               # API/simulated API data sources
  stores/                 # Pinia stores
  types/                  # TypeScript domain contracts
  utils/                  # Formatting helpers and utility functions

nuxt.config.ts            # Nuxt config and module registration
package.json              # Scripts and dependencies
```

## Installed Packages

Runtime dependencies currently used:

- `nuxt`
- `vue`
- `@nuxtjs/tailwindcss`
- `tailwindcss`
- `@pinia/nuxt`
- `pinia`
- `@nuxt/icon`

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

App runs on the Nuxt dev server (default: `http://localhost:3000`).


