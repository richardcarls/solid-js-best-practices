# Changelog

All notable changes to this skill will be documented in this file.

## [1.2.0] - Testing category

### Added

- New category 8: Testing, with 6 rules (8-1 through 8-6)
  - 8-1: Configure Vitest for Solid (CRITICAL) - Vitest config with resolve conditions, plugin, deps
  - 8-2: Wrap Render in Arrow Functions (CRITICAL) - `render(() => <C />)` not `render(<C />)`
  - 8-3: Test Primitives in a Root (HIGH) - `createRoot`/`renderHook` for reactive ownership
  - 8-4: Handle Async in Tests (HIGH) - `findBy` queries, fake timer config, portal queries
  - 8-5: Use Accessible Queries (MEDIUM) - Role/label query priority over test IDs
  - 8-6: Separate Logic from UI Tests (MEDIUM) - `renderHook`/`renderDirective` for isolated testing
- "Writing Tests" task-based rule selection in SKILL.md
- 3 testing-related entries in Common Mistakes table

### Changed

- Rule count updated from 32 to 38, categories from 7 to 8
- Updated SKILL.md frontmatter description
- Updated README.md features, categories table, and TODO checklist
- Updated AGENTS.md file structure and category list

## [1.1.0] - Skill structure improvements

### Changed

- Fixed SKILL.md frontmatter to use only valid Claude Code fields (`name`, `description`, `allowed-tools`)
- Expanded description with discovery-relevant phrases for better skill activation
- Capitalized tool names to match Claude Code identifiers (`Read`, `Grep`, `Glob`)
- Merged task-based rule selection, common mistakes table, and React comparison from AGENTS.md into SKILL.md
- Trimmed AGENTS.md to contributor-focused content only
- Added YAML frontmatter (id, title, category, priority, description) to all 32 rule files
- Updated README.md to reflect new file structure

### Removed

- Removed invalid frontmatter fields (`trigger_phrases`, `requirements`, `keywords`, `license`, `author`, `version`)
- Removed inline `# Title` and `**Priority:** X` lines from rule files (now in frontmatter)
- Deleted `rules/index.json` (metadata now lives in each rule file's frontmatter)
- Deleted `metadata.json` (duplicated frontmatter)
- Deleted `examples.md` (trivial duplicates of rule file content)
- Deleted `reference.md` (stub with placeholder text)
- Deleted empty `scripts/` directory
- Deleted empty `.github/` directory

## [1.0.0] - Initial release

- Initial set of 32 rules and documentation
