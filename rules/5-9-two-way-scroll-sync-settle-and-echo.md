---
id: 5-9
title: Two-Way Scroll Sync Needs a Settle Signal and Echo Suppression
category: Refs & DOM
priority: HIGH
description: A scroll-snap carousel whose index is both a prop (an effect scrolls to it) and reported outward (native settling calls back up) must report only settled positions and must not re-scroll for its own echo
---

## Problem

A carousel's active index is controlled: an effect calls `scrollTo()` when the prop changes, and
native scrolling reports the settled index through the same callback that chevrons, keyboard
commands, and other external controls use. That loop produces two separate bugs:

1. **Mid-flight reads oscillate.** A smooth programmatic `scrollTo()` fires many `scroll` events
   before it arrives. Reporting an index from each event reports the starting index, which sends
   the effect back toward the start. One chevron click produced about eight conflicting updates and
   snapped back.
1. **The echo is not a no-op.** After a user swipe settles, the reported index returns as the prop,
   and the effect starts a smooth `scrollTo()` toward the position the track already rests at. That
   call owns the scroll for its duration, so a second swipe started during it is swallowed.

Fixing the first hides the second in casual testing; only rapid consecutive swipes expose it.

## Incorrect

```tsx
createEffect(() => {
  track.scrollTo({ left: props.index * track.clientWidth, behavior: "smooth" });
});

<div ref={track} onScroll={() => props.onSelect(Math.round(track.scrollLeft / track.clientWidth))} />
```

## Correct

```tsx
let echoed: number | undefined;
const settledIndex = () => Math.round(Math.abs(track.scrollLeft) / track.clientWidth);

createEffect(() => {
  const target = props.index;
  const isEcho = target === echoed;
  echoed = undefined;
  if (isEcho) return; // our own report coming back; the track already rests there
  track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
});

onMount(() => {
  const report = () => {
    const settled = settledIndex();
    if (settled === untrack(() => props.index)) return;
    echoed = settled;
    props.onSelect(settled);
  };

  if ("onscrollend" in window) {
    track.addEventListener("scrollend", report);
    onCleanup(() => track.removeEventListener("scrollend", report));
    return;
  }

  let timer: number | undefined;
  const debounced = () => {
    clearTimeout(timer);
    timer = window.setTimeout(report, 120);
  };
  track.addEventListener("scroll", debounced, { passive: true });
  onCleanup(() => {
    clearTimeout(timer);
    track.removeEventListener("scroll", debounced);
  });
});
```

- `scrollend` is the settle signal. Without it, debounce with a timer reset on every `scroll`
  event; one `requestAnimationFrame` is shorter than a smooth scroll's intermediate frames.
- Marking the echo with the reported value, not a boolean, means a parent that ignores the report
  cannot leave a stuck flag that swallows the next real index change.
- `Math.abs(scrollLeft)` keeps the index correct in RTL, where `scrollLeft` is zero or negative.

## Related Rules

- [1-4: Avoid Setting Signals in Effects](1-4-avoid-signal-in-effect.md)
- [5-3: Cleanup with onCleanup](5-3-cleanup-with-oncleanup.md)
