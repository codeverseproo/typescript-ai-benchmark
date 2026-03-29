# The Prisma Singleton Pattern Under Strict TypeScript

## The Problem

Next.js hot-reloading creates multiple PrismaClient instances
in development. The naive fix — `as unknown as` or `as any` —
introduces type errors or silently corrupts the type system.

## The Wrong Pattern (what agents reach for)

```typescript
// ❌ WRONG — operator precedence error
// `as` binds tighter than `||`
// prisma ends up typed as PrismaClient | { prisma: PrismaClient }
const prisma = globalForPrisma.prisma
  || new PrismaClient() as unknown as { prisma: PrismaClient };
```

## The Correct Pattern

```typescript
// ✅ CORRECT — cast globalThis, not the PrismaClient instance
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

## Why This Works

- `globalThis` is typed as `typeof globalThis` — casting it to an
  object shape is a one-time, contained escape hatch
- The PrismaClient instance itself is never cast — it retains
  full type information
- `prisma` is correctly inferred as `PrismaClient` (not a union)
- All downstream call sites get full type checking

## Add This to AGENTS.md

Add this rule to prevent agents from reaching for the wrong fix:

```
- For Prisma singleton under Next.js: cast globalThis, not
  the PrismaClient instance. See /docs/prisma-singleton-pattern.md
```
