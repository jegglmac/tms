'use client';

import React, { useState } from 'react';
import { MapPinIcon, TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentId: string;
  route: string;
}

function GoogleMapModal({ isOpen, onClose, shipmentId, route }: GoogleMapModalProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'gps'>('gps');
  const [showTraffic, setShowTraffic] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlaces, setShowPlaces] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'shortest' | 'scenic'>('fastest');
  const [showSatelliteDetails, setShowSatelliteDetails] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [gpsMode, setGpsMode] = useState<'2D' | '3D'>('2D');
  const [showCompass, setShowCompass] = useState(true);
  const [trackingMode, setTrackingMode] = useState<'single' | 'fleet' | 'all'>('single');
  const [showVehicleInfo, setShowVehicleInfo] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('TRK-001');
  const [showRouteTrails, setShowRouteTrails] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'active' | 'alerts' | 'low-fuel'>('all');
  const [showConstructionZones, setShowConstructionZones] = useState(true);

  // Vehicle tracking data
  const vehicles = [
    {
      id: 'TRK-001',
      name: 'Truck Alpha',
      driver: 'John Smith',
      status: 'In Transit',
      speed: 65,
      fuel: 78,
      position: { x: 50, y: 24 },
      heading: 45,
      eta: '2:30 PM',
      route: 'I-95 North',
      cargo: 'Electronics',
      destination: 'Boston, MA',
      alerts: ['Maintenance Due'],
      routePoints: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.7500, lng: -73.9857 },
        { lat: 40.7800, lng: -73.9500 }
      ]
    },
    {
      id: 'TRK-002',
      name: 'Truck Beta',
      driver: 'Sarah Johnson',
      status: 'Loading',
      speed: 0,
      fuel: 92,
      position: { x: 20, y: 35 },
      heading: 0,
      eta: '4:15 PM',
      route: 'Route 1',
      cargo: 'Medical Supplies',
      destination: 'Hartford, CT',
      alerts: ['Low Fuel', 'Delayed Schedule'],
      routePoints: [
        { lat: 40.7580, lng: -73.9855 },
        { lat: 40.8000, lng: -73.9000 },
        { lat: 40.8500, lng: -73.8500 }
      ]
    },
    {
      id: 'TRK-003',
      name: 'Truck Gamma',
      driver: 'Mike Wilson',
      status: 'Delivered',
      speed: 45,
      fuel: 34,
      position: { x: 75, y: 60 },
      heading: 180,
      eta: 'Completed',
      route: 'Local Roads',
      cargo: 'Furniture',
      destination: 'New Haven, CT',
      alerts: [],
      routePoints: [
        { lat: 40.6892, lng: -74.0445 },
        { lat: 40.6500, lng: -74.1000 },
        { lat: 40.6000, lng: -74.1500 }
      ]
    },
    {
      id: 'VAN-001',
      name: 'Delivery Van A',
      driver: 'Lisa Chen',
      status: 'In Transit',
      speed: 35,
      fuel: 67,
      position: { x: 35, y: 50 },
      heading: 90,
      eta: '3:45 PM',
      route: 'I-84 West',
      cargo: 'Packages',
      destination: 'Waterbury, CT',
      alerts: ['Traffic Delay'],
      routePoints: [
        { lat: 40.7282, lng: -73.7949 },
        { lat: 40.7400, lng: -73.7800 },
        { lat: 40.7600, lng: -73.7600 }
      ]
    }
  ];

  const getVehicleIcon = (vehicleId: string) => {
    if (vehicleId.startsWith('TRK')) return TruckIcon;
    return TruckIcon; // Default to truck icon for now
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-green-500';
      case 'Loading': return 'bg-yellow-500';
      case 'Delivered': return 'bg-blue-500';
      case 'Emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'Low Fuel': return 'text-red-600 bg-red-50';
      case 'Maintenance Due': return 'text-orange-600 bg-orange-50';
      case 'Traffic Delay': return 'text-yellow-600 bg-yellow-50';
      case 'Delayed Schedule': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getFilteredVehicles = () => {
    let filtered = vehicles;
    
    // Apply tracking mode filter
    if (trackingMode === 'single') {
      filtered = vehicles.filter(v => v.id === selectedVehicle);
    } else if (trackingMode === 'fleet') {
      filtered = vehicles.filter(v => v.id.startsWith('TRK'));
    }
    
    // Apply additional filters
    switch (vehicleFilter) {
      case 'active':
        filtered = filtered.filter(v => v.status === 'In Transit');
        break;
      case 'alerts':
        filtered = filtered.filter(v => v.alerts && v.alerts.length > 0);
        break;
      case 'low-fuel':
        filtered = filtered.filter(v => v.fuel < 30);
        break;
    }
    
    return filtered;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  // Keyboard shortcuts for zoom
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) return null;

  const getMapStyle = () => {
    const gridSize = Math.max(10, Math.min(50, 30 + (zoomLevel * 2))); // Grid responds to zoom but doesn't scale container
    
    switch (mapType) {
      case 'gps':
        return {
          backgroundImage: `
            linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px),
            linear-gradient(rgba(100,100,100,0.1) 1px, transparent 1px),
            linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 20%, #DEE2E6 40%, #CED4DA 60%, #ADB5BD 80%, #95A5A6 100%)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, 100% 100%`,
          backgroundColor: '#F1F3F4',
          border: '2px solid #34495E',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
        };
      case 'satellite':
        return {
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(139, 69, 19, 0.4) 0%, transparent 30%),
            radial-gradient(circle at 85% 15%, rgba(34, 139, 34, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 45% 75%, rgba(30, 144, 255, 0.3) 0%, transparent 25%),
            radial-gradient(circle at 70% 45%, rgba(46, 125, 50, 0.4) 0%, transparent 35%),
            radial-gradient(circle at 25% 65%, rgba(105, 105, 105, 0.3) 0%, transparent 20%),
            linear-gradient(135deg, #1B4332 0%, #2D5A2D 20%, #40916C 40%, #52B788 60%, #74C69D 80%, #95D5B2 100%)
          `,
          backgroundColor: '#081C15',
          backgroundSize: `${Math.max(60, 80 + (zoomLevel * 5))}px ${Math.max(60, 80 + (zoomLevel * 5))}px, ${Math.max(50, 60 + (zoomLevel * 4))}px ${Math.max(50, 60 + (zoomLevel * 4))}px, ${Math.max(80, 100 + (zoomLevel * 6))}px ${Math.max(80, 100 + (zoomLevel * 6))}px, ${Math.max(60, 70 + (zoomLevel * 4))}px ${Math.max(60, 70 + (zoomLevel * 4))}px, ${Math.max(40, 50 + (zoomLevel * 3))}px ${Math.max(40, 50 + (zoomLevel * 3))}px, 100% 100%`
        };
      case 'hybrid':
        return {
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 20% 30%, rgba(34, 139, 34, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #2E7D32 0%, #4CAF50 40%, #66BB6A 100%)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, 100% 100%, 100% 100%`,
          backgroundColor: '#1B5E20'
        };
      default:
        return {
          backgroundImage: `
            linear-gradient(90deg, rgba(200,200,200,0.3) 1px, transparent 1px),
            linear-gradient(rgba(200,200,200,0.3) 1px, transparent 1px),
            linear-gradient(135deg, #F5F5F5 0%, #E8F5E8 50%, #F0F8F0 100%)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, 100% 100%`,
          backgroundColor: '#FAFAFA'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-[98vw] max-h-[98vh] overflow-hidden flex flex-col">
        {/* Google Maps Header */}
        <div className="flex justify-between items-center p-3 border-b bg-white flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Live Tracking - {shipmentId}</h2>
            <div className="flex items-center space-x-3 text-lg text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-bold text-green-700">LIVE</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2 text-base">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-blue-700">65 mph</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-orange-700">2h 18m</span>
              </div>
            </div>
          </div>
          
          {/* Close Button to Return to Homepage */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-300"
              title="Return to Homepage"
            >
              <span className="text-sm font-medium">← Back to Dashboard</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-gray-700"
              title="Close Map"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Places Search */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            {/* Places Search */}
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowPlaces(true)}
                onBlur={() => setTimeout(() => setShowPlaces(false), 200)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-600"
              />
              {showPlaces && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-sm text-gray-600 px-3 py-2 font-bold">Suggested</div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {setSearchQuery('Rest Stop - Mile 127'); setShowPlaces(false);}}>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-gray-900">Connecticut Welcome Center</div>
                        <div className="text-sm text-gray-700 font-medium">Rest stop • I-95 North, Mile 127</div>
                        <div className="text-sm text-green-700 font-semibold">Open 24 hours</div>
                      </div>
                      <div className="text-base text-gray-700 font-bold">8 min</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {setSearchQuery('Shell Gas Station'); setShowPlaces(false);}}>
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-gray-900">Shell</div>
                        <div className="text-sm text-gray-700 font-medium">Gas station • 2.3 miles ahead on route</div>
                        <div className="text-sm text-blue-700 font-semibold">$3.45/gal • Good prices</div>
                      </div>
                      <div className="text-base text-gray-700 font-bold">4 min</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {setSearchQuery('TA Travel Center'); setShowPlaces(false);}}>
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <TruckIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-gray-900">TA Travel Center</div>
                        <div className="text-sm text-gray-700 font-medium">Truck stop • 8.7 miles ahead</div>
                        <div className="text-sm text-green-700 font-semibold">Truck parking available • Showers</div>
                      </div>
                      <div className="text-base text-gray-700 font-bold">12 min</div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {setSearchQuery('Cracker Barrel'); setShowPlaces(false);}}>
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Cracker Barrel Old Country Store</div>
                        <div className="text-xs text-gray-500">Restaurant • Exit 15, 1.2 miles off route</div>
                        <div className="text-xs text-yellow-600">4.3 ★ • Moderate prices</div>
                      </div>
                      <div className="text-xs text-gray-400">18 min</div>
                    </div>
                    
                    <div className="border-t my-2"></div>
                    <div className="text-xs text-gray-500 px-2 py-1 font-medium">Recent</div>
                    
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {setSearchQuery('Newark Distribution Center'); setShowPlaces(false);}}>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 1h2v4H7V5zm8 0v4h-2V5h2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Newark Distribution Center</div>
                        <div className="text-xs text-gray-500">Warehouse • Previous delivery location</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Map Type Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMapType('gps')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${mapType === 'gps' ? 'bg-white shadow text-blue-600' : 'text-gray-700'}`}
                >
                  GPS
                </button>
                <button
                  onClick={() => setMapType('roadmap')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${mapType === 'roadmap' ? 'bg-white shadow text-blue-600' : 'text-gray-700'}`}
                >
                  Map
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${mapType === 'satellite' ? 'bg-white shadow text-blue-600' : 'text-gray-700'}`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapType('hybrid')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${mapType === 'hybrid' ? 'bg-white shadow text-blue-600' : 'text-gray-700'}`}
                >
                  Hybrid
                </button>
              </div>
              <button
                onClick={() => setShowTraffic(!showTraffic)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${showTraffic ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Traffic
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Main Map Area */}
          <div 
            className="flex-1 relative overflow-hidden cursor-move" 
            style={getMapStyle()}
            onWheel={(e) => {
              e.preventDefault();
              if (e.deltaY < 0) {
                handleZoomIn();
              } else {
                handleZoomOut();
              }
            }}
            title="Use mouse wheel to zoom, drag to pan"
          >
            {/* Google Maps Controls - Stay fixed, don't zoom */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1 z-50">
              <div className="bg-white rounded shadow-md border">
                <button 
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 18}
                  className={`w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-t transition-colors ${
                    zoomLevel >= 18 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                  }`}
                  title="Zoom in"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
                <div className="border-t border-gray-200"></div>
                <button 
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className={`w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-b transition-colors ${
                    zoomLevel <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                  }`}
                  title="Zoom out"
                >
                  <span className="text-lg font-bold">−</span>
                </button>
              </div>
              
              {/* Zoom Level Indicator */}
              <div className="bg-white rounded shadow-md px-2 py-1 text-xs font-semibold text-gray-800 text-center border min-w-[40px]">
                <div className="text-sm">{zoomLevel}</div>
                <div className="text-xs text-gray-500 -mt-0.5">zoom</div>
              </div>
              
              <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors" title="My location">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Alerts Toggle - Always Available */}
              <button 
                onClick={() => setShowAlerts(!showAlerts)}
                className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${showAlerts ? 'bg-red-50' : ''}`}
                title="Toggle alerts"
              >
                <svg className={`w-4 h-4 ${showAlerts ? 'text-red-600' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Route Trails Toggle - Always Available */}
              <button 
                onClick={() => setShowRouteTrails(!showRouteTrails)}
                className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${showRouteTrails ? 'bg-green-50' : ''}`}
                title="Toggle route trails"
              >
                <svg className={`w-4 h-4 ${showRouteTrails ? 'text-green-600' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>

              {/* Analytics Toggle - Always Available */}
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${showAnalytics ? 'bg-purple-50' : ''}`}
                title="Toggle analytics & reports"
              >
                <svg className={`w-4 h-4 ${showAnalytics ? 'text-purple-600' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>

              {/* GPS Mode Toggle */}
              {mapType === 'gps' && (
                <>
                  <button 
                    onClick={() => setGpsMode(gpsMode === '2D' ? '3D' : '2D')}
                    className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${gpsMode === '3D' ? 'bg-blue-50' : ''}`}
                    title={`Switch to ${gpsMode === '2D' ? '3D' : '2D'} view`}
                  >                      <span className="text-xs font-bold text-gray-700">{gpsMode}</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowCompass(!showCompass)}
                      className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${showCompass ? 'bg-green-50' : ''}`}
                      title="Toggle compass"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20" style={{transform: 'rotate(15deg)'}}>
                        <path d="M10 2L5.5 8.5L10 9L14.5 8.5L10 2z" fill="#dc2626"/>
                        <path d="M5.5 8.5L10 15L14.5 8.5L10 9L5.5 8.5z" fill="#991b1b"/>
                        <circle cx="10" cy="10" r="2" fill="white"/>
                      </svg>
                    </button>

                    {/* Vehicle Tracking Controls */}
                    <div className="bg-white rounded shadow-md border overflow-hidden">
                      <button 
                        onClick={() => setTrackingMode(trackingMode === 'single' ? 'fleet' : trackingMode === 'fleet' ? 'all' : 'single')}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        title={`Tracking: ${trackingMode}`}
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          {trackingMode === 'single' && (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          )}
                          {trackingMode === 'fleet' && (
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1a1 1 0 00.293.707L15 9.414l.707-.707A1 1 0 0016 8V7z" />
                          )}
                          {trackingMode === 'all' && (
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </button>
                    </div>

                    <button 
                      onClick={() => setShowVehicleInfo(!showVehicleInfo)}
                      className={`w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors ${showVehicleInfo ? 'bg-blue-50' : ''}`}
                      title="Toggle vehicle info"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                </>
              )}
            </div>

            {/* Mini GPS Status Indicator - Fixed position */}
            <div className="absolute top-2 left-2 z-50">
              <div className="bg-white rounded shadow-md px-1.5 py-1 border flex items-center space-x-1.5 text-xs">
                {/* GPS Status */}
                <div className="flex items-center space-x-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700">GPS</span>
                </div>
                
                {/* Signal Strength - Mini bars */}
                <div className="flex items-center space-x-0.5">
                  <div className="w-0.5 h-1 bg-green-500 rounded-sm"></div>
                  <div className="w-0.5 h-1.5 bg-green-500 rounded-sm"></div>
                  <div className="w-0.5 h-2 bg-green-500 rounded-sm"></div>
                </div>
                
                {/* Live indicator */}
                <span className="text-xs text-green-600 font-medium">●</span>
              </div>
            </div>

            {/* Zoom Content Container - Map elements that scale with zoom */}
            <div 
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
              style={{
                transform: `scale(${Math.max(0.5, Math.min(2.0, zoomLevel / 10))})`,
                transformOrigin: 'center center'
              }}
            >

            {/* GPS Compass */}
            {mapType === 'gps' && showCompass && (
              <div className="absolute top-2 right-16 z-20">
                <div className="bg-white rounded-full shadow-md p-2 border w-14 h-14 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Compass Rose */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#d1d5db" strokeWidth="0.5"/>
                      
                      {/* North Arrow */}
                      <path d="M50 5 L55 20 L50 15 L45 20 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="0.5"/>
                      <text x="50" y="12" textAnchor="middle" className="text-[6px] font-bold fill-red-700">N</text>
                      
                      {/* Direction indicator */}
                      <path d="M50 50 L50 25" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)"/>
                      
                      <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,6 L9,3 z" fill="#2563eb"/>
                        </marker>
                      </defs>
                    </svg>
                    
                    {/* Bearing display */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                      NE 045°
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Street View Toggle */}
            <div className="absolute bottom-4 right-4">
              <button className="bg-white rounded shadow-lg p-2 hover:bg-gray-50">
                <svg className="w-8 h-6" viewBox="0 0 32 24" fill="currentColor">
                  <rect x="0" y="8" width="32" height="8" fill="#4285F4" opacity="0.3"/>
                  <rect x="8" y="4" width="16" height="16" fill="#4285F4" opacity="0.6"/>
                  <rect x="12" y="0" width="8" height="24" fill="#4285F4"/>
                </svg>
              </button>
            </div>

            {/* Roads and Highways */}
            {mapType === 'roadmap' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Major Highways */}
                <path d="M 10 30 Q 30 25, 50 28 Q 70 32, 90 25" stroke="#4285F4" strokeWidth="0.8" fill="none" className="opacity-80"/>
                <path d="M 15 45 Q 35 40, 55 43 Q 75 47, 85 40" stroke="#34A853" strokeWidth="0.6" fill="none" className="opacity-60"/>
                <path d="M 20 60 Q 40 55, 60 58 Q 80 62, 85 55" stroke="#FBBC04" strokeWidth="0.4" fill="none" className="opacity-50"/>
                
                {/* Street Labels */}
                <text x="25" y="35" fontSize="2" fill="#666" className="font-sans">I-95 North</text>
                <text x="45" y="50" fontSize="1.5" fill="#666" className="font-sans">Route 1</text>
              </svg>
            )}

            {/* GPS Road Network */}
            {mapType === 'gps' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Major Highways - GPS Style */}
                <defs>
                  <linearGradient id="gpsHighway" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <linearGradient id="gpsRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                
                {/* Interstate Highways */}
                <path d="M 10 30 Q 30 25, 50 28 Q 70 32, 90 25" stroke="url(#gpsHighway)" strokeWidth="2.5" fill="none" className="drop-shadow-sm"/>
                <path d="M 10 30 Q 30 25, 50 28 Q 70 32, 90 25" stroke="#ffffff" strokeWidth="1" fill="none" className="opacity-60"/>
                
                {/* State Routes */}
                <path d="M 15 45 Q 35 40, 55 43 Q 75 47, 85 40" stroke="url(#gpsRoute)" strokeWidth="2" fill="none" className="drop-shadow-sm"/>
                <path d="M 15 45 Q 35 40, 55 43 Q 75 47, 85 40" stroke="#ffffff" strokeWidth="0.8" fill="none" className="opacity-50"/>
                
                {/* Local Roads */}
                <path d="M 20 60 Q 40 55, 60 58 Q 80 62, 85 55" stroke="#6b7280" strokeWidth="1.5" fill="none" className="opacity-70"/>
                <path d="M 5 70 L 95 68" stroke="#6b7280" strokeWidth="1" fill="none" className="opacity-50"/>
                <path d="M 12 15 L 88 18" stroke="#6b7280" strokeWidth="1" fill="none" className="opacity-50"/>
                
                {/* Cross Streets */}
                <path d="M 25 10 L 23 90" stroke="#9ca3af" strokeWidth="1" fill="none" className="opacity-40"/>
                <path d="M 50 5 L 52 95" stroke="#9ca3af" strokeWidth="1" fill="none" className="opacity-40"/>
                <path d="M 75 8 L 77 92" stroke="#9ca3af" strokeWidth="1" fill="none" className="opacity-40"/>
                
                {/* Highway Labels - GPS Style */}
                <g className="font-mono">
                  <rect x="23" y="32" width="8" height="6" fill="#1e40af" rx="1"/>
                  <text x="27" y="36.5" fontSize="3" fill="white" textAnchor="middle" className="font-bold">95</text>
                  
                  <rect x="43" y="46" width="6" height="4" fill="#059669" rx="0.5"/>
                  <text x="46" y="49" fontSize="2" fill="white" textAnchor="middle" className="font-bold">1</text>
                </g>
                
                {/* Mile Markers */}
                {zoomLevel > 12 && (
                  <g>
                    <circle cx="35" cy="28" r="1" fill="#1e40af" className="opacity-70"/>
                    <text x="35" y="25" fontSize="1.5" fill="#1e40af" textAnchor="middle" className="font-bold">127</text>
                    
                    <circle cx="65" cy="31" r="1" fill="#1e40af" className="opacity-70"/>
                    <text x="65" y="28" fontSize="1.5" fill="#1e40af" textAnchor="middle" className="font-bold">128</text>
                  </g>
                )}
                
                {/* Exit Numbers */}
                {zoomLevel > 10 && (
                  <g className="font-mono">
                    <rect x="40" y="25" width="4" height="3" fill="#ffffff" stroke="#1e40af" strokeWidth="0.2" rx="0.3"/>
                    <text x="42" y="27.5" fontSize="1.2" fill="#1e40af" textAnchor="middle" className="font-bold">15</text>
                    
                    <rect x="70" y="33" width="4" height="3" fill="#ffffff" stroke="#1e40af" strokeWidth="0.2" rx="0.3"/>
                    <text x="72" y="35.5" fontSize="1.2" fill="#1e40af" textAnchor="middle" className="font-bold">16</text>
                  </g>
                )}
              </svg>
            )}

            {/* Satellite Features */}
            {mapType === 'satellite' && (
              <>
                {/* Enhanced Terrain Features with realistic scaling */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    top: '12%', 
                    left: '8%',
                    width: `${Math.max(32, 64 * (zoomLevel / 10))}px`,
                    height: `${Math.max(24, 48 * (zoomLevel / 10))}px`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-full opacity-70 shadow-inner"></div>
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-600 rounded-full opacity-50"></div>
                  {zoomLevel > 12 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Forest Area
                    </div>
                  )}
                </div>

                {/* Agricultural Fields */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    top: '20%', 
                    left: '24%',
                    width: `${Math.max(24, 48 * (zoomLevel / 10))}px`,
                    height: `${Math.max(16, 32 * (zoomLevel / 10))}px`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-r from-yellow-600 via-green-500 to-yellow-700 opacity-60 transform rotate-12"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-30"></div>
                  {zoomLevel > 10 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Farmland
                    </div>
                  )}
                </div>

                {/* Water Bodies with realistic appearance */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    bottom: '16%', 
                    right: '12%',
                    width: `${Math.max(40, 80 * (zoomLevel / 10))}px`,
                    height: `${Math.max(20, 40 * (zoomLevel / 10))}px`,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-full opacity-70 shadow-inner"></div>
                  <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-white rounded-full opacity-20"></div>
                  {zoomLevel > 12 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Lake
                    </div>
                  )}
                </div>

                {/* Urban/Industrial Areas */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    top: '16%', 
                    left: '33.33%',
                    transform: `scale(${Math.max(0.8, Math.min(1.5, zoomLevel / 10))})`,
                  }}
                >
                  {/* Buildings cluster */}
                  <div className="w-6 h-6 bg-gray-700 shadow-2xl transform rotate-12"></div>
                  <div className="absolute top-1 left-1 w-4 h-8 bg-gray-600 shadow-2xl transform -rotate-6"></div>
                  <div className="absolute top-2 left-3 w-3 h-4 bg-gray-500 shadow-2xl"></div>
                  <div className="absolute -top-1 left-4 w-5 h-7 bg-gray-800 shadow-2xl transform rotate-3"></div>
                  
                  {/* Industrial structures */}
                  <div className="absolute top-4 -left-2 w-8 h-2 bg-gray-600 rounded opacity-80"></div>
                  <div className="absolute top-6 left-1 w-2 h-6 bg-gray-500 rounded-full opacity-70"></div>
                  
                  {zoomLevel > 10 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Industrial Zone
                    </div>
                  )}
                </div>

                {/* Residential Areas */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    top: '24%', 
                    right: '33.33%',
                    transform: `scale(${Math.max(0.6, Math.min(1.2, zoomLevel / 12))})`,
                  }}
                >
                  <div className="w-3 h-3 bg-red-600 shadow-lg transform rotate-45"></div>
                  <div className="absolute top-1 left-2 w-2 h-2 bg-red-500 shadow-lg transform rotate-12"></div>
                  <div className="absolute -top-1 left-1 w-2 h-2 bg-red-700 shadow-lg transform -rotate-12"></div>
                  <div className="absolute top-2 left-4 w-3 h-3 bg-red-600 shadow-lg transform rotate-30"></div>
                  
                  {zoomLevel > 14 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Residential
                    </div>
                  )}
                </div>

                {/* Enhanced Vegetation Areas */}
                <div className="absolute top-8 right-8 transition-all duration-300" style={{ transform: `scale(${Math.max(0.8, Math.min(1.4, zoomLevel / 8))})`}}>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-green-600 to-green-800 rounded-full opacity-80 shadow-lg"></div>
                  <div className="absolute top-1 left-1 w-6 h-6 bg-green-400 rounded-full opacity-60"></div>
                  <div className="absolute top-2 left-2 w-4 h-4 bg-green-300 rounded-full opacity-40"></div>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-700 rounded-full opacity-70"></div>
                  <div className="absolute top-3 -right-1 w-2 h-2 bg-green-600 rounded-full opacity-60"></div>
                  
                  {zoomLevel > 12 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      Park
                    </div>
                  )}
                </div>

                {/* Roads visible in satellite view */}
                {zoomLevel > 8 && (
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 10 30 Q 30 25, 50 28 Q 70 32, 90 25" stroke="#666" strokeWidth="0.3" fill="none"/>
                    <path d="M 15 45 Q 35 40, 55 43 Q 75 47, 85 40" stroke="#555" strokeWidth="0.2" fill="none"/>
                    <path d="M 20 60 Q 40 55, 60 58 Q 80 62, 85 55" stroke="#777" strokeWidth="0.15" fill="none"/>
                  </svg>
                )}

                {/* Cloud shadows for realism */}
                <div className="absolute top-1/4 left-1/2 w-20 h-12 bg-black opacity-10 rounded-full transform -skew-x-12 animate-pulse" style={{animationDuration: '4s'}}></div>
                <div className="absolute bottom-1/3 left-1/4 w-16 h-8 bg-black opacity-5 rounded-full transform skew-x-6 animate-pulse" style={{animationDuration: '6s'}}></div>

                {/* Enhanced Satellite Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white rounded-lg p-3 shadow-lg border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Satellite View</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>📅 Captured: March 15, 2024</div>
                    <div>📐 Resolution: 60cm/pixel</div>
                    <div>☁️ Cloud coverage: 2%</div>
                    <div>🛰️ Source: WorldView-3</div>
                    {zoomLevel > 12 && (
                      <>
                        <div className="border-t border-gray-600 pt-1 mt-2">
                          <div>🔍 Zoom: {zoomLevel}x</div>
                          <div>📏 Scale: 1:{Math.round(100000 / zoomLevel)}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Atmospheric effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-yellow-50 opacity-5 pointer-events-none"></div>
              </>
            )}
            {showTraffic && (
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-16 h-1 bg-red-500 rounded opacity-80"></div>
                <div className="absolute top-1/3 left-1/2 w-12 h-1 bg-yellow-500 rounded opacity-80"></div>
                <div className="absolute top-1/2 left-1/3 w-20 h-1 bg-green-500 rounded opacity-80"></div>
              </div>
            )}

            {/* Construction Zone Indicators - Smaller */}
            {showConstructionZones && (
              <div className="absolute inset-0 pointer-events-none">
              {/* Main Construction Zone near Exit 15 */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: '65%', 
                  top: '35%',
                  zIndex: 25
                }}
              >
                {/* Construction Area Boundary - Smaller */}
                <div className="relative">
                  {/* Animated construction boundary */}
                  <div className="w-12 h-6 border-2 border-orange-500 border-dashed rounded bg-orange-100 bg-opacity-60 animate-pulse">
                    {/* Construction equipment */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Construction vehicles */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-500 rounded transform rotate-45"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-600 rounded"></div>
                  </div>
                  
                  {/* Construction warning signs - Smaller */}
                  <div className="absolute -top-4 -left-2">
                    <div className="w-4 h-4 bg-yellow-400 transform rotate-45 border border-black flex items-center justify-center">
                      <span className="text-black text-xs transform -rotate-45">🚧</span>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 -right-2">
                    <div className="w-4 h-4 bg-orange-500 transform rotate-45 border border-black flex items-center justify-center">
                      <span className="text-white text-xs transform -rotate-45">⚠️</span>
                    </div>
                  </div>
                  
                  {/* Lane closure indicators - Smaller */}
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-0.5">
                      <div className="w-2 h-1 bg-red-500 rounded opacity-80"></div>
                      <div className="w-2 h-1 bg-green-500 rounded opacity-80"></div>
                      <div className="w-2 h-1 bg-green-500 rounded opacity-80"></div>
                    </div>
                    <div className="text-xs text-center mt-0.5 bg-black bg-opacity-70 text-white px-1 rounded">
                      2/3
                    </div>
                  </div>
                  
                  {/* Speed limit sign - Smaller */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-5 h-6 bg-white border border-red-600 rounded flex flex-col items-center justify-center shadow">
                      <div className="text-xs font-bold text-red-600">45</div>
                    </div>
                  </div>
                  
                  {/* Active work indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-orange-700 rounded-full"></div>
                  </div>
                </div>
                
                {/* Information tooltip for construction zone */}
                {zoomLevel > 10 && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-orange-900 text-white text-xs px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    <div className="font-bold">🚧 Active Construction</div>
                    <div>Bridge work 6AM-4PM</div>
                  </div>
                )}
              </div>
              
              {/* Construction equipment indicators - Smaller */}
              <div 
                className="absolute"
                style={{ 
                  left: '68%', 
                  top: '38%',
                  zIndex: 20
                }}
              >
                <div className="w-2 h-3 bg-yellow-500 rounded transform rotate-12 shadow">
                  <div className="w-0.5 h-0.5 bg-black rounded-full mt-0.5 ml-0.5"></div>
                </div>
              </div>
              
              <div 
                className="absolute"
                style={{ 
                  left: '62%', 
                  top: '33%',
                  zIndex: 20
                }}
              >
                <div className="w-2.5 h-2 bg-orange-600 rounded shadow">
                  <div className="w-0.5 h-0.5 bg-white rounded-full mt-0.5 ml-0.5"></div>
                </div>
              </div>
              
              {/* Traffic cones - Smaller */}
              <div 
                className="absolute flex space-x-1"
                style={{ 
                  left: '58%', 
                  top: '36%',
                  zIndex: 15
                }}
              >
                <div className="w-0.5 h-2 bg-orange-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                <div className="w-0.5 h-2 bg-orange-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                <div className="w-0.5 h-2 bg-orange-500" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
              </div>
              
              {/* Construction zone impact area - Smaller */}
              <div 
                className="absolute"
                style={{ 
                  left: '58%', 
                  top: '32%',
                  width: '15%',
                  height: '6%',
                  zIndex: 5
                }}
              >
                <div className="w-full h-full bg-orange-200 opacity-30 rounded border border-orange-400 border-dashed"></div>
              </div>
              
              {/* Detour route indicator - Smaller */}
              <svg 
                className="absolute"
                style={{ 
                  left: '48%', 
                  top: '28%',
                  width: '20%',
                  height: '15%',
                  zIndex: 10
                }}
                viewBox="0 0 100 50"
              >
                <defs>
                  <marker id="detourArrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L6,3 z" fill="#2563eb"/>
                  </marker>
                </defs>
                <path 
                  d="M 10 25 Q 30 15, 50 20 Q 70 25, 90 20" 
                  stroke="#2563eb" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="3,2"
                  markerEnd="url(#detourArrow)"
                  opacity="0.8"
                />
                <text x="50" y="35" fontSize="4" fill="#1d4ed8" textAnchor="middle" className="font-bold">
                  Alt Route
                </text>
              </svg>
            </div>
            )}

            {/* Route Path with Enhanced Arrow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="100%" stopColor="#1A73E8" />
                </linearGradient>
                <marker id="routeArrowEnd" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#1A73E8" stroke="#1A73E8" strokeWidth="1"/>
                </marker>
                <marker id="routeArrowMid" markerWidth="8" markerHeight="8" refX="6" refY="2" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,4 L6,2 z" fill="#4285F4" stroke="#4285F4" strokeWidth="0.5"/>
                </marker>
              </defs>
              <path
                d="M 20 35 Q 35 28, 50 32 Q 65 36, 80 28"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="none"
                markerEnd="url(#routeArrowEnd)"
                markerMid="url(#routeArrowMid)"
                className="drop-shadow-sm"
              />
              
              {/* Direction indicators along the route */}
              <circle cx="35" cy="30" r="1.5" fill="#4285F4" opacity="0.8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="32" r="1.5" fill="#4285F4" opacity="0.6">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="65" cy="34" r="1.5" fill="#4285F4" opacity="0.4">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite"/>
              </circle>
            </svg>

            {/* Starting Point - Smaller Google Maps Style */}
            <div 
              className="absolute top-28 left-16 transform hover:scale-110 transition-transform cursor-pointer"
              style={{ 
                transform: `scale(${Math.max(0.3, Math.min(0.8, zoomLevel / 15))}) translate(-50%, -50%)`,
                left: '16%',
                top: '28%',
                zIndex: 40
              }}
            >
              <div className="relative">
                <div className={`${zoomLevel > 12 ? 'w-6 h-8' : 'w-5 h-7'} bg-red-500 rounded-t-full rounded-b-none transform rotate-0 flex items-start justify-center pt-1 shadow-lg transition-all`}>
                  <div className={`${zoomLevel > 12 ? 'w-3 h-3' : 'w-2 h-2'} bg-white rounded-full transition-all`}></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>
              {zoomLevel > 10 && (
                <div className="mt-1 bg-white px-1.5 py-0.5 rounded shadow-md border text-xs font-semibold text-gray-900">
                  {route.split(' → ')[0]}
                </div>
              )}
            </div>

            {/* Vehicle Fleet Tracking - Smaller Vehicles */}
            {vehicles
              .filter(vehicle => {
                if (trackingMode === 'single') return vehicle.id === selectedVehicle;
                if (trackingMode === 'fleet') return vehicle.id.startsWith('TRK');
                return true; // Show all vehicles
              })
              .map((vehicle) => {
                const VehicleIcon = getVehicleIcon(vehicle.id);
                const isSelected = vehicle.id === selectedVehicle;
                const statusColor = getStatusColor(vehicle.status);
                
                return (
                  <div
                    key={vehicle.id}
                    className="absolute cursor-pointer transition-all duration-300"
                    style={{ 
                      transform: `scale(${Math.max(0.4, Math.min(0.8, zoomLevel / 15))}) translate(-50%, -50%)`,
                      left: `${vehicle.position.x}%`,
                      top: `${vehicle.position.y}%`,
                      zIndex: isSelected ? 30 : 20
                    }}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className="relative">
                      {/* Vehicle Icon - Smaller */}
                      <div className={`${zoomLevel > 12 ? 'w-10 h-10' : 'w-8 h-8'} ${statusColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all relative ${isSelected ? 'ring-2 ring-blue-300 ring-opacity-75' : 'ring-1 ring-gray-300 ring-opacity-50'}`} style={{
                        filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
                        boxShadow: isSelected ? '0 0 10px rgba(59, 130, 246, 0.5)' : '0 0 5px rgba(0,0,0,0.2)'
                      }}>
                        <VehicleIcon className={`${zoomLevel > 12 ? 'w-6 h-6' : 'w-5 h-5'} text-white transition-all drop-shadow-lg`} />
                        
                        {/* Live indicator pulse for moving vehicles */}
                        {vehicle.speed > 0 && (
                          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40"></div>
                        )}
                        
                        {/* Emergency indicator */}
                        {vehicle.status === 'Emergency' && (
                          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Vehicle Information Popup */}
                      {(zoomLevel > 8 && showVehicleInfo && isSelected) && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-40">
                          <div className="flex items-center space-x-1">
                            <div className={`w-1.5 h-1.5 ${statusColor} rounded-full ${vehicle.speed > 0 ? 'animate-pulse' : ''}`}></div>
                            <span className="font-bold">{vehicle.speed} mph</span>
                            <span className="text-gray-300">•</span>
                            <span>{vehicle.eta}</span>
                          </div>
                          <div className="text-xs text-gray-300 mt-0.5 text-center">
                            {vehicle.driver} • {vehicle.status}
                          </div>
                        </div>
                      )}
                      
                      {/* Compact info for non-selected vehicles */}
                      {(zoomLevel > 10 && showVehicleInfo && !isSelected && trackingMode !== 'single') && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs whitespace-nowrap">
                          {vehicle.id}
                        </div>
                      )}
                      
                      {/* Direction Arrow - Fixed and Enhanced */}
                      {vehicle.speed > 0 && (
                        <div 
                          className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center"
                          style={{ 
                            transform: `rotate(${vehicle.heading}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          <svg className="w-4 h-4 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" className={vehicle.speed > 30 ? 'text-green-600' : vehicle.speed > 15 ? 'text-yellow-600' : 'text-red-600'} />
                          </svg>
                        </div>
                      )}
                      
                      {/* Speed indicator ring for moving vehicles */}
                      {vehicle.speed > 0 && (
                        <div className={`absolute inset-0 border-2 border-green-400 rounded-full ${zoomLevel > 10 ? 'animate-spin' : 'animate-pulse'}`} style={{animationDuration: `${Math.max(1, 4 - vehicle.speed/20)}s`}}></div>
                      )}
                      
                      {/* Vehicle ID Label - Smaller */}
                      {zoomLevel > 12 && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded shadow border text-xs font-bold text-center text-gray-800">
                          {vehicle.name}
                        </div>
                      )}
                      
                      {/* Always visible vehicle ID for better identification */}
                      {zoomLevel <= 12 && (
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-1 py-0.5 rounded text-xs font-bold text-center">
                          {vehicle.id}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Route Trails */}
            {showRouteTrails && getFilteredVehicles().map((vehicle) => (
              <div key={`trail-${vehicle.id}`}>
                {vehicle.routePoints && vehicle.routePoints.map((point, index) => (
                  <div key={`trail-point-${vehicle.id}-${index}`}>
                    {index > 0 && (
                      <svg
                        className="absolute pointer-events-none"
                        style={{ 
                          left: `${Math.min(
                            ((vehicle.routePoints[index-1].lng + 74.1) / 0.1) * 80,
                            ((point.lng + 74.1) / 0.1) * 80
                          )}%`,
                          top: `${Math.min(
                            ((40.8 - vehicle.routePoints[index-1].lat) / 0.15) * 80,
                            ((40.8 - point.lat) / 0.15) * 80
                          )}%`,
                          width: `${Math.abs(((vehicle.routePoints[index-1].lng + 74.1) / 0.1) * 80 - ((point.lng + 74.1) / 0.1) * 80)}%`,
                          height: `${Math.abs(((40.8 - vehicle.routePoints[index-1].lat) / 0.15) * 80 - ((40.8 - point.lat) / 0.15) * 80)}%`,
                          minWidth: '2px',
                          minHeight: '2px'
                        }}
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="100%"
                          y2="100%"
                          stroke={vehicle.id === selectedVehicle ? '#3B82F6' : '#6B7280'}
                          strokeWidth={vehicle.id === selectedVehicle ? '3' : '2'}
                          strokeDasharray={vehicle.status === 'In Transit' ? '0' : '5,5'}
                          opacity={vehicle.id === selectedVehicle ? '0.8' : '0.5'}
                          className={vehicle.speed > 0 ? 'animate-pulse' : ''}
                          markerEnd={`url(#trailArrow-${vehicle.id})`}
                        />
                        <defs>
                          <marker id={`trailArrow-${vehicle.id}`} markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,4 L5,2 z" fill={vehicle.id === selectedVehicle ? '#3B82F6' : '#6B7280'} opacity={vehicle.id === selectedVehicle ? '0.8' : '0.5'}/>
                          </marker>
                        </defs>
                      </svg>
                    )}
                    
                    {/* Route waypoints */}
                    <div
                      className={`absolute w-2 h-2 rounded-full border-2 border-white shadow-sm ${
                        vehicle.id === selectedVehicle ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ 
                        left: `${((point.lng + 74.1) / 0.1) * 80}%`,
                        top: `${((40.8 - point.lat) / 0.15) * 80}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`Waypoint ${index + 1} for ${vehicle.name}`}
                    ></div>
                  </div>
                ))}
              </div>
            ))}

            {/* Vehicle Alert Indicators */}
            {showAlerts && getFilteredVehicles()
              .filter(vehicle => vehicle.alerts && vehicle.alerts.length > 0)
              .map((vehicle) => (
                <div key={`alerts-${vehicle.id}`}>
                  {vehicle.alerts.map((alert, alertIndex) => (
                    <div
                      key={`alert-${vehicle.id}-${alertIndex}`}
                      className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${getAlertColor(alert)} px-2 py-1 rounded-full text-xs font-medium border shadow-lg animate-bounce`}
                      style={{ 
                        left: `${vehicle.position.x}%`,
                        top: `${vehicle.position.y - 8 - (alertIndex * 3)}%`,
                        animationDelay: `${alertIndex * 0.2}s`
                      }}
                    >
                      {alert}
                    </div>
                  ))}
                </div>
              ))}

            {/* Route Trail for Selected Vehicle - Enhanced */}
            {trackingMode === 'single' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="vehicleTrail" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
                  </linearGradient>
                  <marker id="vehicleTrailArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L8,3 z" fill="#1e40af" opacity="0.9"/>
                  </marker>
                </defs>
                <path
                  d="M 20 35 Q 35 28, 50 32 Q 65 36, 80 28"
                  stroke="url(#vehicleTrail)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8,4"
                  markerEnd="url(#vehicleTrailArrow)"
                  className="drop-shadow-sm"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite"/>
                </path>
                
                {/* Progress indicators */}
                <circle cx="20" cy="35" r="2" fill="#3b82f6" opacity="0.8"/>
                <circle cx="50" cy="32" r="1.5" fill="#1d4ed8" opacity="0.6">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="80" cy="28" r="2" fill="#1e40af" opacity="0.9"/>
              </svg>
            )}

            {/* Destination Point - Smaller */}
            <div 
              className="absolute top-20 right-16 transform hover:scale-110 transition-transform cursor-pointer"
              style={{ 
                transform: `scale(${Math.max(0.3, Math.min(0.8, zoomLevel / 15))}) translate(50%, -50%)`,
                right: '16%',
                top: '20%',
                zIndex: 40
              }}
            >
              <div className="relative">
                <div className={`${zoomLevel > 12 ? 'w-6 h-8' : 'w-5 h-7'} bg-green-500 rounded-t-full rounded-b-none flex items-start justify-center pt-1 shadow-lg transition-all`}>
                  <div className={`${zoomLevel > 12 ? 'w-3 h-3' : 'w-2 h-2'} bg-white rounded-full transition-all`}></div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
              </div>
              {zoomLevel > 10 && (
                <div className="mt-1 bg-white px-1.5 py-0.5 rounded shadow-md border text-xs font-semibold text-gray-900">
                  {route.split(' → ')[1]}
                </div>
              )}
            </div>

            </div> {/* Close zoom container */}

            {/* Scale Indicator - Fixed position */}
            <div className="absolute bottom-2 left-2 bg-white rounded shadow-md px-2 py-1.5 text-xs text-gray-800 border z-50">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{Math.round(50 / (zoomLevel / 10))} mi</span>
                <div className="relative">
                  <div className="w-12 h-0.5 bg-gray-800 rounded"></div>
                  <div className="absolute -left-0.5 -top-0.5 w-0.5 h-1.5 bg-gray-800"></div>
                  <div className="absolute -right-0.5 -top-0.5 w-0.5 h-1.5 bg-gray-800"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 text-center">
                1:{Math.round(100000 / zoomLevel)}
              </div>
            </div>

            {/* Analytics Overlay */}
            {showAnalytics && (
              <div className="absolute top-4 left-4 right-4 bottom-4 pointer-events-none z-40">
                {/* Performance Heat Map Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Route Efficiency Zones */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-green-400 opacity-20 rounded-lg border-2 border-green-500 border-dashed"></div>
                  <div className="absolute top-1/3 right-1/4 w-24 h-12 bg-yellow-400 opacity-20 rounded-lg border-2 border-yellow-500 border-dashed"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-20 h-10 bg-red-400 opacity-20 rounded-lg border-2 border-red-500 border-dashed"></div>
                  
                  {/* Efficiency Labels */}
                  <div className="absolute top-1/4 left-1/4 transform -translate-y-8 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    High Efficiency Zone
                  </div>
                  <div className="absolute top-1/3 right-1/4 transform -translate-y-8 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                    Moderate Zone
                  </div>
                  <div className="absolute bottom-1/3 left-1/3 transform translate-y-8 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    Congestion Zone
                  </div>
                </div>

                {/* Analytics Data Points */}
                <div className="absolute top-6 right-6 pointer-events-auto">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border p-4 max-w-xs">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <h3 className="font-bold text-sm text-gray-900">Live Analytics</h3>
                    </div>
                    
                    {/* KPIs */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Speed:</span>
                        <span className="font-bold text-green-600">58.4 mph</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fuel Efficiency:</span>
                        <span className="font-bold text-blue-600">7.8 mpg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">On-Time Rate:</span>
                        <span className="font-bold text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Route Deviation:</span>
                        <span className="font-bold text-yellow-600">2.1 mi</span>
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="mt-3 pt-2 border-t">
                      <div className="text-xs text-gray-600 mb-1">Speed Trend (Last 2h)</div>
                      <div className="flex items-end space-x-1 h-8">
                        <div className="w-2 bg-blue-300 h-4"></div>
                        <div className="w-2 bg-blue-400 h-6"></div>
                        <div className="w-2 bg-blue-500 h-5"></div>
                        <div className="w-2 bg-blue-600 h-7"></div>
                        <div className="w-2 bg-blue-500 h-6"></div>
                        <div className="w-2 bg-blue-400 h-4"></div>
                        <div className="w-2 bg-blue-500 h-5"></div>
                        <div className="w-2 bg-blue-600 h-8"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fleet Performance Summary */}
                <div className="absolute bottom-6 left-6 pointer-events-auto">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border p-4 max-w-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-bold text-sm text-gray-900">Fleet Performance</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-gray-600">Active</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">3</div>
                        <div className="text-gray-600">En Route</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="text-2xl font-bold text-yellow-600">2</div>
                        <div className="text-gray-600">Delayed</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="text-2xl font-bold text-red-600">1</div>
                        <div className="text-gray-600">Alert</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total Distance:</span>
                        <span className="font-bold">2,847 mi</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Fuel Consumed:</span>
                        <span className="font-bold">365 gal</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">CO₂ Savings:</span>
                        <span className="font-bold text-green-600">-12.4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-80 bg-white border-l overflow-y-auto flex-shrink-0 h-full">
            {/* Vehicle Tracking Panel */}
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base flex items-center text-gray-900">
                  <TruckIcon className="w-4 h-4 mr-2 text-blue-600" />
                  Vehicle Tracking
                </h3>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-gray-600">Mode:</span>
                  <select 
                    value={trackingMode} 
                    onChange={(e) => setTrackingMode(e.target.value as 'single' | 'fleet' | 'all')}
                    className="text-xs border rounded px-1 py-0.5 bg-white"
                  >
                    <option value="single">Single</option>
                    <option value="fleet">Fleet</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>
              
              {/* Enhanced Filtering */}
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-xs text-gray-800">Filters</h4>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setShowRouteTrails(!showRouteTrails)}
                      className={`px-1.5 py-0.5 text-xs rounded ${showRouteTrails ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}
                    >
                      Trails
                    </button>
                    <button
                      onClick={() => setShowAlerts(!showAlerts)}
                      className={`px-1.5 py-0.5 text-xs rounded ${showAlerts ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}
                    >
                      Alerts
                    </button>
                    <button
                      onClick={() => setShowConstructionZones(!showConstructionZones)}
                      className={`px-1.5 py-0.5 text-xs rounded ${showConstructionZones ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'}`}
                    >
                      🚧 Construction
                    </button>
                  </div>
                </div>
                <select 
                  value={vehicleFilter} 
                  onChange={(e) => setVehicleFilter(e.target.value as 'all' | 'active' | 'alerts' | 'low-fuel')}
                  className="w-full text-xs border rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Vehicles</option>
                  <option value="active">Active Only</option>
                  <option value="alerts">With Alerts</option>
                  <option value="low-fuel">Low Fuel</option>
                </select>
              </div>
              
              {/* Vehicle List */}
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {getFilteredVehicles().map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      vehicle.id === selectedVehicle 
                        ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' 
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${getStatusColor(vehicle.status)} rounded-full ${vehicle.speed > 0 ? 'animate-pulse' : ''}`}></div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <div className="font-semibold text-xs text-gray-900">{vehicle.name}</div>
                            {vehicle.alerts && vehicle.alerts.length > 0 && (
                              <div className="flex items-center space-x-0.5">
                                <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-bold text-red-600">{vehicle.alerts.length}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">{vehicle.driver}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-900">{vehicle.speed} mph</div>
                        <div className="text-xs text-gray-600">{vehicle.status}</div>
                      </div>
                    </div>
                    
                    {/* Vehicle Alerts */}
                    {vehicle.alerts && vehicle.alerts.length > 0 && (
                      <div className="mt-1 pt-1 border-t border-gray-200">
                        <div className="flex flex-wrap gap-0.5">
                          {vehicle.alerts.map((alert, index) => (
                            <span key={index} className={`px-1 py-0.5 text-xs rounded-full ${getAlertColor(alert)}`}>
                              {alert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-1 pt-1 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Route: {vehicle.route}</span>
                        <span>Fuel: {vehicle.fuel}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                        <span>Cargo: {vehicle.cargo}</span>
                        <span>ETA: {vehicle.eta}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        → {vehicle.destination}
                      </div>
                    </div>
                    
                    {/* Fuel Level Bar */}
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Fuel Level</span>
                        <span>{vehicle.fuel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            vehicle.fuel > 50 ? 'bg-green-500' : vehicle.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${vehicle.fuel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Fleet Summary */}
              {trackingMode !== 'single' && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-xs text-gray-800 mb-2">Fleet Status</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-green-600">{vehicles.filter(v => v.status === 'In Transit').length}</div>
                      <div className="text-gray-600">In Transit</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-600">{vehicles.filter(v => v.status === 'Loading').length}</div>
                      <div className="text-gray-600">Loading</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{vehicles.filter(v => v.status === 'Delivered').length}</div>
                      <div className="text-gray-600">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-600">{Math.round(vehicles.reduce((acc, v) => acc + v.fuel, 0) / vehicles.length)}%</div>
                      <div className="text-gray-600">Avg Fuel</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Construction Zone Status */}
            {showConstructionZones && (
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base flex items-center text-gray-900">
                    <div className="w-4 h-4 mr-2 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🚧</span>
                    </div>
                    Construction Zones
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-orange-700">1 Active</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {/* Active Construction Zone */}
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="font-bold text-sm text-orange-800">I-95 North - Exit 15</div>
                          <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">ACTIVE</span>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">Bridge rehabilitation project</div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Impact:</span>
                            <span className="font-semibold text-red-700 ml-1">+8 min delay</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Speed:</span>
                            <span className="font-semibold text-orange-700 ml-1">45 mph</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Lanes:</span>
                            <span className="font-semibold text-gray-900 ml-1">2 of 3 open</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold text-gray-900 ml-1">3 months</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-orange-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Next update:</span>
                            <span className="font-medium text-gray-900">2 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Construction Zone Statistics */}
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-xs text-gray-800 mb-2">Impact Summary</h4>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-orange-600">1</div>
                        <div className="text-gray-600">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">0</div>
                        <div className="text-gray-600">Planned</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">2</div>
                        <div className="text-gray-600">Completed</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium hover:bg-blue-200 transition-colors">
                      View Alternative Routes
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Updates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Route Options */}
            <div className="p-3 border-b">
              <h3 className="font-bold text-base mb-3 flex items-center text-gray-900">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Route options
              </h3>
              <div className="space-y-1">
                <div 
                  onClick={() => setSelectedRoute('fastest')}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRoute === 'fastest' ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg flex items-center text-gray-900">
                        <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Fastest route
                      </div>
                      <div className="text-base text-gray-800 font-semibold mt-1">2h 30m • 125 miles via I-95 N</div>
                      <div className="text-sm text-green-700 mt-2 font-medium">Light traffic</div>
                    </div>
                    {selectedRoute === 'fastest' && <div className="text-blue-700 font-bold text-sm">CURRENT</div>}
                  </div>
                </div>
                
                <div 
                  onClick={() => setSelectedRoute('shortest')}
                  className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRoute === 'shortest' ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm flex items-center text-gray-900">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Shortest route
                      </div>
                      <div className="text-sm text-gray-800 font-semibold mt-0.5">2h 45m • 118 miles via Route 1</div>
                      <div className="text-xs text-yellow-700 mt-1 font-medium">Moderate traffic • +15 min</div>
                      <div className="text-xs text-gray-600 mt-1">
                        💰 Fuel: $28.40 • 🛣️ 7 miles saved
                      </div>
                    </div>
                    {selectedRoute === 'shortest' && <div className="text-blue-700 font-bold text-xs">CURRENT</div>}
                  </div>
                </div>
                
                <div 
                  onClick={() => setSelectedRoute('scenic')}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRoute === 'scenic' ? 'bg-blue-50 border-2 border-blue-500 shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg flex items-center text-gray-900">
                        <svg className="w-6 h-6 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                        </svg>
                        Scenic route
                      </div>
                      <div className="text-base text-gray-800 font-semibold mt-1">3h 10m • 142 miles via Coast Hwy</div>
                      <div className="text-sm text-orange-700 mt-2 font-medium">Mountain views • +40 min</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shortest Route Analysis Panel */}
              {selectedRoute === 'shortest' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-bold text-sm text-blue-800">Shortest Route Analysis</h4>
                  </div>
                  
                  {/* Route Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Total Distance</div>
                      <div className="font-bold text-sm text-gray-900">118.2 miles</div>
                      <div className="text-xs text-green-600">7 miles shorter</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Fuel Cost</div>
                      <div className="font-bold text-sm text-gray-900">$28.40</div>
                      <div className="text-xs text-green-600">$2.10 saved</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Travel Time</div>
                      <div className="font-bold text-sm text-gray-900">2h 45m</div>
                      <div className="text-xs text-yellow-600">+15 min delay</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Route Type</div>
                      <div className="font-bold text-sm text-gray-900">Mixed</div>
                      <div className="text-xs text-blue-600">State routes</div>
                    </div>
                  </div>
                  
                  {/* Route Details */}
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-semibold text-xs text-gray-800 mb-1">Route Segments</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Route 1 North</span>
                          <span className="text-gray-800 font-medium">45.2 mi • 1h 15m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Local Roads</span>
                          <span className="text-gray-800 font-medium">28.6 mi • 52m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">State Hwy 9</span>
                          <span className="text-gray-800 font-medium">44.4 mi • 38m</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border">
                      <div className="font-semibold text-xs text-gray-800 mb-1">Traffic Conditions</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-900">Route 1: Light traffic</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-900">Local roads: Moderate delays</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-medium text-gray-900">State Hwy: Clear</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-2 rounded border">
                      <div className="font-semibold text-xs text-gray-800 mb-1">Cost Breakdown</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Fuel (3.8 gal @ $3.45)</span>
                          <span className="font-semibold text-gray-900">$13.11</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Tolls</span>
                          <span className="font-semibold text-gray-900">$8.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">Vehicle wear (~$0.58/mi)</span>
                          <span className="font-semibold text-gray-900">$6.79</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-bold">
                          <span className="text-gray-900">Total Cost</span>
                          <span className="text-blue-600">$28.40</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Route Advantages */}
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <div className="font-semibold text-xs text-green-800 mb-1">✅ Advantages</div>
                      <ul className="text-xs text-green-700 space-y-0.5">
                        <li>• Lowest fuel consumption</li>
                        <li>• 7 miles shorter distance</li>
                        <li>• $2.10 cost savings</li>
                        <li>• Less vehicle wear</li>
                      </ul>
                    </div>
                    
                    {/* Route Considerations */}
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                      <div className="font-semibold text-xs text-yellow-800 mb-1">⚠️ Considerations</div>
                      <ul className="text-xs text-yellow-700 space-y-0.5">
                        <li>• 15 minutes longer than fastest</li>
                        <li>• Some local road sections</li>
                        <li>• Moderate traffic areas</li>
                        <li>• Limited rest stops</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enhanced Satellite View Controls */}
              {mapType === 'satellite' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-800">Satellite Analysis</span>
                    </div>
                    <button 
                      onClick={() => setShowSatelliteDetails(!showSatelliteDetails)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      {showSatelliteDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  
                  {/* Always visible quick stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-green-700">98%</div>
                      <div className="text-xs text-green-600">Image Quality</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-blue-700">60cm</div>
                      <div className="text-xs text-blue-600">Resolution</div>
                    </div>
                  </div>
                  
                  {showSatelliteDetails && (
                    <div className="space-y-3">
                      {/* Detailed Information */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Image Metadata</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>📅 Capture Date:</span>
                            <span className="font-medium">March 15, 2024 14:32 UTC</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🛰️ Satellite:</span>
                            <span className="font-medium">WorldView-3</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📐 Resolution:</span>
                            <span className="font-medium">60cm/pixel (Panchromatic)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>☁️ Cloud Cover:</span>
                            <span className="font-medium text-green-600">2% (Excellent)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🌞 Sun Angle:</span>
                            <span className="font-medium">52.3°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📊 Quality Score:</span>
                            <span className="font-medium text-green-600">9.8/10</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature Analysis */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Detected Features</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-600 rounded"></div>
                              <span>Vegetation</span>
                            </div>
                            <span className="font-medium text-green-600">42%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gray-600 rounded"></div>
                              <span>Urban Areas</span>
                            </div>
                            <span className="font-medium text-gray-600">28%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-600 rounded"></div>
                              <span>Water Bodies</span>
                            </div>
                            <span className="font-medium text-blue-600">15%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                              <span>Agriculture</span>
                            </div>
                            <span className="font-medium text-yellow-600">12%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-gray-400 rounded"></div>
                              <span>Roads/Infrastructure</span>
                            </div>
                            <span className="font-medium text-gray-500">3%</span>
                          </div>
                        </div>
                      </div>

                      {/* Satellite Controls */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">View Controls</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-xs">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span>Show terrain labels</span>
                          </label>
                          <label className="flex items-center space-x-2 text-xs">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span>Highlight water bodies</span>
                          </label>
                          <label className="flex items-center space-x-2 text-xs">
                            <input type="checkbox" className="rounded" />
                            <span>Show property boundaries</span>
                          </label>
                          <label className="flex items-center space-x-2 text-xs">
                            <input type="checkbox" className="rounded" />
                            <span>Historical comparison</span>
                          </label>
                        </div>
                      </div>

                      {/* Enhanced Options */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm text-blue-800 mb-2">Enhanced Features</h4>
                        <div className="space-y-1">
                          <button className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1 px-2 hover:bg-blue-100 rounded">
                            📊 View spectral analysis
                          </button>
                          <button className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1 px-2 hover:bg-blue-100 rounded">
                            🕰️ Compare with previous imagery
                          </button>
                          <button className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1 px-2 hover:bg-blue-100 rounded">
                            📈 Generate terrain profile
                          </button>
                          <button className="w-full text-left text-xs text-blue-700 hover:text-blue-900 py-1 px-2 hover:bg-blue-100 rounded">
                            🌡️ Environmental analysis
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Directions Panel */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="font-bold text-lg text-gray-900">Directions</span>
              </div>
              <div className="text-base text-gray-800 mb-3 font-semibold">Fastest route • Avoiding tolls</div>
              <div className="text-2xl font-bold text-gray-900">4h 23m (265 mi)</div>
              <div className="text-lg text-gray-700 font-medium">via I-95 N</div>
            </div>

            {/* Turn-by-turn */}
            <div className="divide-y">
              <div className="p-5 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-900">Head north on Local St</div>
                    <div className="text-sm text-gray-700 font-medium">0.3 mi</div>
                  </div>
                  <div className="text-base text-gray-700 font-semibold">1 min</div>
                </div>
              </div>

              <div className="p-5 hover:bg-gray-50 cursor-pointer bg-blue-50">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-900">Merge onto I-95 N</div>
                    <div className="text-sm text-gray-700 font-medium">85.2 mi</div>
                  </div>
                  <div className="text-base text-gray-700 font-semibold">1h 18m</div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Take exit 23 for Downtown</div>
                    <div className="text-sm text-gray-600">0.8 mi</div>
                  </div>
                  <div className="text-sm text-gray-500">2 min</div>
                </div>
              </div>
            </div>

            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="p-4 border-t">
                <h3 className="font-bold text-base mb-3 flex items-center text-gray-900">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Analytics & Reports
                </h3>
                
                {/* Key Performance Indicators */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Fleet Performance</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                      <div className="text-lg font-bold text-green-700">94.2%</div>
                      <div className="text-xs text-green-600">On-Time Rate</div>
                      <div className="text-xs text-green-500 mt-1">+2.3% vs last month</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                      <div className="text-lg font-bold text-blue-700">58.4 mph</div>
                      <div className="text-xs text-blue-600">Avg Speed</div>
                      <div className="text-xs text-blue-500 mt-1">Optimal range</div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
                      <div className="text-lg font-bold text-yellow-700">7.8 mpg</div>
                      <div className="text-xs text-yellow-600">Fuel Efficiency</div>
                      <div className="text-xs text-yellow-500 mt-1">-0.2 vs target</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                      <div className="text-lg font-bold text-purple-700">$2.34</div>
                      <div className="text-xs text-purple-600">Cost per Mile</div>
                      <div className="text-xs text-purple-500 mt-1">-5.2% savings</div>
                    </div>
                  </div>
                </div>

                {/* Performance Trends */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Performance Trends</h4>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Route Efficiency</span>
                        <span className="text-xs font-medium text-green-600">↗ 12% improvement</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Delivery Accuracy</span>
                        <span className="text-xs font-medium text-blue-600">↗ 8% improvement</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Fuel Optimization</span>
                        <span className="text-xs font-medium text-yellow-600">↘ 3% decline</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Analysis */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Route Analysis</h4>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-700">Most Efficient Route</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">I-95 North → Route 128</div>
                      <div className="text-xs text-gray-600 mt-1">Avg time: 2h 15m • Success rate: 96%</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-700">Alternative Route</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Backup</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Route 1 → I-93 North</div>
                      <div className="text-xs text-gray-600 mt-1">Avg time: 2h 35m • Success rate: 89%</div>
                    </div>
                  </div>
                </div>

                {/* Quick Reports */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left bg-white hover:bg-gray-50 rounded-lg p-2 border border-gray-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2v1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">Daily Performance</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                    
                    <button className="w-full text-left bg-white hover:bg-gray-50 rounded-lg p-2 border border-gray-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">Weekly Summary</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                    
                    <button className="w-full text-left bg-white hover:bg-gray-50 rounded-lg p-2 border border-gray-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Fleet Analytics</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Export Options */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Export Options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-2 transition-colors">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-red-700">PDF</span>
                      </div>
                    </button>
                    
                    <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-2 transition-colors">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-green-700">Excel</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Traffic Alerts */}
            <div className="p-4 border-t pb-6">
              <h3 className="font-bold text-base mb-3 text-gray-900">Traffic alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Moderate traffic ahead</div>
                    <div className="text-sm font-medium text-gray-800">+12 min delay on I-95 N</div>
                  </div>
                </div>
                
                {/* Enhanced Construction Zone Alert */}
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="font-bold text-sm text-orange-800">🚧 Active Construction Zone</div>
                        <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">HIGH IMPACT</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mb-2">I-95 North: Lane restrictions near Exit 15</div>
                      
                      {/* Construction Details */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2 rounded border">
                            <div className="text-gray-600">Duration</div>
                            <div className="font-bold text-gray-900">Mar 15 - Jun 30</div>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <div className="text-gray-600">Time</div>
                            <div className="font-bold text-gray-900">6 AM - 4 PM</div>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <div className="text-gray-600">Lanes Open</div>
                            <div className="font-bold text-orange-700">2 of 3 lanes</div>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <div className="text-gray-600">Speed Limit</div>
                            <div className="font-bold text-red-700">45 mph</div>
                          </div>
                        </div>
                        
                        {/* Project Details */}
                        <div className="bg-white p-2 rounded border">
                          <div className="text-xs text-gray-600 mb-1">Project Type</div>
                          <div className="font-semibold text-sm text-gray-900">Bridge deck rehabilitation & resurfacing</div>
                        </div>
                        
                        {/* Current Impact */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-orange-800">Active construction</span>
                          </div>
                          <div className="font-bold text-red-700">+8 min delay</div>
                        </div>
                        
                        {/* Safety Information */}
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-red-800">Safety Notice</span>
                          </div>
                          <ul className="text-xs text-red-700 space-y-1">
                            <li>• Reduce speed to 45 mph</li>
                            <li>• Merge early, be patient</li>
                            <li>• Workers present - fines doubled</li>
                            <li>• No shoulder available</li>
                          </ul>
                        </div>
                        
                        {/* Alternative Route Suggestion */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-blue-800">Alternative Route</span>
                          </div>
                          <div className="text-xs text-blue-700">
                            <div className="font-medium">Take Route 1 North → Save 5 minutes</div>
                            <div className="text-blue-600 mt-1">Exit 14 → Route 1 → Rejoin at Exit 17</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom spacer for proper scrolling */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleMapModal;
