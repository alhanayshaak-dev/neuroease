import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from '../Navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('Navigation Component', () => {
  describe('Rendering', () => {
    it('should render all 5 navigation sections', () => {
      render(<Navigation />);
      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('CareCircle')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient')).toBeInTheDocument();
      expect(screen.getByLabelText('Devices')).toBeInTheDocument();
      expect(screen.getByLabelText('Community')).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      render(<Navigation />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(5);
    });

    it('should have correct href for each section', () => {
      render(<Navigation />);
      expect(screen.getByLabelText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
      expect(screen.getByLabelText('CareCircle').closest('a')).toHaveAttribute(
        'href',
        '/care-circle'
      );
      expect(screen.getByLabelText('Patient').closest('a')).toHaveAttribute('href', '/patient');
      expect(screen.getByLabelText('Devices').closest('a')).toHaveAttribute('href', '/devices');
      expect(screen.getByLabelText('Community').closest('a')).toHaveAttribute('href', '/community');
    });
  });

  describe('Active State', () => {
    it('should mark Dashboard as active when on /dashboard', () => {
      render(<Navigation />);
      const dashboardLink = screen.getByLabelText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have teal color for active link', () => {
      render(<Navigation />);
      const dashboardLink = screen.getByLabelText('Dashboard').closest('a');
      const icon = dashboardLink?.querySelector('div');
      expect(icon).toHaveClass('text-primary-400');
    });

    it('should have active indicator dot', () => {
      render(<Navigation />);
      const dashboardLink = screen.getByLabelText('Dashboard').closest('a');
      const indicator = dashboardLink?.querySelector('.bg-primary-400');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Inactive State', () => {
    it('should have gray color for inactive links', () => {
      render(<Navigation />);
      const careCircleLink = screen.getByLabelText('CareCircle').closest('a');
      expect(careCircleLink).not.toHaveAttribute('aria-current', 'page');
    });

    it('should not have active indicator for inactive links', () => {
      render(<Navigation />);
      const careCircleLink = screen.getByLabelText('CareCircle').closest('a');
      const indicator = careCircleLink?.querySelector('.bg-primary-400');
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('Dark Mode Styling', () => {
    it('should have dark background', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('bg-neutral-950');
    });

    it('should have dark border', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('border-neutral-800');
    });

    it('should have light text for active state', () => {
      render(<Navigation />);
      const dashboardLabel = screen.getByText('Dashboard');
      expect(dashboardLabel).toHaveClass('text-primary-400');
    });

    it('should have gray text for inactive state', () => {
      render(<Navigation />);
      const careCircleLabel = screen.getByText('CareCircle');
      expect(careCircleLabel).toHaveClass('text-neutral-500');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all links', () => {
      render(<Navigation />);
      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('CareCircle')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient')).toBeInTheDocument();
      expect(screen.getByLabelText('Devices')).toBeInTheDocument();
      expect(screen.getByLabelText('Community')).toBeInTheDocument();
    });

    it('should have title attributes for tooltips', () => {
      render(<Navigation />);
      expect(screen.getByTitle('Dashboard')).toBeInTheDocument();
      expect(screen.getByTitle('CareCircle')).toBeInTheDocument();
      expect(screen.getByTitle('Patient')).toBeInTheDocument();
      expect(screen.getByTitle('Devices')).toBeInTheDocument();
      expect(screen.getByTitle('Community')).toBeInTheDocument();
    });

    it('should have aria-current for active page', () => {
      render(<Navigation />);
      const activeLink = screen.getByLabelText('Dashboard').closest('a');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have minimum touch target size', () => {
      const { container } = render(<Navigation />);
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        expect(link).toHaveClass('min-h-touch-target', 'min-w-touch-target');
      });
    });

    it('should have semantic nav element', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav?.tagName).toBe('NAV');
    });
  });

  describe('Responsive Design', () => {
    it('should display icons for all sections', () => {
      const { container } = render(<Navigation />);
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(5);
    });

    it('should display labels for all sections', () => {
      render(<Navigation />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('CareCircle')).toBeInTheDocument();
      expect(screen.getByText('Patient')).toBeInTheDocument();
      expect(screen.getByText('Devices')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    it('should have equal spacing for all sections', () => {
      const { container } = render(<Navigation />);
      const navInner = container.querySelector('nav > div');
      expect(navInner).toHaveClass('flex', 'justify-around');
    });
  });

  describe('Fixed Positioning', () => {
    it('should be fixed at bottom', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    });

    it('should have high z-index', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('z-40');
    });

    it('should have fixed height', () => {
      const { container } = render(<Navigation />);
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('h-16');
    });
  });

  describe('Icon Display', () => {
    it('should display Dashboard icon', () => {
      const { container } = render(<Navigation />);
      const dashboardLink = screen.getByLabelText('Dashboard').closest('a');
      const icon = dashboardLink?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display CareCircle icon', () => {
      const { container } = render(<Navigation />);
      const careCircleLink = screen.getByLabelText('CareCircle').closest('a');
      const icon = careCircleLink?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display Patient icon', () => {
      const { container } = render(<Navigation />);
      const patientLink = screen.getByLabelText('Patient').closest('a');
      const icon = patientLink?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display Devices icon', () => {
      const { container } = render(<Navigation />);
      const devicesLink = screen.getByLabelText('Devices').closest('a');
      const icon = devicesLink?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display Community icon', () => {
      const { container } = render(<Navigation />);
      const communityLink = screen.getByLabelText('Community').closest('a');
      const icon = communityLink?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
