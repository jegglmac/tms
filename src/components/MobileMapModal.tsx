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
  ArrowPathIcon,
  MapIcon
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
  pressure: number;
  uvIndex: number;
  feelsLike: number;
  alerts: string[];
  hourlyForecast: {
    time: string;
    temp: number;
    condition: string;
    icon: string;
    precipChance: number;
  }[];
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
  const [isLoading, setIsLoading] = useState(false); // Start as false for faster load
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

  // Enhanced weather data with real-time updates
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: 'Current Route Area',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 8,
    visibility: 10,
    icon: '⛅',
    pressure: 30.12,
    uvIndex: 6,
    feelsLike: 74,
    alerts: ['Light winds favorable for transport'],
    hourlyForecast: [
      { time: '12PM', temp: 72, condition: 'Partly Cloudy', icon: '⛅', precipChance: 10 },
      { time: '1PM', temp: 74, condition: 'Sunny', icon: '☀️', precipChance: 5 },
      { time: '2PM', temp: 76, condition: 'Sunny', icon: '☀️', precipChance: 0 },
      { time: '3PM', temp: 75, condition: 'Partly Cloudy', icon: '⛅', precipChance: 15 },
      { time: '4PM', temp: 73, condition: 'Cloudy', icon: '☁️', precipChance: 25 }
    ]
  });

  // Real-time tracking simulation - optimized with error handling
  useEffect(() => {
    if (!isTracking || !isOpen) {
      setIsLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Quick initial load
    setIsLoading(true);
    const loadingTimeout = setTimeout(() => setIsLoading(false), 500);

    // Simple interval for updates with error handling
    const interval = setInterval(() => {
      try {
        setCurrentPosition(prev => {
          const currentLat = prev?.lat || 40.7128;
          const currentLng = prev?.lng || -74.0060;
          
          // Ensure coordinates stay within reasonable bounds
          const newLat = Math.max(25, Math.min(50, currentLat + (Math.random() - 0.5) * 0.001));
          const newLng = Math.max(-125, Math.min(-65, currentLng + (Math.random() - 0.5) * 0.001));
          
          return { lat: newLat, lng: newLng };
        });
      
      setVehicleData(prev => ({
        speed: Math.max(0, Math.min(120, (prev?.speed || 65) + (Math.random() - 0.5) * 3)), // Cap speed at 120 MPH
        heading: Math.abs(((prev?.heading || 45) + (Math.random() - 0.5) * 5) % 360), // Ensure positive heading
        fuel: Math.max(0, Math.min(100, (prev?.fuel || 78) + (Math.random() - 0.5) * 1)), // Cap fuel 0-100%
        temperature: Math.max(-20, Math.min(120, (prev?.temperature || 72) + (Math.random() - 0.5) * 2)) // Reasonable temp range
      }));
      
      // Update weather data occasionally
      if (Math.random() < 0.3) { // 30% chance each update
        setWeatherData(prev => {
          const newCondition = Math.random() > 0.7 ? 
            ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)] : 
            prev.condition;
          
          const newIcon = newCondition === 'Sunny' ? '☀️' : 
                         newCondition === 'Partly Cloudy' ? '⛅' :
                         newCondition === 'Cloudy' ? '☁️' : 
                         newCondition === 'Light Rain' ? '🌧️' : '☀️';
          
          return {
            ...prev,
            temperature: Math.round(prev.temperature + (Math.random() - 0.5) * 3),
            humidity: Math.max(20, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
            windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 2),
            pressure: Math.max(29.5, Math.min(30.5, prev.pressure + (Math.random() - 0.5) * 0.1)),
            feelsLike: Math.round(prev.feelsLike + (Math.random() - 0.5) * 2),
            condition: newCondition,
            icon: newIcon
          };
        });
      }        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error updating tracking data:', error);
        // Continue tracking even if one update fails
      }
    }, 3000); // Update every 3 seconds
    
    intervalRef.current = interval;

    // Cleanup function
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, isOpen]);

  if (!isOpen) return null;

  // Safety checks for data
  const safeVehicleData = {
    speed: vehicleData?.speed || 0,
    heading: vehicleData?.heading || 0,
    fuel: vehicleData?.fuel || 0,
    temperature: vehicleData?.temperature || 72
  };

  const title = vehicle ? `${vehicle.name} - Live Location` : `Shipment ${shipment?.id || 'Unknown'} - Route`;
  const currentLocationStr = `${(currentPosition?.lat || 40.7128).toFixed(4)}, ${(currentPosition?.lng || -74.0060).toFixed(4)}`;
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
    lat: currentPosition?.lat || 40.7128,
    lng: currentPosition?.lng || -74.0060,
    address: currentLocationStr
  });

  const getDestinationData = () => ({
    address: destination,
    lat: 40.7589,
    lng: -73.9851
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Loading Overlay - Only show when actually loading */}
        {isLoading && (
          <div className="absolute top-16 left-4 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-1 rounded-lg text-xs z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
              <span>Updating...</span>
            </div>
          </div>
        )}
        
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

        {/* Interactive Map Container */}
        <div className="relative h-80 bg-gray-100 overflow-hidden cursor-move" 
             onTouchStart={(e) => console.log('Map touch started')}
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const x = e.clientX - rect.left;
               const y = e.clientY - rect.top;
               console.log(`Map clicked at: ${x}, ${y}`);
               setButtonFeedback(`Map clicked at ${x.toFixed(0)}, ${y.toFixed(0)}`);
               setTimeout(() => setButtonFeedback(''), 2000);
             }}>
          
          {/* Map Background with Grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
            {/* Grid Lines for realistic look */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gray-300" style={{ top: `${i * 12.5}%` }} />
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gray-300" style={{ left: `${i * 16.67}%` }} />
              ))}
            </div>
            
            {/* Interactive Map Elements */}
            <div className="absolute inset-0">
              {/* Main Highway - Interactive */}
              <div 
                className="absolute top-1/3 left-0 w-full h-3 bg-orange-400 opacity-80 hover:opacity-100 cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback('Interstate 95 selected');
                  setTimeout(() => setButtonFeedback(''), 2000);
                }}
                title="Interstate 95"
              ></div>
              
              {/* Secondary Road */}
              <div 
                className="absolute left-1/2 top-0 w-2 h-full bg-gray-400 opacity-70 hover:opacity-90 cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback('Route 287 selected');
                  setTimeout(() => setButtonFeedback(''), 2000);
                }}
                title="Route 287"
              ></div>
              
              {/* Traffic Zones - Interactive */}
              <div 
                className="absolute top-1/4 left-1/4 w-16 h-8 bg-red-400 opacity-60 rounded-lg cursor-pointer hover:opacity-80 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback('Heavy traffic zone - 15 min delay');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }}
                title="Heavy Traffic"
              >
                <div className="text-xs text-white text-center mt-1 font-bold">TRAFFIC</div>
              </div>
              
              {/* Gas Station - Interactive */}
              <div 
                className="absolute top-1/2 left-3/4 w-6 h-6 bg-green-500 rounded-full cursor-pointer hover:scale-110 transition-all flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback(`Gas Station - ${(Math.random() * 1 + 3).toFixed(2)}/gal`);
                  setTimeout(() => setButtonFeedback(''), 3000);
                }}
                title="Gas Station"
              >
                <span className="text-white text-xs font-bold">⛽</span>
              </div>
              
              {/* Rest Area */}
              <div 
                className="absolute top-2/3 left-1/3 w-5 h-5 bg-blue-500 rounded cursor-pointer hover:scale-110 transition-all flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback('Rest Area - 24/7 facilities');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }}
                title="Rest Area"
              >
                <span className="text-white text-xs">🅿️</span>
              </div>
              
              {/* Delivery Destination - Interactive */}
              <div 
                className="absolute top-1/4 right-4 w-8 h-8 bg-purple-500 rounded-full cursor-pointer hover:scale-110 transition-all flex items-center justify-center border-2 border-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setButtonFeedback(`Destination: ${destination} - ETA: ${new Date(Date.now() + 2.5 * 60 * 60 * 1000).toLocaleTimeString()}`);
                  setTimeout(() => setButtonFeedback(''), 4000);
                }}
                title={`Destination: ${destination}`}
              >
                <MapPinIcon className="w-4 h-4 text-white" />
              </div>
              
              {/* Dynamic Vehicle Marker - Interactive */}
              <div 
                className={`absolute transition-all duration-1000 cursor-pointer hover:scale-110 ${isTracking ? 'animate-pulse' : ''}`} 
                style={{ 
                  top: '45%', 
                  left: `${48 + Math.sin(Date.now() / 5000) * 2}%`, // Slight movement simulation
                  transform: `translate(-50%, -50%) rotate(${safeVehicleData.heading}deg)` 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const exactLat = (currentPosition?.lat || 40.7128).toFixed(6);
                  const exactLng = (currentPosition?.lng || -74.0060).toFixed(6);
                  setButtonFeedback(`📍 ${vehicle?.name || 'Vehicle'} - Exact Location: ${exactLat}°N, ${Math.abs(parseFloat(exactLng))}°W | Speed: ${Math.round(safeVehicleData.speed)} MPH | Fuel: ${Math.round(safeVehicleData.fuel)}%`);
                  setTimeout(() => setButtonFeedback(''), 6000);
                }}
                title={`${vehicle?.name || 'Vehicle'} - Click for details`}
              >
                <div className="relative">
                  <div className="bg-blue-600 rounded-full p-3 shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-2 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  
                  {/* Speed indicator */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {Math.round(safeVehicleData.speed)} MPH
                  </div>
                </div>
              </div>

              {/* Interactive Route Path */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 20,60 Q 150,20 280,60 T 360,80"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                  fill="none"
                  className={`cursor-pointer hover:stroke-blue-700 transition-colors ${isTracking ? "animate-pulse" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setButtonFeedback('Route path - Total distance: 127 miles, ETA: 2h 35m');
                    setTimeout(() => setButtonFeedback(''), 3000);
                  }}
                />
                
                {/* Route waypoints */}
                <circle cx="80" cy="50" r="4" fill="#10B981" className="cursor-pointer hover:r-6 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setButtonFeedback('Waypoint 1 - Newark Distribution Center');
                    setTimeout(() => setButtonFeedback(''), 2000);
                  }}
                />
                <circle cx="200" cy="35" r="4" fill="#10B981" className="cursor-pointer hover:r-6 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setButtonFeedback('Waypoint 2 - Fuel Stop');
                    setTimeout(() => setButtonFeedback(''), 2000);
                  }}
                />
                <circle cx="320" cy="65" r="4" fill="#10B981" className="cursor-pointer hover:r-6 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setButtonFeedback('Waypoint 3 - Customer Pickup');
                    setTimeout(() => setButtonFeedback(''), 2000);
                  }}
                />
              </svg>
            </div>

            {/* Conditional Overlays Based on Button States */}
            
            {/* Traffic Overlay */}
            {showTraffic && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Traffic Heat Zones */}
                <div className="absolute top-1/4 left-1/4 w-20 h-12 bg-red-400 opacity-40 rounded-lg animate-pulse">
                  <div className="text-xs text-white text-center mt-2 font-bold">HEAVY</div>
                </div>
                <div className="absolute top-1/2 left-1/2 w-16 h-8 bg-orange-400 opacity-50 rounded-lg">
                  <div className="text-xs text-white text-center mt-1 font-bold">MODERATE</div>
                </div>
                <div className="absolute top-2/3 left-2/3 w-12 h-6 bg-yellow-400 opacity-40 rounded-lg">
                  <div className="text-xs text-white text-center font-bold">LIGHT</div>
                </div>
                
                {/* Traffic Flow Arrows */}
                <div className="absolute top-1/3 left-0 flex space-x-1">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-1 bg-red-500 opacity-60 animate-ping"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                
                {/* Traffic Incidents */}
                <div className="absolute top-1/4 left-3/4 w-4 h-4 bg-red-600 rounded-full animate-bounce flex items-center justify-center">
                  <span className="text-white text-xs">⚠️</span>
                </div>
                <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🚧</span>
                </div>
              </div>
            )}
            
            {/* Weather Overlay */}
            {showWeather && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Weather Zones */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-200 opacity-20">
                  <div className="text-xs text-blue-800 text-center mt-8 font-bold">Clear Skies</div>
                </div>
                <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gray-300 opacity-30">
                  <div className="text-xs text-gray-700 text-center mt-8 font-bold">Partly Cloudy</div>
                </div>
                <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-400 opacity-25">
                  <div className="text-xs text-blue-900 text-center mt-8 font-bold">Light Rain</div>
                </div>
                
                {/* Weather Icons */}
                <div className="absolute top-1/6 right-1/4 text-2xl animate-bounce">☀️</div>
                <div className="absolute top-1/2 right-1/3 text-2xl animate-pulse">⛅</div>
                <div className="absolute top-5/6 right-1/2 text-2xl animate-ping">🌧️</div>
                
                {/* Wind Direction Indicators */}
                <div className="absolute top-1/4 left-1/6 flex items-center space-x-1">
                  <span className="text-blue-600 text-sm">💨</span>
                  <div className="w-8 h-1 bg-blue-400 rounded transform rotate-45"></div>
                </div>
                <div className="absolute top-3/4 right-1/6 flex items-center space-x-1">
                  <span className="text-blue-600 text-sm">💨</span>
                  <div className="w-6 h-1 bg-blue-400 rounded transform rotate-12"></div>
                </div>
              </div>
            )}
            
            {/* Geofence Zones Overlay */}
            {showGeofences && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Delivery Zones */}
                <div className="absolute top-1/6 left-1/6 w-24 h-16 border-2 border-green-500 border-dashed rounded-lg bg-green-100 opacity-60">
                  <div className="text-xs text-green-800 text-center mt-4 font-bold">DELIVERY<br/>ZONE A</div>
                </div>
                <div className="absolute top-2/3 right-1/6 w-20 h-12 border-2 border-blue-500 border-dashed rounded-lg bg-blue-100 opacity-60">
                  <div className="text-xs text-blue-800 text-center mt-2 font-bold">PICKUP<br/>ZONE B</div>
                </div>
                
                {/* Restricted Areas */}
                <div className="absolute top-1/3 left-1/2 w-16 h-16 border-2 border-red-500 border-solid rounded-lg bg-red-100 opacity-50">
                  <div className="text-xs text-red-800 text-center mt-4 font-bold">NO<br/>TRUCKS</div>
                </div>
                
                {/* Safe Parking Zone */}
                <div className="absolute bottom-4 left-1/4 w-18 h-10 border-2 border-purple-500 border-dotted rounded-lg bg-purple-100 opacity-60">
                  <div className="text-xs text-purple-800 text-center mt-1 font-bold">PARKING</div>
                </div>
                
                {/* Zone Status Indicators */}
                <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded p-1 text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700">Zone A: Active</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700">Zone B: Active</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700">Restricted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-700">Parking: 4/12</span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Map Controls */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
              <button 
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded shadow text-gray-700 hover:text-gray-900 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                  setButtonFeedback('Zoomed in');
                  setTimeout(() => setButtonFeedback(''), 1000);
                }}
                title="Zoom In"
              >
                <span className="text-sm font-bold">+</span>
              </button>
              <button 
                className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded shadow text-gray-700 hover:text-gray-900 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                  setButtonFeedback('Zoomed out');
                  setTimeout(() => setButtonFeedback(''), 1000);
                }}
                title="Zoom Out"
              >
                <span className="text-sm font-bold">-</span>
              </button>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-95 p-2 rounded shadow-sm text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Vehicle</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Destination</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Traffic</span>
                </div>
              </div>
            </div>

            {/* Map Attribution */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-80 px-1 rounded">
              © Interactive TMS Map
            </div>
          </div>
        </div>

        {/* Interactive Map Controls Panel */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Map Controls</h3>
            <div className="text-xs text-gray-600">Zoom: {mapZoom}x</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            {/* Map Layer Buttons */}
            <button
              onClick={() => {
                handleMapLayerChange('street');
                setButtonFeedback('Street view activated');
                setTimeout(() => setButtonFeedback(''), 1500);
              }}
              className={`px-2 py-1 text-xs rounded transition-all ${
                mapLayer === 'street' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => {
                handleMapLayerChange('satellite');
                setButtonFeedback('Satellite view activated');
                setTimeout(() => setButtonFeedback(''), 1500);
              }}
              className={`px-2 py-1 text-xs rounded transition-all ${
                mapLayer === 'satellite' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => {
                handleMapLayerChange('terrain');
                setButtonFeedback('Terrain view activated');
                setTimeout(() => setButtonFeedback(''), 1500);
              }}
              className={`px-2 py-1 text-xs rounded transition-all ${
                mapLayer === 'terrain' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => {
                handleMapLayerChange('traffic');
                setButtonFeedback('Traffic view activated');
                setTimeout(() => setButtonFeedback(''), 1500);
              }}
              className={`px-2 py-1 text-xs rounded transition-all ${
                mapLayer === 'traffic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Traffic
            </button>
          </div>
          
          {/* Enhanced Map Toggle Options */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => {
                setShowTraffic(!showTraffic);
                const trafficStatus = !showTraffic;
                if (trafficStatus) {
                  setButtonFeedback(`🚦 Traffic overlay enabled - Found ${trafficAlerts.length} alerts`);
                } else {
                  setButtonFeedback('🚦 Traffic overlay disabled');
                }
                setTimeout(() => setButtonFeedback(''), 2500);
              }}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                showTraffic 
                ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border-2 border-red-400 shadow-red-200' 
                : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-300 hover:border-red-300'
              }`}
            >
              <div className={`text-lg mb-1 ${showTraffic ? 'animate-pulse' : ''}`}>🚦</div>
              <div className="font-semibold">Traffic</div>
              {showTraffic && (
                <div className="text-xs text-red-600 mt-1">
                  {trafficAlerts.length} alerts
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setShowWeather(!showWeather);
                const weatherStatus = !showWeather;
                if (weatherStatus) {
                  setButtonFeedback(`🌤️ Weather overlay enabled - ${weatherData.temperature}°F ${weatherData.condition}`);
                } else {
                  setButtonFeedback('🌤️ Weather overlay disabled');
                }
                setTimeout(() => setButtonFeedback(''), 2500);
              }}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                showWeather 
                ? 'bg-gradient-to-br from-blue-100 to-sky-200 text-blue-800 border-2 border-blue-400 shadow-blue-200' 
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className={`text-lg mb-1 ${showWeather ? 'animate-bounce' : ''}`}>{weatherData.icon}</div>
              <div className="font-semibold">Weather</div>
              {showWeather && (
                <div className="text-xs text-blue-600 mt-1">
                  {weatherData.temperature}°F
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setShowGeofences(!showGeofences);
                const geofenceStatus = !showGeofences;
                if (geofenceStatus) {
                  const zoneCount = 4; // Simulated zone count
                  setButtonFeedback(`📍 Geofences enabled - Monitoring ${zoneCount} zones`);
                } else {
                  setButtonFeedback('📍 Geofences disabled');
                }
                setTimeout(() => setButtonFeedback(''), 2500);
              }}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                showGeofences 
                ? 'bg-gradient-to-br from-green-100 to-emerald-200 text-green-800 border-2 border-green-400 shadow-green-200' 
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-300 hover:border-green-300'
              }`}
            >
              <div className={`text-lg mb-1 ${showGeofences ? 'animate-ping' : ''}`}>📍</div>
              <div className="font-semibold">Zones</div>
              {showGeofences && (
                <div className="text-xs text-green-600 mt-1">
                  4 active
                </div>
              )              }
            </button>
          </div>
        </div>

        {/* Conditional Information Panels */}
        
        {/* Traffic Alerts Panel (when traffic overlay is enabled) */}
        {showTraffic && (
          <div className="p-3 bg-red-50 border-t border-red-200">
            <h3 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
              🚦 Live Traffic Alerts
              <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                {trafficAlerts.length} Active
              </span>
            </h3>
            <div className="space-y-2">
              {trafficAlerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg p-2 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'medium' ? 'bg-orange-200 text-orange-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-600">{alert.location}</span>
                      </div>
                      <div className="text-sm text-gray-900">{alert.description}</div>
                      {alert.eta_delay && (
                        <div className="text-xs text-red-600 mt-1">
                          ⏱️ Expected delay: {alert.eta_delay}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setButtonFeedback(`Rerouting around ${alert.location}...`);
                        setTimeout(() => setButtonFeedback('Alternative route found - 5 min saved'), 2000);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-2"
                    >
                      🔄 Reroute
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Traffic Control Actions */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <button
                onClick={() => {
                  setButtonFeedback('Refreshing traffic data...');
                  setTimeout(() => setButtonFeedback('Traffic data updated - No new alerts'), 2000);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                🔄 Refresh Traffic
              </button>
              <button
                onClick={() => {
                  setButtonFeedback('Auto-reroute enabled - Will avoid all traffic delays');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                🚗 Auto-Route
              </button>
              <button
                onClick={() => {
                  const summary = `Traffic Summary: ${trafficAlerts.length} alerts, Est. total delay: ${trafficAlerts.reduce((sum, alert) => sum + parseInt(alert.eta_delay || '0'), 0)} min`;
                  setButtonFeedback(summary);
                  setTimeout(() => setButtonFeedback(''), 5000);
                }}
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                📊 Summary
              </button>
            </div>
          </div>
        )}

        {/* Geofence Zones Panel (when zones overlay is enabled) */}
        {showGeofences && (
          <div className="p-3 bg-green-50 border-t border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center">
              📍 Active Geofence Zones
              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                4 Zones
              </span>
            </h3>
            
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-green-800">Delivery Zone A</div>
                    <div className="text-xs text-gray-600">Downtown Distribution</div>
                    <div className="text-xs text-green-600 mt-1">✅ Vehicle inside zone</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">ACTIVE</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-blue-800">Pickup Zone B</div>
                    <div className="text-xs text-gray-600">Industrial Complex</div>
                    <div className="text-xs text-blue-600 mt-1">📍 2.3 miles away</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-700 font-medium">ACTIVE</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-red-800">Restricted Zone</div>
                    <div className="text-xs text-gray-600">No Commercial Vehicles</div>
                    <div className="text-xs text-red-600 mt-1">⚠️ Avoid this area</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-xs text-red-700 font-medium">RESTRICTED</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-2 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-purple-800">Safe Parking</div>
                    <div className="text-xs text-gray-600">24/7 Secure Lot</div>
                    <div className="text-xs text-purple-600 mt-1">🅿️ 4/12 spaces occupied</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-purple-700 font-medium">AVAILABLE</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Geofence Control Actions */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <button
                onClick={() => {
                  setButtonFeedback('Creating new geofence zone...');
                  setTimeout(() => setButtonFeedback('New zone created successfully'), 2000);
                }}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                ➕ Add Zone
              </button>
              <button
                onClick={() => {
                  setButtonFeedback('Zone alerts enabled - Will notify on entry/exit');
                  setTimeout(() => setButtonFeedback(''), 3000);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                🔔 Alerts
              </button>
              <button
                onClick={() => {
                  setButtonFeedback('Zones: 1 occupied, 1 approaching, 1 restricted, 1 available');
                  setTimeout(() => setButtonFeedback(''), 4000);
                }}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                📊 Status
              </button>
            </div>
          </div>
        )}

        {/* Location Details */}
        <div className="p-4 space-y-4">
          {/* Live Vehicle Data */}
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <SignalIcon className="w-4 h-4 text-blue-500 mr-2" />
              Live Vehicle Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-3xl font-bold text-blue-900">{Math.round(safeVehicleData.speed)}</div>
                <div className="text-sm font-bold text-blue-900">MPH</div>
                <div className="text-xs text-blue-700 mt-1">Current Speed</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-3xl font-bold text-green-900">{Math.round(safeVehicleData.fuel)}%</div>
                <div className="text-sm font-bold text-green-900">FUEL</div>
                <div className="text-xs text-green-700 mt-1">Fuel Level</div>
              </div>
            </div>
          </div>

          {/* Exact Location Information */}
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <MapPinIcon className="w-4 h-4 text-green-500 mr-2" />
              Exact Location
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">GPS Coordinates</div>
                <div className="font-mono text-sm font-bold text-gray-900">
                  {(currentPosition?.lat || 40.7128).toFixed(6)}°N, {Math.abs(currentPosition?.lng || -74.0060).toFixed(6)}°W
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Accuracy: ±3.2m • Last Update: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-blue-600 font-semibold">Latitude</div>
                  <div className="font-mono text-blue-900">{(currentPosition?.lat || 40.7128).toFixed(6)}°</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="text-purple-600 font-semibold">Longitude</div>
                  <div className="font-mono text-purple-900">{(currentPosition?.lng || -74.0060).toFixed(6)}°</div>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="text-xs text-amber-700 font-semibold mb-1">Current Address (Estimated)</div>
                <div className="text-sm text-amber-900">
                  {Math.abs(currentPosition?.lat || 40.7128) > 40.7 ? 
                    "Manhattan Financial District, New York, NY 10038" : 
                    "Newark Distribution Center, Newark, NJ 07102"
                  }
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Speed: {Math.round(safeVehicleData.speed)} MPH • Heading: {Math.round(safeVehicleData.heading)}° NE
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>📍 GPS Signal: Strong</span>
                <span>🛰️ Satellites: 12/12</span>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(`${(currentPosition?.lat || 40.7128).toFixed(6)}, ${(currentPosition?.lng || -74.0060).toFixed(6)}`);
                    setButtonFeedback('Coordinates copied to clipboard!');
                    setTimeout(() => setButtonFeedback(''), 2000);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  📋 Copy GPS
                </button>
              </div>
            </div>
          </div>

          {/* Comprehensive Weather Panel */}
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-lg mr-2">{weatherData.icon}</span>
              Current Weather Conditions
            </h3>
            
            {/* Main Weather Display */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-2xl font-bold text-blue-900">{weatherData.temperature}°F</div>
                  <div className="text-sm text-blue-700">{weatherData.condition}</div>
                  <div className="text-xs text-blue-600">Feels like {weatherData.feelsLike}°F</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl">{weatherData.icon}</div>
                  <div className="text-xs text-blue-600 mt-1">{weatherData.location}</div>
                </div>
              </div>
            </div>
            
            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">💧 Humidity</div>
                <div className="font-bold text-gray-900">{weatherData.humidity}%</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">💨 Wind Speed</div>
                <div className="font-bold text-gray-900">{weatherData.windSpeed.toFixed(1)} mph</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">👁️ Visibility</div>
                <div className="font-bold text-gray-900">{weatherData.visibility} mi</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">📊 Pressure</div>
                <div className="font-bold text-gray-900">{weatherData.pressure.toFixed(2)} in</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">☀️ UV Index</div>
                <div className={`font-bold ${weatherData.uvIndex > 7 ? 'text-red-600' : weatherData.uvIndex > 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {weatherData.uvIndex} {weatherData.uvIndex > 7 ? 'High' : weatherData.uvIndex > 3 ? 'Moderate' : 'Low'}
                </div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-gray-600">🚛 Driving</div>
                <div className={`font-bold ${weatherData.condition === 'Light Rain' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {weatherData.condition === 'Light Rain' ? 'Caution' : 'Good'}
                </div>
              </div>
            </div>
            
            {/* Hourly Forecast */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-700 mb-2">5-Hour Forecast</div>
              <div className="flex space-x-2 overflow-x-auto">
                {weatherData.hourlyForecast.map((hour, index) => (
                  <div key={index} className="flex-shrink-0 bg-white border rounded-lg p-2 text-center min-w-16">
                    <div className="text-xs text-gray-600">{hour.time}</div>
                    <div className="text-lg my-1">{hour.icon}</div>
                    <div className="text-xs font-bold">{hour.temp}°</div>
                    <div className="text-xs text-blue-600">{hour.precipChance}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weather Alerts for Fleet */}
            {weatherData.alerts.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="text-xs font-semibold text-green-800 mb-1">📢 Fleet Weather Advisory</div>
                {weatherData.alerts.map((alert, index) => (
                  <div key={index} className="text-xs text-green-700">{alert}</div>
                ))}
              </div>
            )}
            
            {/* Weather Action Buttons */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <button
                onClick={() => {
                  setButtonFeedback(`Weather: ${weatherData.temperature}°F ${weatherData.condition}, Wind: ${weatherData.windSpeed}mph, Visibility: ${weatherData.visibility}mi`);
                  setTimeout(() => setButtonFeedback(''), 4000);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                📋 Copy Weather
              </button>
              <button
                onClick={() => {
                  setButtonFeedback('Weather radar activated - Checking precipitation in route area...');
                  setTimeout(() => setButtonFeedback('No precipitation detected in next 2 hours'), 2000);
                }}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                🌧️ Check Radar
              </button>
              <button
                onClick={() => {
                  const driveAdvice = weatherData.condition === 'Light Rain' ? 
                    'Reduce speed, increase following distance, use headlights' :
                    weatherData.windSpeed > 15 ?
                    'Monitor for crosswinds, secure cargo properly' :
                    'Conditions favorable for normal driving';
                  setButtonFeedback(`Driving advice: ${driveAdvice}`);
                  setTimeout(() => setButtonFeedback(''), 5000);
                }}
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                🚛 Drive Tips
              </button>
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
                setButtonFeedback('Initializing new shipment workflow...');
                console.log('New Shipment button clicked!');
                
                // Generate realistic shipment data
                const shipmentId = `TMS-${Date.now().toString().slice(-6)}`;
                const currentTime = new Date();
                const estimatedPickup = new Date(currentTime.getTime() + 30 * 60000); // 30 minutes from now
                const estimatedDelivery = new Date(currentTime.getTime() + 4 * 60 * 60000); // 4 hours from now
                
                const shipmentData = {
                  id: shipmentId,
                  pickupLocation: currentLocationStr,
                  pickupAddress: Math.abs(currentPosition?.lat || 40.7128) > 40.7 ? 
                    "Manhattan Financial District, New York, NY 10038" : 
                    "Newark Distribution Center, Newark, NJ 07102",
                  deliveryAddress: destination || "Customer Location",
                  vehicle: vehicle?.name || 'Auto-Assigned Vehicle',
                  driver: vehicle?.driver || 'Auto-Assigned Driver',
                  estimatedPickup: estimatedPickup.toLocaleTimeString(),
                  estimatedDelivery: estimatedDelivery.toLocaleTimeString(),
                  priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Standard',
                  weight: (Math.random() * 2000 + 500).toFixed(0), // 500-2500 lbs
                  distance: (Math.random() * 150 + 25).toFixed(1), // 25-175 miles
                  estimatedCost: (Math.random() * 300 + 150).toFixed(2) // $150-450
                };
                
                setTimeout(() => {
                  setButtonFeedback('Shipment details generated...');
                  
                  setTimeout(() => {
                    setButtonFeedback('Ready to create shipment - Confirm details');
                    
                    const confirmationMessage = `🚛 NEW SHIPMENT DETAILS

📦 Shipment ID: ${shipmentData.id}
📍 Pickup: ${shipmentData.pickupAddress}
🎯 Delivery: ${shipmentData.deliveryAddress}
🚚 Vehicle: ${shipmentData.vehicle}
👨‍💼 Driver: ${shipmentData.driver}

⏰ SCHEDULE:
• Pickup: ${shipmentData.estimatedPickup}
• Delivery: ${shipmentData.estimatedDelivery}

📊 DETAILS:
• Priority: ${shipmentData.priority}
• Weight: ${shipmentData.weight} lbs
• Distance: ${shipmentData.distance} miles
• Est. Cost: $${shipmentData.estimatedCost}

🌤️ WEATHER: ${weatherData.temperature}°F ${weatherData.condition}
🚦 TRAFFIC: ${trafficAlerts.length} alerts on route

Would you like to CREATE this shipment?`;

                    if (confirm(confirmationMessage)) {
                      setButtonFeedback('Creating shipment...');
                      
                      setTimeout(() => {
                        setButtonFeedback(`✅ Shipment ${shipmentData.id} created successfully!`);
                        
                        setTimeout(() => {
                          setButtonFeedback('Shipment added to dispatch queue');
                          
                          // Final success notification
                          setTimeout(() => {
                            setButtonFeedback('');
                            alert(`🎉 SHIPMENT CREATED SUCCESSFULLY!

Shipment ID: ${shipmentData.id}
Status: Ready for Dispatch
Tracking: Available in 5 minutes

Next Steps:
• Driver notification sent
• Route optimization in progress
• Customer notification pending

Estimated pickup in 30 minutes.`);
                          }, 2000);
                        }, 2000);
                      }, 1500);
                    } else {
                      setButtonFeedback('Shipment creation cancelled');
                      setTimeout(() => setButtonFeedback(''), 2000);
                    }
                  }, 1500);
                }, 1000);
              }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-lg border border-blue-200 hover:border-blue-300"
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 rounded-full p-2 mb-2 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-xs font-semibold">New Shipment</div>
                <div className="text-xs text-blue-600 mt-1">Quick Create</div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setButtonFeedback('Initializing route optimization test...');
                console.log('Route Test button clicked!');
                
                // Generate route test data
                const testId = `RT-${Date.now().toString().slice(-6)}`;
                const currentSpeed = Math.round(safeVehicleData.speed);
                const fuelLevel = Math.round(safeVehicleData.fuel);
                
                setTimeout(() => {
                  setButtonFeedback('Testing GPS connectivity...');
                  
                  setTimeout(() => {
                    setButtonFeedback('Analyzing traffic patterns...');
                    
                    setTimeout(() => {
                      setButtonFeedback('Optimizing route efficiency...');
                      
                      setTimeout(() => {
                        setButtonFeedback('Route test completed successfully!');
                        
                        const routeTestResults = `🔍 ROUTE OPTIMIZATION TEST

Test ID: ${testId}
Vehicle: ${vehicle?.name || 'Current Vehicle'}
Driver: ${vehicle?.driver || 'System Test'}

📊 PERFORMANCE METRICS:
✅ GPS Signal: Strong (12/12 satellites)
✅ Speed: ${currentSpeed} MPH (Optimal)
✅ Fuel Level: ${fuelLevel}% (${fuelLevel > 50 ? 'Good' : fuelLevel > 25 ? 'Adequate' : 'Low'})
✅ Route Efficiency: ${(Math.random() * 10 + 85).toFixed(1)}%

🛣️ ROUTE ANALYSIS:
• Total Distance: ${(Math.random() * 50 + 100).toFixed(1)} miles
• Estimated Time: ${Math.floor(Math.random() * 60 + 120)} minutes
• Traffic Delays: ${trafficAlerts.length} alerts (${Math.floor(Math.random() * 15 + 5)} min)
• Alternative Routes: ${Math.floor(Math.random() * 3 + 2)} available

🌤️ WEATHER IMPACT:
• Conditions: ${weatherData.condition}
• Visibility: ${weatherData.visibility} miles
• Driving Recommendation: ${weatherData.condition === 'Light Rain' ? 'Caution' : 'Normal'}

💰 COST OPTIMIZATION:
• Fuel Cost: $${(Math.random() * 20 + 45).toFixed(2)}
• Time Efficiency: ${(Math.random() * 15 + 90).toFixed(1)}%
• Potential Savings: $${(Math.random() * 25 + 15).toFixed(2)}

All systems operational ✅`;

                        if (confirm(routeTestResults + '\n\nApply optimized route to current shipment?')) {
                          setButtonFeedback('Applying route optimization...');
                          setTimeout(() => {
                            setButtonFeedback('✅ Route optimized and applied successfully!');
                            setTimeout(() => setButtonFeedback(''), 3000);
                          }, 1500);
                        } else {
                          setButtonFeedback('Route test completed - No changes applied');
                          setTimeout(() => setButtonFeedback(''), 2000);
                        }
                      }, 1500);
                    }, 1200);
                  }, 1000);
                }, 800);
              }}
              className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-lg border border-green-200 hover:border-green-300"
            >
              <div className="flex flex-col items-center">
                <div className="bg-green-600 rounded-full p-2 mb-2 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs font-semibold">Route Test</div>
                <div className="text-xs text-green-600 mt-1">Optimize</div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setButtonFeedback('Generating comprehensive analytics report...');
                console.log('Reports & Analytics button clicked!');
                
                // Generate realistic analytics data
                const reportId = `RPT-${Date.now().toString().slice(-6)}`;
                const currentTime = new Date();
                const efficiency = (Math.random() * 10 + 88).toFixed(1);
                const onTimeDeliveries = (Math.random() * 5 + 92).toFixed(1);
                const fuelEfficiency = (Math.random() * 2 + 7.5).toFixed(1);
                const safetyScore = Math.round(Math.random() * 8 + 92);
                const customerRating = (Math.random() * 0.5 + 4.5).toFixed(1);
                const costReduction = (Math.random() * 6 + 8).toFixed(1);
                const totalMiles = Math.round(Math.random() * 2000 + 8000);
                const totalShipments = Math.round(Math.random() * 50 + 150);
                
                setTimeout(() => {
                  setButtonFeedback('Analyzing performance metrics...');
                  
                  setTimeout(() => {
                    setButtonFeedback('Calculating cost optimization...');
                    
                    setTimeout(() => {
                      setButtonFeedback('Report generated successfully!');
                      
                      const analyticsReport = `📊 TMS ANALYTICS DASHBOARD

Report ID: ${reportId}
Generated: ${currentTime.toLocaleString()}
Vehicle: ${vehicle?.name || 'Fleet Overview'}
Driver: ${vehicle?.driver || 'All Drivers'}

🎯 KEY PERFORMANCE INDICATORS:
• Overall Efficiency: ${efficiency}%
• On-Time Deliveries: ${onTimeDeliveries}%
• Fuel Efficiency: ${fuelEfficiency} MPG
• Safety Score: ${safetyScore}/100
• Customer Rating: ${customerRating}/5.0 ⭐

📈 OPERATIONAL METRICS:
• Total Miles: ${totalMiles.toLocaleString()} miles
• Total Shipments: ${totalShipments} completed
• Average Speed: ${Math.round(safeVehicleData.speed)} MPH
• Current Fuel: ${Math.round(safeVehicleData.fuel)}%

🚨 CURRENT ALERTS:
${trafficAlerts.length > 0 ? `• ${trafficAlerts.length} Traffic Alerts` : '• No Traffic Issues'}
${safeVehicleData.fuel < 30 ? `• Low Fuel: ${Math.round(safeVehicleData.fuel)}%` : '• Fuel Level: Normal'}
${weatherData.condition === 'Light Rain' ? '• Weather Advisory: Light Rain' : '• Weather: Favorable'}

💰 FINANCIAL ANALYSIS:
• Efficiency Rating: ${Math.round(parseFloat(efficiency))}/100
• Cost Reduction: ${costReduction}%
• Estimated Savings: $${(parseFloat(costReduction) * 45).toFixed(0)}/month
• ROI Improvement: ${(Math.random() * 8 + 12).toFixed(1)}%

📍 LOCATION INSIGHTS:
• Current Zone: ${Math.abs(currentPosition?.lat || 40.7128) > 40.7 ? 'Manhattan' : 'Newark'}
• Active Geofences: ${showGeofences ? '4 zones' : 'Disabled'}
• Route Optimization: Active

🌤️ ENVIRONMENTAL FACTORS:
• Temperature: ${weatherData.temperature}°F
• Visibility: ${weatherData.visibility} miles
• Wind Impact: ${weatherData.windSpeed > 15 ? 'Moderate' : 'Minimal'}

Would you like to:
1. Export detailed report
2. Schedule automated reports
3. View historical trends`;

                      const action = confirm(analyticsReport + '\n\nExport detailed report to email/PDF?');
                      
                      if (action) {
                        setButtonFeedback('Preparing report export...');
                        setTimeout(() => {
                          setButtonFeedback('📧 Report exported and emailed successfully!');
                          setTimeout(() => {
                            alert(`📧 REPORT EXPORTED SUCCESSFULLY!

Report Details:
• Report ID: ${reportId}
• Format: PDF + Excel
• Email: Sent to fleet.manager@company.com
• Cloud Storage: Uploaded to TMS Dashboard

The report includes:
✓ Performance metrics
✓ Cost analysis charts
✓ Route efficiency maps
✓ Driver performance data
✓ Maintenance recommendations
✓ Fuel consumption trends

Access your reports anytime in the TMS Dashboard.`);
                            setButtonFeedback('');
                          }, 2000);
                        }, 1500);
                      } else {
                        setButtonFeedback('Report viewing completed');
                        setTimeout(() => setButtonFeedback(''), 2000);
                      }
                    }, 1200);
                  }, 1000);
                }, 800);
              }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-lg p-3 text-center transition-all transform hover:scale-105 shadow-sm hover:shadow-lg border border-orange-200 hover:border-orange-300"
            >
              <div className="flex flex-col items-center">
                <div className="bg-orange-600 rounded-full p-2 mb-2 text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-xs font-semibold">Reports</div>
                <div className="text-xs text-orange-600 mt-1">Analytics</div>
              </div>
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
