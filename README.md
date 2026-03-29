# typescript-ai-benchmark

> 3 AI agents. 5 TypeScript tasks. Benchmarked with `tsc --noEmit`.

Read the full article: [beyondit on Medium](https://medium.com/@beyondit)

---

## What This Is

A reproducible benchmark testing Claude Code, Cursor Agent, and
GitHub Copilot on 5 strict-mode TypeScript tasks — measured not
by unit test pass rate but by `tsc --noEmit` exit code.

**The finding:** All three agents introduce type debt by default.
The config files in this repo change that.

---

## Quick Start

```bash
git clone https://github.com/beyondit/typescript-ai-benchmark.git
cd typescript-ai-benchmark
npm install
npx tsc --noEmit   # should exit 0
```

---

## Repo Structure

```
/
├── AGENTS.md                          ← Universal config (Claude Code + Cursor)
├── CLAUDE.md                          ← Claude Code fallback
├── .github/
│   └── copilot-instructions.md        ← GitHub Copilot config
├── .claude/
│   └── settings.json                  ← Claude Code PostToolUse hook
├── .cursor/
│   └── rules/typescript.mdc           ← Cursor fallback
├── src/
│   ├── tasks/                         ← 5 benchmark task files
│   ├── legacy/                        ← Intentionally untyped JS (T3 source)
│   ├── lib/
│   │   ├── prisma.ts                  ← Correct Prisma singleton pattern
│   │   └── jobQueue.ts                ← Intentionally buggy (T5 source)
│   ├── components/                    ← T1 output goes here
│   └── api/                           ← T2, T3 output goes here
├── prisma/
│   └── schema.prisma
├── results/
│   ├── round-1/README.md              ← No config results
│   └── round-2/README.md              ← Full config results
├── docs/
│   └── prisma-singleton-pattern.md    ← The T2 workaround
├── tsconfig.json
└── package.json
```

---

## Running the Benchmark

### Pre-flight audit
```bash
echo "=== Type Escape Audit ===" && \
grep -rn "as unknown as" src/ | wc -l && \
grep -rn --include="*.ts" ": any" src/ | wc -l && \
grep -rn "@ts-ignore" src/ | wc -l
```

### Single app
```bash
npx tsc --noEmit --incremental
```

### Monorepo (project references)
```bash
npx tsc --build --noEmit
```

---

## The Config Files

| File | Agent | Purpose |
|------|-------|---------|
| `AGENTS.md` | Claude Code + Cursor | Universal — read from repo root |
| `.github/copilot-instructions.md` | GitHub Copilot | Same rules, Copilot format |
| `CLAUDE.md` | Claude Code | Fallback if not using AGENTS.md |
| `.claude/settings.json` | Claude Code | PostToolUse gate — can't be skipped |
| `.cursor/rules/typescript.mdc` | Cursor | Fallback if not using AGENTS.md |

---

## Results Summary

| Agent | Round 1 (no config) | Round 2 (config active) |
|-------|--------------------|-----------------------|
| Claude Code | 1 task with type debt | 0 debt (all 5 tasks) |
| Cursor Agent | 2 tasks with type debt | 0 debt (all 5 tasks) |
| GitHub Copilot | 3 tasks failed/debt | 1 task partial (T3) |

Full results: `/results/round-1/` and `/results/round-2/`

---

## Drop Your Numbers

Run the same 5 tasks. Post your results in Issues.
Especially if yours are worse than ours.

---

*Built by [beyondit](https://medium.com/@beyondit)*
