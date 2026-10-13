# Solid.js Best Practices - An Agent Skill

`solid-js-best-practices` enables comprehensive best practices for building Solid.js applications
and components. It is optimized for AI-assisted code generation, review, refactoring, and web
component integration.

The current rule examples are based on Solid 1.x. The skill checks the project's Solid major
before using them. Solid 2.x coverage is deferred until its official release. For pre-release
projects, consult the [official migration guide](https://v2.solidjs.com/migration/from-solid-1)
and documentation for the installed version. `version_basis` records which Solid major informed a
rule; it does not limit the rule's applicability.

## Features

- **71 actionable rules** organized into 9 categories
- **Priority levels** (CRITICAL, HIGH, MEDIUM, LOW) for focused code review
- **Before/after code examples** showing incorrect vs. correct patterns
- **Detailed explanations** of why each practice matters
- **Cross-references** between related rules

## Categories

| Category | Rules | Focus Area |
| -------- | ----- | ---------- |
| [Reactivity](rules/1-1-use-signals-correctly.md) | 7 | Signals, effects, memos, batching |
| [Components](rules/2-1-never-destructure-props.md) | 10 | Props, composition, children, return-once, custom element types |
| [Control Flow](rules/3-1-use-show-for-conditionals.md) | 7 | Show, For, Switch, Index, keyed stateful children |
| [State Management](rules/4-1-signals-vs-stores.md) | 7 | Stores, context, reconcile |
| [Refs & DOM](rules/5-1-use-refs-correctly.md) | 10 | Refs, lifecycle, directives, events, security, custom elements |
| [Performance](rules/6-1-avoid-unnecessary-tracking.md) | 6 | Lazy loading, Suspense, optimization, classList, web component bundles |
| [Accessibility](rules/7-1-semantic-html.md) | 4 | Semantic HTML, ARIA, keyboard |
| [Testing](rules/8-1-configure-vitest-for-solid.md) | 12 | Vitest setup, browser mode, async, routers, native API isolation |
| [Web Component Integration](rules/9-1-register-custom-elements-early.md) | 8 | Registration, slot timing, property bindings, thin wrappers |

## Installation

```bash
npx skills add richardcarls/solid-js-best-practices
```

## Usage

The skill activates for Solid.js work: components, reactivity bugs, tests, migrations from React,
and custom element integration.

## Web Component Guidance

Use declarative custom element APIs when they exist:

```tsx
<wc-select
  prop:value={selectedIds()}
  prop:options={options()}
  on:wc-select-change={(event) => setSelectedIds(event.detail.selectedValues)}
/>

<wc-dialog
  prop:open={open()}
  on:wc-dialog-toggle={(event) => setOpen(event.detail.open)}
/>
```

Wrappers should own labels, layout, type adaptation, and form-library integration. The custom
element should own default values, selection, slot timing, native fallback synchronization, focus
internals, and event payloads.

## For AI Agents

[SKILL.md](SKILL.md) contains version routing, the rule index, and task-based rule selection. See
[AGENTS.md](AGENTS.md) for contributor guidance and the
[version support plan](docs/version-support-plan.md) for the Solid 2.x audit.

## Example Prompts

```text
"Create a multiselect dropdown component"
"Help me fix accessibility issues"
"Refactor this Solid component to use fine-grained reactivity correctly"
"Integrate this <wc-select> custom element with a Solid form"
```

## Resources

- [Solid.js Documentation](https://docs.solidjs.com/)
- [Solid.js Tutorial](https://www.solidjs.com/tutorial)
- [eslint-plugin-solid](https://github.com/solidjs-community/eslint-plugin-solid)

## License

MIT
