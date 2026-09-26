---
name: solid-js-best-practices
description: "Solid.js best practices for AI-assisted coding, review, refactoring, and debugging. Use for Solid components, signals, control flow, state, refs and DOM work, performance, accessibility, tests, React migration, and web component integration."
license: MIT
allowed-tools:
  - Read
  - Grep
  - Glob
metadata:
  topics:
    - claude-skills
    - claude-code-skill
---

# Solid.js Best Practices

> **Managed skill; do not edit this installed copy.** Changes may be overwritten.

Comprehensive best practices for building Solid.js applications and components, optimized for
AI-assisted code generation, review, and refactoring.

## Rules by Category

### 1. Reactivity (7 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [1-1](rules/1-1-use-signals-correctly.md) | Use Signals Correctly | CRITICAL | Always call signals as functions `count()` not `count` |
| [1-2](rules/1-2-use-memo-for-derived.md) | Use Memo for Derived Values | HIGH | Use `createMemo` for computed values, not `createEffect` |
| [1-3](rules/1-3-effects-for-side-effects.md) | Effects for Side Effects Only | HIGH | Use `createEffect` only for side effects, not derivations |
| [1-7](rules/1-7-no-primitives-in-reactive-contexts.md) | No Primitives in Reactive Contexts | HIGH | Don't call hooks or create reactive primitives inside effects or memos |
| [1-4](rules/1-4-avoid-signal-in-effect.md) | Avoid Setting Signals in Effects | MEDIUM | Setting signals in effects can cause infinite loops |
| [1-5](rules/1-5-use-untrack-when-needed.md) | Use Untrack When Needed | MEDIUM | Use `untrack()` to prevent unwanted reactive subscriptions |
| [1-6](rules/1-6-batch-signal-updates.md) | Batch Signal Updates | LOW | Use `batch()` for multiple synchronous signal updates |

### 2. Components (10 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [2-1](rules/2-1-never-destructure-props.md) | Never Destructure Props | CRITICAL | Destructuring props breaks reactivity |
| [2-6](rules/2-6-components-return-once.md) | Components Return Once | CRITICAL | Never use early returns; use `<Show>`, `<Switch>`, etc. in JSX |
| [2-9](rules/2-9-never-call-components-as-functions.md) | Never Call Components as Functions | CRITICAL | Always use JSX or `createComponent()`; direct calls leak reactive scope |
| [2-2](rules/2-2-use-merge-props.md) | Use mergeProps | HIGH | Use `mergeProps` for default prop values |
| [2-3](rules/2-3-use-split-props.md) | Use splitProps | HIGH | Use `splitProps` to separate prop groups safely |
| [2-7](rules/2-7-no-react-specific-props.md) | No React-Specific Props | HIGH | Use `class` not `className`, `for` not `htmlFor` |
| [2-10](rules/2-10-custom-element-typescript-declarations.md) | Custom Element TypeScript Declarations | HIGH | Declare custom element tags in JSX namespace; augment DOM types for newer attributes |
| [2-4](rules/2-4-use-children-helper.md) | Use children Helper | MEDIUM | Use `children()` helper for safe children access |
| [2-5](rules/2-5-component-composition.md) | Prefer Composition | MEDIUM | Prefer composition and context over prop drilling |
| [2-8](rules/2-8-style-prop-conventions.md) | Style Prop Conventions | MEDIUM | Use object syntax with kebab-case properties for `style` |

### 3. Control Flow (7 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [3-1](rules/3-1-use-show-for-conditionals.md) | Use Show for Conditionals | HIGH | Use `<Show>` for conditional rendering and its function child when callers need a narrowed value |
| [3-2](rules/3-2-use-for-for-lists.md) | Use `For` for Lists | HIGH | Use `<For>` for referentially keyed list rendering |
| [3-7](rules/3-7-use-keyed-for-stateful-children.md) | Use keyed for Stateful Children | HIGH | Add `keyed` when child has internal state and value identity (not just truthiness) matters |
| [3-3](rules/3-3-use-index-for-primitives.md) | Use Index for Primitives | MEDIUM | Use `<Index>` when array index matters more than identity |
| [3-4](rules/3-4-use-switch-match.md) | Use Switch/Match | MEDIUM | Use `<Switch>`/`<Match>` for multiple conditions and function children to consume matched values without assertions |
| [3-6](rules/3-6-stable-component-mount.md) | Stable Component Mount | MEDIUM | Avoid rendering the same component in multiple Switch/Show branches |
| [3-5](rules/3-5-provide-fallbacks.md) | Provide Fallbacks | LOW | Always provide `fallback` props for loading states |

