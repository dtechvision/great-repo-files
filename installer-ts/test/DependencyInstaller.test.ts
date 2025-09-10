import { describe, expect, it } from "@effect/vitest"
import { getMissingDependencies, type PackageJson } from "../src/DependencyInstaller.js"

describe("DependencyInstaller", () => {
  describe("getMissingDependencies", () => {
    it("should return all required dependencies when package.json is empty", () => {
      const packageJson: PackageJson = {}
      const missing = getMissingDependencies(packageJson)

      expect(missing.length).toBeGreaterThan(0)
      expect(missing).toContain("@effect/eslint-plugin")
      expect(missing).toContain("eslint")
      expect(missing).toContain("typescript")
    })

    it("should return empty array when all dependencies are present", () => {
      const packageJson: PackageJson = {
        devDependencies: {
          "@effect/eslint-plugin": "^0.3.2",
          "@eslint/compat": "1.1.1",
          "@eslint/eslintrc": "3.1.0",
          "@typescript-eslint/parser": "^8.4.0",
          "eslint-plugin-codegen": "0.28.0",
          "eslint-plugin-import": "^2.30.0",
          "eslint-plugin-simple-import-sort": "^12.1.1",
          "eslint-plugin-sort-destructure-keys": "^2.0.0",
          "eslint": "^9.10.0",
          "typescript": "^5.6.2"
        }
      }

      const missing = getMissingDependencies(packageJson)
      expect(missing).toEqual([])
    })

    it("should detect partially missing dependencies", () => {
      const packageJson: PackageJson = {
        devDependencies: {
          "eslint": "^9.10.0",
          "typescript": "^5.6.2"
        }
      }

      const missing = getMissingDependencies(packageJson)
      expect(missing.length).toBeGreaterThan(0)
      expect(missing).not.toContain("eslint")
      expect(missing).not.toContain("typescript")
      expect(missing).toContain("@effect/eslint-plugin")
    })

    it("should check both dependencies and devDependencies", () => {
      const packageJson: PackageJson = {
        dependencies: {
          "eslint": "^9.10.0"
        },
        devDependencies: {
          "typescript": "^5.6.2"
        }
      }

      const missing = getMissingDependencies(packageJson)
      expect(missing).not.toContain("eslint")
      expect(missing).not.toContain("typescript")
    })

    it("should handle undefined dependency sections", () => {
      const packageJson: PackageJson = {
        name: "test-project"
      }

      const missing = getMissingDependencies(packageJson)
      expect(missing.length).toBeGreaterThan(0)
    })
  })
})
