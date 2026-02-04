'use client';

// Force rebuild v3

// Force rebuild

import { Database } from '@/types/database';
import { useEffect, useState } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

type Message = Database['public']['Tables']['care_circle_messages']['Row'] & {
  sender?: Database['public']['Tables']['users']['Row'];
};

interface CareCircleMessagesProps {
  patientId?: string;
}

const MESSAGE_TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  update: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Update' },
  alert: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Alert' },
  suggestion: { bg: 'bg-teal-500/20', text: 'text-teal-300', label: 'Suggestion' },
  general: { bg: 'bg-neutral-700/50', text: 'text-neutral-300', label: 'Message' },
};

export function CareCircleMessages({}: CareCircleMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'update' | 'alert' | 'suggestion' | 'general'>(
    'general'
  );
  const [isSending, setIsSending] = useState(false);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, []);

  // Subscribe to real-time updates
  useRealtimeSubscription({
    tableName: 'care_circle_messages',
    onData: (payload) => {
      if (payload.eventType === 'INSERT') {
        setMessages((prev) => [payload.new as Message, ...prev]);
      } else if (payload.eventType === 'DELETE') {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      }
    },
  });

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/care-circle/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const response = await fetch('/api/care-circle/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          messageType,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setMessageType('general');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 h-96 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="text-center text-neutral-400 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-neutral-400 py-8">No messages yet.</div>
        ) : (
          messages.map((message) => {
            const typeInfo =
              MESSAGE_TYPE_COLORS[message.message_type] || MESSAGE_TYPE_COLORS.general;

            return (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-100 text-sm">
                      {message.sender?.name || 'Unknown'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${typeInfo.bg} ${typeInfo.text}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">{formatTime(message.created_at)}</span>
                </div>
                <p className="text-sm text-neutral-300 break-words">{message.message}</p>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-teal-500 disabled:opacity-50"
          />
          <select
            value={messageType}
            onChange={(e) =>
              setMessageType(e.target.value as 'update' | 'alert' | 'suggestion' | 'general')
            }
            disabled={isSending}
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500 disabled:opacity-50"
          >
            <option value="general">Message</option>
            <option value="update">Update</option>
            <option value="alert">Alert</option>
            <option value="suggestion">Suggestion</option>
          </select>
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

