'use client';

import React from 'react';
import { Info, Mail } from 'lucide-react';

export function SettingsAboutTab() {
  return (
    <div className="space-y-6">
      <div className="bg-black border border-teal-600/30 rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-6">About Guardian</h2>

        <div className="space-y-6">
          {/* Version Info */}
          <div className="pb-6 border-b border-teal-600/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Version</p>
                <p className="text-white font-semibold">2.1.0</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Build</p>
                <p className="text-white font-semibold">Build 2024.01.15</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                <p className="text-white font-semibold">January 15, 2024</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Platform</p>
                <p className="text-white font-semibold">Web & Mobile</p>
              </div>
            </div>
          </div>

          {/* Legal Documents */}
          <div className="pb-6 border-b border-teal-600/20">
            <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Info size={18} /> Legal Documents
            </h3>
            <div className="space-y-2">
              <button type="button" className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 border border-teal-600/30 rounded transition-colors">
                <p className="text-teal-400 font-semibold">Privacy Policy</p>
                <p className="text-gray-500 text-sm">Last updated: January 15, 2024</p>
              </button>
              <button type="button" className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 border border-teal-600/30 rounded transition-colors">
                <p className="text-teal-400 font-semibold">Terms of Service</p>
                <p className="text-gray-500 text-sm">Last updated: January 15, 2024</p>
              </button>
              <button type="button" className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 border border-teal-600/30 rounded transition-colors">
                <p className="text-teal-400 font-semibold">Cookie Policy</p>
                <p className="text-gray-500 text-sm">Last updated: January 15, 2024</p>
              </button>
              <button type="button" className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 border border-teal-600/30 rounded transition-colors">
                <p className="text-teal-400 font-semibold">Accessibility Statement</p>
                <p className="text-gray-500 text-sm">Last updated: January 15, 2024</p>
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
              <Mail size={18} /> Support & Feedback
            </h3>
            <div className="space-y-2">
              <button type="button" className="w-full px-4 py-3 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-colors">
                Contact Support
              </button>
              <button type="button" className="w-full px-4 py-3 bg-blue-600/20 border border-blue-600 text-blue-400 rounded font-semibold hover:bg-blue-600/30 transition-colors">
                Send Feedback
              </button>
              <button type="button" className="w-full px-4 py-3 bg-purple-600/20 border border-purple-600 text-purple-400 rounded font-semibold hover:bg-purple-600/30 transition-colors">
                Report a Bug
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-black border border-teal-600/30 rounded p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              Guardian is a comprehensive neurodivergent support platform designed to help guardians monitor and support their loved ones. Built with care and backed by research, Guardian provides real-time insights, emergency support, and personalized strategies.
            </p>
            <p className="text-gray-500 text-xs mt-3">
              © 2024 Guardian. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
