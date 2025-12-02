# dTechify

Instantly add essential TypeScript project configuration files and AI helpers to any project.

## 🚀 Quick Start

Install configuration files in your project (binary name is `dtechify`; package is `@dtechvision/make-repo-great`):

```bash
npx @dtechvision/make-repo-great dtechify install
```

Or with Bun:

```bash
bunx @dtechvision/make-repo-great dtechify install
```

## 📦 What Gets Installed

### Configuration Files
- `eslint.config.js` - ESLint configuration with Effect.ts rules
- `eslint-local-rules.cjs` - Custom local ESLint rules  
- `eslint-local-rules-advanced.cjs` - Advanced custom rules
- `tsconfig.json` - TypeScript configuration
- `dprint.json` - Code formatting configuration
- `.prettierrc.json` - Prettier configuration
- `.gitignore` - Git ignore patterns

### AI Helper Files
- `CLAUDE.md` - Claude AI assistant instructions
- `effect-solutions.md` - Effect Solutions CLI setup guide with language service, TypeScript configuration, and reference instructions

### Cursor IDE Rules
- `.cursor/rules/` - Complete set of Cursor IDE rules for:
  - API routes
  - Code quality
  - Configuration files
  - Data access
  - Development workflow
  - Documentation
  - Effect TypeScript
  - Protocol Buffers
  - React components
  - Scratchpad development
  - Service layer
  - SolidJS components
  - Specifications
  - Tailwind UI
  - Test files
  - Utility functions

### Dependencies
The following npm packages will be automatically installed as devDependencies:
- `@effect/eslint-plugin`
- `@eslint/compat`
- `@eslint/eslintrc`
- `@typescript-eslint/parser`
- `eslint-plugin-codegen`
- `eslint-plugin-import`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-sort-destructure-keys`
- `eslint`
- `typescript`

## 🛠️ Usage

### Basic Installation

```bash
# Install all configuration files
npx @dtechvision/make-repo-great dtechify install

# Install specific category of files
npx @dtechvision/make-repo-great dtechify install config
npx @dtechvision/make-repo-great dtechify install ai
npx @dtechvision/make-repo-great dtechify install cursor
npx @dtechvision/make-repo-great dtechify install linting
```

### Options

```bash
# Preview what would be installed (dry run)
npx @dtechvision/make-repo-great dtechify install --dry-run

# Force overwrite existing files without prompting
npx @dtechvision/make-repo-great dtechify install --force

# Skip automatic dependency installation
npx @dtechvision/make-repo-great dtechify install --skip-deps

# Show all available files
npx @dtechvision/make-repo-great dtechify list
```

### Additional Options

- `--skip-effect-solutions` - Install everything except the `effect-solutions.md` guide when running `dtechify install`.

## 🚢 Release
1) Update version in `installer-ts/package.json` (semantic versioning).
2) Ensure `NPM_TOKEN` is set in your environment (and in GitHub Actions secrets for automation).
3) From `installer-ts/`, install, lint, test, and build:
```bash
bun install
bun run lint
bun run test
bun run build
```
4) Publish to npm with Bun:
```bash
bun publish --access public --tag latest
```
5) Verify the package is live and the binary works:
```bash
bunx @dtechvision/make-repo-great dtechify --version
```

### Interactive Mode

When files already exist, you'll be prompted to choose what to do:

```
⚠️  File 'eslint.config.js' already exists
📋 ESLint configuration with Effect.ts rules

What would you like to do?
  [o] Overwrite this file
  [s] Skip this file
  [O] Overwrite ALL remaining files
  [S] Skip ALL remaining files
  [q] Quit installation
  
Your choice: 
```

## 🔧 Development

### Building

```bash
bun run build
```

### Testing

```bash
bun run test
```

### Type Checking

```bash
bun run check
```

### Linting

```bash
bun run lint
bun run lint-fix
```

## 📝 License

MIT
