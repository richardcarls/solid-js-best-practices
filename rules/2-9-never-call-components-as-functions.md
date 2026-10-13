---
id: 2-9
title: Never Call Components as Functions
category: Components
priority: CRITICAL
version_basis: ["1.x"]
description: Always use JSX or createComponent(); calling components as plain functions leaks reactive scope
---

## Problem

Calling a component as a plain function (`MyComp(props)`) instead of using JSX (`<MyComp />`) can
run its body inside a reactive computation in the caller. JSX calls `createComponent`, which
invokes the component with tracking disabled. It does not create an isolated owner. Direct calls
inside tracked JSX expressions can cause:

- Reactive nodes created inside the tracked expression to be disposed when it re-runs
- Any signal reads during initialization are tracked as parent dependencies
- When those signals change, the parent re-runs, effectively unmounting and remounting the "component"

This bug is subtle: the component appears to work on first render but silently resets state whenever
the parent re-runs.

## Incorrect

```tsx
// ❌ Compiled into a reactive memo — tracks MyComp's internal signal reads as parent deps
const Layout = () => (
  <div>{override.component?.(layoutProps)}</div>
);

// ❌ Same problem in a Switch fallback
<Switch fallback={<main>{MyComp(props)}</main>}>
  ...
</Switch>
```

## Correct

```tsx
// ✅ JSX compiles to createComponent(), which untracks the component call
const Layout = () => (
  <div><MyComp {...layoutProps} /></div>
);

// ✅ For conditional dynamic components, capture the reference first
const Comp = override.component;
// then render conditionally:
<Show when={Comp}>{(C) => <C {...layoutProps} />}</Show>

// ✅ Or use <Dynamic> for truly dynamic component references
<Dynamic component={override.component} {...layoutProps} />
```

## Why It Matters

JSX `<MyComp />` compiles to `createComponent(MyComp, props)`, which calls the component through
`untrack`. The component still inherits its surrounding owner. A direct call inside a tracked
expression can subscribe that expression to signal reads made during component initialization.

Consequences of calling a component as a function:

1. **Silent state resets**; reactive nodes created within the tracked expression are disposed and
   recreated when it re-runs
1. **Unexpected dependency tracking**; library hooks that eagerly read signals during init (for
   example, TanStack Query's `queryOptions`) register those reads as parent-scope dependencies
1. **Cascading re-renders**; when the leaked dependencies change, the parent invalidates, causing a
   full unmount/remount cycle instead of a targeted update

## Related Rules

- [2-1: Never Destructure Props](2-1-never-destructure-props.md) - Another pattern that can lose
  reactive prop updates
- [1-5: Use Untrack When Needed](1-5-use-untrack-when-needed.md) - Controlling what gets tracked in
  a reactive scope
