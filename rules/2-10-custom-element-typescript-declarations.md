---
id: 2-10
title: Custom Element TypeScript Declarations
category: Components
priority: HIGH
version_basis: ["1.x"]
description: Declare custom element tags in the solid-js JSX namespace and augment TypeScript's DOM types for newer HTML attributes and experimental CSS properties
---

## Problem

TypeScript has no knowledge of custom elements by default. Using any `<my-element>` tag in JSX
produces LSP errors, and props have no type safety. Similarly, newer HTML attributes (`popover`,
`popoverTarget`) and experimental CSS properties (`anchor-name`, `position-anchor`) may not yet
exist in the TypeScript DOM lib, causing unnecessary `@ts-ignore` usage that hides real errors.

## Incorrect

```tsx
// ❌ WRONG: TypeScript error — JSX element 'my-dropdown' has no corresponding type
<my-dropdown open={isOpen()} />

// ❌ WRONG: @ts-ignore suppresses real errors in the same file
// @ts-ignore
<button popoverTarget="my-panel">Open</button>

// ❌ WRONG: `as never` disables type checking on the entire style object
<div style={{ "anchor-name": "--anchor-btn" } as never} />
```

## Correct

### 1. Declare Custom Elements in the Solid JSX Namespace

Create a `src/custom-elements.d.ts` file (any name works as long as it is included by `tsconfig.json`):

```typescript
// src/custom-elements.d.ts
import type { JSX } from "solid-js";

// Import element class types from your library when available
// import type { MyDropdown } from "my-component-library";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      // Basic custom element with typed props
      "my-dropdown": {
        open?: boolean;
        placement?: "top" | "bottom" | "left" | "right";
        "on:my-open"?: (e: CustomEvent<void>) => void;
        "on:my-close"?: (e: CustomEvent<void>) => void;
        ref?: (el: HTMLElement) => void;
        children?: JSX.Element;
      };

      // Use library-provided element types when available
      // "my-dropdown": MyDropdown["Props"] & { ref?: (el: MyDropdown) => void };

      // Catch-all for any other custom elements (less type-safe but unblocks LSP)
      [tagName: `${string}-${string}`]: Record<string, unknown> & {
        ref?: (el: HTMLElement) => void;
        children?: JSX.Element;
      };
    }
  }
}
```

### 2. Augment Newer JSX Attributes Only When Missing

Check the installed Solid JSX and TypeScript DOM declarations first. If JSX types lack a newer
attribute, add the missing JSX member with the spelling and value type supported by that version:

```typescript
declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> {
      popover?: "auto" | "manual" | "";
    }

    interface ButtonHTMLAttributes<T> {
      popoverTarget?: string;
      popoverTargetAction?: "toggle" | "show" | "hide";
    }
  }
}
```

Do not add `popoverTarget?: string` to `HTMLButtonElement` or `HTMLInputElement`. The HTML
`popovertarget` attribute takes an ID, but the DOM property is
[`popoverTargetElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/popoverTargetElement)
and takes an element reference. Also avoid declaring DOM members that the installed TypeScript
version already provides; incompatible interface merging will itself cause type errors.

### 3. Type Custom Events Correctly

Solid's `on:` prefix binds directly to the native DOM event. Type the handler with `CustomEvent<T>`
using the detail type:

```tsx
// ✅ CORRECT: typed custom event handler
<my-select
  on:my-change={(e: CustomEvent<{ value: string }>) => {
    setSelected(e.detail.value);
  }}
/>

// ✅ CORRECT: typed toggle event (Popover API)
<div
  popover="auto"
  on:toggle={(e: ToggleEvent) => {
    setOpen(e.newState === "open");
  }}
/>
```

### 4. Experimental CSS Properties

Keep the assertion around only the unsupported property. An assertion on the complete style object
also suppresses mistakes in ordinary properties:

```tsx
// ❌ WRONG: as never disables all type checking on the style object
<div style={{ "anchor-name": "--btn", color: "red" } as never} />

// ✅ CORRECT: only the unknown property is cast
const anchorStyle = (name: string): JSX.CSSProperties =>
  ({ "anchor-name": name } as unknown as JSX.CSSProperties);

<div
  style={{
    ...anchorStyle("--my-anchor"),
    color: "red",   // still type-checked
  }}
/>

// ✅ CORRECT: a one-off assertion still stays separate from known properties
<div style={{ ...({ "anchor-name": "--my-anchor" } as unknown as JSX.CSSProperties), color: "red" }} />
```

### 5. The `prop:` Prefix for JS Properties (Not HTML Attributes)

Custom elements often expose JavaScript properties that are not HTML attributes. On a hyphenated
tag, Solid already compiles an un-namespaced dynamic prop to a camel-case property assignment, so
`options={optionsList()}` reaches the property at runtime. `prop:` states that intent explicitly and
keeps it correct if the tag ever changes; `attr:` is the namespace that forces `setAttribute` (see
[9-5](9-5-property-vs-attribute-binding.md)):

```tsx
// ✅ Explicit property bindings
<my-select prop:options={optionsList()} />
<my-toggle prop:checked={isChecked()} />

// ✅ Attribute binding for CSS selectors and .dataset readers
<my-toggle attr:data-size={size()} />
```

### 6. Hand-Maintained Declarations Drift

When declarations are written by hand rather than generated from the component, a renamed
attribute or a newly added property leaves the declaration stale. A consumer error such as
`Property 'prop:allowCreate' does not exist ... Did you mean 'allowcreate'?` on a call site that
matches the component's documentation usually means the declaration file is stale, not the call
site. Compare the declaration's key with the component's current property and `attribute:`
mapping, fix the declaration, and prefer generating it from the component's metadata (for
example a custom elements manifest) so it cannot drift.

## Why It Matters

1. **LSP noise**: Undeclared custom elements produce errors on every usage, making it hard to spot
   real mistakes.
1. **Type safety**: Typed props and events catch mismatches at compile time; for example, passing a
   string where a `boolean` is expected.
1. **`@ts-ignore` debt**: Suppressing errors hides real bugs in adjacent lines; targeted
   declarations or casts are always preferable.
1. **Binding correctness**: A hyphenated tag defaults dynamic props to properties, and only a
   namespace overrides that. An un-namespaced `data-*` on a custom element silently becomes an
   unused property.

## Related Rules

- [5-6: Event Handler Patterns](5-6-event-handler-patterns.md); `on:` syntax and custom event typing
- [5-7: Web Component Controlled State](5-7-web-component-controlled-state.md); imperative APIs and
  `prop:` for value sync
- [2-8: Style Prop Conventions](2-8-style-prop-conventions.md); CSS custom properties and style
  object format
