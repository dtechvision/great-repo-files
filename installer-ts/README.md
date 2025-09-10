# dTechify

Instantly add essential TypeScript project configuration files and AI helpers to any project.

## 🚀 Quick Start

Install configuration files in your project:

```bash
npx dtechify install
```

Or with Bun:

```bash
bunx dtechify install
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
npx dtechify install

# Install specific category of files
npx dtechify install config
npx dtechify install ai
npx dtechify install cursor
npx dtechify install linting
```

### Options

```bash
# Preview what would be installed (dry run)
npx dtechify install --dry-run

# Force overwrite existing files without prompting
npx dtechify install --force

# Skip automatic dependency installation
npx dtechify install --skip-deps

# Show all available files
npx dtechify list
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

