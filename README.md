# 📄 Invoice Management App

A fully responsive, full-featured Invoice Management Application built with **React** and **Tailwind CSS** 

---

## 🚀 Live Demo

> Deploy to Vercel or Netlify (see Deployment section below)

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd invoice-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🏗 Architecture Explanation

### Tech Stack
- **React 19** — UI framework with hooks-based state
- **Tailwind CSS 4** — Utility-first CSS with `darkMode: 'class'`
- **Vite 8** — Fast dev server & build tool
- **LocalStorage** — Data persistence across sessions

### Folder Structure

```
src/
├── context/
│   ├── theme.context.jsx      # Dark/light mode state + localStorage sync
│   └── invoice.context.jsx    # Invoice CRUD state with useReducer + localStorage
├── components/
│   ├── sidebar.jsx           # Desktop left sidebar with logo + theme toggle
│   ├── mobileHeader.jsx      # Mobile top header with logo + theme toggle
│   ├── invoiceList.jsx       # Invoice list page with filter header
│   ├── invoiceDetail.jsx     # Full invoice detail view
│   ├── invoiceForm.jsx       # Create/Edit drawer form with validation
│   ├── filterDropdown.jsx    # Checkbox-based status filter dropdown
│   ├── statusBadge.jsx       # Reusable color-coded status badge
│   ├── deleteModal.jsx       # Confirmation modal with focus trap
│   └── emptyState.jsx        # Empty state illustration + message
├── utils/
│   └── helper.js            # ID generation, formatting, sample data
├── App.jsx                   # Root component with view state routing
├── main.jsx                  # React DOM entry point with providers
└── index.css                 # Tailwind directives + global component classes
```

### State Management

Two Context providers handle all global state:

**`theme.context`** — Manages dark/light mode with:
- `isDark: boolean` — current theme
- `toggleTheme()` — switches theme
- Reads from and writes to `localStorage` key `invoice-theme`
- Applies `dark` class to `<html>` element for Tailwind dark mode

**`invoice.context`** — Manages all invoice data with `useReducer`:
- Actions: `LOAD`, `ADD`, `UPDATE`, `DELETE`, `MARK_PAID`, `SET_FILTER`
- `filteredInvoices` derived from `filter` state
- Persists to `localStorage` key `invoice-data` on every change
- Seeds sample data on first load

### View Routing

No external router library is used. `App.jsx` manages a `view` state enum (`'list'` | `'detail'`) and renders the appropriate component. This keeps the bundle small and avoids URL-based routing complexity for a SPA.

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| Create Invoice | ✅ |
| Read Invoice List | ✅ |
| Read Invoice Detail | ✅ |
| Update Invoice | ✅ |
| Delete Invoice (with modal) | ✅ |
| Save as Draft | ✅ |
| Mark as Paid | ✅ |
| Filter by Status | ✅ |
| Dark / Light Mode Toggle | ✅ |
| Theme persists across reload | ✅ |
| Data persists via LocalStorage | ✅ |
| Form validation | ✅ |
| Responsive (320px → desktop) | ✅ |
| Hover states on all interactive elements | ✅ |

---

## 🔄 Status Logic

Invoices have three statuses with strict state transitions:

```
Draft → (Edit → Save & Send) → Pending → (Mark as Paid) → Paid
```

- **Draft**: Can be edited; cannot be marked as Paid directly
- **Pending**: Can be edited or marked as Paid
- **Paid**: Cannot be edited or reverted

---

## 🎨 Design System

Colors exactly match the provided Figma design system:

| Token | Value |
|---|---|
| Purple | `#7C5DFA` |
| Purple Light | `#9277FF` |
| Navy Dark | `#1E2139` |
| Navy | `#252945` |
| Blue-Gray Light | `#DFE3FA` |
| Gray | `#888EB0` |
| Error | `#EC5757` |
| BG Light | `#F8F8FB` |
| BG Dark | `#141625` |

Typography: **League Spartan** (Google Fonts) — Bold for headings, Medium for body

---

## ♿ Accessibility Notes

### Semantic HTML
- All sections use semantic elements: `<header>`, `<aside>`, `<main>`, `<ul>`, `<li>`, `<address>`, `<fieldset>`, `<legend>`
- All form fields have explicit `<label>` elements with `htmlFor`

### Keyboard Navigation
- All interactive elements are focusable and operable via keyboard
- Custom components use `focus-visible` ring styles (Tailwind `focus-visible:ring-2`)
- Delete modal implements full **focus trap** — Tab/Shift+Tab cycles within modal
- Modal and form drawer close on **Escape key**
- Custom checkbox filter uses `role="checkbox"` and `aria-checked` with keyboard support

### ARIA
- `role="dialog"` + `aria-modal="true"` on modal and drawer
- `aria-label` on all icon-only buttons
- `aria-expanded` on filter dropdown toggle
- `aria-invalid` on invalid form inputs with `aria-describedby` pointing to error message
- `role="alert"` on inline error messages for screen reader announcement
- `aria-label` on invoice list items describing all key fields

### Color Contrast
- All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Status badges maintain contrast in both light and dark modes
- Error states use red (#EC5757) with sufficient contrast

---

## 🔧 Trade-offs & Decisions

### No External Router
Used view-state enum in `App.jsx` instead of React Router. This avoids URL-based navigation (no direct-link support), but is simpler and appropriate for a task submission.

### useReducer over Redux/Zustand
The invoice state is self-contained and the action types are well-defined, making `useReducer` a clean fit without additional dependencies.

### LocalStorage over IndexedDB
LocalStorage is synchronous and straightforward for the data volume of an invoice app. IndexedDB would be preferable at scale (thousands of invoices, large attachments), but adds significant complexity for this use case.

### Single-file Components
Each component is a single `.jsx` file rather than splitting into separate CSS modules. This is enabled by Tailwind and keeps the component boundary clear.

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Drag & drop the `dist/` folder to Netlify Drop
# Or connect your GitHub repo and set:
#   Build command: npm run build
#   Publish directory: dist
```

---

## 📈 Potential Improvements

- **React Router** for proper URL-based navigation and browser history
- **IndexedDB / backend** for larger datasets
- **Invoice PDF export** using `@react-pdf/renderer`
- **Search** invoices by client name or ID
- **Sorting** by date, amount, or status
- **Pagination** or virtual scrolling for large invoice lists
- **Optimistic updates** with error recovery
- **Toast notifications** for success/error feedback
- **Unit & integration tests** with Vitest + React Testing Library
- **E2E tests** with Playwright
