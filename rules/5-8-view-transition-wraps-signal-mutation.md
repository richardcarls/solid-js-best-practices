---
title: Wrap Signal Mutation in View Transition
category: Refs & DOM
priority: HIGH
version_basis: ["1.x"]
description: Call the Solid setter inside startViewTransition() so the browser captures the old DOM before applying the new reactive state
---

## Problem

Updating a signal before `document.startViewTransition()` lets Solid patch the DOM before the
browser captures the old snapshot. The transition then has no meaningful before/after difference and
can appear blank.

## Incorrect

```tsx
setActiveVariant(next);
document.startViewTransition(() => undefined);
```

## Correct

Put the reactive mutation in the transition callback and keep a direct fallback:

```tsx
function setVariant(next: Variant) {
  if (!document.startViewTransition) {
    setActiveVariant(next);
    return;
  }

  document.startViewTransition(() => setActiveVariant(next));
}
```

The browser captures the existing DOM, invokes the callback, waits for the resulting DOM update, and
captures the new state.

## Reactive orchestration

An event handler may call the wrapper directly. If another signal derives the target state, an effect
may orchestrate it, but compare old and new values before setting state so the effect cannot loop:

```tsx
createEffect(() => {
  const next = targetVariant();
  if (next === activeVariant()) return;

  setVariant(next);
});
```

## Why it matters

Solid components execute once and update the DOM from fine-grained reactive state. The View
Transitions API must own the mutation boundary; it cannot recover a DOM state that Solid already
committed.

## Related rules

- [1-4: Avoid Setting Signals in Effects](1-4-avoid-signal-in-effect.md)
- [5-2: Access DOM in onMount](5-2-access-dom-in-onmount.md)
