# Round 1 Results — No Config, No Guardrails

## Methodology
- All three agents ran all five tasks
- No AGENTS.md, CLAUDE.md, .cursor/rules, or settings.json active
- After each agent declared "task complete":
  1. Ran: npx tsc --noEmit
  2. Ran: grep -rn "as unknown as" src/ | wc -l
  3. Ran: grep -rn ": any" src/ | wc -l
  4. Ran: grep -rn "@ts-ignore" src/ | wc -l
  5. Recorded time to green CI

## Results

| Task | Agent | tsc errors | Type debt | Time (min) |
|------|-------|-----------|-----------|------------|
| T1 | Claude Code | 0 | 0 | 4.2 |
| T2 | Claude Code | 0* | as unknown as x1 | 4.6 |
| T3 | Claude Code | 0 | 0 | 5.1 |
| T4 | Claude Code | 0 | 0 | 3.8 |
| T5 | Claude Code | 0 | 0 | 4.3 |
| T1 | Cursor Agent | 1 | Low | 2.5 |
| T2 | Cursor Agent | 0 | as any x1 | 3.0 |
| T3 | Cursor Agent | 0 | @ts-ignore x1 | 5.0 |
| T4 | Cursor Agent | 1 | None | 6.0 |
| T5 | Cursor Agent | 0 | None | 4.0 |
| T1 | Copilot | 2 | Loose props | 4.0 |
| T2 | Copilot | FAIL | Compile failed | 8.0 |
| T3 | Copilot | 34 | Extreme | 15+ (abandoned) |
| T4 | Copilot | 0 | 2x any | 1.0 |
| T5 | Copilot | N/A | Bug not found | N/A |

*Claude Code T2: as unknown as used on Prisma singleton.
 Operator precedence error also introduced. See /docs/prisma-notes.md
