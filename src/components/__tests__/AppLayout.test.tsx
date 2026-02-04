import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayout } from '../AppLayout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('AppLayout Component', () => {
  describe('Rendering', () => {
    it('should render Header, Navigation, and MainContent', () => {
      const { container } = render(
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      );

      // Check for header
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();

      // Check for nav
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();

      // Check for main
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();

      // Check for content
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children in MainContent', () => {
      render(
        <AppLayout>
          <div>Page Content</div>
        </AppLayout>
      );
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <AppLayout>
          <h1>Title</h1>
          <p>Description</p>
          <div>Content</div>
        </AppLayout>
      );
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Header Integration', () => {
    it('should render Header with default props', () => {
      render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByText('Violet')).toBeInTheDocument();
      expect(screen.getByText('Level 1')).toBeInTheDocument();
    });

    it('should pass headerProps to Header', () => {
      render(
        <AppLayout headerProps={{ userName: 'Alice', supportLevel: 2 }}>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    it('should render Header with custom notification count', () => {
      render(
        <AppLayout headerProps={{ notificationCount: 5 }}>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render Header with device status', () => {
      render(
        <AppLayout headerProps={{ devicesConnected: 2, devicesTotal: 3 }}>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByLabelText('2/3 devices connected')).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('should render Navigation with all 5 sections', () => {
      render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('CareCircle')).toBeInTheDocument();
      expect(screen.getByLabelText('Patient')).toBeInTheDocument();
      expect(screen.getByLabelText('Devices')).toBeInTheDocument();
      expect(screen.getByLabelText('Community')).toBeInTheDocument();
    });

    it('should have correct navigation links', () => {
      render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByLabelText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
      expect(screen.getByLabelText('CareCircle').closest('a')).toHaveAttribute(
        'href',
        '/care-circle'
      );
    });
  });

  describe('MainContent Integration', () => {
    it('should render MainContent with proper spacing', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pt-16', 'pb-16');
    });

    it('should accept mainContentClassName', () => {
      const { container } = render(
        <AppLayout mainContentClassName="custom-class">
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-class');
    });

    it('should have dark background', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('bg-neutral-950');
    });
  });

  describe('Layout Structure', () => {
    it('should have Header at top', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('fixed', 'top-0');
    });

    it('should have Navigation at bottom', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('fixed', 'bottom-0');
    });

    it('should have MainContent in middle', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pt-16', 'pb-16');
    });

    it('should have proper z-index layering', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const header = container.querySelector('header');
      const nav = container.querySelector('nav');
      expect(header).toHaveClass('z-40');
      expect(nav).toHaveClass('z-40');
    });
  });

  describe('Dark Mode', () => {
    it('should have dark theme throughout', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const header = container.querySelector('header');
      const nav = container.querySelector('nav');
      const main = container.querySelector('main');

      expect(header).toHaveClass('bg-neutral-950');
      expect(nav).toHaveClass('bg-neutral-950');
      expect(main).toHaveClass('bg-neutral-950');
    });

    it('should have dark borders', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const header = container.querySelector('header');
      const nav = container.querySelector('nav');

      expect(header).toHaveClass('border-neutral-800');
      expect(nav).toHaveClass('border-neutral-800');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
    });

    it('should have minimum touch targets', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('p-2');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pt-16', 'pb-16');
    });

    it('should be responsive on tablet', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('sm:px-6');
    });

    it('should be responsive on desktop', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:px-8', 'md:max-w-6xl');
    });
  });

  describe('Props Handling', () => {
    it('should handle empty headerProps', () => {
      render(
        <AppLayout headerProps={{}}>
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByText('Violet')).toBeInTheDocument();
    });

    it('should handle undefined mainContentClassName', () => {
      const { container } = render(
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('bg-neutral-950');
    });

    it('should handle all headerProps', () => {
      render(
        <AppLayout
          headerProps={{
            userName: 'Bob',
            supportLevel: 3,
            notificationCount: 2,
            devicesConnected: 1,
            devicesTotal: 3,
          }}
        >
          <div>Test</div>
        </AppLayout>
      );
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Level 3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('should render complex content', () => {
      render(
        <AppLayout>
          <section>
            <h1>Dashboard</h1>
            <div>
              <p>Welcome</p>
              <button>Action</button>
            </div>
          </section>
        </AppLayout>
      );
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should render with fragments', () => {
      render(
        <AppLayout>
          <>
            <div>Content 1</div>
            <div>Content 2</div>
          </>
        </AppLayout>
      );
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});
