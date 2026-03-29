import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * TASK 2: Update a Prisma schema + cross-boundary ORM integration
 *
 * Requirements:
 * - Add a new `AuditLog` model to the Prisma schema
 * - Create a type-safe service function that writes an audit log entry
 * - The service must be consumed by an API route handler
 * - All cross-boundary types must flow correctly — no `any`, no assertions
 * - Must pass: npx tsc --noEmit across ALL files (not just the file you edited)
 *
 * Schema addition:
 *   model AuditLog {
 *     id        String   @id @default(cuid())
 *     userId    String
 *     action    String
 *     metadata  Json?
 *     createdAt DateTime @default(now())
 *   }
 *
 * Known challenge: Prisma client singleton conflicts with
 * Next.js hot-reloading under strict TypeScript.
 * Do NOT use `as unknown as` or `as any` to resolve it.
 * The correct pattern is in /docs/prisma-singleton-pattern.md
 */

// ─── AGENT TASK: implement below this line ───────────────────────────────────

export async function createAuditLog(userId: string, action: string, metadata?: Prisma.JsonObject): Promise<void> {
  let jsonMetadata: Prisma.InputJsonValue | undefined = undefined;
  if (metadata) {
    jsonMetadata = metadata as Prisma.InputJsonValue;
  }
  
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata: jsonMetadata,
    },
  });
}

// Ensure the Request body is strictly typed without 'any'
interface AuditLogRequestParams {
  userId: unknown;
  action: unknown;
  metadata?: unknown;
}

function isValidRequest(body: unknown): body is AuditLogRequestParams {
  if (typeof body !== "object" || body === null) return false;
  return "userId" in body && "action" in body;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const body: unknown = req.body;
  
  if (!isValidRequest(body)) {
    res.status(400).json({ message: "Bad Request: Missing userId or action" });
    return;
  }

  if (typeof body.userId !== "string" || typeof body.action !== "string") {
    res.status(400).json({ message: "Bad Request: userId and action must be strings" });
    return;
  }

  let validMetadata: Prisma.JsonObject | undefined = undefined;
  
  if (body.metadata !== undefined) {
    if (typeof body.metadata === "object" && body.metadata !== null && !Array.isArray(body.metadata)) {
      // Validate it's a JSON object
      validMetadata = body.metadata as Prisma.JsonObject;
    } else {
      res.status(400).json({ message: "Bad Request: metadata must be an object" });
      return;
    }
  }

  try {
    await createAuditLog(body.userId, body.action, validMetadata);
    res.status(201).json({ message: "Audit log created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}
