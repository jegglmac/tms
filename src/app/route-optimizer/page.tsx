'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface RouteStop {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  estimatedTime: string;
  priority: 'High' | 'Medium' | 'Low';
  deliveryType: 'Pickup' | 'Delivery';
  packages: number;
  weight: number;
}

interface OptimizedRoute {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  totalDistance: number;
  estimatedTime: string;
  fuelCost: number;
  efficiency: number;
  stops: RouteStop[];
}

export default function RouteOptimizerPage() {
  const [routes, setRoutes] = useState<OptimizedRoute[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<OptimizedRoute | null>(null);
  
  // Sample route data
  const sampleRoutes: OptimizedRoute[] = [
    {
      id: 'route-1',
      name: 'Downtown Express',
      driver: 'John Smith',
      vehicle: 'TMS-001',
      totalDistance: 45.2,
      estimatedTime: '4h 15m',
      fuelCost: 67.80,
      efficiency: 94.5,
      stops: [
        {
          id: 'stop-1',
          address: '123 Main St',
          city: 'Downtown',
          state: 'CA',
          zipCode: '90210',
          estimatedTime: '9:00 AM',
          priority: 'High',
          deliveryType: 'Pickup',
          packages: 5,
          weight: 120
        },
        {
          id: 'stop-2',
          address: '456 Oak Ave',
          city: 'Midtown',
          state: 'CA',
          zipCode: '90211',
          estimatedTime: '10:30 AM',
          priority: 'High',
          deliveryType: 'Delivery',
          packages: 3,
          weight: 75
        },
        {
          id: 'stop-3',
          address: '789 Pine St',
          city: 'Uptown',
          state: 'CA',
          zipCode: '90212',
          estimatedTime: '12:15 PM',
          priority: 'Medium',
          deliveryType: 'Delivery',
          packages: 2,
          weight: 45
        }
      ]
    },
    {
      id: 'route-2',
      name: 'Suburban Circuit',
      driver: 'Maria Garcia',
      vehicle: 'TMS-015',
      totalDistance: 62.8,
      estimatedTime: '5h 45m',
      fuelCost: 94.20,
      efficiency: 91.2,
      stops: [
        {
          id: 'stop-4',
          address: '321 Elm Dr',
          city: 'Westside',
          state: 'CA',
          zipCode: '90213',
          estimatedTime: '8:30 AM',
          priority: 'Medium',
          deliveryType: 'Pickup',
          packages: 8,
          weight: 200
        },
        {
          id: 'stop-5',
          address: '654 Maple Ln',
          city: 'Eastside',
          state: 'CA',
          zipCode: '90214',
          estimatedTime: '11:00 AM',
          priority: 'Low',
          deliveryType: 'Delivery',
          packages: 4,
          weight: 95
        }
      ]
    }
  ];

  useEffect(() => {
    setRoutes(sampleRoutes);
  }, []);

  const optimizeRoutes = () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      // Add some optimized metrics
      const optimizedRoutes = routes.map(route => ({
        ...route,
        totalDistance: route.totalDistance * 0.92, // 8% improvement
        estimatedTime: route.estimatedTime.replace(/(\d+)h/, (match, hours) => 
          `${Math.max(1, parseInt(hours) - 1)}h`
        ),
        fuelCost: route.fuelCost * 0.88, // 12% fuel savings
        efficiency: Math.min(99.9, route.efficiency + 3.2)
      }));
      
      setRoutes(optimizedRoutes);
      setIsOptimizing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    return type === 'Pickup' ? '📤' : '📥';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Route Optimizer</h1>
                <p className="text-sm text-gray-600">AI-Powered Route Planning</p>
              </div>
            </div>
            <button
              onClick={optimizeRoutes}
              disabled={isOptimizing}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isOptimizing ? 'Optimizing...' : 'Optimize'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Optimization Status */}
        {isOptimizing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Optimizing Routes...</p>
                <p className="text-sm text-blue-700">
                  Analyzing traffic, distance, and delivery priorities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Route Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow border">
              {/* Route Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{route.name}</h3>
                      <p className="text-sm text-gray-600">{route.driver} • {route.vehicle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRightIcon className={`w-5 h-5 transform transition-transform ${
                      selectedRoute?.id === route.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                </div>
              </div>

              {/* Route Metrics */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Distance</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{route.totalDistance.toFixed(1)} mi</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Time</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{route.estimatedTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Fuel Cost</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">${route.fuelCost.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <CheckCircleIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Efficiency</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{route.efficiency.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Route Stops Count */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stops</span>
                    <span className="font-medium text-gray-900">{route.stops.length}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Stops (Expandable) */}
              {selectedRoute?.id === route.id && (
                <div className="border-t border-gray-200">
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Route Stops</h4>
                    <div className="space-y-3">
                      {route.stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{getDeliveryTypeIcon(stop.deliveryType)}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(stop.priority)}`}>
                                {stop.priority}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{stop.address}</p>
                            <p className="text-xs text-gray-600">{stop.city}, {stop.state} {stop.zipCode}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                              <span>⏰ {stop.estimatedTime}</span>
                              <span>📦 {stop.packages} pkgs</span>
                              <span>⚖️ {stop.weight} lbs</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optimization Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-2">Optimization Tips</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Routes are optimized for minimum fuel consumption</li>
                <li>• High priority deliveries are scheduled first</li>
                <li>• Real-time traffic data is considered</li>
                <li>• Driver break times are automatically included</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
            <MapPinIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">View Map</p>
            <p className="text-sm text-gray-600">See routes on map</p>
          </button>
          
          <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
            <TruckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Assign Drivers</p>
            <p className="text-sm text-gray-600">Manage assignments</p>
          </button>
          
          <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
            <CurrencyDollarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Cost Analysis</p>
            <p className="text-sm text-gray-600">View savings report</p>
          </button>
        </div>
      </div>
    </div>
  );
}
