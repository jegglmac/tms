'use client';

import React, { useState, useEffect } from 'react';
import MobileNav from '@/components/MobileNav';
import MobileMapModal from '@/components/MobileMapModal';
import MobileCallModal from '@/components/MobileCallModal';
import MobileChatModal from '@/components/MobileChatModal';
import { TruckIcon, MapPinIcon, PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

// Sample vehicle data
const sampleVehicles = [
  {
    id: 'TMS-001',
    name: 'Truck 001',
    driver: 'John Smith',
    position: { lat: 40.7128, lng: -74.0060 },
    destination: 'Newark, NJ',
    status: 'En Route',
    speed: 65,
    fuel: 78,
    phone: '+1-555-0101'
  },
  {
    id: 'TMS-002', 
    name: 'Truck 002',
    driver: 'Sarah Johnson',
    position: { lat: 40.6892, lng: -74.0445 },
    destination: 'Brooklyn, NY',
    status: 'Loading',
    speed: 0,
    fuel: 85,
    phone: '+1-555-0102'
  }
];

export default function LiveTrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<typeof sampleVehicles[0] | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Quick page load simulation
  useEffect(() => {
    setTimeout(() => setIsPageLoading(false), 300);
  }, []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <div className="text-sm text-gray-600">Loading Live Tracking...</div>
        </div>
      </div>
    );
  }

  const handleMapView = (vehicle: typeof sampleVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setShowMapModal(true);
  };

  const handleCall = (vehicle: typeof sampleVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setShowCallModal(true);
  };

  const handleChat = (vehicle: typeof sampleVehicles[0]) => {
    setSelectedVehicle(vehicle);
    setShowChatModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav currentPage="/live-tracking" />
      
      <div className="pb-20 md:pb-0 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Tracking</h1>
          
          <div className="bg-green-100 border border-green-500 rounded p-4 mb-6">
            <p className="text-green-800 font-medium">✅ Full interactive features added!</p>
          </div>
          
          <div className="space-y-4">
            {sampleVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.driver}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.status === 'En Route' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Speed</p>
                    <p className="font-medium">{vehicle.speed} mph</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fuel</p>
                    <p className="font-medium">{vehicle.fuel}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleMapView(vehicle)}
                    className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Map</span>
                  </button>
                  <button
                    onClick={() => handleCall(vehicle)}
                    className="flex items-center justify-center space-x-1 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleChat(vehicle)}
                    className="flex items-center justify-center space-x-1 py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Interactive Modals */}
      <MobileMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        vehicle={selectedVehicle || undefined}
      />
      
      <MobileCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        contact={selectedVehicle ? {
          name: selectedVehicle.driver,
          phone: selectedVehicle.phone,
          role: 'Driver',
          vehicle: selectedVehicle.name,
          status: selectedVehicle.status
        } : {
          name: '',
          phone: '',
          role: ''
        }}
      />

      <MobileChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        contact={selectedVehicle ? {
          name: selectedVehicle.driver,
          role: 'Driver',
          phone: selectedVehicle.phone,
          vehicle: selectedVehicle.name,
          status: selectedVehicle.status
        } : {
          name: '',
          role: '',
          phone: ''
        }}
      />
    </div>
  );
}
