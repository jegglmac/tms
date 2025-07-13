'use client';

import React, { useState } from 'react';
import {
  TruckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function MobileFleetSummary() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Sample data optimized for mobile
  const fleetMetrics = [
    { title: 'Active Vehicles', value: '24', change: '+2', icon: TruckIcon, color: 'bg-blue-600' },
    { title: 'Total Revenue', value: '$12.5K', change: '+8%', icon: CurrencyDollarIcon, color: 'bg-green-600' },
    { title: 'Deliveries', value: '156', change: '+12', icon: CheckCircleIcon, color: 'bg-purple-600' },
    { title: 'Efficiency', value: '94.2%', change: '+2.1%', icon: ChartBarIcon, color: 'bg-orange-600' }
  ];

  const sections = [
    {
      id: 'vehicles',
      title: 'Vehicle Status',
      icon: TruckIcon,
      count: '24 Active',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Operational</span>
            <span className="text-lg font-bold text-green-600">22</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Maintenance</span>
            <span className="text-lg font-bold text-yellow-600">2</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Out of Service</span>
            <span className="text-lg font-bold text-red-600">0</span>
          </div>
        </div>
      )
    },
    {
      id: 'drivers',
      title: 'Driver Performance',
      icon: DevicePhoneMobileIcon,
      count: '8 Active',
      content: (
        <div className="space-y-3">
          {[
            { name: 'John Smith', vehicle: 'TMS-001', status: 'On Route', efficiency: '98%' },
            { name: 'Maria Garcia', vehicle: 'TMS-015', status: 'Delivering', efficiency: '96%' },
            { name: 'David Johnson', vehicle: 'TMS-023', status: 'Break', efficiency: '94%' }
          ].map((driver, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-600">{driver.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{driver.efficiency}</p>
                  <p className="text-xs text-gray-500">{driver.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'routes',
      title: 'Route Optimization',
      icon: MapPinIcon,
      count: '6 Routes',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Downtown Express</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Optimized</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">4h 15m</p>
                <p className="text-xs text-gray-600">Time</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">$67.80</p>
                <p className="text-xs text-gray-600">Fuel</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">94.5%</p>
                <p className="text-xs text-gray-600">Efficiency</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Suburban Circuit</span>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optimizing</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">5h 45m</p>
                <p className="text-xs text-gray-600">Time</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">$94.20</p>
                <p className="text-xs text-gray-600">Fuel</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">91.2%</p>
                <p className="text-xs text-gray-600">Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tracking',
      title: 'Cell Phone Tracking',
      icon: DevicePhoneMobileIcon,
      count: '8 Connected',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">GPS Tracking</span>
              </div>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-sm text-gray-600">All drivers connected with real-time location</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <WifiIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Signal Strength</span>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Strong</span>
            </div>
            <p className="text-sm text-gray-600">Average signal: 85% across all devices</p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BoltIcon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Battery Status</span>
              </div>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Good</span>
            </div>
            <p className="text-sm text-gray-600">Average battery: 78% across all devices</p>
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <TruckIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Fleet Summary</h1>
            <p className="text-sm text-gray-600">Mobile-optimized view</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium">
            <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" />
            Export
          </button>
          <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium">
            <ShareIcon className="w-4 h-4 inline mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {fleetMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">{metric.title}</p>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.count}</p>
                </div>
              </div>
              {expandedSection === section.id ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="px-4 pb-4">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mt-6">
        <h2 className="font-semibold text-gray-900 mb-3">Today's Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-xs text-gray-600">Deliveries Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">$12,450</p>
            <p className="text-xs text-gray-600">Revenue Generated</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">2,340</p>
            <p className="text-xs text-gray-600">Miles Driven</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">94.2%</p>
            <p className="text-xs text-gray-600">Avg Efficiency</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Delivery completed - TMS-001
              </p>
              <p className="text-xs text-gray-600">2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Route optimized - Downtown Express
              </p>
              <p className="text-xs text-gray-600">5 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Driver check-in - Maria Garcia
              </p>
              <p className="text-xs text-gray-600">8 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
