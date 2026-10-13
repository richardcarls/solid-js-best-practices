---
id: 3-1
title: Use Show for Conditionals
category: Control Flow
priority: HIGH
version_basis: ["1.x"]
description: Use <Show> for conditional rendering and its function child when callers need a narrowed value
---

## Problem

Using JavaScript ternary operators or logical AND (`&&`) for conditional rendering works but
bypasses Solid's optimizations. The `<Show>` component is optimized for conditional rendering and
provides better performance and semantics.

## Incorrect

```tsx
// ❌ WRONG: Ternary operator
function UserGreeting(props) {
  return props.user
    ? <WelcomeMessage user={props.user} />
    : <LoginPrompt />;
}
```

```tsx
// ❌ WRONG: Logical AND - also has falsy value issues
function Notification(props) {
  return props.count && <Badge count={props.count} />;
  // When count is 0, this renders "0" instead of nothing!
}
```

## Correct

```tsx
import { Show } from "solid-js";

// ✅ CORRECT: Show component with fallback
function UserGreeting(props) {
  return (
    <Show when={props.user} fallback={<LoginPrompt />}>
      <WelcomeMessage user={props.user} />
    </Show>
  );
}
```

```tsx
// ✅ CORRECT: Show handles falsy values properly
function Notification(props) {
  return (
    <Show when={props.count > 0}>
      <Badge count={props.count} />
    </Show>
  );
}
```

### Accessing the Condition Value

```tsx
import { Show } from "solid-js";

// ✅ CORRECT: The callback receives a narrowed accessor
function UserProfile(props) {
  return (
    <Show when={props.user} fallback={<p>Loading...</p>}>
      {(user) => (
        <div>
          <h1>{user().name}</h1>
          <p>{user().email}</p>
        </div>
      )}
    </Show>
  );
}
```

The function-child form is the type-narrowing boundary. Plain JSX children do not narrow a
separate read of the original accessor or prop:

```tsx
// ❌ WRONG: props.icon remains string | undefined inside plain children
<Show when={props.icon}>
  <Icon icon={props.icon!} />
</Show>

// ✅ CORRECT: icon is Accessor<string>
<Show when={props.icon}>
  {(icon) => <Icon icon={icon()} />}
</Show>
```

For a combined condition, put the value to consume last so the expression returns that value
instead of a boolean:

```tsx
<Show when={syncStatus() !== "syncing" && lastSyncAt()}>
  {(syncedAt) => <span>{syncedAt().toLocaleTimeString()}</span>}
</Show>
```

When two independent optional values must narrow together, derive one combined accessor:

```tsx
const upcoming = () => {
  const meal = nextMeal.data;
  const recipe = recipeQuery.data;

  return meal && recipe ? { meal, recipe } : undefined;
};

<Show when={upcoming()}>
  {(value) => <RecipeCard recipe={value().recipe} />}
</Show>
```

The narrowed accessor is valid only while its branch is active. Before passing it into a nested
conditional's `children` or `fallback`, read
[3-4: Narrowed Accessors Expire With Their Branch](3-4-use-switch-match.md#narrowed-accessors-expire-with-their-branch).

JSX attributes have no function-child boundary. Read once in an inline function so the same
reactive expression owns the guard and the narrowed value:

```tsx
title={(() => {
  const step = managedDirectionStep();

  return step ? `Ingredients used in step ${step.stepIndex + 1}` : "Step associations";
})()}
```

### Keyed Show for Object Identity

```tsx
import { Show } from "solid-js";

// ✅ CORRECT: keyed=true rerenders when object reference changes
function ItemDetail(props) {
  return (
    <Show when={props.item} keyed>
      {(item) => <ItemView item={item} />}
    </Show>
  );
}
```

### Nested Conditions

```tsx
import { Show } from "solid-js";

function Dashboard(props) {
  return (
    <Show when={props.user} fallback={<LoginPage />}>
      {(user) => (
        <Show when={user().isAdmin} fallback={<UserDashboard user={user()} />}>
          <AdminDashboard user={user()} />
        </Show>
      )}
    </Show>
  );
}
```

## Why It Matters

1. **Optimization**: `<Show>` preserves DOM nodes and component instances when toggling. Ternaries
   may recreate elements.

1. **Type Narrowing**: The callback form provides a narrowed, non-null accessor. Plain children
   do not narrow later reads of the original value.

1. **Falsy Safety**: Properly handles `0`, `""`, and other falsy values that `&&` renders incorrectly.

1. **Readability**: Explicit `fallback` prop is clearer than ternary's `:` alternative.

1. **Keyed Updates**: The `keyed` prop gives control over when to recreate content.

## Show Props

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `when` | `T \| undefined \| null \| false` | Condition to evaluate |
| `fallback` | `JSX.Element` | Rendered when `when` is falsy |
| `keyed` | `boolean` | Rerender when `when` reference changes |

## Pattern Comparison

| Pattern | Performance | Type Safe | Falsy Safe |
| ------- | ----------- | --------- | ---------- |
| `condition ? <A/> : <B/>` | ⚠️ May recreate | ❌ No narrowing | ✅ Yes |
| `condition && <A/>` | ⚠️ May recreate | ❌ No narrowing | ❌ Renders "0" |
| `<Show when={condition}>` | ✅ Optimized | ✅ With callback | ✅ Yes |

## When to Use Ternaries

Ternaries are acceptable for:

- Simple attribute values: `class={active ? "on" : "off"}`
- Inline text: `{count === 1 ? "item" : "items"}`
- Very simple toggles where performance doesn't matter

But for component rendering, prefer `<Show>`.

`<Show>` also works well for conditional slotted children of a custom element. It inserts and
removes the child without adding a wrapper element, so the custom element's slot assignment and
`slotchange` behavior continue to see the expected direct child.

## Related Rules

- [3-4: Use Switch/Match](3-4-use-switch-match.md) - For multiple conditions
- [3-5: Provide Fallbacks](3-5-provide-fallbacks.md) - Always include loading states
