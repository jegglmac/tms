'use client';

import { useState } from 'react';
import { 
  MapPinIcon, 
  TruckIcon, 
  ArrowRightIcon,
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

export default function MapViewFallback({ shipment, onClose }: MapViewProps) {
  const [showDirections, setShowDirections] = useState(true);

  // Mock route data
  const routeData = {
    origin: shipment.origin,
    destination: shipment.destination,
    currentLocation: shipment.currentLocation || 'Kansas City, MO',
    totalDistance: '2,789 miles',
    estimatedTime: '42 hours',
    progressPercentage: shipment.progressPercentage
  };

  // Mock navigation steps
  const navigationSteps = [
    { instruction: 'Head north on I-70 West toward Denver', distance: '187 mi', time: '3h 2m', completed: true },
    { instruction: 'Continue on I-70 West through Colorado', distance: '120 mi', time: '2h 15m', completed: true },
    { instruction: 'Merge onto I-25 South toward New Mexico', distance: '342 mi', time: '5h 15m', completed: false, current: true },
    { instruction: 'Take I-40 West toward Amarillo', distance: '267 mi', time: '4h 8m', completed: false },
    { instruction: 'Continue on I-40 West to Los Angeles', distance: '543 mi', time: '8h 30m', completed: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-full flex">
      {/* Visual Map Representation */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* Map Visualization */}
        <div className="h-full p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            {/* Route Visualization */}
            <div className="relative">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${routeData.progressPercentage}%` }}
                ></div>
              </div>

              {/* Route Points */}
              <div className="flex justify-between items-center relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-blue-300"></div>
                </div>
                
                {/* Origin */}
                <div className="relative bg-white rounded-lg shadow-lg p-4 z-10 border-2 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-green-700">ORIGIN</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{routeData.origin}</p>
                </div>

                {/* Current Position */}
                <div className="relative bg-white rounded-lg shadow-lg p-4 z-10 border-2 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <TruckIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-700">CURRENT</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{routeData.currentLocation}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-blue-600">Live tracking</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="relative bg-white rounded-lg shadow-lg p-4 z-10 border-2 border-red-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-red-700">DESTINATION</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{routeData.destination}</p>
                </div>
              </div>

              {/* Progress Info */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{routeData.progressPercentage}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{routeData.totalDistance}</div>
                  <div className="text-sm text-gray-600">Total Distance</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{routeData.estimatedTime}</div>
                  <div className="text-sm text-gray-600">Drive Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Live Status</h4>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipment ID:</span>
              <span className="font-medium">{shipment.id}</span>
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

        {/* Map Controls */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">Interactive Map</div>
            <div className="text-xs text-gray-600">Visual route representation</div>
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
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-opacity-50' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.current 
                      ? 'bg-blue-500 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.current ? 'font-semibold text-blue-900' : 'text-gray-900'}`}>
                      {step.instruction}
                    </p>
                    <div className="flex space-x-4 mt-1 text-xs text-gray-600">
                      <span>📍 {step.distance}</span>
                      <span>⏱️ {step.time}</span>
                      {step.current && (
                        <span className="text-blue-600 font-medium">← Current</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Remaining</p>
              <p className="text-lg font-bold text-blue-600">1,152 miles</p>
              <p className="text-xs text-gray-600">≈ 17 hours driving time</p>
              <div className="mt-2 text-xs text-green-600">
                ✅ On schedule for delivery
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Directions Button */}
      {!showDirections && (
        <button
          onClick={() => setShowDirections(true)}
          className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
        >
          <ArrowRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
