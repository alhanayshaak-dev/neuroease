'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  message_type: 'update' | 'alert' | 'suggestion' | 'general';
  created_at: string;
}

interface TherapistMessagingProps {
  patientId: string;
  patientName: string;
  therapistName: string;
  messages?: Message[];
  onSendMessage?: (
    message: string,
    messageType: 'update' | 'alert' | 'suggestion' | 'general'
  ) => void;
  onClose?: () => void;
}

export function TherapistMessaging({
  patientId,
  patientName,
  therapistName,
  messages = [],
  onSendMessage,
  onClose,
}: TherapistMessagingProps) {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'update' | 'alert' | 'suggestion' | 'general'>(
    'general'
  );
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedMessages(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage?.(messageText, messageType);
      setMessageText('');
      setMessageType('general');
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-overload/10 border-overload/30 text-overload';
      case 'suggestion':
        return 'bg-primary-400/10 border-primary-400/30 text-primary-400';
      case 'update':
        return 'bg-calm/10 border-calm/30 text-calm';
      default:
        return 'bg-neutral-800 border-neutral-700 text-neutral-300';
    }
  };

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'alert':
        return 'Alert';
      case 'suggestion':
        return 'Suggestion';
      case 'update':
        return 'Update';
      default:
        return 'Message';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-lg border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div>
          <h3 className="font-semibold text-neutral-100">{patientName}</h3>
          <p className="text-xs text-neutral-500">Patient ID: {patientId}</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-800 rounded transition-colors">
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-neutral-500 text-sm">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === 'therapist' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg border ${getMessageTypeColor(msg.message_type)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">{msg.sender_name}</span>
                  <span className="text-xs opacity-75">
                    {getMessageTypeBadge(msg.message_type)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-800 p-4 space-y-3">
        {/* Message Type Selector */}
        <div className="flex gap-2">
          {(['general', 'update', 'suggestion', 'alert'] as const).map((type) => (
            <button type="button"
              key={type}
              onClick={() => setMessageType(type)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                messageType === type
                  ? 'bg-primary-400/20 text-primary-400'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-primary-400"
          />
          <button type="button"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="px-4 py-2 bg-primary-400 text-neutral-900 rounded font-medium hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

