import { GitHubSyncService } from '@/services/github-sync';

export class Scheduler {
  private syncService: GitHubSyncService;
  private intervalDays: number;
  private intervalId?: NodeJS.Timeout;
  private isRunning = false;

  constructor(token?: string, intervalDays: number = 7) {
    this.syncService = new GitHubSyncService(token);
    this.intervalDays = intervalDays;
  }

  async runInitialSync(): Promise<void> {
    if (this.isRunning) {
      console.log('[Scheduler] Sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      console.log('[Scheduler] Running initial sync...');
      await this.syncService.sync();
    } catch (error) {
      console.error('[Scheduler] Initial sync failed:', error);
    } finally {
      this.isRunning = false;
    }
  }

  start(): void {
    // Run initial sync
    this.runInitialSync().catch(console.error);

    // Schedule weekly sync
    const intervalMs = this.intervalDays * 24 * 60 * 60 * 1000;
    
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        console.log('[Scheduler] Previous sync still running, skipping...');
        return;
      }

      this.isRunning = true;
      try {
        console.log(`[Scheduler] Running scheduled sync (every ${this.intervalDays} days)...`);
        await this.syncService.sync();
      } catch (error) {
        console.error('[Scheduler] Scheduled sync failed:', error);
      } finally {
        this.isRunning = false;
      }
    }, intervalMs);

    console.log(`[Scheduler] Started. Will sync every ${this.intervalDays} days.`);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('[Scheduler] Stopped.');
    }
  }
}

