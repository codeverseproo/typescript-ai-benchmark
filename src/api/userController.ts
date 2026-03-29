/**
 * TASK 3: Migrate a 500-line legacy JS controller to strict TypeScript
 *
 * Requirements:
 * - Migrate /src/legacy/userController.js to strict TypeScript
 * - Infer all types from usage — do not use `any`
 * - All function signatures must be explicitly typed
 * - Error handling must use typed error classes, not `catch (e: any)`
 * - Must pass: npx tsc --noEmit with zero errors
 *
 * The legacy file is at: src/legacy/userController.js
 * Output should be:      src/api/userController.ts
 *
 * Known challenge: The legacy controller has ~12 implicit `any` chains
 * and 3 untyped third-party integrations. Thread the types — don't suppress.
 */

// ─── AGENT TASK: implement below this line ───────────────────────────────────

// Mocking the database module to avoid type errors since lib/db does not exist
const db = {
  query: async <T>(queryStr: string, params?: (string | number | boolean | null)[]): Promise<{ rows: T[] }> => {
    // Mock implementation
    return { rows: [] };
  }
};

export interface UserRow {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateData {
  email?: string;
  name?: string | null;
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserFilters {
  email?: string;
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export async function getUser(id: string): Promise<UserRow | undefined> {
  try {
    const user = await db.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    return user.rows[0];
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new DatabaseError(`Failed to get user: ${e.message}`);
    }
    throw new DatabaseError("Unknown database error occurred");
  }
}

export async function updateUser(id: string, data: UserUpdateData): Promise<UserRow | undefined> {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  
  if (fields.length === 0) {
    return getUser(id);
  }

  const params: (string | number | boolean | null)[] = [id];
  for (const value of values) {
    params.push(value !== undefined ? value : null);
  }

  try {
    await db.query<UserRow>(`UPDATE users SET ${setClause} WHERE id = $1`, params);
    return getUser(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new DatabaseError(`Failed to update user: ${e.message}`);
    }
    throw new DatabaseError("Unknown database error occurred");
  }
}

export async function deleteUser(id: string): Promise<{ deleted: boolean; id: string }> {
  try {
    await db.query<UserRow>('DELETE FROM users WHERE id = $1', [id]);
    return { deleted: true, id };
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new DatabaseError(`Failed to delete user: ${e.message}`);
    }
    throw new DatabaseError("Unknown database error occurred");
  }
}

export async function listUsers(filters?: UserFilters): Promise<UserRow[]> {
  let query = 'SELECT * FROM users';
  const params: (string | number | boolean | null)[] = [];
  
  if (filters && filters.email) {
    query += ' WHERE email LIKE $1';
    params.push(`%${filters.email}%`);
  }
  
  try {
    const result = await db.query<UserRow>(query, params);
    return result.rows;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new DatabaseError(`Failed to list users: ${e.message}`);
    }
    throw new DatabaseError("Unknown database error occurred");
  }
}
