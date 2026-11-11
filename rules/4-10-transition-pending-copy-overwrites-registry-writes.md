---
id: 4-10
category: State Management
version_basis: ["1.x"]
title: A router transition's pending signal copy can overwrite registry writes from cleanups
priority: HIGH
tags: [solid, transitions, router, signals, oncleanup, registry]
description: "Cleanups that read-modify-write a shared signal during router navigation can lose updates, because a Solid transition keeps a pending copy of the signal and commits it last; keep the registry in a plain array and use the signal only to notify"
---

## Problem

Don't keep a registry that `onMount`/`onCleanup` update as a signal's value when
the owners mount and dispose during navigation. `@solidjs/router` navigates
inside `startTransition`, and while a transition runs, Solid writes a signal's
new value to a separate pending copy (`tValue`) and commits that copy when the
transition settles. Reads and writes outside the transition use the committed
value. A read-modify-write such as
`setItems([...items().filter(...)])` can then start from the wrong copy, and
whichever copy commits last wins, bringing back entries a cleanup removed.

## Incorrect

```ts
// This read and write can target different transition copies.
setItems([...items().filter(item => item !== removed)]);
```

## Correct

Keep the registry in a plain mutable array and give the signal no data:

```ts
let registry: readonly Item[] = [];
const [changed, notify] = createSignal(undefined, { equals: false });
const items = () => (changed(), registry);
const publish = (next: Item[]) => { registry = next; notify(); };
```

Readers always get the live array, so a stale commit can at most cause an extra
re-run, never stale data. Also make each registration remove only its own
entries (by reference, not by id) and replace same-id entries on mount, so
overlapping old/new owners can't duplicate or delete each other's items.

## Why it matters

This avoids restoring disposed owners after navigation and prevents duplicate actions.

## Evidence

An app-bar action registry (`createActionMenu` in the observed app) added each
recipe's overflow actions again on every visit, in the production build on
Chrome and Firefox for Android. Logging in the built bundle showed both
cleanups on back navigation running and the list reaching 0, then reading 8
again about 400 ms later, after the transition committed. Switching to a
functional updater and a fresh array per write still lost the final removal;
the plain-array registry fixed it. `yarn dev` and the Vitest route tests never
reproduced it, so test this in a production build.

## Sources

- [Solid `startTransition` reference](https://docs.solidjs.com/reference/reactive-utilities/start-transition):
  updates inside a transition are deferred until its async work settles.
- [solid-js `writeSignal` and `readSignal`](https://github.com/solidjs/solid/blob/main/packages/solid/src/reactive/signal.ts):
  writes during a running transition set `tValue`; outside one they set
  `value`; reads choose between them by `Transition.running`. Checked against
  the `solid-js` 1.9.12 dist.
- Field observation: the lost removal and its production-only timing, with
  `solid-js` 1.9.12 and `@solidjs/router` 1.0.0.

## Related rules

- [Cleanup at the page ownership boundary](4-7-cleanup-at-page-ownership-boundary.md).
