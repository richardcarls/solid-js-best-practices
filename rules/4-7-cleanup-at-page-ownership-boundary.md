---
id: 4-7
title: Cleanup at the Page Ownership Boundary
category: State Management
priority: HIGH
version_basis: ["1.x"]
description: Use per-page cleanup when multiple routed panes remain mounted
---

## Problem

In split-pane layouts, multiple routed pages can remain mounted simultaneously. Resetting shared
context state whenever the pathname changes clears state owned by panes that did not unmount.

## Correct

Place cleanup with the page or resource owner and use `onCleanup` when that owner actually
unmounts. Treat navigation as a state change, not proof that every previous page disappeared.

Test narrow and wide layouts because their mounting lifecycles may differ.

## Audit Every Consumer When Splitting a Context per Pane

Giving each mounted pane its own provider, instead of one shared instance that was safe only while
a single pane existed, changes what every `useContext` call resolves to. Enumerate every field on
the context type and check each field's readers, not only the field the bug report named. A reader
outside the newly scoped region still resolves the outer instance, which no pane writes anymore.

In the observed case, the app bar already had an opt-out flag and was scoped correctly. The
floating action button, read from the same context by the outer shell with no flag, went dark at
every width. Nothing threw, type-checked differently, or failed an existing test.

For each reader outside the scoped region, extend the existing gate or forward the active pane's
fields explicitly, for example by passing the outer context as a prop and mirroring the active
pane's fields into it from an effect. Add a test for every field an outside consumer depends on.
