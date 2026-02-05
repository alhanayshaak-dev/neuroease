// Integration Hub
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected';
  icon: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
}

export function getAvailableIntegrations(): Integration[] {
  return [
    {
      id: '1',
      name: 'Google Calendar',
      description: 'Sync appointments and reminders',
      category: 'calendar',
      status: 'disconnected',
      icon: '📅',
    },
    {
      id: '2',
      name: 'Apple Health',
      description: 'Sync health data',
      category: 'health',
      status: 'disconnected',
      icon: '❤️',
    },
    {
      id: '3',
      name: 'Slack',
      description: 'Send notifications to Slack',
      category: 'messaging',
      status: 'disconnected',
      icon: '💬',
    },
  ];
}

export function connectIntegration(_integrationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function disconnectIntegration(_integrationId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function createWebhook(url: string, events: string[]): Promise<Webhook> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        url,
        events,
        active: true,
        createdAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export function getWebhooks(): Webhook[] {
  return [
    {
      id: '1',
      url: 'https://api.example.com/webhooks/alerts',
      events: ['alert', 'medication'],
      active: true,
      createdAt: '2024-02-01',
    },
  ];
}

export function deleteWebhook(_webhookId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function generateAPIKey(name: string, permissions: string[]): Promise<APIKey> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name,
        key: `sk_${Math.random().toString(36).substr(2, 32)}`,
        createdAt: new Date().toISOString(),
        permissions,
      });
    }, 500);
  });
}

export function getAPIKeys(): APIKey[] {
  return [
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_prod_xyz123...',
      createdAt: '2024-01-15',
      lastUsed: '2024-02-05',
      permissions: ['read', 'write'],
    },
  ];
}

export function revokeAPIKey(_keyId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

export function getAPIDocumentation(): string {
  return `
# NeuroFlow API Documentation

## Authentication
Use API keys in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints
- GET /api/health - Get health data
- POST /api/alerts - Create alert
- GET /api/medications - Get medications
  `.trim();
}
