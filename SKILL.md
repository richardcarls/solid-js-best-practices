---
name: solid-js-best-practices
description: Comprehensive best practices for Solid.js apps and components, designed for AI agents and LLMs. 32 rules organized into 7 categories, each ranked by priority.
keywords:
  - solid
  - solidjs
  - best-practices
  - claude-code
  - ai-agents
  - reactivity
  - signals
  - fine-grained-reactivity
license: MIT
author: Rick Carls <richard.j.carls@gmail.com>
version: 1.0.0
---

# Solid.js Best Practices

Comprehensive best practices for building Solid.js applications and components, optimized for AI-assisted code generation, review, and refactoring.

## Quick Reference

### Essential Imports

```typescript
import {
  createSignal,
  createEffect,
  createMemo,
  createResource,
  onMount,
  onCleanup,
  Show,
  For,
  Switch,
  Match,
  Index,
  Suspense,
  ErrorBoundary,
  lazy,
  batch,
  untrack,
  mergeProps,
  splitProps,
  children,
} from "solid-js";

import { createStore, produce, reconcile } from "solid-js/store";
```

### Component Skeleton

```tsx
import { Component, JSX, mergeProps, splitProps } from "solid-js";

interface MyComponentProps {
  title: string;
  count?: number;
  onAction?: () => void;
  children?: JSX.Element;
}

const MyComponent: Component<MyComponentProps> = (props) => {
  // Merge default props
  const merged = mergeProps({ count: 0 }, props);

  // Split component props from passed-through props
  const [local, others] = splitProps(merged, ["title", "count", "onAction"]);

  // Local reactive state
  const [value, setValue] = createSignal("");

  // Derived/computed values
  const doubled = createMemo(() => local.count * 2);

  // Side effects
  createEffect(() => {
    console.log("Count changed:", local.count);
  });

  // Lifecycle
  onMount(() => {
    console.log("Component mounted");
  });

  onCleanup(() => {
    console.log("Component cleanup");
  });

  return (
    <div {...others}>
      <h1>{local.title}</h1>
      <p>Count: {local.count}, Doubled: {doubled()}</p>
      <input
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
      />
      <button onClick={local.onAction}>Action</button>
      {props.children}
    </div>
  );
};

export default MyComponent;
```

## Rules by Category

### 1. Reactivity (6 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [1-1](rules/1-1-use-signals-correctly.md) | Use Signals Correctly | CRITICAL | Always call signals as functions `count()` not `count` |
| [1-2](rules/1-2-use-memo-for-derived.md) | Use Memo for Derived Values | HIGH | Use `createMemo` for computed values, not `createEffect` |
| [1-3](rules/1-3-effects-for-side-effects.md) | Effects for Side Effects Only | HIGH | Use `createEffect` only for side effects, not derivations |
| [1-4](rules/1-4-avoid-signal-in-effect.md) | Avoid Setting Signals in Effects | MEDIUM | Setting signals in effects can cause infinite loops |
| [1-5](rules/1-5-use-untrack-when-needed.md) | Use Untrack When Needed | MEDIUM | Use `untrack()` to prevent unwanted reactive subscriptions |
| [1-6](rules/1-6-batch-signal-updates.md) | Batch Signal Updates | LOW | Use `batch()` for multiple synchronous signal updates |

### 2. Components (5 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [2-1](rules/2-1-never-destructure-props.md) | Never Destructure Props | CRITICAL | Destructuring props breaks reactivity |
| [2-2](rules/2-2-use-merge-props.md) | Use mergeProps | HIGH | Use `mergeProps` for default prop values |
| [2-3](rules/2-3-use-split-props.md) | Use splitProps | HIGH | Use `splitProps` to separate prop groups safely |
| [2-4](rules/2-4-use-children-helper.md) | Use children Helper | MEDIUM | Use `children()` helper for safe children access |
| [2-5](rules/2-5-component-composition.md) | Prefer Composition | MEDIUM | Prefer composition and context over prop drilling |

