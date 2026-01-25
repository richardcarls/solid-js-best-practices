# Solid.js Best Practices - An Agent Skill

An [Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) (for [Claude Code](https://claude.ai), but quietly becoming an industry standard), `solid-js-best-practices` enables the use of comprehensive best practices for building [Solid.js](https://www.solidjs.com/) applications and components. It is optimized for AI-assisted code generation, review, and refactoring.

> **NOTE** Generative AI was used to create this skill, with information published in the resources listed at the bottom of this README. The rules have been expanded and refined from there, based on performance being used in a personal project of mine.

## Features

- **32 actionable rules** organized into 7 categories
- **Priority levels** (CRITICAL, HIGH, MEDIUM, LOW) for focused code review
- **Before/after code examples** showing incorrect vs correct patterns
- **Detailed explanations** of why each practice matters
- **Cross-references** between related rules

### TODO

- [ ] Testing - writing integration and unit tests, test libraries, examples
- [ ] [SolidStart](https://start.solidjs.com/) - maybe not fully in scope, but add a short reference table or something?
- [ ] Libraries - list and summarize popular libraries, integration examples

## Categories

| Category | Rules | Focus Area |
| -------- | ----- | ---------- |
| [Reactivity](rules/1-1-use-signals-correctly.md) | 6 | Signals, effects, memos, batching |
| [Components](rules/2-1-never-destructure-props.md) | 5 | Props, composition, children |
| [Control Flow](rules/3-1-use-show-for-conditionals.md) | 5 | Show, For, Switch, Index |
| [State Management](rules/4-1-signals-vs-stores.md) | 5 | Stores, context, reconcile |
| [Refs & DOM](rules/5-1-use-refs-correctly.md) | 4 | Refs, lifecycle, directives |
| [Performance](rules/6-1-avoid-unnecessary-tracking.md) | 4 | Lazy loading, Suspense, optimization |
| [Accessibility](rules/7-1-semantic-html.md) | 3 | Semantic HTML, ARIA, keyboard |

## Installation

### Claude Code CLI

```bash
npx skills add richardcarls/solid-js-best-practices
```

### Manual Integration

1. Clone or download this repository
2. Reference [SKILL.md](SKILL.md) for quick rule lookup
3. Load specific rules from `rules/` directory as needed

## Usage

The skill automatically activates when Claude detects tasks involving Solid.js.

### Priority Levels

Rules are categorized by impact:

| Priority | Description | Action |
| -------- | ----------- | ------ |
| CRITICAL | Major performance or correctness issues | Fix immediately |
| HIGH | Significant impact on maintainability/performance | Address in current PR |
| MEDIUM | Best practice violations | Address when touching related code |
| LOW | Style preferences and micro-optimizations | Consider during refactoring |

### For AI Agents

Start with [AGENTS.md](AGENTS.md) for task-based rule selection:

- **Writing new components**: Load rules 1-1, 2-1, 2-2, 2-3, 3-1, 3-2, 5-3
- **Code review**: Focus on CRITICAL rules (1-1, 2-1) and HIGH priority
- **Performance optimization**: Load rules 1-2, 1-6, 4-2, 6-1, 6-2, 6-4
- **Accessibility audit**: Load rules 7-1, 7-2, 7-3

## Example Prompts

```text
"Create a multiselect dropdown component"
"Help me fix accessibility issues"
"Help me refactor my app to follow best practices"
```

## Contributing

Contributions are welcome! There is also a Fork button 😁.

## Resources

- [Solid.js Documentation](https://docs.solidjs.com/)
- [Solid.js Tutorial](https://www.solidjs.com/tutorial)

## License

MIT
