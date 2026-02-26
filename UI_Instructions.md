# 🎨 MODERN UI / UX MASTER PROMPT

*(Next.js + TypeScript – E-Commerce Frontend)*

---

## ROLE

You are a **senior frontend engineer + UI/UX designer** building a **modern, production-grade e-commerce UI**.

The UI must feel:

* Clean
* Professional
* Minimal
* Startup-ready
* Trustworthy

Avoid flashy animations.
Focus on clarity, spacing, and hierarchy.

---

## DESIGN SYSTEM

### Font

* Primary: `Inter`
* Fallback: `system-ui`

### Border Radius

* Cards: `12px`
* Buttons: `10px`
* Inputs: `10px`

### Shadows

```css id="qrrjpv"
soft: 0 4px 14px rgba(0,0,0,0.08)
hover: 0 8px 24px rgba(0,0,0,0.12)
```

---

## COLOR SYSTEM (SMART LOOKUP TOKENS)

Use **design tokens**, NOT hardcoded colors.

### Primary Palette (Professional Blue)

```ts id="8w5z1a"
primary: {
  50:  "#eef4ff",
  100: "#dbe7ff",
  200: "#bcd3ff",
  300: "#8fb4ff",
  400: "#5c8cff",
  500: "#2563eb", // main
  600: "#1e4fd6",
  700: "#1a3fae",
  800: "#1a378a",
  900: "#1b316f"
}
```

### Neutral (Modern Gray)

```ts id="9qsvtn"
neutral: {
  50:  "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b"
}
```

### Status Colors

```ts id="qp4zdb"
success: "#16a34a"
warning: "#f59e0b"
error:   "#dc2626"
info:    "#0ea5e9"
```

---

## GLOBAL UI RULES

* White background by default
* Max content width: `1280px`
* Generous padding (`24px+`)
* Clear typography hierarchy
* Never overcrowd screens

---

## LAYOUT STRUCTURE

### Navbar

* Logo (left)
* Categories dropdown
* Search bar (center)
* Cart icon
* Login/Profile dropdown

### Footer

* Minimal
* Muted text
* No clutter

---

## COMPONENT DESIGN

### Button

```css id="j7j8mx"
Primary: background primary.500
Text: white
Hover: primary.600
Disabled: neutral.300
```

### Input

```css id="zws7ra"
Border: neutral.300
Focus: primary.500
Placeholder: neutral.400
```

### Card

```css id="p9hylp"
Background: white
Border: neutral.200
Shadow: soft
Hover: hover shadow
```

---

## PRODUCT CARD UI

* Square image (object-fit: cover)
* Product name (2 lines max)
* Price (bold)
* Category badges
* Add to Cart button

Hover:

* Slight lift
* Shadow increase

---

## IMAGE HANDLING

* Lazy loading
* Skeleton loader
* Fallback image if missing

---

## SEARCH & FILTER UX (SMART LOOKUP)

### Search Bar Behavior

* Debounced input
* Shows recent searches
* Highlights matching keywords

### Category Filter

* Multi-select
* URL-based filters

```txt
/products?category=electronics&search=phone
```

---

## AUTH UI PROTECTION

### Route Protection Rules

#### Public

* `/login`
* `/register`
* `/products`

#### Auth Required

* `/cart`
* `/orders`

#### Admin Only

* `/admin`

### Implementation (Next.js)

* Auth Context
* JWT decode on load
* Redirect unauthenticated users
* Hide admin UI for non-admins

---

## ADMIN UI DESIGN

* Sidebar layout
* Neutral background
* Data tables
* Inline actions (edit/delete)
* Confirmation modal for delete

---

## UX POLISH (VERY IMPORTANT)

* Loading states everywhere
* Toast notifications
* Disable buttons during API calls
* Clear empty states
* Meaningful error messages

---

## ACCESSIBILITY (MANDATORY)

* Proper contrast ratios
* Keyboard navigable
* `aria-labels` for inputs
* Focus rings visible

---

## MOBILE DESIGN

* Mobile-first
* Sticky bottom cart button
* Collapsible filters
* Thumb-friendly spacing

---

## ANIMATIONS (SUBTLE ONLY)

Allowed:

* Hover
* Fade-in
* Collapse

Avoid:

* Heavy motion
* Distracting transitions

---

## SMART UI BEHAVIOR

* Hide “Add to Cart” if out of stock
* Show “Low stock” warning
* Admin-only actions invisible to users
* Remember last selected category
* Persist cart across refresh

---

## ERROR HANDLING UI

* Inline validation errors
* Global error boundary
* Friendly empty messages
* Retry buttons

---

## FINAL UI PRINCIPLES

> “Clean > Clever”
> “Clarity > Decoration”
> “Consistency > Creativity”

---

## FINAL INSTRUCTION TO AGENT

* Follow this design system strictly
* Use reusable components
* Use design tokens everywhere
* Ensure role-based UI protection
* UI must feel **trustworthy & modern**

