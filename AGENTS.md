# Solid.js Best Practices - Agent Guide

> **Note:** This document helps AI agents work effectively with Solid.js best practices rules. Use this guide to select relevant rules based on your current task and avoid common mistakes. Detailed rules with code examples are in the `rules/` directory.

## How to Use This Skill

1. **Read SKILL.md first** for the rule index and quick reference
2. **Load specific rules as needed** based on the task at hand
3. **Prioritize by impact** - CRITICAL and HIGH rules should always be followed

## Task-Based Rule Selection

### Writing New Components

Load these rules when creating new Solid.js components:

| Rule | Why |
| ---- | --- |
| [1-1](rules/1-1-use-signals-correctly.md) | Ensure signals are called as functions |
| [2-1](rules/2-1-never-destructure-props.md) | Prevent reactivity breakage |
| [2-2](rules/2-2-use-merge-props.md) | Handle default props correctly |
| [2-3](rules/2-3-use-split-props.md) | Separate local and forwarded props |
| [3-1](rules/3-1-use-show-for-conditionals.md) | Proper conditional rendering |
| [3-2](rules/3-2-use-for-for-lists.md) | Efficient list rendering |
| [5-3](rules/5-3-cleanup-with-oncleanup.md) | Prevent memory leaks |

### Code Review

Focus on these rules during code review:

| Priority | Rules |
| -------- | ----- |
| CRITICAL | [1-1](rules/1-1-use-signals-correctly.md), [2-1](rules/2-1-never-destructure-props.md) |
| HIGH | [1-2](rules/1-2-use-memo-for-derived.md), [1-3](rules/1-3-effects-for-side-effects.md), [5-2](rules/5-2-access-dom-in-onmount.md), [5-3](rules/5-3-cleanup-with-oncleanup.md) |

### Performance Optimization

Load these rules when optimizing performance:

| Rule | Focus |
| ---- | ----- |
| [1-2](rules/1-2-use-memo-for-derived.md) | Prevent unnecessary recomputation |
| [1-6](rules/1-6-batch-signal-updates.md) | Reduce update cycles |
| [4-2](rules/4-2-store-path-updates.md) | Granular store updates |
| [6-1](rules/6-1-avoid-unnecessary-tracking.md) | Prevent unwanted subscriptions |
| [6-2](rules/6-2-use-lazy-components.md) | Code splitting |
| [6-4](rules/6-4-optimize-store-access.md) | Efficient store access |

### State Management

Load these rules when working with application state:

| Rule | Focus |
| ---- | ----- |
| [4-1](rules/4-1-signals-vs-stores.md) | Choose the right primitive |
| [4-2](rules/4-2-store-path-updates.md) | Efficient updates |
| [4-3](rules/4-3-use-produce-for-mutations.md) | Complex mutations |
| [4-4](rules/4-4-use-reconcile-for-data.md) | External data integration |
| [4-5](rules/4-5-use-context-for-global.md) | Cross-component state |

### Accessibility Audit

Load these rules when auditing accessibility:

| Rule | Focus |
| ---- | ----- |
| [7-1](rules/7-1-semantic-html.md) | Semantic structure |
| [7-2](rules/7-2-aria-attributes.md) | Screen reader support |
| [7-3](rules/7-3-keyboard-navigation.md) | Keyboard users |

## Critical Patterns to Always Check

### 1. Signals as Functions

```tsx
// ❌ WRONG - accessing signal without calling
const count = createSignal(0);
return <div>{count}</div>;

// ✅ CORRECT - calling signal as function
const [count, setCount] = createSignal(0);
return <div>{count()}</div>;
```

### 2. Never Destructure Props

```tsx
// ❌ WRONG - breaks reactivity
function Greeting({ name }) {
  return <h1>Hello {name}</h1>;
}

// ✅ CORRECT - preserves reactivity
function Greeting(props) {
  return <h1>Hello {props.name}</h1>;
}
```

### 3. Use Control Flow Components

```tsx
// ❌ WRONG - ternaries don't optimize
return condition ? <ComponentA /> : <ComponentB />;

// ✅ CORRECT - Show component optimizes updates
return (
  <Show when={condition} fallback={<ComponentB />}>
    <ComponentA />
  </Show>
);
```

### 4. Memos for Derived Values

```tsx
// ❌ WRONG - recalculates every access
const doubled = () => count() * 2;

// ✅ CORRECT - cached, only updates when count changes
const doubled = createMemo(() => count() * 2);
```

### 5. Cleanup Side Effects

```tsx
// ❌ WRONG - timer never cleaned up
onMount(() => {
  setInterval(() => tick(), 1000);
});

// ✅ CORRECT - timer cleaned up on unmount
onMount(() => {
  const id = setInterval(() => tick(), 1000);
  onCleanup(() => clearInterval(id));
});
```

## Common Mistakes to Catch

| Mistake | Rule | Solution |
| ------- | ---- | -------- |
| Forgetting `()` on signal access | [1-1](rules/1-1-use-signals-correctly.md) | Always call signals: `count()` |
| Destructuring props | [2-1](rules/2-1-never-destructure-props.md) | Access via `props.name` |
| Using ternaries for conditionals | [3-1](rules/3-1-use-show-for-conditionals.md) | Use `<Show>` component |
| `.map()` for lists | [3-2](rules/3-2-use-for-for-lists.md) | Use `<For>` component |
| Deriving values in effects | [1-2](rules/1-2-use-memo-for-derived.md) | Use `createMemo` |
| Setting signals in effects | [1-4](rules/1-4-avoid-signal-in-effect.md) | Use `createMemo` or external triggers |
| Accessing DOM during render | [5-2](rules/5-2-access-dom-in-onmount.md) | Use `onMount` |
| Forgetting cleanup | [5-3](rules/5-3-cleanup-with-oncleanup.md) | Use `onCleanup` |
| Spreading whole store | [6-4](rules/6-4-optimize-store-access.md) | Access specific properties |

## Skill File Structure

```text
solid-js-best-practices/
├── SKILL.md           # Index, quick reference, when to use (start here)
├── AGENTS.md          # This file - agent guidance
├── README.md          # Human documentation
├── metadata.json      # Ignore (same as this file's frontmatter)
└── rules/             # Individual rule files
    ├── 1-*.md         # Reactivity rules
    ├── 2-*.md         # Component rules
    ├── 3-*.md         # Control flow rules
    ├── 4-*.md         # State management rules
    ├── 5-*.md         # Refs & DOM rules
    ├── 6-*.md         # Performance rules
    └── 7-*.md         # Accessibility rules
```

### Rule File Naming

Files follow the pattern: `[category]-[number]-[hyphenated-topic].md`

- Category 1: Reactivity
- Category 2: Components
- Category 3: Control Flow
- Category 4: State Management
- Category 5: Refs & DOM
- Category 6: Performance
- Category 7: Accessibility

## Solid.js vs React Mental Model

When helping users familiar with React, keep these differences in mind:

| React | Solid.js |
| ----- | -------- |
| Components re-render on state change | Components run once, signals update DOM directly |
| `useState` returns `[value, setter]` | `createSignal` returns `[getter, setter]` |
| `useMemo` with deps array | `createMemo` with automatic tracking |
| `useEffect` with deps array | `createEffect` with automatic tracking |
| Destructure props freely | Never destructure props |
| `{condition && <Component />}` | `<Show when={condition}><Component /></Show>` |
| `{items.map(item => ...)}` | `<For each={items}>{item => ...}</For>` |
| Context requires `useContext` hook | Context works with `useContext` or direct access |