### 3. Control Flow (5 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [3-1](rules/3-1-use-show-for-conditionals.md) | Use Show for Conditionals | HIGH | Use `<Show>` instead of ternary operators |
| [3-2](rules/3-2-use-for-for-lists.md) | Use For for Lists | HIGH | Use `<For>` for referentially-keyed list rendering |
| [3-3](rules/3-3-use-index-for-primitives.md) | Use Index for Primitives | MEDIUM | Use `<Index>` when array index matters more than identity |
| [3-4](rules/3-4-use-switch-match.md) | Use Switch/Match | MEDIUM | Use `<Switch>`/`<Match>` for multiple conditions |
| [3-5](rules/3-5-provide-fallbacks.md) | Provide Fallbacks | LOW | Always provide `fallback` props for loading states |

### 4. State Management (5 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [4-1](rules/4-1-signals-vs-stores.md) | Signals vs Stores | HIGH | Use signals for primitives, stores for nested objects |
| [4-2](rules/4-2-store-path-updates.md) | Use Store Path Syntax | HIGH | Use path syntax for granular, efficient store updates |
| [4-3](rules/4-3-use-produce-for-mutations.md) | Use produce for Mutations | MEDIUM | Use `produce` for complex mutable-style store updates |
| [4-4](rules/4-4-use-reconcile-for-data.md) | Use reconcile for Server Data | MEDIUM | Use `reconcile` when integrating server/external data |
| [4-5](rules/4-5-use-context-for-global.md) | Use Context for Global State | MEDIUM | Use Context API for cross-component shared state |

### 5. Refs & DOM (4 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [5-1](rules/5-1-use-refs-correctly.md) | Use Refs Correctly | HIGH | Use callback refs for conditional elements |
| [5-2](rules/5-2-access-dom-in-onmount.md) | Access DOM in onMount | HIGH | Access DOM elements in `onMount`, not during render |
| [5-3](rules/5-3-cleanup-with-oncleanup.md) | Cleanup with onCleanup | HIGH | Always clean up subscriptions and timers |
| [5-4](rules/5-4-use-directives.md) | Use Directives | MEDIUM | Use `use:` directives for reusable element behaviors |

### 6. Performance (4 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [6-1](rules/6-1-avoid-unnecessary-tracking.md) | Avoid Unnecessary Tracking | HIGH | Don't access signals outside reactive contexts |
| [6-2](rules/6-2-use-lazy-components.md) | Use Lazy Components | MEDIUM | Use `lazy()` for code splitting large components |
| [6-3](rules/6-3-use-suspense.md) | Use Suspense | MEDIUM | Use `<Suspense>` for async loading boundaries |
| [6-4](rules/6-4-optimize-store-access.md) | Optimize Store Access | LOW | Access only the store properties you need |

### 7. Accessibility (3 rules)

| # | Rule | Priority | Description |
| - | ---- | -------- | ----------- |
| [7-1](rules/7-1-semantic-html.md) | Use Semantic HTML | HIGH | Use appropriate semantic HTML elements |
| [7-2](rules/7-2-aria-attributes.md) | Use ARIA Attributes | MEDIUM | Apply appropriate ARIA attributes for custom controls |
| [7-3](rules/7-3-keyboard-navigation.md) | Support Keyboard Navigation | MEDIUM | Ensure all interactive elements are keyboard accessible |

## Priority Levels

- **CRITICAL**: Fix immediately. Causes bugs, broken reactivity, or runtime errors.
- **HIGH**: Address in code reviews. Important for correctness and maintainability.
- **MEDIUM**: Apply when relevant. Improves code quality and performance.
- **LOW**: Consider during refactoring. Nice-to-have optimizations.

## Key Solid.js Concepts

### Fine-Grained Reactivity

Solid.js updates only the specific DOM elements that depend on changed data, not entire component trees. This is achieved through:

- **Signals**: Reactive primitives that track dependencies
- **Effects**: Side effects that automatically re-run when dependencies change
- **Memos**: Cached derived values that only recompute when dependencies change

### Components Render Once

Unlike React, Solid components are functions that run once during initial render. Reactivity happens at the signal level, not the component level. This is why:

- Props must not be destructured (would capture static values)
- Signals must be called as functions (to maintain reactive tracking)
- Control flow uses special components (`<Show>`, `<For>`) instead of JS expressions

### Stores for Complex State

For nested objects and arrays, Solid provides stores with:

- Fine-grained updates via path syntax
- Automatic proxy wrapping for nested reactivity
- Utilities like `produce` and `reconcile` for common patterns

## Resources

- [Solid.js Documentation](https://docs.solidjs.com/)
