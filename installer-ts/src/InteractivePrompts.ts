import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as readline from "readline"

export interface PromptResult {
  readonly action: "overwrite" | "skip" | "overwrite_all" | "skip_all"
}

const createInterface = Effect.sync(() =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
)

const question = (rl: any, query: string): Effect.Effect<string, Error> =>
  Effect.async<string, Error>((resume) => {
    rl.question(query, (answer: string) => {
      resume(Effect.succeed(answer))
    })
  })

export const promptForFileConflict = (
  filePath: string,
  description: string
): Effect.Effect<PromptResult, Error> =>
  Effect.gen(function*() {
    const rl = yield* createInterface

    yield* Console.log(`\n⚠️  File '${filePath}' already exists`)
    yield* Console.log(`📋 ${description}`)

    const answer = yield* question(
      rl,
      `
What would you like to do?
  [o] Overwrite this file
  [s] Skip this file
  [O] Overwrite ALL remaining files
  [S] Skip ALL remaining files
  [q] Quit installation
  
Your choice: `
    )

    rl.close()

    const trimmedAnswer = answer.trim()

    switch (trimmedAnswer) {
      case "o":
      case "overwrite":
        return { action: "overwrite" as const }
      case "s":
      case "skip":
        return { action: "skip" as const }
      case "O":
      case "overwrite all":
        return { action: "overwrite_all" as const }
      case "S":
      case "skip all":
        return { action: "skip_all" as const }
      case "q":
      case "Q":
      case "quit":
        return yield* Effect.fail(new Error("Installation cancelled by user"))
      default:
        yield* Console.log(`Invalid option '${answer}'. Please choose o, s, O, S, or q.`)
        return yield* promptForFileConflict(filePath, description)
    }
  }).pipe(
    Effect.catchAll((error) =>
      Effect.gen(function*() {
        yield* Console.log(`\nError reading input: ${error.message}`)
        return yield* Effect.fail(new Error("Failed to read user input"))
      })
    )
  )

export interface InstallationState {
  overwriteAll: boolean
  skipAll: boolean
}

export const createInstallationState = (): InstallationState => ({
  overwriteAll: false,
  skipAll: false
})
