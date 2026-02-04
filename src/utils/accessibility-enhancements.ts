// Accessibility enhancements
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'd',
    ctrl: true,
    action: 'navigate-dashboard',
    description: 'Go to Dashboard',
  },
  {
    key: 'c',
    ctrl: true,
    action: 'navigate-care-circle',
    description: 'Go to Care Circle',
  },
  {
    key: 'p',
    ctrl: true,
    action: 'navigate-patient',
    description: 'Go to Patient',
  },
  {
    key: 'v',
    ctrl: true,
    action: 'navigate-devices',
    description: 'Go to Devices',
  },
  {
    key: 'e',
    ctrl: true,
    action: 'emergency-mode',
    description: 'Activate Emergency Mode',
  },
  {
    key: 's',
    ctrl: true,
    action: 'open-search',
    description: 'Open Search',
  },
  {
    key: '?',
    action: 'show-help',
    description: 'Show Help',
  },
];

export function handleKeyboardShortcut(event: KeyboardEvent): string | null {
  for (const shortcut of KEYBOARD_SHORTCUTS) {
    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
    const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
    const altMatch = shortcut.alt ? event.altKey : !event.altKey;

    if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
      return shortcut.action;
    }
  }
  return null;
}

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

export function enableVoiceCommands(): void {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    console.log('Voice commands available');
  }
}

export function getAccessibilitySettings() {
  return {
    screenReaderEnabled: localStorage.getItem('accessibility-screen-reader') === 'true',
    highContrast: localStorage.getItem('accessibility-high-contrast') === 'true',
    largeText: localStorage.getItem('accessibility-large-text') === 'true',
    keyboardNavigation: localStorage.getItem('accessibility-keyboard') === 'true',
    voiceCommands: localStorage.getItem('accessibility-voice') === 'true',
  };
}

export function setAccessibilitySetting(setting: string, enabled: boolean): void {
  localStorage.setItem(`accessibility-${setting}`, enabled ? 'true' : 'false');
}
