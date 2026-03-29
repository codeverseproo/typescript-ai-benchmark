# Full config: https://github.com/beyondit/typescript-ai-benchmark

# TypeScript Enforcement — Non-negotiables
- Never use `any`. Use `unknown` and narrow with type guards.
- Never use `as X` assertions. Implement type guard functions.
- Never use `// @ts-ignore` or `// @ts-expect-error`.
- All async functions must have explicit return types.
- After every file change, run: npx tsc --noEmit --incremental
  If it exits non-zero — fix it before the next task.
  Do not simulate this check. Actually run it.
