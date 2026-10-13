# Solid Version Support Plan

The current rules came from Solid 1.x work. Each rule's `version_basis` field records the major
version whose examples were checked. A rule marked only `1.x` may still express a useful principle
for Solid 2.x, but its code is not yet verified for 2.x.

## Current state

| Major | Status | Guidance |
| --- | --- | --- |
| Solid 1.x | Rule examples based on 1.x work | Apply the indexed rules, then check project-specific library versions. |
| Solid 2.x prerelease | Coverage deferred until the official release | Check the installed version and the [official migration guide](https://v2.solidjs.com/migration/from-solid-1) before applying a 1.x example. |

## Solid 2.x follow-up after official release

Begin this work once Solid 2.x has an official stable release.

1. Pin that stable release and record its version. Use its official API and migration
   documentation as the source of truth.
1. Audit every rule's imports, JSX syntax, reactive ownership, control flow, state APIs, server
   behavior, testing setup, and integration assumptions against that release. Mark `2.x` in
   `version_basis` only after its examples and claims are checked against the target 2.x release.
1. For behavior shared by both majors, keep one rule with clearly labeled version variants where
   the syntax differs. For a genuinely 2.x-only concern, add a distinct rule and route 2.x readers
   to it from `SKILL.md`; retain stable IDs and links for existing 1.x rules.
1. Add a migration map of changed or removed APIs with a small before/after example and a source
   link for each change. Keep migration guidance separate from general best practices.
1. Compile representative examples in minimal 1.x and 2.x fixture projects. Exercise behavior
   claims in a browser when they depend on custom elements, layout, slots, or focus. Run
   `node scripts/check-skill.mjs` and Markdown lint after updating the index and counts.

The 2.x audit is complete when the skill can route by installed major, every example carries
accurate version basis metadata, migration entries cite the relevant official change, and both
fixture projects pass their compile and behavior checks.
