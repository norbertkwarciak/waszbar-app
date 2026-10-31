# Project instructions

- After every code change, format all changed code files with Prettier before considering the change complete.
- Use the project's Prettier configuration (`.prettierrc.json`).
- After every code change, run the project linter (`pnpm lint`).

## Project structure

- Keep `src/core` for generic, reusable code that is not tied to a single page or business domain.
- Keep page-specific code inside that page's folder under `src/pages/<PageName>`.
- A page folder can contain `hooks`, `mutations`, `queries`, and `utils` subfolders for code used only by that page.

- Avoid nested ternary expressions; extract the branching logic into a clearly named function.
