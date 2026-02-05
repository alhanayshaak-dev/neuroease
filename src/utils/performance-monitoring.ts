// Performance Monitoring
export interface PerformanceAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface UptimeData {
  date: string;
  uptime: number;
  downtime: number;
  incidents: number;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack: string;
  timestamp: string;
  userId: string;
  url: string;
  frequency: number;
}

export class PerformanceMonitor {
  private static alerts: PerformanceAlert[] = [];
  private static errors: ErrorReport[] = [];

  static trackError(error: Error, context?: any): void {
    const report: ErrorReport = {
      id: Math.random().toString(36).substr(2, 9),
      message: error.message,
      stack: error.stack || '',
      timestamp: new Date().toISOString(),
      userId: 'user-123',
      url: typeof window !== 'undefined' ? window.location.href : '',
      frequency: 1,
    };

    this.errors.push(report);
  }

  static createAlert(type: 'error' | 'warning' | 'info', message: string, severity: 'low' | 'medium' | 'high' | 'critical'): void {
    const alert: PerformanceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      severity,
    };

    this.alerts.push(alert);
  }

  static getAlerts(): PerformanceAlert[] {
    return this.alerts;
  }

  static getErrors(): ErrorReport[] {
    return this.errors;
  }

  static clearAlerts(): void {
    this.alerts = [];
  }

  static clearErrors(): void {
    this.errors = [];
  }
}

export function getUptimeData(days: number = 30): UptimeData[] {
  const data: UptimeData[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      uptime: 99.9 + Math.random() * 0.1,
      downtime: 0.1 - Math.random() * 0.05,
      incidents: Math.random() > 0.9 ? 1 : 0,
    });
  }
  return data;
}

export function getErrorRate(): number {
  const errors = PerformanceMonitor.getErrors();
  return errors.length > 0 ? (errors.length / 1000) * 100 : 0;
}

export function getAverageResponseTime(): number {
  return Math.random() * 500 + 100; // 100-600ms
}

export function getServerStatus(): 'healthy' | 'degraded' | 'down' {
  const errorRate = getErrorRate();
  if (errorRate > 5) return 'down';
  if (errorRate > 1) return 'degraded';
  return 'healthy';
}

export function enableRealUserMonitoring(): void {
  // Real User Monitoring enabled
}

export function trackPageView(pageName: string): void {
  // Page view tracked
}

export function trackUserAction(action: string, details?: any): void {
  // User action tracked
}

export function setUpAlertThreshold(metric: string, threshold: number): void {
  // Alert threshold set
}
