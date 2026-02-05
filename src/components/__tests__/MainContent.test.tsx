import React from 'react';
import { render, screen } from '@testing-library/react';
import { MainContent } from '../MainContent';

describe('MainContent Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <MainContent>
          <div>Test Content</div>
        </MainContent>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <MainContent>
          <div>Content 1</div>
          <div>Content 2</div>
          <div>Content 3</div>
        </MainContent>
      );
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });

    it('should render as main element', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Spacing and Layout', () => {
    it('should have top padding for header', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pt-16');
    });

    it('should have bottom padding for navigation', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pb-16');
    });

    it('should have minimum height of screen', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('should have full width', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('w-full', 'max-w-full');
    });
  });

  describe('Dark Mode Styling', () => {
    it('should have dark background', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('bg-neutral-950');
    });
  });

  describe('Responsive Padding', () => {
    it('should have mobile padding', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('px-4');
    });

    it('should have tablet padding', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('sm:px-6');
    });

    it('should have desktop padding', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:px-8');
    });

    it('should have vertical padding', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('py-6');
    });
  });

  describe('Max Width Constraint', () => {
    it('should have max width on desktop', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:max-w-6xl');
    });

    it('should be centered on desktop', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:mx-auto');
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <MainContent className="custom-class">
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <MainContent className="custom-class">
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-class');
      expect(main).toHaveClass('bg-neutral-950');
      expect(main).toHaveClass('pt-16');
    });
  });

  describe('Accessibility', () => {
    it('should use semantic main element', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main?.tagName).toBe('MAIN');
    });

    it('should be accessible with screen readers', () => {
      render(
        <MainContent>
          <h1>Page Title</h1>
          <p>Page content</p>
        </MainContent>
      );
      expect(screen.getByRole('heading', { name: 'Page Title' })).toBeInTheDocument();
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
  });

  describe('Content Wrapper', () => {
    it('should wrap content in a div', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const wrapper = container.querySelector('main > div');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have proper structure', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      const wrapper = main?.querySelector('div');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.textContent).toContain('Test');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should be responsive on mobile', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const main = container.querySelector('main');
      expect(main).toHaveClass('pt-16', 'pb-16');
    });

    it('should have proper spacing for mobile', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('px-4', 'py-6');
    });
  });

  describe('Desktop Responsiveness', () => {
    it('should have max width on desktop', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:max-w-6xl');
    });

    it('should be centered on desktop', () => {
      const { container } = render(
        <MainContent>
          <div>Test</div>
        </MainContent>
      );
      const contentDiv = container.querySelector('main > div');
      expect(contentDiv).toHaveClass('md:mx-auto');
    });
  });
});