### 4. State Management (7 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [4-1](rules/4-1-signals-vs-stores.md) | Signals vs Stores | HIGH | Use signals for primitives, stores for nested objects |
| [4-2](rules/4-2-store-path-updates.md) | Use Store Path Syntax | HIGH | Use path syntax for granular, efficient store updates |
| [4-3](rules/4-3-use-produce-for-mutations.md) | Use produce for Mutations | MEDIUM | Use `produce` for complex mutable-style store updates |
| [4-4](rules/4-4-use-reconcile-for-data.md) | Use reconcile for Server Data | MEDIUM | Use `reconcile` when integrating server/external data |
| [4-5](rules/4-5-use-context-for-global.md) | Use Context for Global State | MEDIUM | Use Context API for cross-component shared state |
| [4-6](rules/4-6-store-functions-with-wrapper.md) | Store Functions with a Wrapper | HIGH | Wrap function values so setStore does not invoke them as updater functions |
| [4-7](rules/4-7-cleanup-at-page-ownership-boundary.md) | Cleanup at the Page Ownership Boundary | HIGH | Use per-page cleanup when multiple routed panes remain mounted |

### 5. Refs & DOM (8 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [5-1](rules/5-1-use-refs-correctly.md) | Use Refs Correctly | HIGH | Use callback refs for conditional elements |
| [5-2](rules/5-2-access-dom-in-onmount.md) | Access DOM in onMount | HIGH | Access DOM elements in `onMount`, not during render |
| [5-3](rules/5-3-cleanup-with-oncleanup.md) | Cleanup with onCleanup | HIGH | Always clean up subscriptions and timers |
| [5-5](rules/5-5-avoid-innerhtml.md) | Avoid innerHTML | HIGH | Avoid `innerHTML` to prevent XSS; use JSX or `textContent` |
| [5-7](rules/5-7-web-component-controlled-state.md) | Web Component Controlled State | HIGH | Use `prop:*` properties and `on:wc-*` events for modern custom elements; reserve refs/effects for native or legacy APIs |
| [5-8](rules/5-8-view-transition-wraps-signal-mutation.md) | Wrap Signal Mutation in View Transition | HIGH | Call the Solid setter inside `startViewTransition()` so the browser captures the old DOM before applying the new reactive state |
| [5-4](rules/5-4-use-directives.md) | Use Directives | MEDIUM | Use `use:` directives for reusable element behaviors |
| [5-6](rules/5-6-event-handler-patterns.md) | Event Handler Patterns | MEDIUM | Use `on:`/`oncapture:` namespaces and array handler syntax correctly |

### 6. Performance (6 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [6-1](rules/6-1-avoid-unnecessary-tracking.md) | Avoid Unnecessary Tracking | HIGH | Don't access signals outside reactive contexts |
| [6-2](rules/6-2-use-lazy-components.md) | Use Lazy Components | MEDIUM | Use `lazy()` for code splitting large components |
| [6-3](rules/6-3-use-suspense.md) | Use Suspense | MEDIUM | Use `<Suspense>` for async loading boundaries |
| [6-6](rules/6-6-web-component-css-and-bundle.md) | Web Component CSS and Bundle Strategy | MEDIUM | Import components individually; place `::part()` overrides in a global stylesheet |
| [6-4](rules/6-4-optimize-store-access.md) | Optimize Store Access | LOW | Access only the store properties you need |
| [6-5](rules/6-5-prefer-classlist.md) | Prefer classList | LOW | Use `classList` prop for conditional class toggling |

