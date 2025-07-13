'use client';

import { useState } from 'react';
import { 
  MapPinIcon, 
  TruckIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface MapViewProps {
  shipment: {
    id: string;
    customerName: string;
    origin: string;
    destination: string;
    status: string;
    currentLocation?: string;
    progressPercentage: number;
    estimatedDelivery: string;
    assignedDriver?: string;
    assignedVehicle?: string;
  };
  onClose: () => void;
}

export default function MapViewSimple({ shipment, onClose }: MapViewProps) {
  const [showDirections, setShowDirections] = useState(true);

  // Mock route data with GPS coordinates
  const routeData = {
    origin: { lat: 40.7128, lng: -74.0060, name: shipment.origin },
    destination: { lat: 34.0522, lng: -118.2437, name: shipment.destination },
    currentPosition: { lat: 39.0458, lng: -96.0922, name: shipment.currentLocation || 'Kansas City, MO' },
    waypoints: [
      { lat: 40.7128, lng: -74.0060, name: 'New York, NY (Origin)' },
      { lat: 39.7392, lng: -104.9903, name: 'Denver, CO' },
      { lat: 39.0458, lng: -96.0922, name: 'Kansas City, MO (Current)' },
      { lat: 35.2271, lng: -101.8313, name: 'Amarillo, TX' },
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA (Destination)' }
    ]
  };

  // Mock navigation instructions
  const navigationSteps = [
    { instruction: 'Continue on I-70 West for 187 miles', distance: '187 mi', time: '3h 2m', completed: true },
    { instruction: 'Take exit 340 toward US-83 S/Garden City', distance: '2.1 mi', time: '4m', completed: true },
    { instruction: 'Merge onto I-25 South', distance: '342 mi', time: '5h 15m', completed: false, current: true },
    { instruction: 'Take exit 450B toward I-40 West/Amarillo', distance: '1.2 mi', time: '2m', completed: false },
    { instruction: 'Continue on I-40 West for 267 miles', distance: '267 mi', time: '4h 8m', completed: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600';
      case 'in transit': return 'text-blue-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Simplified Map Visualization */}
        <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
          <div className="h-full p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Interactive Route Map */}
              <div className="relative">
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full mb-8 shadow-inner">
                  <div 
                    className="h-3 bg-blue-500 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${shipment.progressPercentage}%` }}
                  ></div>
                </div>

                {/* Route Points */}
                <div className="flex justify-between items-center relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-blue-300"></div>
                  </div>
                  
                  {/* Origin */}
                  <div className="relative bg-white rounded-xl shadow-lg p-4 z-10 border-2 border-green-500 min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-semibold text-green-700">START</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{routeData.origin.name}</p>
                  </div>

                  {/* Current Position */}
                  <div className="relative bg-white rounded-xl shadow-lg p-4 z-10 border-2 border-blue-500 min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <TruckIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-700">CURRENT</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{routeData.currentPosition.name}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-blue-600">Live GPS</span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="relative bg-white rounded-xl shadow-lg p-4 z-10 border-2 border-red-500 min-w-[120px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPinIcon className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-semibold text-red-700">DESTINATION</span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{routeData.destination.name}</p>
                  </div>
                </div>

                {/* Route Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{shipment.progressPercentage}%</div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="text-xl font-bold text-green-600">2,789</div>
                    <div className="text-xs text-gray-600">Total Miles</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="text-xl font-bold text-orange-600">42h</div>
                    <div className="text-xs text-gray-600">Drive Time</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 text-center">
                    <div className="text-xl font-bold text-purple-600">17h</div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Live Tracking</h4>
            <span className={`text-sm font-medium ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">{shipment.progressPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ETA:</span>
              <span className="font-medium">{shipment.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver:</span>
              <span className="font-medium">{shipment.assignedDriver || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle:</span>
              <span className="font-medium">{shipment.assignedVehicle || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Current Location Indicator */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">
              Current: {routeData.currentPosition.name}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Panel */}
      {showDirections && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Turn-by-Turn Directions</h3>
              <button
                onClick={() => setShowDirections(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Route to {shipment.destination}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {navigationSteps.map((step, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : step.current 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.current 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.current ? 'font-semibold text-blue-900' : 'text-gray-900'}`}>
                      {step.instruction}
                    </p>
                    <div className="flex space-x-4 mt-1 text-xs text-gray-600">
                      <span>{step.distance}</span>
                      <span>{step.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Total Distance</p>
              <p className="text-lg font-bold text-blue-600">2,789 miles</p>
              <p className="text-xs text-gray-600">Est. 42 hours driving time</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Directions Button */}
      {!showDirections && (
        <button
          onClick={() => setShowDirections(true)}
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50"
        >
          <ArrowRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
