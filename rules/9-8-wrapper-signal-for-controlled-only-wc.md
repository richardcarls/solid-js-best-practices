---
title: Wrapper-Owned Signal for Controlled-Only Custom Elements
priority: HIGH
version_basis: ["1.x"]
category: Web Component Integration
---

# Wrapper-Owned Signal for Controlled-Only Custom Elements

## Rule

When a custom element exposes a `value` property but no `defaultValue` mechanism, the wrapper
needs local state for an **uncontrolled** `defaultValue`. If callers supply `value`, read that prop
reactively so later controlled updates reach the element. The wrapper owns this bridge because the
custom element has no default-value contract.

## Why This Differs from Rule 9-4

Rule 9-4 says let the custom element own value/default handling. That applies when the WC supports
it. Some lighter-weight WCs deliberately omit `defaultValue` and expose only a controlled `value`
property. For those, the wrapper must fill the gap.

**Check before wrapping:** read the WC's property definitions. If it exposes `value` but no
`defaultValue`, the wrapper needs the signal for uncontrolled callers. Keep the choice between
controlled and uncontrolled modes fixed for a mounted wrapper instance.

## Correct

```tsx
interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export const Slider = (props: SliderProps) => {
  const [localValue, setLocalValue] = createSignal(props.defaultValue ?? 0);
  const isControlled = props.value !== undefined;
  const currentValue = () => isControlled ? props.value! : localValue();

  return (
    <wc-slider
      prop:value={currentValue()}
      on:wc-slider-change={(e: CustomEvent<{ value: number }>) => {
        if (!isControlled) setLocalValue(e.detail.value);
        props.onChange?.(e.detail.value);
      }}
    />
  );
};
```

## Incorrect; passing defaultValue to a WC that doesn't support it

```tsx
<wc-slider
  prop:defaultValue={props.defaultValue}  // ignored when the element has no such property
  on:wc-slider-change={handleChange}
/>
```

Also avoid initializing a local signal from `props.value` and then always binding the signal:
later controlled prop changes would never reach the element.

## Why It Matters

Without local state, an uncontrolled field cannot reflect user changes through the wrapper.
Controlled callers, however, already provide a reactive `props.value`; copying it only once into
a signal would make the field stale after the parent changes it.

## Related Rules

- [9-4 Thin Web Component Wrappers](9-4-thin-web-component-wrappers.md)
- [5-7 Web Component Controlled State](5-7-web-component-controlled-state.md)
