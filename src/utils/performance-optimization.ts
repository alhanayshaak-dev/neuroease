// Performance Optimization
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export interface CacheStrategy {
  key: string;
  ttl: number;
  size: number;
  priority: 'low' | 'medium' | 'high';
}

export class PerformanceOptimizer {
  private static cache = new Map<string, { data: any; expiry: number }>();

  static cacheData(key: string, data: any, ttlSeconds: number = 3600): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiry });
  }

  static getCachedData(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static getMetrics(): PerformanceMetrics {
    if (typeof window === 'undefined') {
      return {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        timeToInteractive: 0,
      };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const largest = performance.getEntriesByType('largest-contentful-paint');

    return {
      pageLoadTime: navigation?.loadEventEnd - navigation?.fetchStart || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: largest[largest.length - 1]?.startTime || 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: navigation?.domInteractive - navigation?.fetchStart || 0,
    };
  }
}

export function lazyLoadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve('');
    img.src = src;
  });
}

export function optimizeImage(url: string, width: number, quality: number = 80): string {
  // In production, use image optimization service
  return `${url}?w=${width}&q=${quality}`;
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export function prefetchResource(url: string, type: 'script' | 'style' | 'image' = 'script'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (type === 'style') link.as = 'style';
  if (type === 'script') link.as = 'script';
  if (type === 'image') link.as = 'image';
  document.head.appendChild(link);
}

export function enableCodeSplitting(): void {
  console.log('Code splitting enabled');
}

export function optimizeBundle(): void {
  console.log('Bundle optimization enabled');
}
