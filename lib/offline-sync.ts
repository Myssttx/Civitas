/**
 * Offline sync manager with outbox pattern and background sync
 */

import { offlineStorage } from './offline';

interface QueuedAction {
  id: string;
  endpoint: string;
  method: string;
  body: unknown;
  timestamp: number;
  retries: number;
}

class OfflineSyncManager {
  private syncInProgress = false;
  private retryDelay = 1000; // Start with 1 second

  /**
   * Queue an action for offline sync
   */
  async queueAction(endpoint: string, method: string, body: unknown): Promise<void> {
    await offlineStorage.addToOutbox({
      endpoint,
      method,
      body,
    });

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncOutbox().catch(console.error);
    }
  }

  /**
   * Sync all queued actions
   */
  async syncOutbox(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return;
    this.syncInProgress = true;

    try {
      const items = await offlineStorage.getOutboxItems();
      const results = await Promise.allSettled(
        items.map((item) => this.attemptSync(item))
      );

      // Remove successfully synced items
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'fulfilled') {
          await offlineStorage.removeOutboxItem(items[i].id);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Attempt to sync a single item
   */
  private async attemptSync(item: QueuedAction): Promise<void> {
    const maxRetries = 5;
    if (item.retries >= maxRetries) {
      console.warn(`Max retries reached for ${item.id}`);
      return;
    }

    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Success - item will be removed by caller
    } catch (error) {
      // Exponential backoff
      const delay = this.retryDelay * Math.pow(2, item.retries);
      await this.delay(delay);

      // Update retry count
      await offlineStorage.updateOutboxItem(item.id, {
        retries: item.retries + 1,
      });

      throw error; // Re-throw to mark as failed
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Initialize background sync
   */
  init() {
    // Listen for online event
    window.addEventListener('online', () => {
      this.syncOutbox().catch(console.error);
    });

    // Periodic sync (every 30 seconds when online)
    setInterval(() => {
      if (navigator.onLine) {
        this.syncOutbox().catch(console.error);
      }
    }, 30000);

    // Initial sync
    if (navigator.onLine) {
      this.syncOutbox().catch(console.error);
    }
  }
}

export const offlineSyncManager = new OfflineSyncManager();

