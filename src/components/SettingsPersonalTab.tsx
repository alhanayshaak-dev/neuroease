'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, XCircle, LogOut } from 'lucide-react';

interface PersonalTabProps {
  onLogout?: () => void;
}

export function SettingsPersonalTab({ onLogout }: PersonalTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: 'Avery Gray',
    email: 'avery.gray@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    relationship: 'Mother',
  });

  return (
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
          <div>
            <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={personalData.name}
                onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{personalData.name}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={personalData.email}
                onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{personalData.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={personalData.phone}
                onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{personalData.phone}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
              <MapPin size={16} /> Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={personalData.location}
                onChange={(e) => setPersonalData({ ...personalData, location: e.target.value })}
                className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white font-semibold">{personalData.location}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2 flex items-center gap-2">
              <User size={16} /> Relationship to Violet
            </label>
            {isEditing ? (
              <select
                value={personalData.relationship}
                onChange={(e) => setPersonalData({ ...personalData, relationship: e.target.value })}
                className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
              >
                <option>Mother</option>
                <option>Father</option>
                <option>Guardian</option>
                <option>Therapist</option>
                <option>Teacher</option>
              </select>
            ) : (
              <p className="text-white font-semibold">{personalData.relationship}</p>
            )}
          </div>

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

      <div className="bg-red-900 border border-red-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Logout</h3>
            <p className="text-gray-400 text-sm">Sign out of your account</p>
          </div>
          <button type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
