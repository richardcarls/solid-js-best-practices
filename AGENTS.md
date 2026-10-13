# Solid.js Best Practices - Contributor Guide

> **For AI agents:** The primary skill content is in [SKILL.md](SKILL.md), which includes the rule
  index and task-based rule selection; the rule files carry examples and React comparisons.

This document is for contributors working on the skill itself.

## Skill File Structure

```text
solid-js-best-practices/
├── SKILL.md           # Primary skill file (start here)
├── AGENTS.md          # This file - contributor guidance
├── README.md          # Human documentation
├── CHANGELOG.md       # Version history
├── docs/              # Version audit plan
├── scripts/           # Structural checks
└── rules/             # Individual rule files
    ├── 1-*.md         # Reactivity rules
    ├── 2-*.md         # Component rules
    ├── 3-*.md         # Control flow rules
    ├── 4-*.md         # State management rules
    ├── 5-*.md         # Refs & DOM rules
    ├── 6-*.md         # Performance rules
    ├── 7-*.md         # Accessibility rules
    ├── 8-*.md         # Testing rules
    └── 9-*.md         # Web component integration rules
```

## Rule Categories

- Category 1: Reactivity
- Category 2: Components
- Category 3: Control Flow
- Category 4: State Management
- Category 5: Refs & DOM
- Category 6: Performance
- Category 7: Accessibility
- Category 8: Testing
- Category 9: Web Component Integration

## Rule File Naming

Files follow the pattern `[category]-[number]-[hyphenated-topic].md`.

## Rule File Structure

Each rule file should contain:

1. YAML frontmatter with title, category, priority, and `version_basis`; add a description when useful.
1. Problem section explaining what goes wrong.
1. Incorrect code examples.
1. Correct code examples.
1. Why-it-matters guidance.
1. Related rules with cross-references.

Examples should stay generic and publishable. Use hypothetical `<wc-*>` custom elements or native
platform elements, not project-local components.

`version_basis` lists Solid majors that informed the rule. The current examples came from 1.x work.
Defer the Solid 2.x audit until an official release is available.
Do not mark a rule as based on 2.x merely because its principle appears version-neutral; check the
example's imports, JSX syntax, and runtime behavior against the targeted 2.x release first. Keep
existing rule IDs and links stable when adding version-specific guidance.

Run `node scripts/check-skill.mjs` after editing rules, indexes, counts, or links. It checks the
version metadata, category counts, index coverage, and local links.
