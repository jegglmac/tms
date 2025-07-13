'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  MapPinIcon, 
  TruckIcon, 
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MapViewProps {
  shipment: {
    id: string;
    origin: string;
    destination: string;
    currentLocation?: string;
    gpsCoordinates?: { lat: number; lng: number };
    status: string;
    estimatedDelivery: string;
    assignedVehicle?: string;
    assignedDriver?: string;
  };
  onClose: () => void;
}

interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
  type: 'origin' | 'destination' | 'current' | 'checkpoint';
  timestamp?: string;
  eta?: string;
}

export default function MapView({ shipment, onClose }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [routePoints] = useState<RoutePoint[]>([
    { lat: 34.0522, lng: -118.2437, name: shipment.origin, type: 'origin' },
    { lat: 35.3733, lng: -119.0187, name: 'Bakersfield, CA', type: 'current', timestamp: '2025-07-13 14:30' },
    { lat: 35.1983, lng: -111.6513, name: 'Flagstaff, AZ', type: 'checkpoint', eta: '2025-07-13 18:00' },
    { lat: 33.4484, lng: -112.0740, name: shipment.destination, type: 'destination', eta: shipment.estimatedDelivery }
  ]);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;
        
        // Import CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        if (mapRef.current && !map) {
          const mapInstance = L.map(mapRef.current).setView([34.5, -116], 6);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance);

          // Add route points
          routePoints.forEach((point, index) => {
            let iconHtml = '';
            let className = '';
            
            switch (point.type) {
              case 'origin':
                iconHtml = '🏭';
                className = 'bg-blue-500';
                break;
              case 'destination':
                iconHtml = '🏢';
                className = 'bg-green-500';
                break;
              case 'current':
                iconHtml = '🚛';
                className = 'bg-red-500 animate-pulse';
                break;
              case 'checkpoint':
                iconHtml = '📍';
                className = 'bg-yellow-500';
                break;
            }

            const customIcon = L.divIcon({
              html: `<div class="flex items-center justify-center w-8 h-8 ${className} text-white rounded-full text-sm font-bold shadow-lg">${iconHtml}</div>`,
              className: 'custom-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            const marker = L.marker([point.lat, point.lng], { icon: customIcon })
              .addTo(mapInstance)
              .bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold">${point.name}</h3>
                  <p class="text-sm text-gray-600">Type: ${point.type}</p>
                  ${point.timestamp ? `<p class="text-xs">Last seen: ${point.timestamp}</p>` : ''}
                  ${point.eta ? `<p class="text-xs">ETA: ${point.eta}</p>` : ''}
                </div>
              `);

            marker.on('click', () => setSelectedPoint(point));
          });

          // Draw route line
          const routeCoordinates = routePoints.map(point => [point.lat, point.lng] as [number, number]);
          L.polyline(routeCoordinates, {
            color: '#3B82F6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 5'
          }).addTo(mapInstance);

          // Fit map to show all points
          const markers = routePoints.map(point => 
            L.marker([point.lat, point.lng])
          );
          const group = L.featureGroup(markers);
          mapInstance.fitBounds(group.getBounds().pad(0.1));

          setMap(mapInstance);
          setIsLoaded(true);
        }
      }
    };

    loadMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const navigationInstructions = [
    { instruction: "Continue on I-5 North", distance: "45 miles", duration: "45 min" },
    { instruction: "Take exit 257 for CA-58 East toward Bakersfield", distance: "2.3 miles", duration: "3 min" },
    { instruction: "Merge onto CA-58 East", distance: "112 miles", duration: "1h 45min" },
    { instruction: "Take I-40 East toward Flagstaff", distance: "165 miles", duration: "2h 30min" },
    { instruction: "Take exit 201 for I-17 South toward Phoenix", distance: "145 miles", duration: "2h 15min" }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Live Navigation - {shipment.id}
            </h3>
            <p className="text-sm text-gray-500">
              Real-time tracking from {shipment.origin.split(',')[0]} to {shipment.destination.split(',')[0]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Route Map</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowNavigation(!showNavigation)}
                      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                        showNavigation 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                      Navigation
                    </button>
                  </div>
                </div>
              </div>
              <div 
                ref={mapRef} 
                className="h-96 w-full rounded-b-lg"
                style={{ minHeight: '400px' }}
              />
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Status */}
            <div className="bg-white rounded-lg shadow border p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Vehicle Status</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">{shipment.assignedVehicle || 'TMS-001'}</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Online & Moving</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Speed: 65 mph</p>
                  <p>Last update: 2 minutes ago</p>
                </div>
              </div>
            </div>

            {/* Route Progress */}
            <div className="bg-white rounded-lg shadow border p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Route Progress</h4>
              <div className="space-y-4">
                {routePoints.map((point, index) => (
                  <div 
                    key={index}
                    className={`flex items-start p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedPoint?.name === point.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPoint(point)}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                      point.type === 'origin' ? 'bg-blue-500' :
                      point.type === 'current' ? 'bg-red-500' :
                      point.type === 'checkpoint' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{point.name.split(',')[0]}</p>
                      <p className="text-xs text-gray-500 capitalize">{point.type}</p>
                      {point.eta && (
                        <p className="text-xs text-blue-600">ETA: {point.eta}</p>
                      )}
                    </div>
                    {point.type === 'current' && (
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Instructions */}
            {showNavigation && (
              <div className="bg-white rounded-lg shadow border p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Turn-by-Turn Navigation</h4>
                <div className="space-y-3">
                  {navigationInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{instruction.instruction}</p>
                        <p className="text-xs text-gray-600">{instruction.distance} • {instruction.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="text-sm font-medium text-yellow-800">Route Alert</h4>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Heavy traffic reported on I-40 East. Consider alternate route.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
          <div className="flex space-x-4">
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
              Share Location
            </button>
            <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <ClockIcon className="h-4 w-4 mr-2" />
              Update ETA
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
}
