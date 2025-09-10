# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an **Effect CLI Application Template** - a TypeScript project built around the Effect functional programming library for creating command-line applications. The codebase follows strict functional programming patterns with comprehensive Effect integration.

## Essential Commands

### Development
```bash
# Run TypeScript files directly (primary development method)
bun ./path/to/file.ts

# Type checking
bun run check

# Linting (includes Effect-specific rules)
bun run lint
bun run lint-fix

# Testing (uses vitest via @effect/vitest)
bun run test
bun run coverage
```

### Build & Distribution
```bash
# Full build (tsup + package.json copy)
bun run build

# TypeScript build only
bun run build:ts

# Clean build artifacts
bun run clean
```

### Publishing
```bash
# Version management with changesets
bun run changeset-version

# Build and publish
bun run changeset-publish
```

## Architecture Overview

### Core Structure
- **Entry Point**: `src/bin.ts` - Executable with shebang, sets up Node.js runtime
- **CLI Logic**: `src/Cli.ts` - Command definitions using `@effect/cli/Command`
- **Tests**: `test/` directory using `@effect/vitest` patterns
- **Scripts**: `scripts/` for build utilities (e.g., `copy-package-json.ts`)

### Effect-First Design
This codebase is built entirely around the Effect library:
- All operations use `Effect.gen` for monadic composition
- Proper error handling through Effect's type system
- Resource management with automatic cleanup patterns
- CLI integration via `@effect/cli` and `@effect/platform-node`

### TypeScript Configuration
- **Modular Setup**: Uses project references (`tsconfig.src.json`, `tsconfig.test.json`, `tsconfig.scripts.json`)
- **Strict Configuration**: `exactOptionalPropertyTypes` enabled
- **Effect Integration**: Effect Language Service plugin configured
- **ES2022 Target**: NodeNext module resolution

## Testing Patterns

### Framework: @effect/vitest
```typescript
import { describe, expect, it } from "@effect/vitest"

describe("ModuleName", () => {
  it("should do something", () => {
    expect(true).toBe(true)
  })
})
```

**Key Testing Guidelines:**
- Use `@effect/vitest` for all tests, not regular vitest
- Test files in `/test/` directory with `*.test.ts` pattern
- Import `{ describe, expect, it }` from `@effect/vitest`

## Code Quality Standards

### ESLint Configuration
The project uses strict ESLint rules with Effect-specific plugins:
- **@effect/eslint-plugin** with dprint formatting
- **Consistent type imports** enforced
- **Array type syntax**: Generic format (`Array<T>`, not `T[]`)
- **Import organization**: First/newline-after-import/no-duplicates
- **Destructuring keys**: Must be sorted

### Code Style (via @effect/dprint)
- **Indentation**: 2 spaces
- **Line Width**: 120 characters
- **Semicolons**: ASI (Automatic Semicolon Insertion)
- **Quotes**: Always double quotes
- **Trailing Commas**: Never
- **Arrow Functions**: Force parentheses

### Functional Programming Patterns
- Use `Effect.gen` for composable operations
- Leverage Effect's error handling instead of try-catch
- Follow existing patterns in `src/Cli.ts` and `src/bin.ts`
- Use proper Effect constructors and combinators

## Development Workflow

### Running Code
Primary development uses Bun's native TypeScript execution:
```bash
bun ./src/bin.ts  # Run the CLI
bun ./test/SomeTest.ts  # Run individual test files
```

### Build Process
1. **tsup** bundles `src/bin.ts` as entry point with tree-shaking
2. Custom script copies sanitized `package.json` to `dist/`
3. Outputs CommonJS (`bin.cjs`) for Node.js compatibility

### Package Management
- **Bun**: Package manager and runtime (v1.1.34+)
- **Patches**: Applied via `patches/` directory
- **Dependencies**: All Effect libraries in devDependencies for template usage
- **Native TypeScript**: No need for tsx or ts-node

## Template Usage
This is designed as a reusable template for Effect-based CLI applications:
- Replace placeholder values in `package.json` (name, repository, etc.)
- Modify `src/Cli.ts` to define your CLI commands
- Add business logic while maintaining Effect patterns
- Use the established testing and build configuration

## VS Code Integration
Recommended extensions are configured:
- `effectful-tech.effect-vscode` - Effect language support
- `dbaeumer.vscode-eslint` - ESLint integration with auto-fix on save