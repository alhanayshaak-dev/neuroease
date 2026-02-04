'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Users,
  MessageSquare,
  Shield,
  Video,
  Search,
  Send,
  Eye,
  FileText,
  Mic,
  VideoIcon,
  X,
  Paperclip,
} from 'lucide-react';

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  email: string;
  permissions: string[];
  lastActive: string;
  status?: 'online' | 'away' | 'offline';
  schedule?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  attachment?: string;
}

interface Chat {
  id: string;
  name: string;
  type: 'personal' | 'group';
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  participants?: string[];
}

export default function CareCirclePage() {
  const [activeView, setActiveView] = useState<'chats' | 'guardians'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [showGuardianDetails, setShowGuardianDetails] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      id: '1',
      name: 'Avery Gray',
      relationship: 'Mother (Primary)',
      email: 'avery@example.com',
      permissions: ['All except mic/camera'],
      lastActive: 'Now',
      status: 'online',
      schedule: 'Weekly check-in: Sunday 6:00 PM',
    },
    {
      id: '2',
      name: 'Kai Azer',
      relationship: 'Father',
      email: 'kai@example.com',
      permissions: ['Status', 'Alerts', 'Trends'],
      lastActive: '2 hours ago',
      status: 'away',
      schedule: 'Therapy session: Thursday 3:00 PM',
    },
    {
      id: '3',
      name: 'Sophie Falcone',
      relationship: 'Therapist',
      email: 'sophie@example.com',
      permissions: ['Trends', 'Medical', 'Strategies'],
      lastActive: '1 day ago',
      status: 'offline',
      schedule: 'Monthly review: 1st Friday 2:00 PM',
    },
    {
      id: '4',
      name: 'Scarlet White',
      relationship: 'Teacher',
      email: 'scarlet@example.com',
      permissions: ['Status only'],
      lastActive: '3 days ago',
      status: 'offline',
      schedule: 'School updates: As needed',
    },
  ]);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relationship: '',
    email: '',
  });
  const [permissions, setPermissions] = useState({
    viewStatus: true,
    viewAlerts: true,
    viewTrends: true,
    viewMedical: true,
    viewStrategies: true,
    microphone: false,
    camera: false,
    fileSharing: true,
  });

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Avery Gray',
      type: 'personal',
      lastMessage: 'How is Violet doing today?',
      lastMessageTime: '2:30 PM',
      unread: 0,
    },
    {
      id: '2',
      name: 'Care Circle Group',
      type: 'group',
      lastMessage: 'Sophie: New coping strategies to try',
      lastMessageTime: '1:15 PM',
      unread: 2,
      participants: ['Avery Gray', 'Kai Azer', 'Sophie Falcone'],
    },
    {
      id: '3',
      name: 'Kai Azer',
      type: 'personal',
      lastMessage: 'See you at the appointment',
      lastMessageTime: 'Yesterday',
      unread: 0,
    },
    {
      id: '4',
      name: 'Sophie Falcone',
      type: 'personal',
      lastMessage: 'Violet is making great progress',
      lastMessageTime: '3 days ago',
      unread: 0,
    },
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'Kai Azer',
      message: 'How was Violet\'s day today?',
      timestamp: '2:30 PM',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'You',
      message: 'Pretty good! She had a calm morning and did well at school.',
      timestamp: '2:45 PM',
      isOwn: true,
    },
    {
      id: '3',
      sender: 'Sophie Falcone',
      message: 'I\'d like to discuss the new coping strategies we discussed.',
      timestamp: '3:15 PM',
      isOwn: false,
    },
    {
      id: '4',
      sender: 'You',
      message: 'Sure! She\'s been using the breathing exercises. They seem to help.',
      timestamp: '3:20 PM',
      isOwn: true,
      attachment: 'breathing_guide.pdf',
    },
  ];

  const handlePermissionChange = (key: string) => {
    setPermissions({
      ...permissions,
      [key]: !permissions[key as keyof typeof permissions],
    });
  };

  const handleAddMember = () => {
    if (newMemberForm.name && newMemberForm.email) {
      const newGuardian: Guardian = {
        id: Date.now().toString(),
        name: newMemberForm.name,
        relationship: newMemberForm.relationship,
        email: newMemberForm.email,
        permissions: ['Status only'],
        lastActive: 'Just added',
        status: 'offline',
        schedule: 'To be scheduled',
      };
      setGuardians([...guardians, newGuardian]);
      setNewMemberForm({ name: '', relationship: '', email: '' });
      setShowAddMemberModal(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    setGuardians(guardians.filter(g => g.id !== id));
    setShowGuardianDetails(false);
  };

  const handleUpdateMember = () => {
    if (selectedGuardian) {
      setGuardians(guardians.map(g => 
        g.id === selectedGuardian.id 
          ? { ...selectedGuardian, ...newMemberForm }
          : g
      ));
      setShowEditMemberModal(false);
      setShowGuardianDetails(false);
    }
  };

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Care Circle</h1>
            <p className="text-xs text-gray-400">Connect with your care team</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveView('chats')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeView === 'chats'
                ? 'bg-teal-600 text-white'
                : 'bg-navy-900 text-gray-400 hover:text-teal-300'
            }`}
          >
            <MessageSquare size={18} className="inline mr-2" />
            Messages
          </button>
          <button
            type="button"
            onClick={() => setActiveView('guardians')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeView === 'guardians'
                ? 'bg-teal-600 text-white'
                : 'bg-navy-900 text-gray-400 hover:text-teal-300'
            }`}
          >
            <Users size={18} className="inline mr-2" />
            Guardians
          </button>
        </div>

        {/* Chats View - Mobile First */}
        {activeView === 'chats' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search contacts & groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900 border border-teal-600/30 rounded pl-10 pr-4 py-2 text-white placeholder-gray-500"
              />
            </div>

            {/* Contacts & Groups List */}
            <div className="space-y-2">
              {mockChats.map((chat) => (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="w-full bg-navy-900 border border-teal-600/30 rounded-lg p-4 hover:border-teal-400 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">{chat.name}</p>
                      {chat.type === 'group' && (
                        <p className="text-gray-400 text-xs">{chat.participants?.length} members</p>
                      )}
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-teal-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
                  <p className="text-gray-500 text-xs mt-1">{chat.lastMessageTime}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window - Shown after selecting a chat */}
        {selectedChat && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Chat Header - Fixed at top */}
            <div className="bg-teal-600/20 border-b border-teal-600/30 p-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-40">
              <button
                type="button"
                onClick={() => setSelectedChat(null)}
                className="text-teal-400 hover:text-teal-300 font-semibold"
              >
                ← Back
              </button>
              <div className="flex-1 text-center">
                <h3 className="text-white font-semibold">{selectedChat.name}</h3>
                {selectedChat.type === 'group' && (
                  <p className="text-gray-400 text-xs">{selectedChat.participants?.length} members</p>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" className="p-2 hover:bg-teal-600/20 rounded transition-colors">
                  <Video size={18} className="text-teal-400" />
                </button>
                <button type="button" className="p-2 hover:bg-teal-600/20 rounded transition-colors">
                  <Search size={18} className="text-teal-400" />
                </button>
              </div>
            </div>

            {/* Messages - Scrollable middle section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.isOwn
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {!msg.isOwn && <p className="text-xs font-semibold text-teal-300 mb-1">{msg.sender}</p>}
                    <p className="text-sm">{msg.message}</p>
                    {msg.attachment && (
                      <div className="mt-2 flex items-center gap-1 text-xs opacity-80">
                        <FileText size={14} />
                        {msg.attachment}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="bg-black border-t border-teal-600/30 p-4 space-y-3 flex-shrink-0 sticky bottom-0 z-40">
              {/* Media & Share Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button type="button" className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-600/30 hover:border-teal-600 rounded text-teal-400 text-sm transition-colors">
                  <FileText size={16} />
                  Share Report
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-600/30 hover:border-teal-600 rounded text-teal-400 text-sm transition-colors">
                  <Paperclip size={16} />
                  Attach File
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-600/30 hover:border-teal-600 rounded text-teal-400 text-sm transition-colors">
                  <Mic size={16} />
                  Voice
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-600/30 hover:border-teal-600 rounded text-teal-400 text-sm transition-colors">
                  <VideoIcon size={16} />
                  Video
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 border border-teal-600/30 hover:border-teal-600 rounded text-teal-400 text-sm transition-colors">
                  <Eye size={16} />
                  Photo
                </button>
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && newMessage.trim() && alert('Message sent!')}
                  className="flex-1 bg-black/50 border border-teal-600/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-600"
                />
                <button type="button"
                  onClick={() => newMessage.trim() && alert('Message sent!')}
                  disabled={!newMessage.trim()}
                  className="px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 text-white rounded font-semibold transition-colors flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guardians View */}
        {activeView === 'guardians' && (
          <div className="space-y-3">
            {/* Add Member Button */}
            <button
              type="button"
              onClick={() => setShowAddMemberModal(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Users size={18} />
              Add Member
            </button>

            {guardians.map((guardian) => (
              <div
                key={guardian.id}
                className="w-full bg-navy-900 border border-teal-600/30 rounded-lg p-4 hover:border-teal-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGuardian(guardian);
                      setShowGuardianDetails(true);
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          guardian.status === 'online'
                            ? 'bg-green-400'
                            : guardian.status === 'away'
                            ? 'bg-yellow-400'
                            : 'bg-gray-500'
                        }`}
                      ></div>
                      <div>
                        <p className="text-white font-semibold">{guardian.name}</p>
                        <p className="text-gray-400 text-sm">{guardian.relationship}</p>
                        <p className="text-gray-500 text-xs mt-1">{guardian.email}</p>
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGuardian(guardian);
                        setNewMemberForm({
                          name: guardian.name,
                          relationship: guardian.relationship,
                          email: guardian.email,
                        });
                        setShowEditMemberModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-semibold transition-colors"
                      title="Edit member"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(guardian.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-semibold transition-colors"
                      title="Delete member"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {guardian.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guardian Details Modal */}
        {showGuardianDetails && selectedGuardian && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white text-2xl font-bold">{selectedGuardian.name}</h2>
                  <p className="text-gray-400">{selectedGuardian.relationship}</p>
                </div>
                <button type="button"
                  onClick={() => setShowGuardianDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-3">Contact</h3>
                  <p className="text-gray-300 text-sm mb-2">{selectedGuardian.email}</p>
                  <p className="text-gray-400 text-xs">Last active: {selectedGuardian.lastActive}</p>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="text-teal-400 font-semibold mb-3">Schedule</h3>
                  <p className="text-gray-300 text-sm">{selectedGuardian.schedule}</p>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-6">
                <h3 className="text-teal-400 font-semibold mb-3">Permissions</h3>
                <div className="space-y-2">
                  {selectedGuardian.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-black/50 rounded">
                      <span className="text-gray-300 text-sm">{perm}</span>
                      <Eye size={16} className="text-teal-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button type="button" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Message
                </button>
                <button type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2">
                  <Video size={18} />
                  Video Call
                </button>
                <button type="button"
                  onClick={() => {
                    setShowPermissionsModal(true);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Shield size={18} />
                  Edit Perms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Add Member</h2>
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Relationship</label>
                  <input
                    type="text"
                    value={newMemberForm.relationship}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relationship: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="e.g., Parent, Therapist"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={handleAddMember}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Add
                </button>
                <button type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditMemberModal && selectedGuardian && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Edit Member</h2>
                <button type="button" onClick={() => setShowEditMemberModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Relationship</label>
                  <input
                    type="text"
                    value={newMemberForm.relationship}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relationship: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="e.g., Parent, Therapist"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={handleUpdateMember}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Update
                </button>
                <button type="button"
                  onClick={() => setShowEditMemberModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Permissions Modal */}
        {showPermissionsModal && selectedGuardian && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="bg-navy-900 border border-teal-600 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Manage Permissions</h2>
                <button type="button" onClick={() => setShowPermissionsModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-300 mb-4 font-semibold">{selectedGuardian.name}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-black/70 rounded">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-teal-400" />
                    <span className="text-gray-300">View Status</span>
                  </div>
                  <button type="button"
                    onClick={() => handlePermissionChange('viewStatus')}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      permissions.viewStatus
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {permissions.viewStatus ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/70 rounded">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-teal-400" />
                    <span className="text-gray-300">View Trends</span>
                  </div>
                  <button type="button"
                    onClick={() => handlePermissionChange('viewTrends')}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      permissions.viewTrends
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {permissions.viewTrends ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-600/30 rounded">
                  <div className="flex items-center gap-2">
                    <Mic size={18} className="text-red-400" />
                    <span className="text-gray-300">Microphone (Disabled)</span>
                  </div>
                  <button type="button"
                    disabled
                    className="px-3 py-1 rounded text-sm font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
                  >
                    Off
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-600/30 rounded">
                  <div className="flex items-center gap-2">
                    <VideoIcon size={18} className="text-red-400" />
                    <span className="text-gray-300">Camera (Disabled)</span>
                  </div>
                  <button type="button"
                    disabled
                    className="px-3 py-1 rounded text-sm font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
                  >
                    Off
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Save
                </button>
                <button type="button"
                  onClick={() => setShowPermissionsModal(false)}
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



