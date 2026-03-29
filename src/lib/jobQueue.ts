export type JobStatus = "pending" | "processing" | "done" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  payload: unknown;
}

const jobs: Map<string, Job> = new Map();

// A global promise chain queue for atomic operations
let lock: Promise<void> = Promise.resolve();

export async function addJob(job: Job): Promise<void> {
  const previousLock = lock;
  let release: () => void = () => {};
  
  lock = new Promise<void>((resolve) => {
    release = resolve;
  });

  try {
    await previousLock;
    jobs.set(job.id, job);
  } finally {
    release();
  }
}

export async function claimJob(jobId: string): Promise<Job | null> {
  // We need to wait for the previous operation to finish
  const previousLock = lock;
  let release: () => void = () => {};
  
  lock = new Promise<void>((resolve) => {
    release = resolve;
  });

  try {
    await previousLock;
    
    // Critical Section
    const job = jobs.get(jobId);
    if (!job || job.status !== "pending") return null;

    job.status = "processing";
    return job;
  } finally {
    release();
  }
}

export async function completeJob(jobId: string): Promise<void> {
  const previousLock = lock;
  let release: () => void = () => {};
  
  lock = new Promise<void>((resolve) => {
    release = resolve;
  });

  try {
    await previousLock;
    
    const job = jobs.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);
    job.status = "done";
  } finally {
    release();
  }
}

// Keep a way to fetch raw job for testing
export function getJobDirectly(jobId: string): Job | undefined {
  return jobs.get(jobId);
}
