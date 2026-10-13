---
id: 8-1
title: Configure Vitest for Solid
category: Testing
priority: CRITICAL
version_basis: ["1.x"]
description: Compile Solid JSX and resolve the browser build when testing Solid 1.x components
---

## Problem

Solid component tests need the Solid Vite plugin to compile JSX and the browser export of
`solid-js` when running in jsdom. A configuration that resolves the server build can render
static output while effects and DOM updates fail. The
[Solid testing guide](https://docs.solidjs.com/guides/testing) recommends the plugin and
`resolve.conditions: ["development", "browser"]` for Solid 1.x.

## Correct: Vitest 5 and Solid 1.x

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: { conditions: ["development", "browser"] },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.unit.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

Install matching versions of `vitest`, `vite`, `vite-plugin-solid`, `solid-js`,
`@solidjs/testing-library`, `jsdom`, and `@testing-library/jest-dom`. Add
`@vitest/browser-playwright` for the browser project. Vitest 5 requires Node.js 22.12 or newer and
Vite 6.4 or newer; use the [Vitest browser-mode guide](https://vitest.dev/guide/browser/) for the
current provider setup. If a project only needs jsdom, use a single `test` configuration with the
unit project's options and omit the browser project.

The file globs must be disjoint so each test runs once. Browser mode uses a real browser for web
components, layout, and native APIs that jsdom does not model well. In CI, `headless: true` avoids
opening a browser window.

## Older Vitest Projects

Vitest 1–3 used a separate `vitest.workspace.ts` and a string browser provider. Vitest 4 replaced
the workspace file with `test.projects` and requires a provider object. It also renamed
`deps.optimizer.web` to `deps.optimizer.client`. Do not copy those older settings into a Vitest 4
or 5 project; consult the [Vitest migration guide](https://vitest.dev/guide/migration.html) for
the installed major. Dependency optimization is optional and should be added for a measured
resolution or startup problem, not as a prerequisite for Solid reactivity.

## Verification

Test an actual update, not only initial markup:

```tsx
import { createSignal } from "solid-js";
import { fireEvent, render } from "@solidjs/testing-library";
import { expect, test } from "vitest";

function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount((n) => n + 1)}>{count()}</button>;
}

test("updates after a click", () => {
  const { getByRole } = render(() => <Counter />);
  fireEvent.click(getByRole("button"));
  expect(getByRole("button")).toHaveTextContent("1");
});
```

If the update fails, inspect the resolved Solid export condition and JSX transform before
changing component code.

## Related Rules

- [8-2: Wrap Render in Arrow Functions](8-2-wrap-render-in-arrow.md)
- [8-3: Test Primitives in a Root](8-3-test-primitives-in-root.md)
- [8-7: Browser Mode for Web Components and PWA APIs](8-7-browser-mode-for-web-components-and-pwa-apis.md)
