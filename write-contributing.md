⏺ Based on the CONTRIBUTING.md files, here's how they achieve effective documentation and how to write excellent concise contributing guides:

  What Makes These CONTRIBUTING.md Files Effective

  Structural Precision

  - Clear hierarchy: Root → packages → specific implementations
  - Dependencies mapping: types → sdk → framework packages
  - File structure mirrors workflow: Where you work depends on what you're changing

  Process-Oriented Instructions

  - Decision trees: "Do you have an updated OAS file? Yes/No" with clear paths
  - Command specificity: bun run oas-types, bun run lint - no ambiguity
  - Validation steps: "run existing tests to ensure you have not broke any types"

  How to Write Excellent Concise CONTRIBUTING.md Files (German Engineer Approach)

  1. Systemarchitektur First

  # CONTRIBUTING

  ## Architecture Overview
  - Package A → Package B → Package C (dependency flow)
  - Where you work = what you're changing

  2. Decision-Driven Structure

  ## What are you doing?
  - Adding API endpoint? → packages/types
  - Core function? → packages/sdk
  - UI component? → packages/react

  3. Executable Instructions

  - Every instruction must be a runnable command
  - No "maybe" or "consider" - only definitive steps
  - Include validation: "Run X to verify Y works"

  4. Failure Prevention

  - Explicit warnings: "NOTICE you will need to adjust..."
  - Test requirements: "Please add tests for..."
  - Common pitfalls: "Make sure there are no type strictness regressions"

  5. German Engineering Principles

  - Präzision: One correct way to do each task
  - Effizienz: Minimal words, maximum clarity
  - Systematik: Logical flow from decision to execution
  - Qualitätskontrolle: Built-in validation at each step

  Template Structure:

  # CONTRIBUTING

  ## System Overview
  [Architecture diagram in text]

  ## Decision Matrix
  What → Where → How

  ## Processes
  ### Task A
  1. Command
  2. Validation
  3. Next step

  ### Task B
  [Same structure]

  ## Quality Gates
  - Lint: `command`
  - Test: `command`
  - Build: `command`

  The key is no waste, maximum precision, systematic workflow.
