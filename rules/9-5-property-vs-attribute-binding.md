---
id: 9-5
title: Property vs Attribute Binding
category: Web Component Integration
priority: HIGH
description: "Dynamic props on custom elements compile to property assignments; use `prop:` to state that intent and `attr:` whenever the element, CSS, or dataset must see a real attribute"
---

# Property vs Attribute Binding

## Rule

On a hyphenated (custom-element) tag, Solid's compiler turns every un-namespaced dynamic prop into a
camel-case property assignment: `value={x()}` becomes `el.value = x()`, and `data-tone={t()}`
becomes `el.dataTone = t()`. Native elements get `setAttribute` except for a short list of
properties such as `value`.

- Use `prop:*` for property-based public APIs: controlled state and all rich data. On a custom
  element it compiles the same way, but it states the intent and survives a tag change.
- Use `attr:*` whenever the element, a CSS selector, or a `.dataset` reader must see an attribute:
  every `data-*`, ID-reference ARIA (`aria-controls`, `aria-labelledby`, `aria-describedby`,
  `aria-activedescendant`, `aria-owns`), and attributes the element observes without exposing a
  property.
- String ARIA such as `aria-label` works without `attr:` because browser ARIA reflection
  (`el.ariaLabel`) writes the attribute. ID-reference ARIA has no string property, so it silently
  does nothing.

## Incorrect

```tsx
// ❌ Compiles to el.dataTone = ... and el.ariaControls = ...; neither reflects, so
// [data-tone='danger'] never matches and the popup relationship is never exposed
<wc-button data-tone={tone()} aria-controls={menuId}>
  Delete
</wc-button>
```

## Correct

```tsx
<wc-button attr:data-tone={tone()} attr:aria-controls={menuId}>
  Delete
</wc-button>
```

```tsx
<wc-select
  prop:value={selectedIds()}
  prop:defaultValue={initialIds}
  prop:options={options()}
  disabled={isDisabled()}
  on:wc-select-change={(event: CustomEvent<WcSelectChangeDetail>) => {
    setSelectedIds(event.detail.selectedValues);
  }}
/>
```

```tsx
<wc-dialog
  prop:open={open()}
  prop:defaultOpen={false}
  on:wc-dialog-toggle={(event: CustomEvent<{ open: boolean }>) => setOpen(event.detail.open)}
/>
```

`disabled={isDisabled()}` is a property assignment too; it works because the element defines a
`disabled` property. `slot={...}` works without `attr:` because `slot` is a reflected
`HTMLElement` property.

## Why It Matters

The failure is silent. Assigning a property the element never defined succeeds, TypeScript accepts
the prop, and the only symptom is a selector or `.dataset` read that never matches, which looks
like a cascade or token bug. The compiled module is the ground truth: Vite serves it transformed,
so `_el$.dataTone = ...` versus `setAttribute(_el$, "data-tone", ...)` settles the question. One
instance usually means more; grep every dynamic `data-*` and ID-reference `aria-*` binding on a
custom element.

## Related Rules

- [2-10 Custom Element TypeScript Declarations](2-10-custom-element-typescript-declarations.md)
- [5-6 Event Handler Patterns](5-6-event-handler-patterns.md)
- [5-7 Web Component Controlled State](5-7-web-component-controlled-state.md)
- [9-4 Thin Web Component Wrappers](9-4-thin-web-component-wrappers.md)
