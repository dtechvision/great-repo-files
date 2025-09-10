import { describe, expect, it } from "@effect/vitest"
import { FILE_MAPPINGS, REQUIRED_DEPENDENCIES } from "../src/FileConfig.js"

describe("FileConfig", () => {
  describe("FILE_MAPPINGS", () => {
    it("should have essential configuration files", () => {
      const localPaths = FILE_MAPPINGS.map((mapping) => mapping.localPath)

      expect(localPaths).toContain("eslint.config.js")
      expect(localPaths).toContain("tsconfig.json")
      expect(localPaths).toContain("CLAUDE.md")
      expect(localPaths).toContain(".cursor/rules/effect-typescript.json")
    })

    it("should have valid GitHub URLs for all files", () => {
      FILE_MAPPINGS.forEach((mapping) => {
        expect(mapping.githubPath).toMatch(
          /^https:\/\/raw\.githubusercontent\.com\/dtechvision\/great-repo-files\/master\//
        )
        expect(mapping.githubPath).toContain(mapping.localPath.replace(/\.\//g, ""))
      })
    })

    it("should categorize files correctly", () => {
      const categories = new Set(FILE_MAPPINGS.map((mapping) => mapping.category))
      expect(categories).toEqual(new Set(["config", "ai", "cursor", "linting"]))
    })

    it("should have descriptions for all files", () => {
      FILE_MAPPINGS.forEach((mapping) => {
        expect(mapping.description).toBeDefined()
        expect(mapping.description.length).toBeGreaterThan(0)
      })
    })

    it("should have at least one required file", () => {
      const requiredFiles = FILE_MAPPINGS.filter((mapping) => mapping.required)
      expect(requiredFiles.length).toBeGreaterThan(0)
    })
  })

  describe("REQUIRED_DEPENDENCIES", () => {
    it("should include essential ESLint dependencies", () => {
      expect(REQUIRED_DEPENDENCIES).toContain("@effect/eslint-plugin")
      expect(REQUIRED_DEPENDENCIES).toContain("eslint")
      expect(REQUIRED_DEPENDENCIES).toContain("typescript")
    })

    it("should have valid package names", () => {
      REQUIRED_DEPENDENCIES.forEach((dep) => {
        expect(dep).toMatch(/^[@a-z0-9-/]+$/)
        expect(dep.length).toBeGreaterThan(0)
      })
    })
  })
})
