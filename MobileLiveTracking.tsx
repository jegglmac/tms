'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  UserIcon,
  BoltIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  BeakerIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import MobileMapModal from './MobileMapModal';
import MobileCallModal from './MobileCallModal';
import MobileChatModal from './MobileChatModal';
import MobileDirectionsModal from './MobileDirectionsModal';

interface Vehicle {
  id: string;
  name: string;
  driver: string;
  status: 'In Transit' | 'Loading' | 'Delivered' | 'Maintenance' | 'Idle';
  speed: number;
  fuel: number;
  battery: number;
  signal: number;
  position: { lat: number; lng: number };
  destination: string;
  eta: string;
  cargo: string;
  alerts: string[];
  lastUpdate: string;
}

export default function MobileLiveTracking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'TRK-001',
      name: 'Truck Alpha',
      driver: 'John Smith',
      status: 'In Transit',
      speed: 65,
      fuel: 78,
      battery: 85,
      signal: 92,
      position: { lat: 40.7128, lng: -74.0060 },
      destination: 'Boston, MA',
      eta: '2:30 PM',
      cargo: 'Electronics',
      alerts: ['Maintenance Due'],
      lastUpdate: '2 min ago'
    },
    {
      id: 'TRK-002',
      name: 'Truck Beta',
      driver: 'Sarah Johnson',
      status: 'Loading',
      speed: 0,
      fuel: 92,
      battery: 67,
      signal: 88,
      position: { lat: 40.7580, lng: -73.9855 },
      destination: 'Hartford, CT',
      eta: '4:15 PM',
      cargo: 'Medical Supplies',
      alerts: ['Delayed Schedule'],
      lastUpdate: '1 min ago'
    },
    {
      id: 'VAN-001',
      name: 'Delivery Van A',
      driver: 'Mike Wilson',
      status: 'Delivered',
      speed: 0,
      fuel: 34,
      battery: 45,
      signal: 95,
      position: { lat: 40.6892, lng: -74.0445 },
      destination: 'New Haven, CT',
      eta: 'Completed',
      cargo: 'Furniture',
      alerts: ['Low Fuel'],
      lastUpdate: '5 min ago'
    },
    {
      id: 'VAN-002',
      name: 'Delivery Van B',
      driver: 'Lisa Chen',
      status: 'In Transit',
      speed: 35,
      fuel: 67,
      battery: 78,
      signal: 84,
      position: { lat: 40.7282, lng: -73.7949 },
      destination: 'Albany, NY',
      eta: '6:45 PM',
      cargo: 'Textiles',
      alerts: [],
      lastUpdate: 'Just now'
    }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [filter, setFilter] = useState<'all' | 'alerts' | 'active'>('all');
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-green-100 text-green-800';
      case 'Loading': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalBars = (signal: number) => {
    const bars = Math.ceil(signal / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 ${i < bars ? 'bg-green-500' : 'bg-gray-300'}`}
        style={{ height: `${(i + 1) * 3}px` }}
      />
    ));
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'bg-green-500';
    if (battery > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleMapView = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setShowMapModal(true);
  };

  const handleCall = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setShowCallModal(true);
  };

  const handleChat = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setShowChatModal(true);
  };

  const handleDirections = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setShowDirectionsModal(true);
  };

  const getContactInfo = (vehicle: Vehicle) => ({
    name: vehicle.driver,
    role: 'Driver',
    phone: '+1 (555) 123-4567', // In real app, this would come from vehicle data
    vehicle: vehicle.name,
    status: vehicle.status === 'In Transit' ? 'Available' : 
            vehicle.status === 'Loading' ? 'Busy' : 'Available'
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    switch (filter) {
      case 'alerts': return vehicle.alerts.length > 0;
      case 'active': return vehicle.status === 'In Transit' || vehicle.status === 'Loading';
      default: return true;
    }
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        speed: vehicle.status === 'In Transit' ? 
          Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10) : vehicle.speed,
        lastUpdate: 'Just now'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [isTracking]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Tracking</h1>
              <p className="text-sm text-gray-600">Real-time fleet monitoring</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`p-2 rounded-lg ${isTracking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
          >
            {isTracking ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-bold text-green-600">{vehicles.filter(v => v.status === 'In Transit').length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{vehicles.filter(v => v.alerts.length > 0).length}</p>
            <p className="text-xs text-gray-600">Alerts</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{vehicles.filter(v => v.status === 'Delivered').length}</p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        {[
          { key: 'all', label: 'All Vehicles', count: vehicles.length },
          { key: 'active', label: 'Active', count: vehicles.filter(v => v.status === 'In Transit' || v.status === 'Loading').length },
          { key: 'alerts', label: 'Alerts', count: vehicles.filter(v => v.alerts.length > 0).length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
              filter === tab.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
              className="w-full p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <TruckIcon className="w-8 h-8 text-blue-600" />
                    {vehicle.alerts.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                  {selectedVehicle === vehicle.id ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>{vehicle.driver}</span>
                <span>{vehicle.lastUpdate}</span>
              </div>
            </button>

            {selectedVehicle === vehicle.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {/* Device Status */}
                <div className="grid grid-cols-3 gap-3 mb-4 mt-4">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <BoltIcon className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <div className={`w-6 h-2 rounded ${getBatteryColor(vehicle.battery)}`}></div>
                        <span className="text-xs text-gray-600">{vehicle.battery}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <WifiIcon className="w-4 h-4 text-gray-600" />
                    <div className="flex items-center space-x-1">
                      {getSignalBars(vehicle.signal)}
                      <span className="text-xs text-gray-600">{vehicle.signal}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <BeakerIcon className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <div className={`w-6 h-2 rounded ${vehicle.fuel > 50 ? 'bg-green-500' : vehicle.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-600">{vehicle.fuel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Destination</p>
                      <p className="text-sm text-gray-600">{vehicle.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">ETA</p>
                      <p className="text-sm text-blue-600">{vehicle.eta}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cargo</p>
                      <p className="text-sm text-gray-600">{vehicle.cargo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Speed</p>
                      <p className="text-sm text-green-600">{Math.round(vehicle.speed)} mph</p>
                    </div>
                  </div>

                  {vehicle.alerts.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-medium text-red-900">Alerts</p>
                      </div>
                      {vehicle.alerts.map((alert, index) => (
                        <p key={index} className="text-sm text-red-700">• {alert}</p>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    <button 
                      onClick={() => handleMapView(vehicle)}
                      className="flex flex-col items-center justify-center py-2 px-2 bg-blue-600 text-white rounded-lg text-xs"
                    >
                      <EyeIcon className="w-4 h-4 mb-1" />
                      <span>Map</span>
                    </button>
                    <button 
                      onClick={() => handleDirections(vehicle)}
                      className="flex flex-col items-center justify-center py-2 px-2 bg-indigo-600 text-white rounded-lg text-xs"
                    >
                      <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                      <span>Nav</span>
                    </button>
                    <button 
                      onClick={() => handleCall(vehicle)}
                      className="flex flex-col items-center justify-center py-2 px-2 bg-green-600 text-white rounded-lg text-xs"
                    >
                      <PhoneIcon className="w-4 h-4 mb-1" />
                      <span>Call</span>
                    </button>
                    <button 
                      onClick={() => handleChat(vehicle)}
                      className="flex flex-col items-center justify-center py-2 px-2 bg-purple-600 text-white rounded-lg text-xs"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4 mb-1" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Update Indicator */}
      {isTracking && (
        <div className="fixed bottom-24 right-4 bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
          <ArrowPathIcon className="w-4 h-4 animate-spin" />
          <span>Live</span>
        </div>
      )}

      {/* Modals */}
      {activeVehicle && (
        <>
          <MobileMapModal
            isOpen={showMapModal}
            onClose={() => setShowMapModal(false)}
            vehicle={{
              id: activeVehicle.id,
              name: activeVehicle.name,
              driver: activeVehicle.driver,
              position: activeVehicle.position,
              destination: activeVehicle.destination,
              status: activeVehicle.status
            }}
          />
          
          <MobileCallModal
            isOpen={showCallModal}
            onClose={() => setShowCallModal(false)}
            contact={getContactInfo(activeVehicle)}
          />
          
          <MobileChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            contact={getContactInfo(activeVehicle)}
          />
          
          <MobileDirectionsModal
            isOpen={showDirectionsModal}
            onClose={() => setShowDirectionsModal(false)}
            origin={{
              lat: activeVehicle.position.lat,
              lng: activeVehicle.position.lng,
              address: `${activeVehicle.position.lat.toFixed(4)}, ${activeVehicle.position.lng.toFixed(4)}`
            }}
            destination={{
              address: activeVehicle.destination
            }}
            vehicle={{
              id: activeVehicle.id,
              name: activeVehicle.name,
              driver: activeVehicle.driver
            }}
          />
        </>
      )}
    </div>
  );
}
