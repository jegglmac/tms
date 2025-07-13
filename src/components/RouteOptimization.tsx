'use client';

import { useState } from 'react';
import { 
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface RouteOptimizationProps {
  onOptimize: () => void;
}

interface Route {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
  optimizedTime: number;
  savings: number;
  status: 'pending' | 'optimizing' | 'completed';
}

const mockRoutes: Route[] = [
  {
    id: 'R001',
    name: 'Downtown Circuit',
    distance: 45.2,
    estimatedTime: 120,
    optimizedTime: 98,
    savings: 22,
    status: 'completed'
  },
  {
    id: 'R002', 
    name: 'Industrial Zone',
    distance: 67.8,
    estimatedTime: 150,
    optimizedTime: 135,
    savings: 15,
    status: 'completed'
  },
  {
    id: 'R003',
    name: 'Suburban Delivery',
    distance: 32.1,
    estimatedTime: 95,
    optimizedTime: 85,
    savings: 10,
    status: 'optimizing'
  }
];

export default function RouteOptimization({ onOptimize }: RouteOptimizationProps) {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeAll = async () => {
    setIsOptimizing(true);
    onOptimize();
    
    // Simulate optimization process
    setTimeout(() => {
      setRoutes(routes.map(route => ({
        ...route,
        status: 'completed' as const,
        optimizedTime: Math.floor(route.estimatedTime * 0.85),
        savings: Math.floor(route.estimatedTime * 0.15)
      })));
      setIsOptimizing(false);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'optimizing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Route Optimization</h3>
          <p className="text-sm text-gray-500">AI-powered route planning and optimization</p>
        </div>
        <button
          onClick={handleOptimizeAll}
          disabled={isOptimizing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOptimizing ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Optimize All Routes
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(route.status)}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{route.name}</h4>
                  <p className="text-sm text-gray-500">Route {route.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {route.status === 'completed' ? `${route.savings} min saved` : 'Pending'}
                </p>
                <p className="text-xs text-gray-500">
                  {route.distance} miles • {route.optimizedTime || route.estimatedTime} min
                </p>
              </div>
            </div>
            
            {route.status === 'completed' && (
              <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                <span>Original: {route.estimatedTime} min</span>
                <span>Optimized: {route.optimizedTime} min</span>
                <span className="text-green-600 font-medium">
                  {Math.round((route.savings / route.estimatedTime) * 100)}% improvement
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-blue-900">
            Total potential savings: {routes.reduce((sum, route) => sum + route.savings, 0)} minutes daily
          </span>
        </div>
      </div>
    </div>
  );
}
