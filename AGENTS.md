# Full config: https://github.com/beyondit/typescript-ai-benchmark

# TypeScript Enforcement — Non-negotiables

## Why these rules exist
Production bugs from implicit `any` types are silent.
They don't fail CI. They fail in prod, at 2am.
Type assertions (`as unknown as X`) hide mismatches
the compiler would otherwise catch. We enforce strict
mode so the compiler catches them — not your on-call.

## Rules
- Never use `any`. Use `unknown` and narrow with type guards.
- Never use `as X` type assertions. Implement type guard functions.
- Never use `// @ts-ignore` or `// @ts-expect-error`.
- All async functions must have explicit return types.
- After every file change, run: npx tsc --noEmit --incremental
  If it exits non-zero — fix it before the next task.
  Do not simulate this check. Actually run it.
- When a type cannot be resolved — stop and ask.
  Do not assert your way out.
- For Prisma singleton under Next.js: cast globalThis, not
  the PrismaClient instance. See /docs/prisma-singleton-pattern.md
