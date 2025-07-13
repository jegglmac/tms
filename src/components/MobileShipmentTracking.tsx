'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShareIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import MobileMapModal from './MobileMapModal';
import MobileCallModal from './MobileCallModal';
import MobileChatModal from './MobileChatModal';

interface Shipment {
  id: string;
  route: string;
  origin: string;
  destination: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Exception';
  driver: string;
  vehicle: string;
  progress: number;
  eta: string;
  lastUpdate: string;
  cargo: string;
  trackingEvents: Array<{
    timestamp: string;
    event: string;
    location: string;
    status: 'completed' | 'current' | 'pending';
  }>;
}

export default function MobileShipmentTracking() {
  const [shipments] = useState<Shipment[]>([
    {
      id: 'SP001',
      route: 'New York → Boston',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      status: 'In Transit',
      driver: 'John Smith',
      vehicle: 'TRK-001',
      progress: 65,
      eta: '2:30 PM',
      lastUpdate: '2 min ago',
      cargo: 'Electronics (2.5 tons)',
      trackingEvents: [
        { timestamp: '8:00 AM', event: 'Package picked up', location: 'New York, NY', status: 'completed' },
        { timestamp: '8:30 AM', event: 'Departed facility', location: 'New York, NY', status: 'completed' },
        { timestamp: '11:15 AM', event: 'In transit', location: 'Hartford, CT', status: 'current' },
        { timestamp: '2:30 PM', event: 'Expected delivery', location: 'Boston, MA', status: 'pending' }
      ]
    },
    {
      id: 'SP002',
      route: 'Chicago → Detroit',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      status: 'Pending',
      driver: 'Sarah Johnson',
      vehicle: 'TRK-002',
      progress: 0,
      eta: '4:15 PM',
      lastUpdate: '5 min ago',
      cargo: 'Medical Supplies (1.8 tons)',
      trackingEvents: [
        { timestamp: '10:00 AM', event: 'Order processed', location: 'Chicago, IL', status: 'completed' },
        { timestamp: '11:00 AM', event: 'Loading scheduled', location: 'Chicago, IL', status: 'current' },
        { timestamp: '12:00 PM', event: 'Departure planned', location: 'Chicago, IL', status: 'pending' },
        { timestamp: '4:15 PM', event: 'Expected delivery', location: 'Detroit, MI', status: 'pending' }
      ]
    },
    {
      id: 'SP003',
      route: 'Los Angeles → San Francisco',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      status: 'Delivered',
      driver: 'Mike Wilson',
      vehicle: 'VAN-001',
      progress: 100,
      eta: 'Completed',
      lastUpdate: '1 hour ago',
      cargo: 'Furniture (3.2 tons)',
      trackingEvents: [
        { timestamp: '6:00 AM', event: 'Package picked up', location: 'Los Angeles, CA', status: 'completed' },
        { timestamp: '6:30 AM', event: 'Departed facility', location: 'Los Angeles, CA', status: 'completed' },
        { timestamp: '2:00 PM', event: 'Delivered', location: 'San Francisco, CA', status: 'completed' },
        { timestamp: '2:15 PM', event: 'Delivery confirmed', location: 'San Francisco, CA', status: 'completed' }
      ]
    },
    {
      id: 'SP004',
      route: 'Miami → Orlando',
      origin: 'Miami, FL',
      destination: 'Orlando, FL',
      status: 'Delayed',
      driver: 'Lisa Chen',
      vehicle: 'VAN-002',
      progress: 35,
      eta: '6:45 PM (Delayed)',
      lastUpdate: 'Just now',
      cargo: 'Textiles (1.5 tons)',
      trackingEvents: [
        { timestamp: '9:00 AM', event: 'Package picked up', location: 'Miami, FL', status: 'completed' },
        { timestamp: '9:30 AM', event: 'Departed facility', location: 'Miami, FL', status: 'completed' },
        { timestamp: '1:15 PM', event: 'Traffic delay', location: 'Fort Lauderdale, FL', status: 'current' },
        { timestamp: '6:45 PM', event: 'Expected delivery', location: 'Orlando, FL', status: 'pending' }
      ]
    }
  ]);

  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered' | 'issues'>('all');
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Exception': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Transit': return <TruckIcon className="w-4 h-4 text-green-600" />;
      case 'Pending': return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'Delivered': return <CheckCircleIcon className="w-4 h-4 text-blue-600" />;
      case 'Delayed': 
      case 'Exception': return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      default: return <MapPinIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleMapView = (shipment: Shipment) => {
    setActiveShipment(shipment);
    setShowMapModal(true);
  };

  const handleCall = (shipment: Shipment) => {
    setActiveShipment(shipment);
    setShowCallModal(true);
  };

  const handleChat = (shipment: Shipment) => {
    setActiveShipment(shipment);
    setShowChatModal(true);
  };

  const getContactInfo = (shipment: Shipment) => ({
    name: shipment.driver,
    role: 'Driver',
    phone: '+1 (555) 123-4567', // In real app, this would come from shipment data
    vehicle: shipment.vehicle,
    status: shipment.status === 'In Transit' ? 'Available' : 
            shipment.status === 'Pending' ? 'Busy' : 'Available'
  });

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.driver.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = (() => {
      switch (statusFilter) {
        case 'active': return shipment.status === 'In Transit' || shipment.status === 'Pending';
        case 'delivered': return shipment.status === 'Delivered';
        case 'issues': return shipment.status === 'Delayed' || shipment.status === 'Exception';
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <TruckIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shipment Tracking</h1>
            <p className="text-sm text-gray-600">Track all your deliveries</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, route, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-lg font-bold text-gray-900">{shipments.length}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-lg font-bold text-green-600">{shipments.filter(s => s.status === 'In Transit').length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-lg font-bold text-blue-600">{shipments.filter(s => s.status === 'Delivered').length}</p>
            <p className="text-xs text-gray-600">Delivered</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <p className="text-lg font-bold text-red-600">{shipments.filter(s => s.status === 'Delayed' || s.status === 'Exception').length}</p>
            <p className="text-xs text-gray-600">Issues</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {[
          { key: 'all', label: 'All', count: shipments.length },
          { key: 'active', label: 'Active', count: shipments.filter(s => s.status === 'In Transit' || s.status === 'Pending').length },
          { key: 'delivered', label: 'Delivered', count: shipments.filter(s => s.status === 'Delivered').length },
          { key: 'issues', label: 'Issues', count: shipments.filter(s => s.status === 'Delayed' || s.status === 'Exception').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`flex-shrink-0 py-2 px-4 rounded-lg text-sm font-medium whitespace-nowrap ${
              statusFilter === tab.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Shipment List */}
      <div className="space-y-3">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
              className="w-full p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(shipment.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">#{shipment.id}</h3>
                    <p className="text-sm text-gray-600">{shipment.route}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                  {selectedShipment === shipment.id ? (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{shipment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      shipment.status === 'Delivered' ? 'bg-blue-600' :
                      shipment.status === 'Delayed' ? 'bg-red-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${shipment.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>ETA: {shipment.eta}</span>
                <span>Updated: {shipment.lastUpdate}</span>
              </div>
            </button>

            {selectedShipment === shipment.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {/* Shipment Details */}
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Driver</p>
                      <p className="text-sm text-gray-600">{shipment.driver}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Vehicle</p>
                      <p className="text-sm text-gray-600">{shipment.vehicle}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Cargo</p>
                    <p className="text-sm text-gray-600">{shipment.cargo}</p>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Tracking History</h4>
                    {shipment.trackingEvents.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          event.status === 'completed' ? 'bg-green-500' :
                          event.status === 'current' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`text-sm font-medium ${
                                event.status === 'completed' ? 'text-gray-900' :
                                event.status === 'current' ? 'text-blue-900' :
                                'text-gray-500'
                              }`}>
                                {event.event}
                              </p>
                              <p className="text-xs text-gray-600">{event.location}</p>
                            </div>
                            <span className="text-xs text-gray-500">{event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button 
                      onClick={() => handleMapView(shipment)}
                      className={`flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium ${
                        shipment.status === 'Delivered' 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      disabled={shipment.status === 'Delivered'}
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Map</span>
                    </button>
                    <button 
                      onClick={() => handleCall(shipment)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    <button 
                      onClick={() => handleChat(shipment)}
                      className="flex items-center justify-center space-x-1 py-2 px-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="text-center py-8">
          <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shipments found matching your criteria</p>
        </div>
      )}

      {/* Modals */}
      {activeShipment && (
        <>
          <MobileMapModal
            isOpen={showMapModal}
            onClose={() => setShowMapModal(false)}
            shipment={{
              id: activeShipment.id,
              route: activeShipment.route,
              origin: activeShipment.origin,
              destination: activeShipment.destination,
              progress: activeShipment.progress
            }}
          />
          
          <MobileCallModal
            isOpen={showCallModal}
            onClose={() => setShowCallModal(false)}
            contact={getContactInfo(activeShipment)}
          />
          
          <MobileChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            contact={getContactInfo(activeShipment)}
          />
        </>
      )}
    </div>
  );
}