### 7. Accessibility (4 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [7-1](rules/7-1-semantic-html.md) | Use Semantic HTML | HIGH | Use appropriate semantic HTML elements |
| [7-2](rules/7-2-aria-attributes.md) | Use ARIA Attributes | MEDIUM | Apply appropriate ARIA attributes for custom controls |
| [7-3](rules/7-3-keyboard-navigation.md) | Support Keyboard Navigation | MEDIUM | Ensure all interactive elements are keyboard accessible |
| [7-4](rules/7-4-router-root-link-end.md) | End-Match Root Router Links | HIGH | Add end matching so the root link is not current on every route |

### 8. Testing (12 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [8-1](rules/8-1-configure-vitest-for-solid.md) | Configure Vitest for Solid | CRITICAL | Configure Vitest with Solid-specific resolve conditions and plugin |
| [8-2](rules/8-2-wrap-render-in-arrow.md) | Wrap Render in Arrow Functions | CRITICAL | Always use `render(() => <C />)` not `render(<C />)` |
| [8-3](rules/8-3-test-primitives-in-root.md) | Test Primitives in a Root | HIGH | Wrap signal/effect/memo tests in `createRoot` or `renderHook` |
| [8-4](rules/8-4-handle-async-in-tests.md) | Handle Async in Tests | HIGH | Use `findBy` queries and proper timer config for async behavior |
| [8-5](rules/8-5-use-accessible-queries.md) | Use Accessible Queries | MEDIUM | Prefer role and label queries over test IDs |
| [8-6](rules/8-6-separate-logic-from-ui-tests.md) | Separate Logic from UI Tests | MEDIUM | Test primitives/hooks independently from component rendering |
| [8-7](rules/8-7-browser-mode-for-web-components-and-pwa-apis.md) | Browser Mode for Web Components and PWA APIs | HIGH | Use Vitest browser mode (real Chromium) for custom elements, shadow DOM, and browser-native APIs |
| [8-8](rules/8-8-testing-headless-ui-libraries.md) | Testing Headless UI Libraries with Non-Standard ARIA | MEDIUM | Headless UI libraries use non-obvious ARIA structures and portals; inspect the actual tree before querying |
| [8-9](rules/8-9-browser-native-api-test-isolation.md) | Browser-Native API Test Isolation | HIGH | Clear IndexedDB and localStorage between tests; close connection before deleteDatabase |
| [8-10](rules/8-10-router-integration-testing.md) | Router Integration Testing | HIGH | Use MemoryRouter `root` prop to provide router context to layout providers |
| [8-11](rules/8-11-tanstack-query-test-setup.md) | TanStack Query Test Setup | HIGH | Create a fresh QueryClient per test with retry and caching disabled |
| [8-12](rules/8-12-deproxy-before-structured-clone.md) | Deproxy Before Structured Clone | HIGH | Remove every reactive proxy before writing data to IndexedDB |

### 9. Web Component Integration (8 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [9-1](rules/9-1-register-custom-elements-early.md) | Register Custom Elements at App Entry | HIGH | Import `/define` side-effects before any SolidJS reactive context |
| [9-2](rules/9-2-defer-slotchange-handlers.md) | Defer slotchange Handler Side Effects | HIGH | Always defer focus, state writes, and DOM mutations in `slotchange` via `queueMicrotask` |
| [9-3](rules/9-3-decouple-lit-and-solid-reactivity.md) | Treat Custom Element and SolidJS Reactivity as Decoupled | MEDIUM | Use one-way data flow (SolidJS -> attributes/props -> events -> SolidJS); never read custom element internal state from SolidJS reactive contexts |
| [9-4](rules/9-4-thin-web-component-wrappers.md) | Thin Web Component Wrappers | HIGH | Wrappers own labels, layout, type adaptation, and form glue; custom elements own timing and native sync |
| [9-5](rules/9-5-property-vs-attribute-binding.md) | Property vs Attribute Binding | HIGH | Dynamic props on custom elements are already properties; use `prop:*` for intent and `attr:*` for `data-*`, ID-reference ARIA, and CSS-visible attributes |
| [9-6](rules/9-6-register-custom-fields-with-form-libraries.md) | Register Custom Fields with Form Libraries | HIGH | Ensure property-bound custom fields enter lazy form-library registries |
| [9-7](rules/9-7-store-state-for-web-component-heavy-forms.md) | Store State for Web-Component-Heavy Forms | MEDIUM | Prefer a Solid store when custom elements already own field interaction |
| [9-8](rules/9-8-wrapper-signal-for-controlled-only-wc.md) | Wrapper Signal for Controlled-Only WC | HIGH | When a WC has no `defaultValue`, use `createSignal` in the wrapper to own the uncontrolled → controlled bridge |

