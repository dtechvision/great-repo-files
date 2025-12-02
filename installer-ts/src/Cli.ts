import * as Args from "@effect/cli/Args"
import * as Command from "@effect/cli/Command"
import * as Options from "@effect/cli/Options"
import * as Array from "effect/Array"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import { checkAndInstallDependencies } from "./DependencyInstaller.js"
import { FILE_MAPPINGS } from "./FileConfig.js"
import { installFiles } from "./FileInstaller.js"

const EFFECT_SOLUTIONS_FILE = "effect-solutions.md"

const forceOption = Options.boolean("force").pipe(
  Options.withAlias("f"),
  Options.withDescription("Overwrite existing files without prompting")
)

const dryRunOption = Options.boolean("dry-run").pipe(
  Options.withDescription("Show what would be installed without making changes")
)

const skipDepsOption = Options.boolean("skip-deps").pipe(
  Options.withDescription("Skip automatic dependency installation")
)

const skipEffectSolutionsOption = Options.boolean("skip-effect-solutions").pipe(
  Options.withDescription("Skip installing the Effect Solutions guide")
)

const categoryArgs = Args.text().pipe(
  Args.withDescription("Category of files to install (all|config|ai|cursor|linting)"),
  Args.withDefault("all")
)

const installCommand = Command.make("install", {
  force: forceOption,
  dryRun: dryRunOption,
  skipDeps: skipDepsOption,
  skipEffectSolutions: skipEffectSolutionsOption,
  category: categoryArgs
}).pipe(
  Command.withDescription("Install common TypeScript configuration files"),
  Command.withHandler(({ category, dryRun, force, skipDeps, skipEffectSolutions }) =>
    Effect.gen(function*() {
      const validCategories = ["all", "config", "ai", "cursor", "linting"] as const

      if (!validCategories.includes(category as any)) {
        return yield* Effect.fail(
          new Error(`Invalid category '${category}'. Valid options: ${validCategories.join(", ")}`)
        )
      }

      const filesToInstall = category === "all"
        ? FILE_MAPPINGS
        : Array.filter(FILE_MAPPINGS, (mapping) => mapping.category === category)

      const filteredFiles = skipEffectSolutions
        ? filesToInstall.filter((mapping) => mapping.localPath !== EFFECT_SOLUTIONS_FILE)
        : filesToInstall

      if (dryRun) {
        yield* Console.log("📋 Files that would be installed:")
        yield* Effect.forEach(filteredFiles, (mapping) =>
          Console.log(`  • ${mapping.localPath} - ${mapping.description}`))
        yield* Console.log(`\nTotal: ${filteredFiles.length} files`)

        if (!skipDeps) {
          yield* Console.log("\n📦 Dependencies would also be checked and installed if missing")
        }
        return
      }

      yield* installFiles(filteredFiles, force)

      if (!skipDeps) {
        yield* Console.log("\n" + "=".repeat(50))
        yield* checkAndInstallDependencies()
      }
    })
  )
)

const listCommand = Command.make("list").pipe(
  Command.withDescription("List all available files"),
  Command.withHandler(() =>
    Effect.gen(function*() {
      yield* Console.log("📁 Available configuration files:")
      yield* Effect.forEach(FILE_MAPPINGS, (mapping) =>
        Console.log(
          `  ${mapping.required ? "🔴" : "🔵"} ${mapping.localPath} (${mapping.category}) - ${mapping.description}`
        ))
      yield* Console.log("\n🔴 = Required files")
      yield* Console.log("🔵 = Optional files")
    })
  )
)

const mainCommand = Command.make("dtechify").pipe(
  Command.withSubcommands([installCommand, listCommand]),
  Command.withDescription("Instantly add essential TypeScript project configuration files")
)

export const run = Command.run(mainCommand, {
  name: "dtechify",
  version: "1.0.0"
})
