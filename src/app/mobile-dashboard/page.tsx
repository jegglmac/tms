'use client';

import React, { useState, useEffect } from 'react';
import InstallButton from '@/components/InstallButton';
import {
  TruckIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BellIcon,
  PlusIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import MobileNewShipmentModal from '@/components/MobileNewShipmentModal';

interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  color: string;
  badge?: string;
}

export default function MobileDashboard() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [buttonFeedback, setButtonFeedback] = useState<string>('');
  const [todayShipments, setTodayShipments] = useState(12); // Default value
  const [mounted, setMounted] = useState(false);

  // Handle hydration-safe random number generation
  useEffect(() => {
    setMounted(true);
    setTodayShipments(Math.floor(Math.random() * 12) + 8);
  }, []);
  
  // Handle quick action clicks
  const handleQuickAction = (actionName: string) => {
    switch (actionName) {
      case 'New Shipment':
        setButtonFeedback('🚛 Opening shipment creation wizard...');
        setTimeout(() => {
          setShowNewShipmentModal(true);
          setButtonFeedback('');
        }, 500);
        break;
      case 'Route Test':
        setButtonFeedback('🗺️ Initializing route test...');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/mobile-test';
          }
        }, 800);
        break;
      case 'Reports':
        setButtonFeedback('📊 Loading analytics dashboard...');
        setTimeout(() => {
          setButtonFeedback('Reports feature coming soon!');
          setTimeout(() => setButtonFeedback(''), 2000);
        }, 800);
        break;
      case 'Alerts':
        setButtonFeedback('🔔 Checking system alerts...');
        setTimeout(() => {
          setButtonFeedback('No new alerts at this time');
          setTimeout(() => setButtonFeedback(''), 2000);
        }, 800);
        break;
      default:
        setButtonFeedback(`${actionName} clicked!`);
        setTimeout(() => setButtonFeedback(''), 1500);
    }
  };
  
  // All TMS navigation items
  const navigationItems: MobileNavItem[] = [
    {
      name: 'Fleet Management',
      href: '/fleet-summary',
      icon: TruckIcon,
      description: 'Vehicle tracking & maintenance',
      color: 'bg-blue-600',
      badge: '24'
    },
    {
      name: 'Driver Performance',
      href: '/drivers',
      icon: UserIcon,
      description: 'Driver metrics & schedules',
      color: 'bg-green-600',
      badge: '8'
    },
    {
      name: 'Route Optimizer',
      href: '/mobile-routes',
      icon: MapIcon,
      description: 'AI-powered route planning',
      color: 'bg-purple-600'
    },
    {
      name: 'Shipment Tracking',
      href: '/shipments',
      icon: ClipboardDocumentListIcon,
      description: 'Real-time delivery status',
      color: 'bg-orange-600',
      badge: '12'
    },
    {
      name: 'Mobile Tracking',
      href: '/mobile-test',
      icon: DevicePhoneMobileIcon,
      description: 'Test GPS & cell tracking',
      color: 'bg-red-600'
    },
    {
      name: 'Operations',
      href: '/operations',
      icon: Cog6ToothIcon,
      description: 'Daily operations management',
      color: 'bg-indigo-600'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      description: 'Reports & performance metrics',
      color: 'bg-cyan-600'
    },
    {
      name: 'Financial Reports',
      href: '/financial',
      icon: CurrencyDollarIcon,
      description: 'Revenue & cost analysis',
      color: 'bg-emerald-600'
    }
  ];

  // Quick action items with enhanced New Shipment
  const quickActions = [
    {
      name: 'New Shipment',
      icon: PlusIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      special: true
    },
    {
      name: 'Route Test',
      icon: GlobeAltIcon,
      color: 'bg-green-600'
    },
    {
      name: 'Reports',
      icon: DocumentTextIcon,
      color: 'bg-purple-600'
    },
    {
      name: 'Alerts',
      icon: BellIcon,
      color: 'bg-red-600'
    }
  ];

  // Sample metrics
  const todayMetrics = [
    { label: 'Active Vehicles', value: '24', change: '+2', color: 'text-blue-600' },
    { label: 'Deliveries Today', value: '156', change: '+12', color: 'text-green-600' },
    { label: 'Revenue Today', value: '$12,450', change: '+8%', color: 'text-purple-600' },
    { label: 'Avg Efficiency', value: '94.2%', change: '+2.1%', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TruckIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TMS Mobile</h1>
                <p className="text-sm text-gray-600">Transport Management</p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">TMS Navigation</h2>
            </div>
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Today's Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            {todayMetrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-green-600">{metric.change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          {/* Feedback Display */}
          {buttonFeedback && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm text-center animate-pulse">
              {buttonFeedback}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.name)}
                className={`${action.color} text-white p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden ${
                  action.special ? 'ring-2 ring-blue-300 ring-opacity-50 shadow-xl' : ''
                }`}
              >
                {action.special && (
                  <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                )}
                <action.icon className={`w-6 h-6 mx-auto mb-2 ${action.special ? 'animate-bounce' : ''}`} />
                <p className="font-medium text-sm">{action.name}</p>
                {action.special && (
                  <div className="text-xs text-blue-100 mt-1 font-semibold">
                    🚛 Create & Track
                    <div className="mt-1 text-blue-200">Today: {todayShipments} shipments</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">TMS Modules</h2>
          <div className="space-y-3">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.badge && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Route optimization completed</p>
                <p className="text-xs text-gray-600">Saved 15 minutes on downtown route</p>
              </div>
              <p className="text-xs text-gray-500">2m ago</p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Delivery completed</p>
                <p className="text-xs text-gray-600">TMS-001 delivered 5 packages</p>
              </div>
              <p className="text-xs text-gray-500">5m ago</p>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Driver check-in</p>
                <p className="text-xs text-gray-600">John Smith started his route</p>
              </div>
              <p className="text-xs text-gray-500">8m ago</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">GPS Tracking</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Route Optimization</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Driver Communication</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data Sync</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Syncing</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Shipment Modal */}
      <MobileNewShipmentModal
        isOpen={showNewShipmentModal}
        onClose={() => setShowNewShipmentModal(false)}
        onShipmentCreated={() => {
          setShowNewShipmentModal(false);
          setButtonFeedback('✅ Shipment created successfully!');
          setTimeout(() => setButtonFeedback(''), 3000);
        }}
      />

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 gap-1">
          <a
            href="/mobile-dashboard"
            className="flex flex-col items-center py-2 px-1 text-xs text-blue-600"
          >
            <TruckIcon className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-center leading-tight">Home</span>
          </a>
          <a
            href="/fleet-summary"
            className="flex flex-col items-center py-2 px-1 text-xs text-gray-600"
          >
            <TruckIcon className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-center leading-tight">Fleet</span>
          </a>
          <a
            href="/live-tracking"
            className="flex flex-col items-center py-2 px-1 text-xs text-gray-600"
          >
            <MapIcon className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-center leading-tight">Track</span>
          </a>
          <a
            href="/mobile-routes"
            className="flex flex-col items-center py-2 px-1 text-xs text-gray-600"
          >
            <MapIcon className="w-5 h-5 mb-1 flex-shrink-0" />
            <span className="text-center leading-tight">Routes</span>
          </a>
        </div>
      </div>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-16"></div>
      
      {/* PWA Install Button */}
      <InstallButton />
    </div>
  );
}
