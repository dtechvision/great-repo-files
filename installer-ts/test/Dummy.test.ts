import { describe, expect, it } from "@effect/vitest"
import { FILE_MAPPINGS } from "../src/FileConfig.js"

describe("Integration", () => {
  it("should have all required exports from main modules", () => {
    // Verify main exports are available
    expect(FILE_MAPPINGS).toBeDefined()
    expect(Array.isArray(FILE_MAPPINGS)).toBe(true)
    expect(FILE_MAPPINGS.length).toBeGreaterThan(0)
  })

  it("should have consistent file mappings structure", () => {
    FILE_MAPPINGS.forEach((mapping) => {
      expect(mapping).toHaveProperty("localPath")
      expect(mapping).toHaveProperty("githubPath")
      expect(mapping).toHaveProperty("description")
      expect(mapping).toHaveProperty("required")
      expect(mapping).toHaveProperty("category")

      expect(typeof mapping.localPath).toBe("string")
      expect(typeof mapping.githubPath).toBe("string")
      expect(typeof mapping.description).toBe("string")
      expect(typeof mapping.required).toBe("boolean")
      expect(typeof mapping.category).toBe("string")
    })
  })
})
