// Offline mode and data caching
export interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  expiresIn: number; // milliseconds
}

export class OfflineDataManager {
  private static readonly STORAGE_KEY = 'neuroflow-cache';

  static cacheData(key: string, data: any, expiresInHours: number = 24): void {
    const cache = this.getCache();
    cache[key] = {
      key,
      data,
      timestamp: Date.now(),
      expiresIn: expiresInHours * 60 * 60 * 1000,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
  }

  static getCachedData(key: string): any | null {
    const cache = this.getCache();
    const item = cache[key];

    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.expiresIn;
    if (isExpired) {
      delete cache[key];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
      return null;
    }

    return item.data;
  }

  static getCache(): Record<string, CachedData> {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  static clearCache(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  static syncWhenOnline(callback: () => Promise<void>): void {
    if (this.isOnline()) {
      callback();
    } else {
      window.addEventListener('online', () => {
        callback();
      }, { once: true });
    }
  }
}
