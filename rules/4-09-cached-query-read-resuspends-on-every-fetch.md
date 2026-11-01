---
id: 4-09
category: State Management
version_basis: ["1.x"]
title: A solid-query read of cached data suspends the boundary again on every later fetch
priority: HIGH
tags: [solid, tanstack-query, solid-query, suspense, remount, performance, yarn-patch]
description: "solid-query 5.x returns cached `data` through `queryResource.latest`, and a read before that resource first resolves registers with the nearest `<Suspense>` for good, so every later fetch (invalidation, `setQueryData`, an `enabled` change) removes and re-inserts the whole subtree; patch the getter to return `state.data` when it's defined."
---

## Use when

A Solid app uses `@tanstack/solid-query` (seen in 5.90.23, same code in 5.104.5) under a
`<Suspense>` that wraps more than the page, such as one in the router root. Check this before
blaming web components for repeated setup work, closed dialogs, or reset scroll positions.

## Failure smell

- A `MutationObserver` sees the same large subtree (the app layout root, ~450–1000 elements)
  removed from `#root` and added back in one batch, about a microtask apart.
- It happens after the page has mounted with cached data: returning to a route, saving,
  toggling a favorite, a sync finishing, a deferred query being enabled.
- Every custom element disconnects and reconnects, so resize observers re-report, chip groups
  re-measure, `rc-virtual-scroller` elements re-find their scroll ancestor, and an open
  `<dialog>` closes.
- Firefox hides most of the cost; Chrome showed ~330 ms of extra blocking at 4× throttling on
  one route change.

## Cause

`useBaseQuery`'s result proxy reads `data` like this:

```js
if (state.data !== undefined) return queryResource.latest?.data;
return queryResource()?.data;
```

On the first render the resource hasn't resolved, and `latest` on an unresolved resource
calls `read()`. `read()` inside a non-user computation, with a Suspense context present,
creates a computed that increments the boundary whenever the resource has a pending promise.
That computed lives until the reading computation reruns. The resource's storage is the query
store (`createDeepSignal`), whose accessor always returns the same object, so the reader never
reruns. solid-query calls `refetch()` on the resource for every observer update, so each later
update suspends the boundary for a microtask and Solid removes and re-inserts its content.

## Do

Return the store's value directly when it exists; it's the same value as `latest?.data` and
reads no resource. Reads with no data yet still go through `queryResource()`, so route
transitions still wait for first data.

```sh
yarn patch @tanstack/solid-query
# edit build/index.js, build/index.cjs, build/dev.js, build/dev.cjs (and src/useBaseQuery.ts):
#   return queryResource.latest?.data;  ->  return state.data;
yarn patch-commit -s <folder>
yarn install
```

File the bug upstream and drop the patch when a release fixes it.

## Avoid

- `startTransition` around the `enabled` flip alone. It covers a fresh cache, but a stale
  query fetches, and the refresh on arrival runs outside the transition.
- Treating 5-52's `isSuccess` guard as the whole fix: it stops the first-fetch suspension of a
  late-enabled query, not this one.
- Upgrading solid-query 5.x expecting a fix without diffing `useBaseQuery`.

## Test/verify

Cached data must be fresh at mount, or the mount fetch reruns the reader and hides the bug:

```tsx
const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
client.setQueryData(['value'], 'cached');
// render <Suspense><Reader/></Suspense>, where Reader shows query.data
// observe removals of the <p>, then: await client.invalidateQueries({ queryKey: ['value'] });
expect(removed).toBe(false);
```

A test client with `staleTime: 0` passes even without the patch. Confirm the test fails
unfixed: restore `package.json`, `yarn.lock` and `.pnp.cjs`, `yarn install`, run, then restore
the patched files. To find the trigger in a real app, see 2-102.
