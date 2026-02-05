'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, HelpCircle, Lightbulb, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export function DashboardChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hi! I\'m your NeuroFlow assistant. I can help with quick searches, app navigation, and community tips. What would you like help with?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { icon: HelpCircle, label: 'Quick Search', action: 'search' },
    { icon: Lightbulb, label: 'App Tips', action: 'tips' },
    { icon: Users, label: 'Community', action: 'community' },
  ];

  const handleQuickAction = (action: string) => {
    let userMessage = '';
    let botResponse = '';

    switch (action) {
      case 'search':
        userMessage = 'How do I search for something?';
        botResponse = 'You can search for coping strategies, community posts, and resources using the search bar on each page. Try searching for "breathing exercises" or "stress management" to find helpful content.';
        break;
      case 'tips':
        userMessage = 'Give me app tips';
        botResponse = 'Here are some helpful tips:\n• Use Emergency Mode when stress levels spike\n• Check the Care Circle for support from your guardians\n• Log triggers to track patterns\n• View analytics to see your progress\n• Customize settings for accessibility\n• Join community challenges for motivation';
        break;
      case 'community':
        userMessage = 'Tell me about the community';
        botResponse = 'The Community section has:\n• Trending strategies shared by others\n• Success stories from real users\n• Peer support matching\n• Learning resources\n• Support groups\n• User profiles to connect with others\n\nJoin challenges and share your own strategies!';
        break;
    }

    addMessage(userMessage, 'user');
    setTimeout(() => {
      addMessage(botResponse, 'bot');
    }, 500);
  };

  const addMessage = (message: string, type: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';

      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes('stress') || lowerInput.includes('overload')) {
        botResponse = 'For stress management, try:\n• Emergency Mode with box breathing\n• Logging your triggers to identify patterns\n• Using calming strategies from the Patient page\n• Checking your stress trends in analytics\n\nWould you like more specific help?';
      } else if (lowerInput.includes('medication') || lowerInput.includes('dose')) {
        botResponse = 'Medication tracking:\n• View all medications on the Patient page\n• Check adherence rates\n• See refill reminders\n• Review drug interactions\n• Log missed doses\n\nAlways consult your doctor about medication questions.';
      } else if (lowerInput.includes('device') || lowerInput.includes('sensor')) {
        botResponse = 'Device management:\n• Check device status on the Devices page\n• View battery levels and sync status\n• Access detailed analytics by clicking a device\n• Manage wearable integrations\n• Recalibrate sensors as needed\n\nMake sure all devices are properly connected!';
      } else if (lowerInput.includes('care circle') || lowerInput.includes('guardian')) {
        botResponse = 'Care Circle features:\n• Send messages to guardians and therapists\n• Join group chats\n• View guardian schedules and permissions\n• Manage who can access your data\n• Video call with your care team\n\nYour guardians are here to support you!';
      } else if (lowerInput.includes('community') || lowerInput.includes('strategy')) {
        botResponse = 'Community features:\n• Browse trending coping strategies\n• Read success stories\n• Find peer support matches\n• Access learning resources\n• Join support groups\n• Share your own strategies\n\nConnect with others who understand!';
      } else if (lowerInput.includes('settings') || lowerInput.includes('accessibility')) {
        botResponse = 'Settings & Accessibility:\n• Adjust text size and font\n• Enable high contrast mode\n• Change color scheme and theme\n• Manage notifications\n• Control data collection\n• Set do-not-disturb hours\n\nCustomize the app to your needs!';
      } else if (lowerInput.includes('help') || lowerInput.includes('how')) {
        botResponse = 'I can help with:\n• Quick searches\n• App navigation\n• Feature explanations\n• Community tips\n• Stress management\n• Device troubleshooting\n\nWhat would you like to know more about?';
      } else {
        botResponse = 'I can help you with:\n• Navigating the app\n• Understanding features\n• Finding community resources\n• Managing stress and triggers\n• Device setup and troubleshooting\n\nTry asking about stress management, medications, devices, or the community!';
      }

      addMessage(botResponse, 'bot');
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Chatbot Button */}
      <button type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg transition-all z-40"
        type="button"
        title="Open chatbot"
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 w-80 max-w-[calc(100vw-2rem)] bg-black/20 border border-teal-600 rounded-lg shadow-xl z-40 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-transparent border-b border-teal-600/30 p-4 flex items-center justify-between rounded-t-lg">
            <div>
              <h3 className="text-white font-semibold">NeuroFlow Assistant</h3>
              <p className="text-gray-400 text-xs">Quick help & guidance</p>
            </div>
            <button type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-black text-gray-100 rounded-bl-none border border-gray-600'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black text-gray-100 px-4 py-2 rounded-lg rounded-bl-none border border-gray-600">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 border-t border-teal-600/30 space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button type="button"
                    key={action.action}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full flex items-center gap-2 p-2 bg-black hover:bg-gray-900 border border-teal-600/30 hover:border-teal-600 rounded transition-all text-left"
                  >
                    <Icon size={16} className="text-teal-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-teal-600/30 p-3 flex gap-2 rounded-b-lg">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-black/50 border border-teal-600/30 rounded px-3 py-2 text-white placeholder-gray-500 text-sm"
            />
            <button type="button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 text-white p-2 rounded transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

