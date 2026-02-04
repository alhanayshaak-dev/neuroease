'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, User, Smartphone, Share2 } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    label: 'CareCircle',
    href: '/care-circle',
    icon: <Users className="w-6 h-6" />,
  },
  {
    label: 'Patient',
    href: '/patient',
    icon: <User className="w-6 h-6" />,
  },
  {
    label: 'Devices',
    href: '/devices',
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    label: 'Community',
    href: '/community',
    icon: <Share2 className="w-6 h-6" />,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950 border-t border-neutral-800 h-16">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative group min-h-touch-target min-w-touch-target`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <div
                className={`${
                  isActive ? 'text-primary-400' : 'text-neutral-500 group-hover:text-neutral-400'
                } transition-colors`}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-primary-400' : 'text-neutral-500 group-hover:text-neutral-400'
                } transition-colors`}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
