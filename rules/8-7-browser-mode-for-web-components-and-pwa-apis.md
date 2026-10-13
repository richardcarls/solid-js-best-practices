---
id: 8-7
title: Use Browser Mode for Browser-Dependent Behavior
category: Testing
priority: HIGH
version_basis: ["1.x"]
description: Use Vitest browser mode for layout, focus, browser storage, and custom-element behavior that jsdom cannot model faithfully
---

## Problem

jsdom supports many basic custom-element and shadow-DOM operations, including ordinary lifecycle
callbacks. It does not perform browser layout, and some platform APIs or edge cases differ from a
real browser. A test that verifies only DOM structure can use jsdom; a test whose result depends on
layout, focus timing, slot distribution, native storage, or actual pointer behavior needs browser
verification. The [jsdom web-platform-test status](https://github.com/jsdom/jsdom/blob/main/test/web-platform-tests/to-run.yaml)
documents remaining custom-element gaps.

## Choose the Environment by Behavior

| Behavior under test | Environment |
| --- | --- |
| Solid state updates and basic DOM structure | jsdom or browser |
| Basic custom-element registration and lifecycle | jsdom can be sufficient |
| Geometry, CSS cascade, focus navigation, or pointer interactions | Browser mode |
| IndexedDB transactions, `crypto.subtle`, or service workers | Browser mode |
| Slot assignment or custom-element timing that failed in jsdom | Browser mode |

Do not treat every custom-element test as a browser test. Conversely, a passing jsdom test does
not verify browser-specific behavior that jsdom does not implement.

## Example

```tsx
// In a browser-mode test project configured by rule 8-1.
import { userEvent } from "vitest/browser";
import { render } from "@solidjs/testing-library";
import "./wc-menu-define";

test("opens the menu with pointer input", async () => {
  render(() => <wc-menu />);

  const trigger = document.querySelector("wc-menu")?.shadowRoot?.querySelector("button");
  if (!trigger) throw new Error("Menu trigger was not rendered");

  await userEvent.click(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
});
```

Use `@testing-library/user-event` in jsdom tests. In Vitest browser mode, `userEvent` from
`vitest/browser` drives the provider's browser interaction path. The APIs resemble one another,
but they do not have identical event behavior.

When browser tests use persistent APIs such as IndexedDB or localStorage, isolate data between
tests as described in rule 8-9. Test a real browser behavior before adding a shim merely to make
the jsdom environment pass.

## Related Rules

- [8-1: Configure Vitest for Solid](8-1-configure-vitest-for-solid.md)
- [8-9: Browser-Native API Test Isolation](8-9-browser-native-api-test-isolation.md)
- [9-2: Handle slotchange After Slot Assignment](9-2-defer-slotchange-handlers.md)
