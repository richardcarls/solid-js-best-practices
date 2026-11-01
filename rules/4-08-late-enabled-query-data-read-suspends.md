---
id: 4-08
category: State Management
version_basis: ["1.x"]
title: Reading a late-enabled solid-query's `data` while pending suspends and remounts the page
priority: HIGH
tags: [solid, tanstack-query, solid-query, suspense, remount, performance]
description: "solid-query's `data` reads through a resource, so when a query is enabled after mount (to defer expensive work) any read of `.data` during its first fetch suspends the nearest `<Suspense>`, remounting that subtree and wiping input state; read `.data` only when `isSuccess` (or `isFetched`)."
---

## Use when

Deferring a query that used to load with the page: `enabled: () => wanted()` flips to true
after the first paint, on idle, or on first interaction.

## Failure smell

After deferring Recipe Tome's search-index query, five list-page tests failed:

- "keeps typed and deleted search text stable" read `''` instead of `chic` 80 ms after
  typing.
- Others found duplicate links, or no suggestion buttons.
- A screenshot test caught the home carousel on a different slide.

The page was suspending and remounting when the index query started, because memos read
`recipeSearchIndex.data` unconditionally. With the query enabled at mount, the same reads had
resolved inside the initial suspense, so the bug only appeared once the query started later.

## Do

```ts
const index = useRecipeSearchIndex(() => wanted() || Boolean(query().q));
// Reading `data` while the first fetch is pending would suspend the page.
const searchIndex = () => (index.isSuccess ? index.data : undefined);
```

- Route every read through the guarded accessor, including memos.
- Bind the result once (`const value = searchIndex()`) before narrowing; calling it twice
  defeats TypeScript's narrowing.

The guard covers only the first fetch. Once a page has read cached data during its first
render, every later fetch of that query suspends the boundary again, guarded or not; see 5-53
for that cause and the solid-query patch.

## Avoid

- Wrapping each consumer in its own `<Suspense>` to contain the remount; the fallback still
  flashes and local state still resets.
- Assuming a query that "loads in the background" can't affect rendering.

## Test/verify

Type into a field that lives under the same `<Suspense>` boundary, let the deferred query
start, and assert the value survives. Run screenshot tests too: a remount resets carousels and
scroll positions.
