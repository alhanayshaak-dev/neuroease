'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User, Smartphone, Users2 } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/guardian' },
  { label: 'Care Circle', icon: Users, href: '/guardian/care-circle' },
  { label: 'Patient', icon: User, href: '/guardian/patient' },
  { label: 'Devices', icon: Smartphone, href: '/guardian/devices' },
  { label: 'Community', icon: Users2, href: '/guardian/community' },
];

export function GuardianNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-teal-600 z-50 no-print">
      <div className="flex items-center justify-around h-16 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/guardian' 
            ? pathname === '/guardian'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-16 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-teal-400 border-t-2 border-teal-400'
                  : 'text-gray-400 hover:text-teal-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
