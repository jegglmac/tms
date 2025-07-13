'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  ArrowPathIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

interface MobileRouteCardProps {
  route: {
    name: string;
    driver: string;
    distance: number;
    time: string;
    fuelCost: number;
    efficiency: number;
    stops: number;
  };
  onOptimize?: () => void;
  isOptimizing?: boolean;
}

export function MobileRouteCard({ route, onOptimize, isOptimizing = false }: MobileRouteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TruckIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{route.name}</h3>
              <p className="text-xs text-gray-600">{route.driver}</p>
            </div>
          </div>
          {onOptimize && (
            <button
              onClick={onOptimize}
              disabled={isOptimizing}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <MapPinIcon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Distance</p>
            <p className="font-bold text-gray-900">{route.distance.toFixed(1)} mi</p>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <ClockIcon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Time</p>
            <p className="font-bold text-gray-900">{route.time}</p>
          </div>
          
          <div className="text-center bg-green-50 rounded-lg p-3">
            <CurrencyDollarIcon className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-700">Fuel Cost</p>
            <p className="font-bold text-green-600">${route.fuelCost.toFixed(2)}</p>
          </div>
          
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <ArrowPathIcon className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-700">Efficiency</p>
            <p className="font-bold text-blue-600">{route.efficiency.toFixed(1)}%</p>
          </div>
        </div>
        
        {/* Stops info */}
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{route.stops}</span> stops planned
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MobileRouteOptimizer() {
  const [routes, setRoutes] = useState([
    {
      name: 'Downtown Express',
      driver: 'John Smith',
      distance: 45.2,
      time: '4h 15m',
      fuelCost: 67.80,
      efficiency: 94.5,
      stops: 6
    },
    {
      name: 'Suburban Circuit',
      driver: 'Maria Garcia',
      distance: 62.8,
      time: '5h 45m',
      fuelCost: 94.20,
      efficiency: 91.2,
      stops: 8
    }
  ]);
  
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);

  const optimizeRoute = (index: number) => {
    setOptimizingIndex(index);
    
    setTimeout(() => {
      setRoutes(prev => prev.map((route, i) => 
        i === index ? {
          ...route,
          distance: route.distance * 0.92,
          fuelCost: route.fuelCost * 0.88,
          efficiency: Math.min(99.9, route.efficiency + 3.2)
        } : route
      ));
      setOptimizingIndex(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Route Optimizer</h2>
        <p className="text-sm text-gray-600">AI-powered route planning</p>
      </div>
      
      {routes.map((route, index) => (
        <MobileRouteCard
          key={index}
          route={route}
          onOptimize={() => optimizeRoute(index)}
          isOptimizing={optimizingIndex === index}
        />
      ))}
      
      {/* Quick stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mt-4">
        <h3 className="font-medium text-gray-900 mb-2">Optimization Benefits</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">8%</p>
            <p className="text-xs text-gray-600">Distance Saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">12%</p>
            <p className="text-xs text-gray-600">Fuel Savings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">15min</p>
            <p className="text-xs text-gray-600">Time Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
