'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  MapPinIcon, 
  TruckIcon, 
  ClockIcon, 
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import MobileDirectionsModal from './MobileDirectionsModal';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: {
    id: string;
    name: string;
    driver: string;
    position: { lat: number; lng: number };
    destination: string;
    status: string;
    speed?: number;
    heading?: number;
    fuel?: number;
    temperature?: number;
  };
  shipment?: {
    id: string;
    route: string;
    origin: string;
    destination: string;
    progress: number;
    waypoints?: Array<{ lat: number; lng: number; name: string; eta?: string; }>;
  };
}

interface TrafficAlert {
  id: string;
  type: 'heavy' | 'moderate' | 'accident' | 'construction' | 'weather';
  location: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  eta_delay?: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

export default function MobileMapModal({ isOpen, onClose, vehicle, shipment }: MapModalProps) {
  const [showDirections, setShowDirections] = useState(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite' | 'terrain' | 'traffic'>('street');
  const [showTraffic, setShowTraffic] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showGeofences, setShowGeofences] = useState(true);
  const [mapZoom, setMapZoom] = useState(10);
  const [isTracking, setIsTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [buttonFeedback, setButtonFeedback] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simulated real-time data
  const [currentPosition, setCurrentPosition] = useState(
    vehicle ? vehicle.position : { lat: 40.7128, lng: -74.0060 }
  );
  const [vehicleData, setVehicleData] = useState({
    speed: vehicle?.speed || 65,
    heading: vehicle?.heading || 45,
    fuel: vehicle?.fuel || 78,
    temperature: vehicle?.temperature || 72
  });

  // Mock traffic alerts
  const [trafficAlerts] = useState<TrafficAlert[]>([
    {
      id: 'alert1',
      type: 'heavy',
      location: 'I-95 North Mile 45',
      severity: 'high',
      description: 'Heavy traffic due to construction',
      eta_delay: '15 min'
    },
    {
      id: 'alert2',
      type: 'accident',
      location: 'Route 287 Eastbound',
      severity: 'medium',
      description: 'Minor accident, right lane blocked',
      eta_delay: '8 min'
    }
  ]);

  // Mock weather data
  const [weatherData] = useState<WeatherData>({
    location: 'Current Route',
    temperature: 72,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 8,
    visibility: 10,
    icon: '☀️'
  });

  // Real-time tracking simulation
  useEffect(() => {
    if (isTracking && isOpen) {
      intervalRef.current = setInterval(() => {
        // Simulate position updates
        setCurrentPosition(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
        
        // Simulate vehicle data updates
        setVehicleData(prev => ({
          speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 5),
          heading: (prev.heading + (Math.random() - 0.5) * 10) % 360,
          fuel: Math.max(0, Math.min(100, prev.fuel + (Math.random() - 0.5) * 2)),
          temperature: prev.temperature + (Math.random() - 0.5) * 3
        }));
        
        setLastUpdate(new Date());
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, isOpen]);

  if (!isOpen) return null;

  const title = vehicle ? `${vehicle.name} - Live Location` : `Shipment ${shipment?.id} - Route`;
  const currentLocationStr = `${currentPosition.lat.toFixed(4)}, ${currentPosition.lng.toFixed(4)}`;
  const destination = vehicle?.destination || shipment?.destination || 'Unknown';

  const handleDirections = () => {
    setShowDirections(true);
  };

  const handleContact = () => {
    const phoneNumber = '+1-555-123-4567';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleMapLayerChange = (layer: 'street' | 'satellite' | 'terrain' | 'traffic') => {
    setMapLayer(layer);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => {
      const newZoom = Math.min(18, prev + 1);
      console.log(`Zooming in to level ${newZoom}`);
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setMapZoom(prev => {
      const newZoom = Math.max(1, prev - 1);
      console.log(`Zooming out to level ${newZoom}`);
      return newZoom;
    });
  };

  const handleCenterOnVehicle = () => {
    // Center the map on the driver's current location
    console.log('Centering map on driver location:', currentPosition);
    console.log('Driver:', vehicle?.driver || 'Unknown Driver');
    console.log('Vehicle:', vehicle?.name || 'Unknown Vehicle');
    // In real app, this would update the map center coordinates
    // and potentially adjust zoom level for better visibility
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const getOriginData = () => ({
    lat: currentPosition.lat,
    lng: currentPosition.lng,
    address: currentLocationStr
  });

  const getDestinationData = () => ({
    address: destination,
    lat: undefined,
    lng: undefined
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">Real-time tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container - Simplified for better performance */}
        <div className="relative h-80 bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
            {/* Simple Map Background */}
            <div className="absolute inset-0">
              {/* Basic road network */}
              <div className="absolute top-1/3 left-0 w-full h-2 bg-orange-400 opacity-80"></div>
              <div className="absolute left-1/2 top-0 w-1.5 h-full bg-gray-400 opacity-70"></div>
              
              {/* Vehicle Marker */}
              <div className={`absolute transition-all duration-1000 ${isTracking ? 'animate-pulse' : ''}`} 
                   style={{ 
                     top: '45%', 
                     left: '48%', 
                     transform: `translate(-50%, -50%) rotate(${vehicleData.heading}deg)` 
                   }}>
                <div className="relative">
                  <div className="bg-blue-600 rounded-full p-3 shadow-lg border-2 border-white">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Route Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 20,60 Q 150,20 280,60 T 360,80"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  fill="none"
                  className={isTracking ? "animate-pulse" : ""}
                />
              </svg>
            </div>

            {/* Map Attribution */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-80 px-1 rounded">
              © Map Data
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="p-4 space-y-4">
          {/* Live Vehicle Data */}
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <SignalIcon className="w-4 h-4 text-blue-500 mr-2" />
              Live Vehicle Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{Math.round(vehicleData.speed)}</div>
                <div className="text-sm font-semibold text-blue-800">MPH</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{Math.round(vehicleData.fuel)}%</div>
                <div className="text-sm font-semibold text-green-800">FUEL</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            {/* Button Feedback Display */}
            {buttonFeedback && (
              <div className="col-span-3 mb-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded-lg text-xs text-center">
                {buttonFeedback}
              </div>
            )}
            
            <button 
              onClick={() => {
                setButtonFeedback('New Shipment button clicked!');
                console.log('New Shipment button clicked!');
                
                setTimeout(() => {
                  setButtonFeedback('Shipment creation process initiated!');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }, 1000);
                
                const shipmentDetails = `Creating New Shipment

PICKUP LOCATION: ${currentLocationStr}
PICKUP TIME: ${new Date().toLocaleString()}

VEHICLE: ${vehicle?.name || 'Auto-Assign'}
DRIVER: ${vehicle?.driver || 'Auto-Assign'}
FUEL LEVEL: ${Math.round(vehicleData.fuel)}%

ESTIMATED COST: $57.50

Click OK to proceed...`;
                
                if (confirm(shipmentDetails)) {
                  alert('Shipment Creation Initiated!\\n\\nShipment ID: TMS-' + Date.now().toString().slice(-6));
                }
              }}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="text-xs font-medium">New Shipment</div>
            </button>
            
            <button 
              onClick={() => {
                setButtonFeedback('Route Test running...');
                console.log('Route Test button clicked!');
                
                setTimeout(() => {
                  setButtonFeedback('Route test completed!');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }, 2000);
                
                alert('Route Test Completed!\\n\\nAll systems operational\\nTest ID: RT-' + Date.now().toString().slice(-6));
              }}
              className="bg-green-50 hover:bg-green-100 text-green-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs font-medium">Route Test</div>
            </button>
            
            <button 
              onClick={() => {
                setButtonFeedback('Generating report...');
                console.log('Reports & Alerts button clicked!');
                
                setTimeout(() => {
                  setButtonFeedback('Report generated!');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }, 1500);
                
                const reportsData = `TMS Analytics Report

PERFORMANCE SUMMARY:
Vehicle: ${vehicle?.name || 'Fleet Average'}
Driver: ${vehicle?.driver || 'System-wide'}

KEY METRICS:
- On-Time Deliveries: 94.2%
- Fuel Efficiency: ${(Math.random() * 2 + 7).toFixed(1)} MPG
- Safety Score: ${Math.round(Math.random() * 10 + 90)}/100
- Customer Rating: 4.7/5.0

CURRENT ALERTS:
${trafficAlerts.length > 0 ? `- ${trafficAlerts.length} Traffic Alerts` : '- No Traffic Issues'}
${vehicleData.fuel < 30 ? `- Fuel Level: ${Math.round(vehicleData.fuel)}%` : '- Fuel Level: Normal'}

FINANCIAL SUMMARY:
- Efficiency Rating: 92/100
- Cost Reduction: ${(Math.random() * 5 + 8).toFixed(1)}%

Click OK for detailed report...`;
                
                if (confirm(reportsData)) {
                  alert('Report Generated Successfully!\\n\\nReport ID: RPT-' + Date.now().toString().slice(-6));
                }
              }}
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="text-xs font-medium">Reports</div>
            </button>
          </div>

          {/* Vehicle Info */}
          {vehicle && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Driver</p>
                <p className="text-sm text-blue-600">{vehicle.driver}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Status</p>
                <p className="text-sm text-green-600">{vehicle.status}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleDirections}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              <span>Directions</span>
            </button>
            <button 
              onClick={handleContact}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directions Modal */}
      <MobileDirectionsModal
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        origin={getOriginData()}
        destination={getDestinationData()}
        vehicle={vehicle ? {
          id: vehicle.id,
          name: vehicle.name,
          driver: vehicle.driver
        } : undefined}
      />
    </div>
  );
}
