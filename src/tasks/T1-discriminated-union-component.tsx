import React from "react";

/**
 * TASK 1: Scaffold a strict React UI component with discriminated unions
 *
 * Requirements:
 * - Create a <StatusBadge /> component
 * - Use a discriminated union for all possible states
 * - No `any`. No `as` assertions. No `@ts-ignore`.
 * - Must pass: npx tsc --noEmit
 *
 * Discriminated union shape:
 *   type BadgeState =
 *     | { status: "loading" }
 *     | { status: "success"; message: string }
 *     | { status: "error"; code: number; message: string }
 *     | { status: "idle" }
 */

// ─── AGENT TASK: implement below this line ───────────────────────────────────

export type BadgeState =
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; code: number; message: string }
  | { status: "idle" };

interface StatusBadgeProps {
  state: BadgeState;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ state }) => {
  switch (state.status) {
    case "loading":
      return <div className="badge loading">Loading...</div>;
    case "success":
      return <div className="badge success">{state.message}</div>;
    case "error":
      return <div className="badge error">Error {state.code}: {state.message}</div>;
    case "idle":
      return <div className="badge idle">Idle</div>;
    default: {
      // Exhaustiveness check
      const _exhaustiveCheck: never = state;
      return null;
    }
  }
};
