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

export default function MapViewInstant({ shipment, onClose }: MapViewProps) {
  const [showDirections, setShowDirections] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Instant Map Visualization */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
        <div className="h-full p-6 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Navigation</h2>
            <p className="text-gray-600">Shipment {shipment.id}</p>
          </div>

          {/* Visual Route */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Progress Bar */}
              <div className="w-full h-4 bg-gray-200 rounded-full mb-8 shadow-inner">
                <div 
                  className="h-4 bg-blue-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${shipment.progressPercentage}%` }}
                ></div>
                <div className="text-center mt-2 text-sm font-medium text-gray-700">
                  {shipment.progressPercentage}% Complete
                </div>
              </div>

              {/* Route Points */}
              <div className="flex justify-between items-center relative mb-8">
                {/* Connecting Line */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-3 border-dashed border-blue-400"></div>
                </div>
                
                {/* Origin Point */}
                <div className="relative bg-white rounded-xl shadow-xl p-6 z-10 border-3 border-green-500 transform hover:scale-105 transition-transform">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <p className="text-xs font-semibold text-green-700 mb-1">ORIGIN</p>
                    <p className="text-sm text-gray-900 font-medium">{shipment.origin}</p>
                  </div>
                </div>

                {/* Current Position */}
                <div className="relative bg-white rounded-xl shadow-xl p-6 z-10 border-3 border-blue-500 transform hover:scale-105 transition-transform">
                  <div className="text-center">
                    <TruckIcon className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-semibold text-blue-700 mb-1">CURRENT</p>
                    <p className="text-sm text-gray-900 font-medium">{shipment.currentLocation || 'In Transit'}</p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-2"></div>
                      <span className="text-xs text-blue-600">Live GPS</span>
                    </div>
                  </div>
                </div>

                {/* Destination Point */}
                <div className="relative bg-white rounded-xl shadow-xl p-6 z-10 border-3 border-red-500 transform hover:scale-105 transition-transform">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <p className="text-xs font-semibold text-red-700 mb-1">DESTINATION</p>
                    <p className="text-sm text-gray-900 font-medium">{shipment.destination}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{shipment.progressPercentage}%</div>
                  <div className="text-xs text-gray-600 mt-1">Progress</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                  <div className="text-xl font-bold text-green-600">2,789</div>
                  <div className="text-xs text-gray-600 mt-1">Total Miles</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                  <div className="text-xl font-bold text-orange-600">42h</div>
                  <div className="text-xs text-gray-600 mt-1">Total Time</div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
                  <div className="text-xl font-bold text-purple-600">17h</div>
                  <div className="text-xs text-gray-600 mt-1">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overlay */}
        <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Live Status</h4>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(shipment.status)}`}>
              {shipment.status}
            </span>
          </div>
          <div className="space-y-2 text-sm">
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

        {/* Map Label */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">🗺️ Interactive Route</div>
            <div className="text-xs text-gray-600">Visual representation</div>
          </div>
        </div>
      </div>

      {/* Directions Panel */}
      {showDirections && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
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
            {[
              { instruction: 'Continue on I-70 West', distance: '187 mi', time: '3h 2m', completed: true },
              { instruction: 'Merge onto I-25 South', distance: '342 mi', time: '5h 15m', completed: false, current: true },
              { instruction: 'Take I-40 West toward Amarillo', distance: '267 mi', time: '4h 8m', completed: false },
              { instruction: 'Continue to Los Angeles', distance: '543 mi', time: '8h 30m', completed: false }
            ].map((step, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : step.current 
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.current 
                      ? 'bg-blue-500 text-white animate-pulse' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.current ? 'font-bold text-blue-900' : 'text-gray-900'}`}>
                      {step.instruction}
                    </p>
                    <div className="flex space-x-4 mt-2 text-xs text-gray-600">
                      <span>📍 {step.distance}</span>
                      <span>⏱️ {step.time}</span>
                      {step.current && <span className="text-blue-600 font-bold">← Current</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-blue-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Remaining Distance</p>
              <p className="text-2xl font-bold text-blue-600">1,152 mi</p>
              <p className="text-xs text-gray-600">≈ 17 hours driving time</p>
              <div className="mt-3 px-3 py-2 bg-green-100 rounded-lg">
                <div className="text-xs text-green-700 font-medium">
                  ✅ On schedule for delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Directions Button */}
      {!showDirections && (
        <button
          onClick={() => setShowDirections(true)}
          className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <ArrowRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