## Task-Based Rule Selection

### Writing New Components

Load these rules when creating new Solid.js components:

| Rule | Why |
| ---- | --- |
| [1-1](rules/1-1-use-signals-correctly.md) | Ensure signals are called as functions |
| [2-1](rules/2-1-never-destructure-props.md) | Prevent reactivity breakage |
| [2-6](rules/2-6-components-return-once.md) | No early returns; use control flow in JSX |
| [2-9](rules/2-9-never-call-components-as-functions.md) | Never call components as plain functions |
| [2-2](rules/2-2-use-merge-props.md) | Handle default props correctly |
| [2-3](rules/2-3-use-split-props.md) | Separate local and forwarded props |
| [3-1](rules/3-1-use-show-for-conditionals.md) | Proper conditional rendering |
| [3-7](rules/3-7-use-keyed-for-stateful-children.md) | `keyed` for forms and stateful children |
| [3-2](rules/3-2-use-for-for-lists.md) | Efficient list rendering |
| [5-3](rules/5-3-cleanup-with-oncleanup.md) | Prevent memory leaks |

### Web Component Integration

Load these rules when integrating Lit or other custom elements with SolidJS:

| Rule | Why |
| ---- | --- |
| [9-1](rules/9-1-register-custom-elements-early.md) | Register before any SolidJS context mounts |
| [9-2](rules/9-2-defer-slotchange-handlers.md) | Prevent synchronous side effects inside `runUpdates` |
| [9-3](rules/9-3-decouple-lit-and-solid-reactivity.md) | One-way data flow design |
| [9-4](rules/9-4-thin-web-component-wrappers.md) | Keep wrappers focused on app concerns |
| [9-5](rules/9-5-property-vs-attribute-binding.md) | `prop:*` for properties, `attr:*` for attributes CSS or ARIA must see |
| [5-6](rules/5-6-event-handler-patterns.md) | Use `on:` namespace for custom element events |

### Code Review

Focus on these rules during code review:

| Priority | Rules |
| -------- | ----- |
| CRITICAL | [1-1](rules/1-1-use-signals-correctly.md), [2-1](rules/2-1-never-destructure-props.md), [2-6](rules/2-6-components-return-once.md), [2-9](rules/2-9-never-call-components-as-functions.md) |
| HIGH | [1-2](rules/1-2-use-memo-for-derived.md), [1-3](rules/1-3-effects-for-side-effects.md), [1-7](rules/1-7-no-primitives-in-reactive-contexts.md), [2-7](rules/2-7-no-react-specific-props.md), [5-2](rules/5-2-access-dom-in-onmount.md), [5-3](rules/5-3-cleanup-with-oncleanup.md), [5-5](rules/5-5-avoid-innerhtml.md) |

### Performance Optimization

Load these rules when optimizing performance:

| Rule | Focus |
| ---- | ----- |
| [1-2](rules/1-2-use-memo-for-derived.md) | Prevent unnecessary recomputation |
| [1-6](rules/1-6-batch-signal-updates.md) | Reduce update cycles |
| [4-2](rules/4-2-store-path-updates.md) | Granular store updates |
| [6-1](rules/6-1-avoid-unnecessary-tracking.md) | Prevent unwanted subscriptions |
| [6-2](rules/6-2-use-lazy-components.md) | Code splitting |
| [6-4](rules/6-4-optimize-store-access.md) | Efficient store access |

### State Management

Load these rules when working with application state:

