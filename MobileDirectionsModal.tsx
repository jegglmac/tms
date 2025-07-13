'use client';

import React, { useState } from 'react';
import { XMarkIcon, MapPinIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    address: string;
    lat?: number;
    lng?: number;
  };
  vehicle?: {
    id: string;
    name: string;
    driver: string;
  };
}

export default function MobileDirectionsModal({ 
  isOpen, 
  onClose, 
  origin, 
  destination, 
  vehicle 
}: DirectionsModalProps) {
  const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'shortest' | 'scenic'>('fastest');

  if (!isOpen) return null;

  const routes = [
    {
      type: 'fastest' as const,
      name: 'Fastest Route',
      duration: '2h 15m',
      distance: '124 miles',
      traffic: 'Light',
      description: 'Via I-95 North',
      color: 'bg-green-500',
      icon: '🚀'
    },
    {
      type: 'shortest' as const,
      name: 'Shortest Route',
      duration: '2h 45m',
      distance: '98 miles',
      traffic: 'Moderate',
      description: 'Via Route 1',
      color: 'bg-blue-500',
      icon: '📏'
    },
    {
      type: 'scenic' as const,
      name: 'Scenic Route',
      duration: '3h 10m',
      distance: '142 miles',
      traffic: 'Light',
      description: 'Via Coastal Highway',
      color: 'bg-purple-500',
      icon: '🌊'
    }
  ];

  const handleOpenInMaps = (routeType: string) => {
    const originCoords = `${origin.lat},${origin.lng}`;
    const destinationQuery = encodeURIComponent(destination.address);
    
    // Detect device and open appropriate maps app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // Apple Maps
      const appleMapsUrl = `http://maps.apple.com/?saddr=${originCoords}&daddr=${destinationQuery}&dirflg=d`;
      window.open(appleMapsUrl, '_blank');
    } else if (isAndroid) {
      // Google Maps Android
      const googleMapsUrl = `google.navigation:q=${destinationQuery}&mode=d`;
      window.location.href = googleMapsUrl;
    } else {
      // Google Maps Web
      const webMapsUrl = `https://www.google.com/maps/dir/${originCoords}/${destinationQuery}`;
      window.open(webMapsUrl, '_blank');
    }
  };

  const handleOpenInWaze = () => {
    const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(destination.address)}&navigate=yes`;
    window.open(wazeUrl, '_blank');
  };

  const handleShareRoute = () => {
    const routeInfo = routes.find(r => r.type === selectedRoute);
    const shareText = `Route to ${destination.address}: ${routeInfo?.duration} (${routeInfo?.distance}) - ${routeInfo?.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Route Information',
        text: shareText,
        url: `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/${encodeURIComponent(destination.address)}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Route information copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <p className="text-sm text-gray-600">Choose your route</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Route Information */}
          <div className="p-4 space-y-4">
            {/* From/To */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">From</p>
                  <p className="text-sm text-gray-600">{origin.address}</p>
                  {vehicle && (
                    <p className="text-xs text-green-600 mt-1">{vehicle.name} - {vehicle.driver}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">To</p>
                  <p className="text-sm text-gray-600">{destination.address}</p>
                </div>
              </div>
            </div>

            {/* Route Options */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Route Options</h3>
              {routes.map((route) => (
                <button
                  key={route.type}
                  onClick={() => setSelectedRoute(route.type)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    selectedRoute === route.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{route.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900">{route.name}</p>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{route.duration}</p>
                          <p className="text-xs text-gray-600">{route.distance}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{route.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${route.color}`}></div>
                        <span className="text-xs text-gray-500">Traffic: {route.traffic}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Apps */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Open in Navigation App</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOpenInMaps(selectedRoute)}
                  className="flex items-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  <span className="text-sm">Maps</span>
                </button>
                
                <button
                  onClick={handleOpenInWaze}
                  className="flex items-center space-x-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-sm">Waze</span>
                </button>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShareRoute}
                className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-sm">Share</span>
              </button>
              
              <button
                onClick={onClose}
                className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm">Later</span>
              </button>
            </div>

            {/* Traffic & Alerts */}
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">Live Traffic Updates</span>
              </div>
              <p className="text-sm text-yellow-700">
                Light traffic on selected route. Construction zone at mile 45 may cause 10-minute delay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
