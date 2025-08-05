# Gude scripts and configs for Bun Typescript projects 

Typescript project .files to copy across projects.

Heavily inspired from great typescript repo setups such as 

- [Effect](https://github.com/Effect-TS)
- and more

used and deployed throughout our work at [our development boutique](https://dtech.vision)

## Why do it?

- Typesafety ensures LLMs get feedback loops
- Effect enhances this typesafety and provides us visibility via easy tracing
- Effect is the great standard library for Typescript
- To use Effect propery we need to guide the LLMs, we've setup these files to do that.
- We have to setup new repos for most of our projects, so aggregating into one makes sense.

# How to use

>**NOTE**: For the CLAUDE.md agent/llm instructions we recommend you start claude, then run the */init* command and append the CLAUDE.md from this repo to the one claude created for your codebase with the following append command
```bash
cat /path/to/dTech/CLAUDE.md >> CLAUDE.md
```
This way you get the setup instructions and file structure and project description from Claude as a good start while adding the greatness of these repo files. Best of both worlds and you can adjust CLAUDE's setup to adjust to your preference as well. Then

1) Copy over the project files you can see here for eslint, tsconfig, CLAUDE.md and others you see.
1) Install dev dependencies

Enjoy :) 

## Dev Dependencies

```
bun add -D dprint @effect/eslint-plugin @effect/language-service @effect/vitest @eslint/compat @eslint/eslintrc @eslint/js eslint eslint-import-resolver-typescript eslint-plugin-codegen eslint-plugin-import-x eslint-plugin-local-rules eslint-plugin-simple-import-sort eslint-plugin-sort-destructure-keys prettier vitest @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Claude.md

We'd recommend not importing the CLAUDE.md file instantly but running `claude` and inputting `/init` to have Claude describe the code structure and merge that right under the headline at the start of the Claude.md file.

By merging you ensure your project structure is honored while gaining the benefits of the CLAUDE.md file adapted (pnpm -> bun + removed JSDoc sections) from the great Effect team. ([Claude.md taken from effect-smol](https://github.com/Effect-TS/effect-smol/blob/main/CLAUDE.md)).