| Rule | Focus |
| ---- | ----- |
| [4-1](rules/4-1-signals-vs-stores.md) | Choose the right primitive |
| [4-2](rules/4-2-store-path-updates.md) | Efficient updates |
| [4-3](rules/4-3-use-produce-for-mutations.md) | Complex mutations |
| [4-4](rules/4-4-use-reconcile-for-data.md) | External data integration |
| [4-5](rules/4-5-use-context-for-global.md) | Cross-component state |

### Accessibility Audit

Load these rules when auditing accessibility:

| Rule | Focus |
| ---- | ----- |
| [7-1](rules/7-1-semantic-html.md) | Semantic structure |
| [7-2](rules/7-2-aria-attributes.md) | Screen reader support |
| [7-3](rules/7-3-keyboard-navigation.md) | Keyboard users |

### Writing Tests

Load these rules when writing or reviewing tests:

| Rule | Focus |
| ---- | ----- |
| [8-1](rules/8-1-configure-vitest-for-solid.md) | Correct Vitest configuration |
| [8-2](rules/8-2-wrap-render-in-arrow.md) | Reactive render scope |
| [8-3](rules/8-3-test-primitives-in-root.md) | Reactive ownership for primitives |
| [8-4](rules/8-4-handle-async-in-tests.md) | Async queries and timers |
| [8-5](rules/8-5-use-accessible-queries.md) | Accessible query selection |
| [8-6](rules/8-6-separate-logic-from-ui-tests.md) | Test architecture |
| [8-7](rules/8-7-browser-mode-for-web-components-and-pwa-apis.md) | When to use browser mode vs jsdom |
| [8-8](rules/8-8-testing-headless-ui-libraries.md) | Portals and non-standard ARIA structures |
| [8-9](rules/8-9-browser-native-api-test-isolation.md) | IDB and localStorage cleanup patterns |
| [8-10](rules/8-10-router-integration-testing.md) | MemoryRouter setup for integration tests |
| [8-11](rules/8-11-tanstack-query-test-setup.md) | QueryClient configuration for tests |

### Integrating Web Components / Custom Elements

Load these rules when using any custom element library (Shoelace, FAST, Lion, Material Web
Components, etc.) or native browser APIs like `<dialog>` and the Popover API:

| Rule | Why |
| ---- | --- |
| [2-10](rules/2-10-custom-element-typescript-declarations.md) | Declare custom element tags in JSX namespace; type newer HTML attributes and experimental CSS properties |
| [5-6](rules/5-6-event-handler-patterns.md) | Use `on:` for all custom element events; type `CustomEvent` payloads correctly |
| [5-7](rules/5-7-web-component-controlled-state.md) | Prefer declarative `prop:*`/`on:wc-*`; use refs for native or legacy APIs only |
| [6-6](rules/6-6-web-component-css-and-bundle.md) | Per-component imports for tree-shaking; `::part()` overrides in global CSS only |
| [9-8](rules/9-8-wrapper-signal-for-controlled-only-wc.md) | When the WC has no `defaultValue`, own the uncontrolled → controlled bridge with `createSignal` |
| [5-8](rules/5-8-view-transition-wraps-signal-mutation.md) | Keep Solid's DOM update inside the View Transition snapshot callback |

### Migrating From React

Load [signals](rules/1-1-use-signals-correctly.md),
[component execution](rules/2-6-components-return-once.md),
[reactive props](rules/2-1-never-destructure-props.md),
[HTML prop names](rules/2-7-no-react-specific-props.md),
[style syntax](rules/2-8-style-prop-conventions.md),
[control flow](rules/3-1-use-show-for-conditionals.md),
[list rendering](rules/3-2-use-for-for-lists.md), and
[event handlers](rules/5-6-event-handler-patterns.md).

## Tooling

For automated linting alongside these best practices, use
[eslint-plugin-solid](https://github.com/solidjs-community/eslint-plugin-solid). The plugin catches
many of the same issues this skill covers (destructured props, early returns, React-specific props,
innerHTML usage, style prop format, etc.) and provides auto-fixable rules.

## Resources

- [Solid.js Documentation](https://docs.solidjs.com/)
