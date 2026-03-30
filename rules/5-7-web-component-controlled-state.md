---
id: 5-7
title: Web Component Controlled State
category: Refs & DOM
priority: HIGH
description: Use createEffect + ref + imperative calls to sync Solid signals to web components and native browser APIs that maintain their own internal state
---

## Problem

Solid's normal pattern — passing a signal value as a prop — doesn't work for web components and native browser APIs that manage their own internal state imperatively (`<dialog>`, the Popover API, most third-party custom element libraries). Passing `open={isOpen()}` as an attribute does nothing because these APIs require method calls to change state. The correct pattern is `createEffect` + `ref` for state-down, plus event listeners for state-up.

## Incorrect

```tsx
// ❌ WRONG: setting an attribute has no effect on a <dialog>
// The dialog will never open or close in response to the signal
function Modal(props: { open: boolean }) {
  return (
    <dialog open={props.open}>
      <p>Content</p>
    </dialog>
  );
}

// ❌ WRONG: same problem with a web component
// The component's internal state doesn't update from attribute changes
function Dropdown(props: { open: boolean; options: string[] }) {
  return (
    <custom-dropdown open={props.open} options={props.options} />
  );
}

// ❌ WRONG: createEffect without onCleanup leaks a manually added listener
createEffect(() => {
  if (dialogRef) {
    dialogRef.addEventListener("close", handleClose);
    // Missing: onCleanup(() => dialogRef.removeEventListener("close", handleClose))
  }
});
```

## Correct

### Pattern 1: Native `<dialog>` Controlled State

The simplest universal example. `<dialog>` exposes `.showModal()` and `.close()` to control open state:

```tsx
import { Component, createEffect, onCleanup } from "solid-js";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  let dialogRef: HTMLDialogElement | undefined;

  // State-down: sync signal → imperative API
  createEffect(() => {
    if (!dialogRef) return;
    if (props.open) {
      dialogRef.showModal();
    } else {
      dialogRef.close();
    }
  });

  // State-up: DOM event → signal (via callback prop)
  // Use on: prefix so the handler fires on the native close event
  return (
    <dialog
      ref={dialogRef!}
      on:close={() => props.onClose?.()}
    >
      {props.children}
    </dialog>
  );
};
```

### Pattern 2: Native Popover API Controlled State

Same pattern with the newer Popover API. Use `on:toggle` to detect state changes:

```tsx
import { Component, createEffect } from "solid-js";

interface PopoverProps {
  open: boolean;
  onToggle?: (open: boolean) => void;
  children: JSX.Element;
}

const Popover: Component<PopoverProps> = (props) => {
  let popoverRef: HTMLDivElement | undefined;

  // State-down: sync signal → imperative API
  createEffect(() => {
    if (!popoverRef) return;
    if (props.open) {
      popoverRef.showPopover();
    } else {
      popoverRef.hidePopover();
    }
  });

  return (
    <div
      ref={popoverRef!}
      popover="manual"
      on:toggle={(e: ToggleEvent) => props.onToggle?.(e.newState === "open")}
    >
      {props.children}
    </div>
  );
};
```

### Pattern 3: Custom Element Value Binding

Web components with value-like state (selects, sliders, pickers) need the same approach. Don't bind `value` as an attribute for two-way sync — listen to the change event and update your signal:

```tsx
import { Component, createEffect, createSignal } from "solid-js";

function CustomSelectExample() {
  const [selected, setSelected] = createSignal("option-a");
  let selectRef: HTMLElement | undefined;

  // State-down: when signal changes externally, push to the element
  // (Only needed if the element doesn't re-read its `value` property automatically)
  createEffect(() => {
    if (selectRef) {
      (selectRef as HTMLElement & { value: string }).value = selected();
    }
  });

  return (
    <custom-select
      ref={selectRef!}
      // State-up: pull the new value from the event
      on:change={(e: CustomEvent<{ value: string }>) => {
        setSelected(e.detail.value ?? (e.target as HTMLInputElement).value);
      }}
    />
  );
}
```

### Pattern 4: The `prop:` Prefix for Object / Array Values

When a custom element expects a JavaScript property (not an HTML attribute) — such as an array of options, a configuration object, or a boolean that must be the JS `true` rather than the string `"true"` — use the `prop:` prefix so Solid sets the DOM property directly:

```tsx
// ❌ WRONG: options becomes "[object Object]" — setAttribute stringifies it
<custom-select options={optionsList()} />

// ✅ CORRECT: Solid sets selectEl.options = optionsList()
<custom-select prop:options={optionsList()} />

// ✅ CORRECT: also works for boolean properties that expect JS true/false
<custom-toggle prop:checked={isChecked()} />

// ✅ CORRECT: imperative update via ref when createEffect is already in use
createEffect(() => {
  if (selectRef) {
    (selectRef as CustomSelectElement).options = optionsList();
  }
});
```

### Cleanup for Manually Attached Listeners

If you add event listeners imperatively (instead of using `on:` in JSX), always pair them with `onCleanup`:

```tsx
import { onMount, onCleanup } from "solid-js";

onMount(() => {
  const handler = (e: Event) => handleClose(e);
  dialogRef!.addEventListener("close", handler);
  onCleanup(() => dialogRef!.removeEventListener("close", handler));
});
```

## Why It Matters

1. **Silent failures**: Passing `open={true}` as an attribute on a `<dialog>` sets the HTML `open` attribute, which only affects non-modal display — `showModal()` is required for the modal backdrop and focus trap. The element appears broken with no error.

2. **Two-way sync**: Web components fire events to announce state changes. Without listening, your signal drifts from the element's actual state (e.g., user dismisses a dialog by pressing Escape — your `open` signal stays `true`).

3. **Property vs. attribute**: HTML attributes are always strings. A `prop:` typo costs nothing to fix; a missing `prop:` on an array prop produces silent `[object Object]` corruption.

4. **Memory leaks**: Manually added event listeners must be removed. `on:` in JSX is managed by Solid automatically; imperative `addEventListener` calls are your responsibility.

## Related Rules

- [5-2: Access DOM in onMount](5-2-access-dom-in-onmount.md) — safe timing for DOM access
- [5-3: Cleanup with onCleanup](5-3-cleanup-with-oncleanup.md) — cleaning up manual event listeners
- [5-6: Event Handler Patterns](5-6-event-handler-patterns.md) — `on:` syntax for custom events
- [2-10: Custom Element TypeScript Declarations](2-10-custom-element-typescript-declarations.md) — typing custom element props and events
