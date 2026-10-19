---
id: 1-8
title: Memo the field you analyze, not the whole record that carries it
category: Reactivity
priority: HIGH
status: stable
version_basis: ["1.x"]
tags: [solid-js, createMemo, For, Index, rerender]
description: "A memo reading props.record.field re-runs whenever the record is replaced, and <For> then remounts rebuilt rows; memo the primitive slice and render rebuilt object rows with <Index>"
---

## Problem

A memo that reads `props.record.field` re-runs whenever the record object is replaced, even for an
unrelated edit. A recipe view derived ingredient issues from `props.recipe.ingredients`; toggling
favorite saved a new recipe object, so the memo re-ran on identical text and built new report and
action objects. The issue details rendered those actions with `<For>`, which matches rows by
object identity, so every action button and its icon element was torn down and recreated.

## Solution

Memo the primitive slice first, and derive from it. A string or number memo stops propagation when
the value is unchanged:

```tsx
const ingredients = createMemo(() => props.recipe.ingredients ?? '');
const issues = createMemo(() => analyzeIngredients(ingredients()));
```

Render rows rebuilt as new objects on each derivation (messages, actions, parsed parts) with
`<Index>`, so the DOM nodes are kept and only their fields update. Keep `<For>` for stable objects
whose identity tracks the item, such as store records.

## Test

Capture a row's element, make an unrelated change to the parent record, and assert the element is
the same node.
