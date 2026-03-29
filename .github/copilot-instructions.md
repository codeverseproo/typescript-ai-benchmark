# Full config: https://github.com/beyondit/typescript-ai-benchmark

# TypeScript Enforcement — Non-negotiables

## Why these rules exist
Production bugs from implicit `any` types are silent.
They fail in prod, not CI. Type assertions hide mismatches
the compiler would otherwise catch. Enforce strict mode
so the compiler catches them — not your on-call engineer.

## Rules
- Never use `any`. Use `unknown` and narrow with type guards.
- Never use `as X` type assertions. Use type guard functions.
- Never suppress errors with `@ts-ignore` or `@ts-expect-error`.
- All async functions must have explicit return types.
- Run `tsc --noEmit` before marking any task complete.
  Do not simulate this check. Actually run it.
- When a type cannot be resolved — stop and ask.
