export interface FileMapping {
  readonly localPath: string
  readonly githubPath: string
  readonly description: string
  readonly required: boolean
  readonly category: "config" | "ai" | "cursor" | "linting"
}

const GITHUB_BASE_URL = "https://raw.githubusercontent.com/dtechvision/great-repo-files/master"

export const FILE_MAPPINGS: ReadonlyArray<FileMapping> = [
  // Core configuration files
  {
    localPath: "eslint.config.js",
    githubPath: `${GITHUB_BASE_URL}/eslint.config.js`,
    description: "ESLint configuration with Effect.ts rules",
    required: true,
    category: "linting"
  },
  {
    localPath: "eslint-local-rules.cjs",
    githubPath: `${GITHUB_BASE_URL}/eslint-local-rules.cjs`,
    description: "Custom local ESLint rules",
    required: true,
    category: "linting"
  },
  {
    localPath: "eslint-local-rules-advanced.cjs",
    githubPath: `${GITHUB_BASE_URL}/eslint-local-rules-advanced.cjs`,
    description: "Advanced custom ESLint rules for Effect",
    required: true,
    category: "linting"
  },
  {
    localPath: "tsconfig.json",
    githubPath: `${GITHUB_BASE_URL}/tsconfig.json`,
    description: "TypeScript configuration",
    required: true,
    category: "config"
  },
  {
    localPath: "dprint.json",
    githubPath: `${GITHUB_BASE_URL}/dprint.json`,
    description: "Code formatting configuration",
    required: false,
    category: "config"
  },
  {
    localPath: ".prettierrc.json",
    githubPath: `${GITHUB_BASE_URL}/.prettierrc.json`,
    description: "Prettier configuration",
    required: false,
    category: "config"
  },
  {
    localPath: ".gitignore",
    githubPath: `${GITHUB_BASE_URL}/.gitignore`,
    description: "Git ignore patterns",
    required: false,
    category: "config"
  },

  // AI helper files
  {
    localPath: "CLAUDE.md",
    githubPath: `${GITHUB_BASE_URL}/CLAUDE.md`,
    description: "Claude AI assistant instructions",
    required: false,
    category: "ai"
  },
  {
    localPath: "AGENTS.md",
    githubPath: `${GITHUB_BASE_URL}/AGENTS.md`,
    description: "AGENTS AI assistant instructions",
    required: false,
    category: "ai"
  },
  {
    localPath: "effect-solutions.md",
    githubPath: `${GITHUB_BASE_URL}/effect-solutions.md`,
    description: "Effect Solutions CLI setup guide for language service and tsconfig",
    required: false,
    category: "ai"
  },
  {
    localPath: "GEMINI.md",
    githubPath: `${GITHUB_BASE_URL}/GEMINI.md`,
    description: "GEMINI AI assistant instructions",
    required: false,
    category: "ai"
  },

  // Cursor IDE rules
  {
    localPath: ".cursor/rules/api-routes.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/api-routes.json`,
    description: "Cursor rules for API routes",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/code-quality.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/code-quality.json`,
    description: "Cursor code quality rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/configuration-files.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/configuration-files.json`,
    description: "Cursor configuration file rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/data-access.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/data-access.json`,
    description: "Cursor data access rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/development-workflow.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/development-workflow.json`,
    description: "Cursor development workflow rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/documentation.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/documentation.json`,
    description: "Cursor documentation rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/effect-typescript.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/effect-typescript.json`,
    description: "Cursor Effect TypeScript rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/proto-files.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/proto-files.json`,
    description: "Cursor Protocol Buffer rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/react-components.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/react-components.json`,
    description: "Cursor React component rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/scratchpad.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/scratchpad.json`,
    description: "Cursor scratchpad rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/service-layer.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/service-layer.json`,
    description: "Cursor service layer rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/solidjs-components.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/solidjs-components.json`,
    description: "Cursor SolidJS component rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/specifications.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/specifications.json`,
    description: "Cursor specification rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/tailwind-ui.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/tailwind-ui.json`,
    description: "Cursor Tailwind UI rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/test-files.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/test-files.json`,
    description: "Cursor test file rules",
    required: false,
    category: "cursor"
  },
  {
    localPath: ".cursor/rules/utility-functions.json",
    githubPath: `${GITHUB_BASE_URL}/.cursor/rules/utility-functions.json`,
    description: "Cursor utility function rules",
    required: false,
    category: "cursor"
  }
]

export const REQUIRED_DEPENDENCIES = [
  "effect",
  "@effect/eslint-plugin",
  "@effect/dprint",
  "@effect/language-service",
  "@eslint/compat",
  "@eslint/eslintrc",
  "@typescript-eslint/parser",
  "eslint-plugin-codegen",
  "eslint-plugin-import",
  "eslint-plugin-simple-import-sort",
  "eslint-plugin-sort-destructure-keys",
  "eslint",
  "typescript"
] as const

export type RequiredDependency = typeof REQUIRED_DEPENDENCIES[number]
