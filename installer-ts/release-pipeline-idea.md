# Release Pipeline: A Practical Guide for Changesets + Bun Monorepos

This is a general, reproducible guide to a reliable package release system. It combines Changesets, Bun, and GitHub Actions with guardrails you can copy into most monorepos.

```mermaid
flowchart TD
    Dev[Dev writes code\n+ bunx changeset] --> PR[PR to main/master\nCI: lint/type/test\nchangeset status]
    PR -->|merge| DefaultBranch[default branch]
    DefaultBranch --> ReleaseJob[GitHub Action: release.yml]
    ReleaseJob --> ChangesetsAction[changesets/action@v1\nversion + publish]
    ChangesetsAction --> VersionCmd[bun run changeset-version\nchangeset version + scripts/version.mjs]
    ChangesetsAction --> PublishCmd[bun run changeset-publish\nbuild + test + changeset publish]
    PublishCmd --> Registry[publish to npm registry]
    ChangesetsAction -->|if pending| ReleasePR[Release PR\nbumped versions + changelog]
    ReleasePR -->|merge| DefaultBranch
```

## Why This Flow
- Intent stays human-authored: every change begins with a Changeset so semantic bumps and notes are explicit.
- CI forces hygiene: PRs must include a changeset and pass lint/type/test before merging.
- Publishing is safe: release job re-runs build and test before publish—no “version-only” deploys.
- Controlled dependency bumps: a custom patch tones down peer-driven major cascades to minor.
- Clear attribution: a custom patch keeps authorship simple (`@handle`) and avoids misattributing changelog entries.

## Stages
1) Authoring  
   - Run `bunx changeset`, pick packages, write the note. Creates `.changeset/*.md`.  
   - Commit and open a PR to your default branch (main/master).  

2) PR validation (`.github/workflows/pr-check.yml` + `.github/workflows/check.yml`)  
   - `pr-check.yml` installs deps, fetches the default branch, and runs `bunx changeset status`. Fails if no changeset for modified packages.  
   - `check.yml` runs `build`, `types`, `lint`, `test`. The build job asserts no generated source drift: `git diff-index --cached HEAD --exit-code packages/*/src`.  

3) Merge  
   - After CI passes, merge to the default branch. Nothing is published yet.  

4) Release automation (`.github/workflows/release.yml`)  
   - On each push to the default branch, `changesets/action@v1` runs.  
   - `version`: `bun run changeset-version` applies changesets, bumps versions, runs `scripts/version.mjs` (a hook).  
   - If releases are pending, a Release PR is opened/updated with version bumps + changelog (`@changesets/changelog-github` pointing at your repo).  
   - When the Release PR merges (or if no PR is needed), `publish` runs: `bun run changeset-publish` → `bun run build` → `TEST_DIST= bun run test` → `changeset publish` (requires `NPM_TOKEN`).  

5) Outputs  
   - Updated changelogs and versioned packages in the Release PR.  
   - Published artifacts to npm for all workspaces with `publishConfig` set.  

## Guardrails and Customizations
- Base branch: set to your default (`main`/`master`) in `.changeset/config.json`.  
- Internal bumps: `updateInternalDependencies: "patch"` keeps intra-repo bumps small.  
- `.github/changeset.yml`: `commitStatus: true`, `autoAdd: false` forces explicit changesets.  
- Custom Changesets patches live in `/patches` and are referenced via `bun.patches` in `package.json`.  
- Release job permissions: `contents`, `id-token`, and `pull-requests` for opening release PRs and publishing.  

## Operational Notes
- Dry run locally: `bun run build && TEST_DIST= bun run test && bunx changeset publish --no-git-tag --snapshot`.  
- Adding packages: include their `tsconfig.build.json` in references and set `publishConfig.directory` plus `files` globs.  
- Extend `scripts/version.mjs` for extra steps (docs, codegen, syncing examples).  

## What to Improve Next
- Pre-publish smoke test against a staging registry (npm `--dry-run` + install in an example app).  
- Auto-comment on PRs summarizing resulting version bumps and changelog snippets.  
- Track release metrics (time from merge to publish; release job failure rate).  

---

# Copy/Paste Setup (Templates)

Use these snippets as starting points; adjust branch names, org/repo, and package scopes to fit your project.

## package.json (release scripts and patches)
```json
{
  "scripts": {
    "changeset-version": "changeset version && node scripts/version.mjs",
    "changeset-publish": "bun run build && TEST_DIST= bun run test && changeset publish"
  },
  "bun": {
    "patches": {
      "@changesets/get-github-info@0.6.0": "patches/@changesets__get-github-info@0.6.0.patch",
      "@changesets/assemble-release-plan@6.0.5": "patches/@changesets__assemble-release-plan@6.0.5.patch"
    }
  }
}
```

## Changesets config
`.changeset/config.json`
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.2/schema.json",
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "your-org/your-repo" }
  ],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

`.github/changeset.yml` (CI status configuration)
```yaml
commitStatus: true
autoAdd: false
```

## CI: require a changeset on PRs
`.github/workflows/pr-check.yml`
```yaml
name: PR Check

on:
  pull_request:
    branches: [main]

jobs:
  changeset-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: git fetch origin main:main
      - run: bun install --frozen-lockfile
      - run: bunx changeset status
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## CI: quality gates (build/type/lint/test)
`.github/workflows/check.yml` (relevant excerpt)
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run build
      - run: git add packages/*/src && git diff-index --cached HEAD --exit-code packages/*/src

  types:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run check

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: bun run test
        env:
          NODE_OPTIONS: --max_old_space_size=8192
```

Composite setup action used above (`.github/actions/setup/action.yml`):
```yaml
name: Setup
runs:
  using: composite
  steps:
    - uses: oven-sh/setup-bun@v1
      with: { bun-version: latest }
    - uses: actions/setup-node@v4
      with: { node-version: 20.14.0 }
    - shell: bash
      run: bun install
```

## Release automation
`.github/workflows/release.yml`
```yaml
name: Release
on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          version: bun run changeset-version
          publish: bun run changeset-publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Release hook
`scripts/version.mjs` (runs after `changeset version`; extend as needed):
```js
/* global console */
console.log("✅ Version script completed");
```

## Custom Changesets patches
`patches/@changesets__assemble-release-plan@6.0.5.patch` (prevent peer-driven major cascades):
```diff
-            type = "major";
+            type = "minor";
```

`patches/@changesets__get-github-info@0.6.0.patch` (keep authorship simple and links plain):
```diff
-      user: user ? `[@${user.login}](${user.url})` : null
+      user: user ? `@${user.login}` : null
```

Wire these patches via the `bun.patches` block shown earlier.

## Contributor quickstart (reminder)
```
1) bunx changeset
2) git add . && git commit -m "add changeset" && git push
3) Open PR to main; CI enforces changeset + lint/type/test
4) Merge; release automation versions and publishes
```

## Minimal Setup Checklist
- Add the `package.json` scripts and `bun.patches` entries.  
- Copy `.changeset/config.json` and `.github/changeset.yml` (tweak repo/baseBranch).  
- Add workflows: `pr-check.yml`, `check.yml`, `release.yml`, plus `./.github/actions/setup`.  
- Add the two patch files under `patches/` (or drop the patch config if not needed).  
- Ensure packages declare `publishConfig.directory` and correct `files` globs.  
- Set secrets: `NPM_TOKEN` (publishing) and rely on GitHub’s provided `GITHUB_TOKEN`.  
