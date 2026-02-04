'use client';

import { Settings, Bell, Smartphone } from 'lucide-react';
import { Brain } from 'lucide-react';
import Image from 'next/image';

export interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  supportLevel?: number;
  notificationCount?: number;
  devicesConnected?: number;
  devicesTotal?: number;
}

export function Header({
  userName = 'Violet',
  userAvatar,
  supportLevel = 1,
  notificationCount = 0,
  devicesConnected = 3,
  devicesTotal = 3,
}: HeaderProps) {
  const allDevicesConnected = devicesConnected === devicesTotal;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950 border-b border-neutral-800 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section: User Info */}
        <div className="flex items-center gap-3 min-w-0">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full bg-neutral-800 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-neutral-950">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-100 truncate">{userName}</p>
            <p className="text-xs text-primary-400">Level {supportLevel}</p>
          </div>
        </div>

        {/* Center Section: Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Brain className="w-6 h-6 text-primary-400" />
          <span className="text-lg font-bold text-neutral-100 hidden sm:inline">NeuroFlow</span>
        </div>

        {/* Right Section: Controls */}
        <div className="flex items-center gap-3">
          {/* Device Status */}
          <button type="button"
            className="relative p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title={`${devicesConnected}/${devicesTotal} devices connected`}
            aria-label={`${devicesConnected}/${devicesTotal} devices connected`}
          >
            <Smartphone
              className={`w-5 h-5 ${allDevicesConnected ? 'text-primary-400' : 'text-neutral-500'}`}
            />
            {!allDevicesConnected && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rising rounded-full" />
            )}
          </button>

          {/* Notifications */}
          <button type="button"
            className="relative p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-neutral-400" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-rising rounded-full flex items-center justify-center text-xs font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button type="button"
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

