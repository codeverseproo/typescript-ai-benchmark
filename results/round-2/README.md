# Round 2 Results — Full Config Active

## Config Applied
- AGENTS.md (root)
- .claude/settings.json (PostToolUse hook)
- .cursor/rules/typescript.mdc

## Results

| Task | Agent | tsc errors | Type debt | Time (min) |
|------|-------|-----------|-----------|------------|
| T1 | Claude Code | 0 | 0 | 4.8 |
| T2 | Claude Code | 0 | 0* | 7.2 |
| T3 | Claude Code | 0 | 0 | 6.1 |
| T4 | Claude Code | 0 | 0 | 4.0 |
| T5 | Claude Code | 0 | 0 | 4.5 |
| T1 | Cursor Agent | 0 | 0 | 3.1 |
| T2 | Cursor Agent | 0 | 0* | 5.8 |
| T3 | Cursor Agent | 0 | 0 | 6.4 |
| T4 | Cursor Agent | 0 | 0 | 6.8 |
| T5 | Cursor Agent | 0 | 0 | 4.2 |
| T1 | Copilot | 0 | 0 | 5.1 |
| T2 | Copilot | 0 | 0* | 9.3 |
| T3 | Copilot | 3 | Low | 18.0 |
| T4 | Copilot | 0 | 0 | 3.2 |
| T5 | Copilot | N/A | Bug not found | N/A |

*T2 Prisma singleton: all agents used the correct globalThis
 pattern from /docs/prisma-singleton-pattern.md after
 AGENTS.md explicitly documented the workaround.
