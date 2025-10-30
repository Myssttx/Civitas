/**
 * Offline storage utilities using IndexedDB
 */

const DB_NAME = 'campus-resilience';
const DB_VERSION = 1;

interface OutboxItem {
  id: string;
  endpoint: string;
  method: string;
  body: unknown;
  timestamp: number;
  retries: number;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Alerts store
        if (!db.objectStoreNames.contains('alerts')) {
          const alertsStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertsStore.createIndex('expires', 'expires', { unique: false });
        }

        // Resources store
        if (!db.objectStoreNames.contains('resources')) {
          db.createObjectStore('resources', { keyPath: 'id' });
        }

        // Checkins store
        if (!db.objectStoreNames.contains('checkins')) {
          const checkinsStore = db.createObjectStore('checkins', {
            keyPath: 'id',
          });
          checkinsStore.createIndex('userId', 'userId', { unique: false });
        }

        // Outbox for queued actions
        if (!db.objectStoreNames.contains('outbox')) {
          const outboxStore = db.createObjectStore('outbox', {
            keyPath: 'id',
          });
          outboxStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveAlert(alert: unknown): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['alerts'], 'readwrite');
    await transaction.objectStore('alerts').put(alert);
  }

  async getAlerts(): Promise<unknown[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['alerts'], 'readonly');
    const request = transaction.objectStore('alerts').getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToOutbox(item: Omit<OutboxItem, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['outbox'], 'readwrite');
    const itemWithMetadata: OutboxItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };
    await transaction.objectStore('outbox').add(itemWithMetadata);
  }

  async getOutboxItems(): Promise<OutboxItem[]> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['outbox'], 'readonly');
    const request = transaction.objectStore('outbox').getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeOutboxItem(id: string): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['outbox'], 'readwrite');
    await transaction.objectStore('outbox').delete(id);
  }

  async updateOutboxItem(id: string, updates: Partial<OutboxItem>): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(['outbox'], 'readwrite');
    const item = await transaction.objectStore('outbox').get(id);
    if (item) {
      await transaction.objectStore('outbox').put({ ...item, ...updates });
    }
  }
}

export const offlineStorage = new OfflineStorage();

