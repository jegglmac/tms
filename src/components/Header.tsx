'use client';

import { useState } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  TruckIcon,
  UserIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'fleet' | 'driver' | 'route' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Vehicle Breakdown',
    message: 'TRK-008 has reported engine failure on I-75. Driver needs assistance.',
    time: '5 min ago',
    read: false,
    category: 'fleet'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Driver Hours Alert',
    message: 'John Doe approaching maximum driving hours (9.5/11 hrs used).',
    time: '15 min ago',
    read: false,
    category: 'driver'
  },
  {
    id: '3',
    type: 'info',
    title: 'Route Optimization Complete',
    message: 'New optimized routes saved 2.5 hours and $340 in fuel costs.',
    time: '1 hour ago',
    read: true,
    category: 'route'
  },
  {
    id: '4',
    type: 'success',
    title: 'Delivery Completed',
    message: 'Shipment #SH-2024-789 delivered successfully to Denver warehouse.',
    time: '2 hours ago',
    read: true,
    category: 'fleet'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Maintenance Due',
    message: 'TRK-015 requires scheduled maintenance within 48 hours.',
    time: '4 hours ago',
    read: false,
    category: 'fleet'
  }
];

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleViewProfile = () => {
    setShowUserMenu(false);
    // Trigger navigation to profile page
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('navigate-to-profile'));
    }
  };
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string, category: string) => {
    switch (type) {
      case 'alert':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fleet':
        return <TruckIcon className="h-4 w-4 text-gray-400" />;
      case 'driver':
        return <UserIcon className="h-4 w-4 text-gray-400" />;
      case 'route':
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Transport Management System</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search vehicles, drivers, routes..."
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {getNotificationIcon(notification.type, notification.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium text-gray-900 ${
                                  !notification.read ? 'font-semibold' : ''
                                }`}>
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  {getCategoryIcon(notification.category)}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {notification.time}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You're all caught up! Check back later for updates.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative flex items-center ml-3">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Admin</p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">AD</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">Admin User</h3>
                        <p className="text-xs text-gray-500">admin@transportms.com</p>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button 
                      onClick={handleViewProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                      View Profile
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Account Settings
                    </button>
                    
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <ShieldCheckIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Security & Privacy
                    </button>

                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <ChartBarIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Activity Dashboard
                    </button>

                    <hr className="my-2 border-gray-200" />

                    {/* Quick Stats */}
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quick Stats</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">127</p>
                          <p className="text-xs text-gray-500">Active Vehicles</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">98.2%</p>
                          <p className="text-xs text-gray-500">On-Time Rate</p>
                        </div>
                      </div>
                    </div>

                    <hr className="my-2 border-gray-200" />

                    {/* System Status */}
                    <div className="px-4 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">System Status</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Fleet Monitoring</span>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">GPS Tracking</span>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                            <span className="text-xs text-green-600">Connected</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Driver Apps</span>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></div>
                            <span className="text-xs text-yellow-600">3 Offline</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-2 border-gray-200" />

                    {/* Logout */}
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside overlay to close menus */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
}
