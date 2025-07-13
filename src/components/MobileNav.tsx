'use client';

import React, { useState } from 'react';
import {
  TruckIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface MobileNavProps {
  currentPage?: string;
}

export default function MobileNav({ currentPage }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/mobile-dashboard', icon: HomeIcon },
    { name: 'Fleet Summary', href: '/fleet-summary', icon: TruckIcon },
    { name: 'Live Tracking', href: '/live-tracking', icon: MapIcon },
    { name: 'Route Optimizer', href: '/mobile-routes', icon: MapIcon },
    { name: 'Mobile Test', href: '/mobile-test', icon: DevicePhoneMobileIcon },
    { name: 'Drivers', href: '/drivers', icon: UserIcon },
    { name: 'Shipments', href: '/shipments', icon: ClipboardDocumentListIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Operations', href: '/operations', icon: Cog6ToothIcon },
    { name: 'Financial', href: '/financial', icon: CurrencyDollarIcon }
  ];

  return (
    <>
      {/* Mobile Header with Navigation Button */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <TruckIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">TMS</h1>
              <p className="text-xs text-gray-600">Transport Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                        currentPage === item.href
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="text-center text-sm text-gray-500">
                  TMS Mobile v1.0
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30">
        <div className="grid grid-cols-4 gap-1">
          {navigationItems.slice(0, 4).map((item) => {
            // Custom labels for better mobile display
            const getShortName = (name: string) => {
              switch(name) {
                case 'Dashboard': return 'Home';
                case 'Fleet Summary': return 'Fleet';
                case 'Live Tracking': return 'Track';
                case 'Route Optimizer': return 'Routes';
                default: return name.split(' ')[0];
              }
            };
            
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-2 px-1 text-xs min-w-0 ${
                  currentPage === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1 flex-shrink-0" />
                <span className="text-center leading-tight">{getShortName(item.name)}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
