// Dashboard customization and widget management
export interface DashboardWidget {
  id: string;
  name: string;
  type: 'status' | 'chart' | 'alerts' | 'devices' | 'medications' | 'insights';
  position: number;
  isVisible: boolean;
  size: 'small' | 'medium' | 'large';
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
}

export function getDefaultLayout(): DashboardLayout {
  return {
    id: 'default',
    name: 'Default Layout',
    widgets: [
      { id: '1', name: 'Violet Status', type: 'status', position: 0, isVisible: true, size: 'large' },
      { id: '2', name: 'Stress Chart', type: 'chart', position: 1, isVisible: true, size: 'medium' },
      { id: '3', name: 'Alerts', type: 'alerts', position: 2, isVisible: true, size: 'medium' },
      { id: '4', name: 'Connected Devices', type: 'devices', position: 3, isVisible: true, size: 'large' },
      { id: '5', name: 'Medications', type: 'medications', position: 4, isVisible: true, size: 'medium' },
      { id: '6', name: 'AI Insights', type: 'insights', position: 5, isVisible: true, size: 'medium' },
    ],
    isDefault: true,
    createdAt: new Date().toISOString(),
  };
}

export function getSavedLayouts(): DashboardLayout[] {
  const saved = localStorage.getItem('dashboard-layouts');
  if (saved) {
    return JSON.parse(saved);
  }
  return [getDefaultLayout()];
}

export function saveLayout(layout: DashboardLayout): void {
  const layouts = getSavedLayouts();
  const index = layouts.findIndex(l => l.id === layout.id);
  if (index >= 0) {
    layouts[index] = layout;
  } else {
    layouts.push(layout);
  }
  localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
}

export function deleteLayout(layoutId: string): void {
  const layouts = getSavedLayouts().filter(l => l.id !== layoutId);
  localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
}

export function reorderWidgets(widgets: DashboardWidget[]): DashboardWidget[] {
  return widgets.map((widget, index) => ({
    ...widget,
    position: index,
  }));
}

export function toggleWidgetVisibility(layoutId: string, widgetId: string): void {
  const layouts = getSavedLayouts();
  const layout = layouts.find(l => l.id === layoutId);
  if (layout) {
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.isVisible = !widget.isVisible;
      saveLayout(layout);
    }
  }
}

export function resizeWidget(layoutId: string, widgetId: string, newSize: 'small' | 'medium' | 'large'): void {
  const layouts = getSavedLayouts();
  const layout = layouts.find(l => l.id === layoutId);
  if (layout) {
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.size = newSize;
      saveLayout(layout);
    }
  }
}
