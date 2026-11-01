---
id: 3-08
category: Control Flow
version_basis: ["1.x"]
title: Guard a routed form with useBeforeLeave, and test it with string navigation
priority: MEDIUM
tags: [solid, solid-router, forms, navigation, testing, beforeunload]
description: "Solid Router's `useBeforeLeave` can block in-app links, `navigate(-1)`, and browser back and forward (it restores the URL); prevent, prompt, then `retry(true)`. Let a navigation to the same URL through, add `beforeunload`, and allow leaving after a save. Under `MemoryRouter`, `navigate(number)` and history back skip the guard, so test with a link and check history back in a real browser."
---

## Use when

A full-page routed form, not a dialog, should ask before discarding unsaved changes, reusing
the app's dirty-dialog prompt.

## Do

```ts
const [pending, setPending] = createSignal<BeforeLeaveEventArgs>();
let leaveAllowed = false;

useBeforeLeave((event) => {
  const { from } = event;
  const staysHere = event.to === `${from.pathname}${from.search}${from.hash}`;

  if (leaveAllowed || event.defaultPrevented || staysHere || !hasChanges()) return;
  event.preventDefault();
  setPending(() => event);
});

const discard = () => {
  const event = pending();

  setPending(undefined);
  leaveAllowed = true;
  event?.retry(true);
};
// beforeunload: event.preventDefault() while hasChanges(); after a save, leaveAllowed = true.
```

- Let a navigation to the current URL through: replacing history state calls the guard too.
- Compare against what's saved: an edit is changed when it differs from the saved record; a
  new item, copy, or import once it has any content.
- Extract the prompt into a shared component so a dirty dialog and the routed guard show the
  same question.
- A routed full-screen form usually shouldn't become a dialog just to reuse the dialog's
  guard: it loses deep links, stacks its own dialogs inside a modal, and still needs history
  handling for the back gesture.

## Avoid

- Testing history back under `MemoryRouter`: `navigate(-1)` goes straight to `utils.go` and
  never calls the guard. In the browser router the same call becomes `popstate`, which is
  blocked and the URL put back.

## Test/verify

Integration tests with an in-app `<A>` link next to the page: no prompt when unchanged; prompt,
Keep editing keeps the text, Discard leaves; `beforeunload` is canceled only while changed;
saving leaves without a prompt. Then, in a real browser build, press the back arrow and the
browser's back with an edit and check the prompt and that Discard keeps the saved record.
