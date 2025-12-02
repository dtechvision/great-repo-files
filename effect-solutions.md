# Effect Solutions Setup Guide

This repo follows the Effect Solutions recommendations to keep TypeScript, tooling, and editor diagnostics aligned with the Effect ecosystem. Keep this guide handy whenever you refresh the setup.

## 1. Dependencies

1. Add the runtime library:

```bash
bun add effect
```

2. Install the language service as a dev dependency so editors can surface Effect diagnostics:

```bash
bun add -d @effect/language-service
```

Do **not** install `@effect/schema`; it is deprecated as of Effect 3.10 and the language service will surface the proper alternatives.

## 2. TypeScript configuration

Ensure `tsconfig.json` includes the recommended compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "moduleDetection": "force",
    "verbatimModuleSyntax": true,
    "rewriteRelativeImportExtensions": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
    "noEmit": true,
    "plugins": [
      {
        "name": "@effect/language-service"
      }
    ]
  }
}
```

This config runs TypeScript in NodeNext mode with verbatim imports, strict safety, and the Effect language service plugin. Refer to `tsconfig.json` for the full settings that drive this repository.

## 3. Language service patch

1. After installing `@effect/language-service`, run:

```bash
bunx effect-language-service patch
```

2. Add the patch step to package scripts so it runs automatically after installs:

```json
"scripts": {
  "prepare": "effect-language-service patch",
  "typecheck": "tsc --noEmit"
}
```

The `typecheck` script can be used in CI or git hooks (`bun run typecheck`).

## 4. Effect Solutions CLI

Use these commands to discover curated guidance:

- `effect-solutions list` — view available topics
- `effect-solutions show project-setup` — language service + reference repo instructions
- `effect-solutions show tsconfig` — compiler recommendations

## 5. Local Effect reference

Clone the Effect source for quick inspection:

```bash
git clone https://github.com/Effect-TS/effect.git ~/.local/share/effect-solutions/effect
```

When the clone exists, grepping it from your AI agent (Claude, Gemini, etc.) gives you real implementation patterns and precise API insight when the docs are not enough.
