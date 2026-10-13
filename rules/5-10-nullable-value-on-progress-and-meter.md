---
id: 5-10
title: Bind a Possibly Missing value on progress or meter as an Attribute
category: Refs & DOM
priority: HIGH
version_basis: ["1.x"]
description: Solid always assigns value as a DOM property, and the progress and meter value setters throw on undefined; use attr:value, which removes the attribute for null or undefined, or branch so the element never receives a non-finite value
---

## Problem

`value` is on Solid's short list of props that always compile to a property assignment
(`el.value = x`), on every element. `HTMLProgressElement.value` and `HTMLMeterElement.value` are
`double` setters, so assigning `undefined` or `NaN` throws a non-finite-value `TypeError`. The
throw escapes the render and unmounts everything up to the nearest `ErrorBoundary`.

Other numeric attributes such as `max` compile to `setAttribute`, which removes the attribute for
`null` or `undefined`, so they tolerate a missing value. That asymmetry makes the crash look
arbitrary.

## Incorrect

```tsx
// ❌ Throws while progress() is still undefined, before the first progress event
<progress value={progress()?.completed} max={progress()?.total} />
```

## Correct

```tsx
// ✅ attr: removes the attribute when nullish; a progress bar without a value is the native
// indeterminate state
const known = () => {
  const current = progress();
  return current?.total != null ? current : undefined;
};

<progress attr:value={known()?.completed} attr:max={known()?.total} />
```

Branch in markup instead when the determinate and indeterminate states differ in more than the
bar.

Do not default with `?? 0`. It reports an unknown amount as zero progress, a wrong signal rather
than a crash.

## Related Rules

- [9-5: Property vs Attribute Binding](9-5-property-vs-attribute-binding.md)
