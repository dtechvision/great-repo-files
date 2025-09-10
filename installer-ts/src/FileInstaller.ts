import * as NodeFileSystem from "@effect/platform-node/NodeFileSystem"
import * as NodeHttp from "@effect/platform-node/NodeHttpClient"
import * as FileSystem from "@effect/platform/FileSystem"
import * as Path from "@effect/platform/Path"
import { Console, Effect, Ref } from "effect"
import type { FileMapping } from "./FileConfig.js"
import { downloadFileWithRetry } from "./HttpClient.js"
import { createInstallationState, type InstallationState, promptForFileConflict } from "./InteractivePrompts.js"

export const createDirectoryIfNeeded = (filePath: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const dir = path.dirname(filePath)

    const exists = yield* fs.exists(dir)
    if (!exists) {
      yield* fs.makeDirectory(dir, { recursive: true })
      yield* Console.log(`Created directory: ${dir}`)
    }
  })

export const fileExists = (filePath: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(filePath)
  })

export const writeFile = (filePath: string, content: string) =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    yield* createDirectoryIfNeeded(filePath)
    yield* fs.writeFileString(filePath, content)
    yield* Console.log(`✓ Installed: ${filePath}`)
  })

export const installFile = (
  mapping: FileMapping,
  stateRef: Ref.Ref<InstallationState>,
  force = false
) =>
  Effect.gen(function*() {
    const exists = yield* fileExists(mapping.localPath)
    const state = yield* Ref.get(stateRef)

    if (exists && !force) {
      if (state.skipAll) {
        yield* Console.log(`⚠ Skipping ${mapping.localPath} (skip all selected)`)
        return
      }

      if (state.overwriteAll) {
        yield* Console.log(`📝 Overwriting ${mapping.localPath} (overwrite all selected)`)
      } else {
        const prompt = yield* promptForFileConflict(mapping.localPath, mapping.description)

        switch (prompt.action) {
          case "skip":
            yield* Console.log(`⚠ Skipping ${mapping.localPath}`)
            return
          case "skip_all":
            yield* Ref.update(stateRef, (s) => ({ ...s, skipAll: true }))
            yield* Console.log(`⚠ Skipping ${mapping.localPath} (and all remaining)`)
            return
          case "overwrite":
            yield* Console.log(`📝 Overwriting ${mapping.localPath}`)
            break
          case "overwrite_all":
            yield* Ref.update(stateRef, (s) => ({ ...s, overwriteAll: true }))
            yield* Console.log(`📝 Overwriting ${mapping.localPath} (and all remaining)`)
            break
        }
      }
    }

    yield* Console.log(`⬇️  Downloading: ${mapping.description}`)

    const result = yield* downloadFileWithRetry(mapping.githubPath).pipe(
      Effect.catchAll((error) =>
        Effect.gen(function*() {
          yield* Console.log(`❌ Failed to download ${mapping.localPath}: ${error.message}`)
          yield* Console.log(`   URL: ${mapping.githubPath}`)
          yield* Console.log(`   This might be due to network issues or the file being moved.`)
          return yield* Effect.fail(error)
        })
      )
    )

    yield* writeFile(mapping.localPath, result.content).pipe(
      Effect.catchAll((error) =>
        Effect.gen(function*() {
          yield* Console.log(`❌ Failed to write ${mapping.localPath}: ${error.message}`)
          yield* Console.log(`   Please check file permissions and disk space.`)
          return yield* Effect.fail(error)
        })
      )
    )
  }).pipe(
    Effect.provide(NodeFileSystem.layer),
    Effect.provide(NodeHttp.layerUndici)
  )

export const installFiles = (
  mappings: ReadonlyArray<FileMapping>,
  force = false
) =>
  Effect.gen(function*() {
    const stateRef = yield* Ref.make(createInstallationState())

    yield* Console.log(`🚀 Installing ${mappings.length} files...`)

    let successCount = 0
    let failureCount = 0

    // Process files sequentially to handle interactive prompts properly
    yield* Effect.forEach(mappings, (mapping) =>
      installFile(mapping, stateRef, force).pipe(
        Effect.map(() => {
          successCount++
        }),
        Effect.catchAll((_error) =>
          Effect.gen(function*() {
            failureCount++
            yield* Console.log(`⚠️  Continuing with remaining files...`)
            // Continue with other files instead of failing completely
          })
        )
      ), {
      concurrency: 1
    })

    if (failureCount > 0) {
      yield* Console.log(`⚠️  Installation completed with issues: ${successCount} succeeded, ${failureCount} failed`)
      if (successCount === 0) {
        return yield* Effect.fail(new Error("All file installations failed"))
      }
    } else {
      yield* Console.log("✅ Installation complete!")
    }
  })
