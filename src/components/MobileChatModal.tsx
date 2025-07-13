'use client';

import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: string;
  type: 'text' | 'location' | 'status';
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    role: string;
    phone: string;
    vehicle?: string;
    status?: string;
  };
}

export default function MobileChatModal({ isOpen, onClose, contact }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'contact',
      content: 'Hi! I\'m currently en route to the destination.',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'user',
      content: 'Great! What\'s your estimated arrival time?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: '3',
      sender: 'contact',
      content: 'ETA is approximately 2:30 PM. Traffic is light.',
      timestamp: '10:33 AM',
      type: 'text'
    },
    {
      id: '4',
      sender: 'contact',
      content: 'Sharing my current location',
      timestamp: '10:35 AM',
      type: 'location'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickMessages = [
    'What\'s your current status?',
    'Please confirm your ETA',
    'Any delays or issues?',
    'Safe driving!',
    'Please share your location',
    'Call me when convenient'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          'Got it, thanks!',
          'Will do, thanks for checking in.',
          'Everything looks good on my end.',
          'Appreciate the update!',
          'No issues here, smooth ride.',
          'Copy that!'
        ];
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'contact',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          type: 'text'
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  const handleQuickMessage = (message: string) => {
    sendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[80vh] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{contact.name}</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <PhoneIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'location'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'location' ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{message.content}</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {quickMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(message)}
                className="flex-shrink-0 px-3 py-1 bg-white text-gray-700 text-xs rounded-full border hover:bg-gray-100 transition-colors"
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
