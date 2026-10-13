---
id: 9-2
title: Handle slotchange After Slot Assignment
category: Web Component Integration
priority: HIGH
version_basis: ["1.x"]
description: Read assigned nodes when slotchange is delivered; defer only work that needs a later lifecycle or rendering phase
---

## Problem

The browser updates slot assignment during DOM mutation, then **queues** `slotchange` for a
mutation-observer microtask. The handler does not run synchronously inside Solid's `runUpdates` call.
The [DOM Standard](https://dom.spec.whatwg.org/#signal-a-slot-change) defines this timing.

A first mount can still differ from a later mount when the custom element creates its shadow root
asynchronously or preserves it across reconnects. Diagnose that lifecycle difference directly;
do not assume that `slotchange` itself changed from asynchronous to synchronous delivery.

## Incorrect

```typescript
// ❌ A second microtask is not required merely to leave Solid's update pass.
slot.addEventListener("slotchange", () => {
  queueMicrotask(() => syncAssignedItems(slot.assignedElements()));
});
```

## Correct

```typescript
// ✅ Read the settled assignment in the slotchange handler.
slot.addEventListener("slotchange", () => {
  syncAssignedItems(slot.assignedElements());
});
```

If initialization needs layout, schedule that layout work with `requestAnimationFrame`. If a focus
change depends on the custom element's own asynchronous render, wait for that render using its
lifecycle API and check that the target remains connected. Neither case requires a blanket
`queueMicrotask` around every `slotchange` side effect.

## Why It Matters

Unnecessary deferral makes ordering harder to reason about and can act on a stale slotted element
after disconnect or replacement. When a bug appears only after remounting, inspect shadow-root
creation, reconnection, and listener cleanup rather than attributing it to synchronous event
delivery.

## Related Rules

- [9-1: Register Custom Elements at App Entry](9-1-register-custom-elements-early.md)
- [9-3: Decouple Lit and Solid Reactivity](9-3-decouple-lit-and-solid-reactivity.md)
- [5-3: Cleanup with onCleanup](5-3-cleanup-with-oncleanup.md)
