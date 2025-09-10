import * as NodeFileSystem from "@effect/platform-node/NodeFileSystem"
import * as FileSystem from "@effect/platform/FileSystem"
import * as child_process from "child_process"
import { Console, Effect } from "effect"
import { REQUIRED_DEPENDENCIES } from "./FileConfig.js"

export interface PackageJson {
  readonly name?: string
  readonly devDependencies?: Record<string, string>
  readonly dependencies?: Record<string, string>
}

export const readPackageJson = (): Effect.Effect<PackageJson, Error> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const exists = yield* fs.exists("package.json")

    if (!exists) {
      return {}
    }

    const content = yield* fs.readFileString("package.json")

    try {
      return JSON.parse(content) as PackageJson
    } catch (error) {
      return yield* Effect.fail(
        new Error(`Failed to parse package.json: ${error}`)
      )
    }
  }).pipe(Effect.provide(NodeFileSystem.layer))

export const detectPackageManager = (): Effect.Effect<"npm" | "yarn" | "pnpm" | "bun", Error> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    const [bunExists, pnpmExists, yarnExists] = yield* Effect.all([
      fs.exists("bun.lockb"),
      fs.exists("pnpm-lock.yaml"),
      fs.exists("yarn.lock")
    ])

    if (bunExists) return "bun"
    if (pnpmExists) return "pnpm"
    if (yarnExists) return "yarn"
    return "npm"
  }).pipe(Effect.provide(NodeFileSystem.layer))

export const getMissingDependencies = (packageJson: PackageJson): Array<string> => {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }

  return REQUIRED_DEPENDENCIES.filter((dep) => !(dep in allDeps))
}

export const installDependencies = (
  dependencies: Array<string>,
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
): Effect.Effect<void, Error> =>
  Effect.gen(function*() {
    if (dependencies.length === 0) {
      yield* Console.log("✅ All required dependencies are already installed")
      return
    }

    yield* Console.log(`📦 Installing ${dependencies.length} missing dependencies with ${packageManager}...`)
    yield* Console.log(`   Dependencies: ${dependencies.join(", ")}`)

    const command = getInstallCommand(packageManager, dependencies)

    yield* Console.log(`💻 Running: ${command.join(" ")}`)

    const result = yield* Effect.promise(() => {
      return new Promise<number>((resolve, reject) => {
        const child = child_process.spawn(command[0], command.slice(1), {
          stdio: "inherit",
          shell: true
        })

        child.on("close", (code: number | null) => {
          resolve(code ?? 1)
        })

        child.on("error", (error: Error) => {
          reject(error)
        })
      })
    })

    if (result !== 0) {
      yield* Console.log(`❌ Dependency installation failed with exit code: ${result}`)
      yield* Console.log(`   Command: ${command.join(" ")}`)
      yield* Console.log(`   Please try running the command manually or check your package manager setup.`)
      return yield* Effect.fail(
        new Error(`Failed to install dependencies. Exit code: ${result}`)
      )
    }

    yield* Console.log("✅ Dependencies installed successfully!")
  })

const getInstallCommand = (
  packageManager: "npm" | "yarn" | "pnpm" | "bun",
  dependencies: Array<string>
): Array<string> => {
  switch (packageManager) {
    case "npm":
      return ["npm", "install", "--save-dev", ...dependencies]
    case "yarn":
      return ["yarn", "add", "--dev", ...dependencies]
    case "pnpm":
      return ["pnpm", "add", "-D", ...dependencies]
    case "bun":
      return ["bun", "add", "--dev", ...dependencies]
  }
}

export const checkAndInstallDependencies = (): Effect.Effect<void, Error> =>
  Effect.gen(function*() {
    yield* Console.log("🔍 Checking for required dependencies...")

    const packageJson = yield* readPackageJson()
    const missingDeps = getMissingDependencies(packageJson)

    if (missingDeps.length === 0) {
      yield* Console.log("✅ All required dependencies are already installed")
      return
    }

    const packageManager = yield* detectPackageManager()
    yield* Console.log(`📦 Detected package manager: ${packageManager}`)

    yield* installDependencies(missingDeps, packageManager)
  })
