'use client';

import { useState } from 'react';
import { 
  TruckIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  model: string;
  year: number;
  mileage: number;
  status: 'active' | 'maintenance' | 'inactive' | 'repair';
  driver?: string;
  location: string;
  fuelLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  issues: string[];
}

const mockVehicles: Vehicle[] = [
  {
    id: 'TRK-001',
    model: 'Freightliner Cascadia',
    year: 2022,
    mileage: 45230,
    status: 'active',
    driver: 'John Doe',
    location: 'En Route to Denver',
    fuelLevel: 78,
    lastMaintenance: '2024-06-15',
    nextMaintenance: '2024-07-15',
    issues: []
  },
  {
    id: 'TRK-015',
    model: 'Volvo VNL',
    year: 2021,
    mileage: 67890,
    status: 'maintenance',
    location: 'Service Bay 2',
    fuelLevel: 45,
    lastMaintenance: '2024-07-10',
    nextMaintenance: '2024-08-10',
    issues: ['Oil change due', 'Brake inspection']
  },
  {
    id: 'TRK-023',
    model: 'Peterbilt 579',
    year: 2023,
    mileage: 23450,
    status: 'active',
    driver: 'Jane Smith',
    location: 'Loading Bay A',
    fuelLevel: 92,
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-07-20',
    issues: []
  },
  {
    id: 'TRK-008',
    model: 'Kenworth T680',
    year: 2020,
    mileage: 89340,
    status: 'repair',
    location: 'Repair Shop',
    fuelLevel: 30,
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-25',
    issues: ['Engine diagnostics', 'Transmission repair']
  },
  {
    id: 'TRK-019',
    model: 'Mack Anthem',
    year: 2022,
    mileage: 34520,
    status: 'inactive',
    location: 'Parking Lot C',
    fuelLevel: 15,
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-07-01',
    issues: ['Low fuel', 'Scheduled for inspection']
  }
];

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'maintenance':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'repair':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <WrenchScrewdriverIcon className="h-5 w-5 text-blue-500" />;
      case 'repair':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'inactive':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <TruckIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 70) return 'bg-green-500';
    if (level >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.driver && vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Fleet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TruckIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-semibold text-gray-900">{vehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WrenchScrewdriverIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Maintenance</p>
              <p className="text-2xl font-semibold text-gray-900">{statusCounts.maintenance || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Needs Attention</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(statusCounts.repair || 0) + vehicles.filter(v => v.issues.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Vehicles
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ID, model, or driver..."
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status Filter
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FunnelIcon className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getStatusIcon(vehicle.status)}
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{vehicle.id}</h3>
                    <p className="text-sm text-gray-500">{vehicle.model} ({vehicle.year})</p>
                  </div>
                </div>
                <span className={getStatusBadge(vehicle.status)}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Mileage</span>
                  <span className="text-sm font-medium text-gray-900">
                    {vehicle.mileage.toLocaleString()} mi
                  </span>
                </div>

                {vehicle.driver && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Driver</span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.driver}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{vehicle.location}</span>
                  </div>
                </div>

                {/* Fuel Level */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">Fuel Level</span>
                    <span className="text-sm font-medium text-gray-900">{vehicle.fuelLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getFuelLevelColor(vehicle.fuelLevel)}`}
                      style={{ width: `${vehicle.fuelLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last Service: {new Date(vehicle.lastMaintenance).toLocaleDateString()}</span>
                    <span>Next Service: {new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Issues */}
                {vehicle.issues.length > 0 && (
                  <div className="pt-3">
                    <p className="text-sm font-medium text-red-600 mb-2">Issues:</p>
                    <ul className="space-y-1">
                      {vehicle.issues.map((issue, index) => (
                        <li key={index} className="text-xs text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  View Details
                </button>
                {vehicle.status === 'active' && (
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Track
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
