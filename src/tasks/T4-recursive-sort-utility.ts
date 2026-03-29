/**
 * TASK 4: Build a type-safe recursive sorting utility with nested key access
 *
 * Requirements:
 * - Create a `sortBy<T>` function that accepts:
 *     - an array of objects of type T
 *     - a dot-notation key path string (e.g. "user.profile.name")
 *     - a sort direction ("asc" | "desc")
 * - The key path must be type-safe: only valid paths on T should be accepted
 * - Use recursive `Paths<T>` template literal types — no `any`
 * - Must pass: npx tsc --noEmit
 *
 * Expected signature:
 *   function sortBy<T>(
 *     arr: T[],
 *     key: Paths<T>,
 *     direction: "asc" | "desc"
 *   ): T[]
 *
 * Known challenge: Recursive template literal types hit TypeScript's
 * instantiation depth limit at > 6 levels of nesting.
 * Cap the recursion depth at 4 with a depth counter generic.
 */

// ─── AGENT TASK: implement below this line ───────────────────────────────────

type Prev = [never, 0, 1, 2, 3];

export type Paths<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? K | `${K}.${Paths<T[K], Prev[D]>}`
        : K;
    }[keyof T & string]
  : never;

// Access deeply nested values safely
function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return current;
}

export function sortBy<T extends object>(
  arr: T[],
  key: Paths<T>,
  direction: "asc" | "desc"
): T[] {
  // Create a copy to avoid mutating the original array
  return [...arr].sort((a, b) => {
    const valA = getNestedValue(a, key as string);
    const valB = getNestedValue(b, key as string);

    // Handle string comparisons
    if (typeof valA === "string" && typeof valB === "string") {
      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    
    // Handle number comparisons
    if (typeof valA === "number" && typeof valB === "number") {
      return direction === "asc" ? valA - valB : valB - valA;
    }

    // Handle boolean comparisons
    if (typeof valA === "boolean" && typeof valB === "boolean") {
      const numA = valA ? 1 : 0;
      const numB = valB ? 1 : 0;
      return direction === "asc" ? numA - numB : numB - numA;
    }
    
    // Fallback for nulls/undefined and other types
    const strA = String(valA ?? "");
    const strB = String(valB ?? "");
    return direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}
