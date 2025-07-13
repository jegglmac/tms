'use client';

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  PhoneIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    role: string;
    phone: string;
    email?: string;
    vehicle?: string;
    status?: string;
    location?: string;
    lastContact?: string;
    emergencyContact?: string;
  };
}

export default function MobileCallModal({ isOpen, onClose, contact }: CallModalProps) {
  const [selectedContactMethod, setSelectedContactMethod] = useState<'call' | 'sms' | 'email' | 'video'>('call');
  const [showEmergency, setShowEmergency] = useState(false);

  if (!isOpen) return null;

  const handleCall = (phoneNumber: string) => {
    // Log the contact attempt
    console.log(`Initiating call to ${contact.name} at ${phoneNumber}`);
    // Initiate phone call
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSMS = (phoneNumber: string, message?: string) => {
    // Log the SMS attempt
    console.log(`Sending SMS to ${contact.name} at ${phoneNumber}`);
    // Open SMS app with optional pre-filled message
    const smsUrl = message 
      ? `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
      : `sms:${phoneNumber}`;
    window.location.href = smsUrl;
  };

  const handleEmail = (emailAddress: string, subject?: string) => {
    if (!emailAddress) {
      alert('Email address not available for this contact');
      return;
    }
    // Open email client
    const emailUrl = subject 
      ? `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`
      : `mailto:${emailAddress}`;
    window.location.href = emailUrl;
  };

  const handleVideoCall = () => {
    // In a real app, this would integrate with Teams, Zoom, etc.
    alert('Video call feature would integrate with your organization\'s video platform (Teams, Zoom, etc.)');
  };

  const handleEmergencyContact = () => {
    if (contact.emergencyContact) {
      const confirmCall = window.confirm(
        `This will call the emergency contact: ${contact.emergencyContact}. Continue?`
      );
      if (confirmCall) {
        window.location.href = `tel:${contact.emergencyContact}`;
      }
    } else {
      alert('Emergency contact not available');
    }
  };

  const quickMessages = [
    'What is your current status?',
    'Please confirm your ETA',
    'Are you experiencing any delays?',
    'Safety check - please respond',
    'Update required on delivery',
    'Please call dispatch when convenient'
  ];

  const contactMethods = [
    {
      id: 'call' as const,
      name: 'Voice Call',
      icon: PhoneIcon,
      color: 'bg-green-600',
      action: () => handleCall(contact.phone),
      available: true
    },
    {
      id: 'sms' as const,
      name: 'Text Message',
      icon: ChatBubbleLeftIcon,
      color: 'bg-blue-600',
      action: () => handleSMS(contact.phone),
      available: true
    },
    {
      id: 'email' as const,
      name: 'Email',
      icon: EnvelopeIcon,
      color: 'bg-purple-600',
      action: () => handleEmail(contact.email || '', `TMS Update - ${contact.name}`),
      available: !!contact.email
    },
    {
      id: 'video' as const,
      name: 'Video Call',
      icon: VideoCameraIcon,
      color: 'bg-indigo-600',
      action: handleVideoCall,
      available: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center space-x-3">
            <PhoneIcon className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
              <p className="text-sm text-gray-600">{contact.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Contact Info */}
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.role}</p>
              {contact.vehicle && (
                <p className="text-sm text-blue-600 mt-1">Vehicle: {contact.vehicle}</p>
              )}
              
              {/* Status and Location */}
              <div className="flex justify-center space-x-4 mt-3">
                {contact.status && (
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    contact.status === 'Available' ? 'bg-green-100 text-green-800' :
                    contact.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                    contact.status === 'On Route' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status}
                  </span>
                )}
                {contact.location && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    📍 {contact.location}
                  </span>
                )}
              </div>

              {contact.lastContact && (
                <p className="text-xs text-gray-500 mt-2">
                  Last contact: {contact.lastContact}
                </p>
              )}
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Contact Methods</h4>
              <div className="grid grid-cols-2 gap-3">
                {contactMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={method.action}
                    disabled={!method.available}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                      method.available
                        ? `${method.color} text-white hover:opacity-90 transform hover:scale-105`
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <method.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{method.name}</span>
                    {!method.available && (
                      <span className="text-xs mt-1">Not available</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 mt-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Phone Number</p>
                <p className="text-lg text-gray-700 font-mono">{contact.phone}</p>
              </div>
              
              {contact.email && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-700">{contact.email}</p>
                </div>
              )}
            </div>

            {/* Quick Messages */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Messages</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleSMS(contact.phone, message)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    💬 "{message}"
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            {contact.emergencyContact && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Emergency Contact</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Use only in case of emergency or when unable to reach driver
                </p>
                <button
                  onClick={handleEmergencyContact}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Call Emergency Contact</span>
                </button>
              </div>
            )}

            {/* Contact Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Contact Tips</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use quick messages for routine updates</li>
                <li>• Call for urgent matters or complex issues</li>
                <li>• Video calls for training or technical support</li>
                <li>• Email for documentation and records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
