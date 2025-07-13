'use client';

import { useState } from 'react';
import {
  ClockIcon,
  UserIcon,
  TruckIcon,
  DocumentIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'update' | 'create' | 'delete' | 'report' | 'config' | 'security' | 'error';
  ip?: string;
  device?: string;
  module: string;
}

export default function ActivityLog() {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  const activities: ActivityItem[] = [
    {
      id: '1',
      action: 'Logged into system',
      description: 'Successful login from desktop application',
      timestamp: '2024-01-15 09:30:45',
      type: 'login',
      ip: '192.168.1.100',
      device: 'Windows Desktop',
      module: 'Authentication'
    },
    {
      id: '2',
      action: 'Updated vehicle maintenance',
      description: 'Modified maintenance schedule for Vehicle V-001',
      timestamp: '2024-01-15 10:15:22',
      type: 'update',
      module: 'Fleet Management'
    },
    {
      id: '3',
      action: 'Created new driver profile',
      description: 'Added driver: John Smith (License: D123456)',
      timestamp: '2024-01-14 14:20:10',
      type: 'create',
      module: 'Driver Management'
    },
    {
      id: '4',
      action: 'Generated analytics report',
      description: 'Monthly fleet performance report exported to PDF',
      timestamp: '2024-01-14 16:45:33',
      type: 'report',
      module: 'Analytics'
    },
    {
      id: '5',
      action: 'Modified route optimization',
      description: 'Updated optimization parameters for Route R-101',
      timestamp: '2024-01-13 11:30:15',
      type: 'config',
      module: 'Route Planning'
    },
    {
      id: '6',
      action: 'Security alert triggered',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-01-12 22:15:45',
      type: 'security',
      ip: '192.168.1.105',
      module: 'Security'
    },
    {
      id: '7',
      action: 'Deleted shipment record',
      description: 'Removed cancelled shipment S-2024-001',
      timestamp: '2024-01-12 13:20:18',
      type: 'delete',
      module: 'Shipment Tracking'
    },
    {
      id: '8',
      action: 'System configuration error',
      description: 'Failed to update GPS tracking settings',
      timestamp: '2024-01-11 15:45:20',
      type: 'error',
      module: 'System Configuration'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserIcon className="h-5 w-5 text-green-500" />;
      case 'update':
        return <DocumentIcon className="h-5 w-5 text-blue-500" />;
      case 'create':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'delete':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'report':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'config':
        return <CogIcon className="h-5 w-5 text-yellow-500" />;
      case 'security':
        return <ShieldCheckIcon className="h-5 w-5 text-red-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-green-50 border-green-200';
      case 'update':
        return 'bg-blue-50 border-blue-200';
      case 'create':
        return 'bg-green-50 border-green-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      case 'report':
        return 'bg-purple-50 border-purple-200';
      case 'config':
        return 'bg-yellow-50 border-yellow-200';
      case 'security':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.module.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track all user actions and system events
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Activities
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actions, descriptions, or modules..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
              Activity Type
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
            >
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="update">Updates</option>
              <option value="create">Created</option>
              <option value="delete">Deleted</option>
              <option value="report">Reports</option>
              <option value="config">Configuration</option>
              <option value="security">Security</option>
              <option value="error">Errors</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">
              Time Period
            </label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
            >
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Activities</dt>
                  <dd className="text-lg font-medium text-gray-900">{filteredActivities.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredActivities.filter(a => !['error', 'security'].includes(a.type)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Errors</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredActivities.filter(a => a.type === 'error').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Security Events</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredActivities.filter(a => a.type === 'security').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border rounded-lg p-4 ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                        <span className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {activity.module}
                        </span>
                        {(activity.ip || activity.device) && (
                          <div className="text-xs text-gray-500">
                            {activity.ip && <span>IP: {activity.ip}</span>}
                            {activity.device && <span className="ml-2">Device: {activity.device}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <DocumentIcon className="h-4 w-4 mr-2" />
          Export to CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <DocumentIcon className="h-4 w-4 mr-2" />
          Export to PDF
        </button>
      </div>
    </div>
  );
}
