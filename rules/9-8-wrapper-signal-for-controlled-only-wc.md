---
title: Wrapper-Owned Signal for Controlled-Only Custom Elements
priority: HIGH
category: Web Component Integration
---

# Wrapper-Owned Signal for Controlled-Only Custom Elements

## Rule

When a custom element exposes only a controlled `value` property and no `defaultValue` mechanism,
initialize a `createSignal` from the wrapper's `defaultValue` prop and bind `prop:value` to that
signal. The wrapper owns the uncontrolled → controlled bridge in this case — not the custom element.

## Why This Differs from Rule 9-4

Rule 9-4 says let the custom element own value/default handling. That applies when the WC supports
it. Some lighter-weight WCs deliberately omit `defaultValue` and expose only a controlled `value`
property. For those, the wrapper must fill the gap.

**Check before wrapping:** read the WC's property definitions. If you see `@property() value = 0`
but no `@property() defaultValue`, the WC is controlled-only and the wrapper needs the signal.

## Correct

```tsx
export const Slider = (props: SliderProps) => {
  const [value, setValue] = createSignal(props.defaultValue ?? props.value ?? 0);

  return (
    <rc-slider
      prop:value={value()}
      on:rc-slider-change={(e: CustomEvent<{ value: number }>) => {
        setValue(e.detail.value);
        props.onChange?.(e.detail.value);
      }}
    />
  );
};
```

## Incorrect — passing defaultValue to a WC that doesn't support it

```tsx
<rc-slider
  prop:defaultValue={props.defaultValue}  // rc-slider ignores this
  on:rc-slider-change={handleChange}
/>
```

## Why It Matters

Without the internal signal, `prop:value` stays at its initial render value because Solid's JSX
only reacts to signals — a plain `props.defaultValue` expression won't drive updates after the
first render.

## Related Rules

- [9-4 Thin Web Component Wrappers](9-4-thin-web-component-wrappers.md)
- [5-7 Web Component Controlled State](5-7-web-component-controlled-state.md)
