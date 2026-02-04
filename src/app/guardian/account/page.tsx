'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  User,
  Lock,
  Shield,
  LogOut,
  Edit2,
  Save,
  XCircle,
  Activity,
  TrendingUp,
  Users,
  Bell,
  Download,
  Smartphone,
  Calendar,
  Clock,
  CheckCircle2,
  Key,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'devices' | 'sessions' | 'analytics' | 'connections'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Avery Gray');
  const [email, setEmail] = useState('avery.gray@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [relationship, setRelationship] = useState('Mother');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const trustedDevicesData = [
    { id: 1, name: 'iPhone 14 Pro', type: 'Mobile', lastActive: '2 minutes ago', location: 'Home', os: 'iOS 17' },
    { id: 2, name: 'MacBook Pro', type: 'Desktop', lastActive: '1 hour ago', location: 'Home', os: 'macOS 14' },
    { id: 3, name: 'iPad Air', type: 'Tablet', lastActive: '3 days ago', location: 'Work', os: 'iPadOS 17' },
  ];

  const activeSessionsData = [
    { id: 1, device: 'iPhone 14 Pro', location: 'Home', ip: '192.168.1.100', active: true, loginTime: 'Today 2:30 PM' },
    { id: 2, device: 'MacBook Pro', location: 'Home', ip: '192.168.1.101', active: true, loginTime: 'Today 9:15 AM' },
  ];

  const guardianStatsData = [
    { label: 'Days Monitoring', value: 156, icon: Calendar, color: 'text-blue-400' },
    { label: 'Check-ins Made', value: 342, icon: Activity, color: 'text-green-400' },
    { label: 'Alerts Responded', value: 89, icon: Bell, color: 'text-yellow-400' },
    { label: 'Avg Response Time', value: '2.3 min', icon: Clock, color: 'text-purple-400' },
  ];

  const violetConnectionData = {
    name: 'Violet Azer',
    age: 16,
    status: 'online',
    lastSync: '2 minutes ago',
    connectionStrength: 95,
    dataShared: ['Health Data', 'Location', 'Stress Levels', 'Medication Logs'],
    permissions: ['View Status', 'View Alerts', 'View Trends', 'View Medical', 'Suggest Strategies'],
  };

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Account Management</h1>
            <p className="text-xs text-gray-400">Manage your profile, security, and connections</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Go back"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>
            <button type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'sessions', label: 'Sessions', icon: Shield },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'connections', label: 'Connections', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-teal-600/20 border border-teal-600 text-teal-400`
                    : 'bg-navy-900 border border-teal-600/30 text-gray-400 hover:text-teal-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">Personal Information</h2>
                <button type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold"
                >
                  {isEditing ? (
                    <>
                      <XCircle size={18} /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} /> Edit
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-teal-600/20">
                  <div className="w-16 h-16 rounded-full bg-teal-600/20 border border-teal-600 flex items-center justify-center">
                    <User size={32} className="text-teal-400" />
                  </div>
                  {isEditing && (
                    <button type="button" className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all">
                      Change Avatar
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-semibold">{name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-semibold">{email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
                    <Phone size={16} /> Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-semibold">{phone}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
                    <MapPin size={16} /> Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white font-semibold">{location}</p>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
                    <Briefcase size={16} /> Relationship to Violet
                  </label>
                  {isEditing ? (
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                    >
                      <option>Mother</option>
                      <option>Father</option>
                      <option>Guardian</option>
                      <option>Therapist</option>
                      <option>Teacher</option>
                    </select>
                  ) : (
                    <p className="text-white font-semibold">{relationship}</p>
                  )}
                </div>

                {/* Account Info */}
                <div className="pt-4 border-t border-teal-600/20 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Account Created</p>
                    <p className="text-white font-semibold">January 15, 2024</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                    <p className="text-white font-semibold">Today at 2:30 PM</p>
                  </div>
                </div>

                {isEditing && (
                  <button type="button" className="w-full mt-4 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-all">
                    <Save size={18} /> Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Security Settings</h2>

              {/* Password */}
              <div className="mb-6 pb-6 border-b border-teal-600/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-semibold flex items-center gap-2">
                      <Key size={18} /> Password
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Last changed 3 months ago</p>
                  </div>
                  <button type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="mb-6 pb-6 border-b border-teal-600/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-semibold flex items-center gap-2">
                      <Shield size={18} /> Two-Factor Authentication
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Add an extra layer of security</p>
                  </div>
                  <button type="button" className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all">
                    Enable
                  </button>
                </div>
              </div>

              {/* Biometric Login */}
              <div className="mb-6 pb-6 border-b border-teal-600/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 size={18} /> Biometric Login
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Use Face ID or fingerprint to login</p>
                  </div>
                  <button type="button" className="px-4 py-2 bg-teal-600/20 border border-teal-600 text-teal-400 rounded font-semibold hover:bg-teal-600/30 transition-all">
                    Setup
                  </button>
                </div>
              </div>

              {/* Login Activity */}
              <div>
                <p className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
                  <Activity size={18} /> Recent Login Activity
                </p>
                <div className="space-y-2">
                  <div className="bg-black/50 rounded p-3 text-sm">
                    <p className="text-gray-300">iPhone 14 Pro - Home</p>
                    <p className="text-gray-500">Today at 2:30 PM</p>
                  </div>
                  <div className="bg-black/50 rounded p-3 text-sm">
                    <p className="text-gray-300">MacBook Pro - Home</p>
                    <p className="text-gray-500">Today at 9:15 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Trusted Devices</h2>

              <div className="space-y-3">
                {trustedDevicesData.map((device) => (
                  <div key={device.id} className="bg-black/50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{device.name}</p>
                      <p className="text-gray-500 text-sm">{device.type} • {device.location} • {device.os}</p>
                      <p className="text-gray-600 text-xs mt-1">Last active: {device.lastActive}</p>
                    </div>
                    <button type="button" className="text-red-400 hover:text-red-300 font-semibold text-sm">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Active Sessions</h2>

              <div className="space-y-3">
                {activeSessionsData.map((session) => (
                  <div key={session.id} className="bg-black/50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{session.device}</p>
                        {session.active && <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">Active</span>}
                      </div>
                      <p className="text-gray-500 text-sm">{session.location} • {session.ip}</p>
                      <p className="text-gray-600 text-xs mt-1">Logged in: {session.loginTime}</p>
                    </div>
                    <button type="button" className="text-red-400 hover:text-red-300 font-semibold text-sm">
                      Logout
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" className="w-full mt-6 px-4 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded font-semibold hover:bg-red-600/30 transition-all">
                Logout All Other Sessions
              </button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {guardianStatsData.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-white text-3xl font-bold">{stat.value}</p>
                      </div>
                      <Icon size={24} className={stat.color} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6">Guardian Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/50 rounded">
                  <span className="text-gray-300">Total Check-ins</span>
                  <span className="text-teal-400 font-bold">342</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/50 rounded">
                  <span className="text-gray-300">Alerts Responded</span>
                  <span className="text-teal-400 font-bold">89</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/50 rounded">
                  <span className="text-gray-300">Avg Response Time</span>
                  <span className="text-teal-400 font-bold">2.3 min</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black/50 rounded">
                  <span className="text-gray-300">Messages Sent</span>
                  <span className="text-teal-400 font-bold">156</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === 'connections' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <Users size={24} /> Connection to Violet
              </h2>

              <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-black/50 rounded-lg p-6 border border-teal-600/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white text-2xl font-bold">{violetConnectionData.name}</p>
                      <p className="text-gray-400 text-sm">Age {violetConnectionData.age}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-green-400 font-semibold capitalize">{violetConnectionData.status}</span>
                      </div>
                      <p className="text-gray-500 text-xs">Last sync: {violetConnectionData.lastSync}</p>
                    </div>
                  </div>

                  {/* Connection Strength */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">Connection Strength</span>
                      <span className="text-teal-400 font-bold">{violetConnectionData.connectionStrength}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${violetConnectionData.connectionStrength}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Data Shared */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Download size={18} /> Data Being Shared
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {violetConnectionData.dataShared.map((data, idx) => (
                      <div key={idx} className="bg-teal-900/20 border border-teal-600/30 rounded p-3">
                        <p className="text-teal-400 text-sm font-semibold">{data}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield size={18} /> Your Permissions
                  </h3>
                  <div className="space-y-2">
                    {violetConnectionData.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-black/50 rounded">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="text-gray-300">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection Actions */}
                <div className="flex gap-2 pt-4 border-t border-teal-600/20">
                  <button type="button" className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors">
                    Message Violet
                  </button>
                  <button type="button" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors">
                    View Profile
                  </button>
                  <button type="button" onClick={() => window.location.href = '/guardian/permissions'} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition-colors">
                    Manage Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-white text-xl font-bold mb-4">Change Password</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Update Password
                </button>
                <button type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-red-600 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-red-400" />
                <h2 className="text-white text-xl font-bold">Logout</h2>
              </div>
              <p className="text-gray-300 mb-6">Are you sure you want to logout? You&apos;ll need to login again to access your account.</p>
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => {
                    setShowLogoutModal(false);
                    alert('Logged out successfully!');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Yes, Logout
                </button>
                <button type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}

