import { describe, expect, it } from "@effect/vitest"
import { createInstallationState } from "../src/InteractivePrompts.js"

describe("InteractivePrompts", () => {
  describe("createInstallationState", () => {
    it("should create initial state with false flags", () => {
      const state = createInstallationState()

      expect(state.overwriteAll).toBe(false)
      expect(state.skipAll).toBe(false)
    })
  })

  // Note: Testing the interactive prompt function would require mocking stdin/stdout
  // which is complex with the current implementation. In a real-world scenario,
  // we would refactor the prompt function to accept input/output streams
  // as parameters to make it more testable.
})
