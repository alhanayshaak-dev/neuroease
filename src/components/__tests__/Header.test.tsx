import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Header />);
      expect(screen.getByText('Violet')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });

    it('should render user name and support level', () => {
      render(<Header userName="Violet" supportLevel={1} />);
      expect(screen.getByText('Violet')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });

    it('should render NeuroFlow logo', () => {
      render(<Header />);
      expect(screen.getByText('NeuroFlow')).toBeInTheDocument();
    });

    it('should render settings button', () => {
      render(<Header />);
      const settingsButton = screen.getByLabelText('Settings');
      expect(settingsButton).toBeInTheDocument();
    });

    it('should render notifications button', () => {
      render(<Header />);
      const notificationsButton = screen.getByLabelText('Notifications');
      expect(notificationsButton).toBeInTheDocument();
    });

    it('should render device status button', () => {
      render(<Header />);
      const deviceButton = screen.getByLabelText('3/3 devices connected');
      expect(deviceButton).toBeInTheDocument();
    });
  });

  describe('User Info Display', () => {
    it('should display user avatar with initials when no image provided', () => {
      render(<Header userName="Violet" />);
      const avatar = screen.getByText('V');
      expect(avatar).toBeInTheDocument();
      expect(avatar.parentElement).toHaveClass('bg-primary-500');
    });

    it('should display user avatar image when provided', () => {
      render(<Header userName="Violet" userAvatar="/avatar.jpg" />);
      const avatar = screen.getByAltText('Violet') as HTMLImageElement;
      expect(avatar).toBeInTheDocument();
      // Next.js Image component transforms the src URL
      expect(avatar.src).toContain('avatar.jpg');
    });

    it('should display correct support level', () => {
      render(<Header supportLevel={2} />);
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('should display support level 3', () => {
      render(<Header supportLevel={3} />);
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });
  });

  describe('Device Status', () => {
    it('should show all devices connected when all connected', () => {
      render(<Header devicesConnected={3} devicesTotal={3} />);
      const deviceButton = screen.getByLabelText('3/3 devices connected');
      expect(deviceButton).toBeInTheDocument();
    });

    it('should show disconnected indicator when devices are disconnected', () => {
      render(<Header devicesConnected={2} devicesTotal={3} />);
      const deviceButton = screen.getByLabelText('2/3 devices connected');
      expect(deviceButton).toBeInTheDocument();
      // Check for warning indicator
      const warningIndicator = deviceButton.querySelector('[class*="rising"]');
      expect(warningIndicator).toBeInTheDocument();
    });

    it('should show all devices disconnected', () => {
      render(<Header devicesConnected={0} devicesTotal={3} />);
      const deviceButton = screen.getByLabelText('0/3 devices connected');
      expect(deviceButton).toBeInTheDocument();
    });
  });

  describe('Notifications', () => {
    it('should not show notification badge when count is 0', () => {
      render(<Header notificationCount={0} />);
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });

    it('should show notification badge with count', () => {
      render(<Header notificationCount={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should show 9+ for notification count > 9', () => {
      render(<Header notificationCount={15} />);
      expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('should show single notification', () => {
      render(<Header notificationCount={1} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Dark Mode Styling', () => {
    it('should have dark background', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-neutral-950');
    });

    it('should have dark border', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-neutral-800');
    });

    it('should have light text color', () => {
      render(<Header userName="Violet" />);
      const userName = screen.getByText('Violet');
      expect(userName).toHaveClass('text-neutral-100');
    });

    it('should have teal accent colors', () => {
      render(<Header supportLevel={1} />);
      const supportLevel = screen.getByText('Level 1');
      expect(supportLevel).toHaveClass('text-primary-400');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Header />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText(/devices connected/)).toBeInTheDocument();
    });

    it('should have proper title attributes', () => {
      render(<Header />);
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
      expect(screen.getByTitle('Notifications')).toBeInTheDocument();
    });

    it('should have minimum touch target size for buttons', () => {
      const { container } = render(<Header />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        // Buttons should have padding to meet 48x48px minimum
        expect(button).toHaveClass('p-2');
      });
    });

    it('should have semantic header element', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.tagName).toBe('HEADER');
    });
  });

  describe('Responsive Design', () => {
    it('should hide NeuroFlow text on small screens', () => {
      render(<Header />);
      const text = screen.getByText('NeuroFlow');
      expect(text).toHaveClass('hidden', 'sm:inline');
    });

    it('should always show logo icon', () => {
      const { container } = render(<Header />);
      // Brain icon should always be visible
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Fixed Positioning', () => {
    it('should be fixed at top', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0');
    });

    it('should have high z-index', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('z-40');
    });

    it('should have fixed height', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('h-16');
    });
  });
});
