import { Scheduler } from './scheduler';

let scheduler: Scheduler | null = null;

export function startScheduler(): void {
  if (scheduler) {
    return; // Already started
  }

  const token = process.env.GITHUB_TOKEN;
  const intervalDays = parseInt(process.env.SYNC_INTERVAL_DAYS || '7', 10);

  scheduler = new Scheduler(token, intervalDays);
  scheduler.start();
}

// Start scheduler when module is imported
if (typeof window === 'undefined') {
  // Only run on server
  startScheduler();
}

