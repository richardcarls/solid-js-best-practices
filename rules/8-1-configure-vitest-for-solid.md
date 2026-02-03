---
id: 8-1
title: Configure Vitest for Solid
category: Testing
priority: CRITICAL
description: Configure Vitest with Solid-specific resolve conditions and plugin settings
---

## Problem

Vitest does not understand Solid's compilation model out of the box. Without the correct `resolve.conditions`, `vite-plugin-solid`, jsdom environment, and dependency optimization settings, tests silently import the server or production build of Solid instead of the development/browser build. This causes effects to never run, reactivity to break, and hydration-mode behavior in what should be client-side tests -- all with no error message.

## Incorrect

```ts
// vitest.config.ts
// ❌ WRONG: Missing Solid-specific configuration
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
// Tests run but signals don't track, effects never fire,
// components render static HTML with no reactivity
```

```ts
// vitest.config.ts
// ❌ WRONG: Has plugin but missing resolve conditions
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
  },
  // Missing resolve.conditions -- wrong module build imported
});
```

## Correct

```ts
// vitest.config.ts
// ✅ CORRECT: Full Solid-specific Vitest configuration
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    conditions: ["development", "browser"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    deps: {
      optimizer: {
        web: {
          include: ["solid-js", "solid-testing-library"],
        },
      },
    },
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
```

### Setup File

```ts
// vitest.setup.ts
// ✅ CORRECT: Import DOM matchers globally
import "@testing-library/jest-dom";
```

### Required Dependencies

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0",
    "vite-plugin-solid": "^2.0.0",
    "@solidjs/testing-library": "^0.8.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

### SolidStart Projects

```ts
// vitest.config.ts
// ✅ CORRECT: SolidStart uses its own Vite plugin
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    conditions: ["development", "browser"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    deps: {
      optimizer: {
        web: {
          include: ["solid-js", "@solidjs/router"],
        },
      },
    },
  },
});
```

## Symptom Diagnosis

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Effects never fire | Missing `resolve.conditions` | Add `['development', 'browser']` |
| `createSignal` updates don't reach DOM | Wrong Solid build (server) | Add `vite-plugin-solid` and conditions |
| `document is not defined` | Missing jsdom environment | Add `environment: 'jsdom'` |
| Module resolution errors for solid-js | Missing deps optimizer | Add `solid-js` to `deps.optimizer.web.include` |
| `toBeInTheDocument` not found | Missing setup file | Create `vitest.setup.ts` with jest-dom import |
| TypeScript errors in test files | Missing globals config | Add `globals: true` or import from `vitest` |

## Why It Matters

1. **Silent Failures**: The wrong Solid build causes tests to pass with broken reactivity -- you're testing static HTML, not a reactive app.

2. **Effects and Memos**: The development/browser build is required for `createEffect` and `createMemo` to register reactive tracking.

3. **Root Cause Confusion**: Configuration bugs look like component bugs. Developers waste hours debugging "broken" components when the test setup is at fault.

4. **CI Reliability**: Tests that pass locally but use the wrong build produce meaningless coverage and green CI pipelines that miss real bugs.

## Related Rules

- [8-2: Wrap Render in Arrow Functions](8-2-wrap-render-in-arrow.md) - Correct config is a prerequisite for reactive rendering
- [8-3: Test Primitives in a Root](8-3-test-primitives-in-root.md) - Effects need both config and reactive owners
