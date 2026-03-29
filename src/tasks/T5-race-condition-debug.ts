import { claimJob, Job, addJob, getJobDirectly } from "../lib/jobQueue";

/**
 * TASK 5: Debug a production race condition corrupting shared database state
 *
 * Requirements:
 * - Find and fix the race condition in /src/lib/jobQueue.ts
 * - Write a failing test FIRST that reproduces the corruption
 * - Fix the implementation until the test passes
 * - Add a type-safe mutex/lock mechanism — no `any`, no assertions
 * - Must pass: npx tsc --noEmit AND all tests
 *
 * Symptoms (from prod logs):
 *   - Job status flips from "processing" to "pending" under concurrent load
 *   - Occurs only when 3+ workers process the same queue simultaneously
 *   - No error thrown — silent state corruption
 *
 * The buggy file is at: src/lib/jobQueue.ts
 *
 * Known challenge: The fix requires an async mutex. Do not use
 * a boolean flag — it is not atomic. Use a Promise chain lock.
 */

// ─── AGENT TASK: implement below this line ───────────────────────────────────

export async function runRaceConditionTest(): Promise<void> {
  const jobId = "test-job-" + Date.now();
  
  const testJob: Job = {
    id: jobId,
    status: "pending",
    payload: { task: "foo" }
  };
  
  await addJob(testJob);
  
  // Simulate 3 concurrent workers claiming the same job
  const claims = await Promise.all([
    claimJob(jobId),
    claimJob(jobId),
    claimJob(jobId)
  ]);
  
  // Count how many workers successfully claimed the job
  let successCount = 0;
  for (const claim of claims) {
    if (claim !== null) {
      successCount++;
    }
  }
  
  const finalJob = getJobDirectly(jobId);
  const status = finalJob ? finalJob.status : "unknown";
  
  if (successCount > 1) {
    console.error(`TEST FAILED: Race condition detected. ${successCount} workers claimed the job simultaneously.`);
    console.error(`Final Status: ${status}`);
    process.exitCode = 1;
  } else if (successCount === 1 && status === "processing") {
    console.log("TEST PASSED: Mutex prevented race condition.");
  } else {
    console.error("TEST FAILED: Unexpected state.");
    process.exitCode = 1;
  }
}

// Run the test if executed directly
if (require.main === module) {
  runRaceConditionTest().catch(console.error);
}
