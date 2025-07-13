'use client';

import { useState } from 'react';
import { 
  MapPinIcon, 
  TruckIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import MapView from './MapViewInstant';

// Simple shipment interface
interface SimpleShipment {
  id: string;
  customerName: string;
  origin: string;
  destination: string;
  status: string;
  currentLocation?: string;
  progressPercentage: number;
  estimatedDelivery: string;
  assignedDriver?: string;
  assignedVehicle?: string;
}

export default function ShipmentTrackingWorking() {
  const [showMapView, setShowMapView] = useState(false);
  const [mapShipment, setMapShipment] = useState<SimpleShipment | null>(null);

  // Simple mock data
  const shipments: SimpleShipment[] = [
    {
      id: 'SH-12345',
      customerName: 'TechCorp Industries',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      status: 'In Transit',
      currentLocation: 'Kansas City, MO',
      progressPercentage: 65,
      estimatedDelivery: '2025-07-15 14:00',
      assignedDriver: 'John Smith',
      assignedVehicle: 'TRK-001'
    },
    {
      id: 'SH-12346',
      customerName: 'Global Manufacturing',
      origin: 'Detroit, MI',
      destination: 'Atlanta, GA',
      status: 'Delivered',
      currentLocation: 'Atlanta, GA',
      progressPercentage: 100,
      estimatedDelivery: '2025-07-12 16:00',
      assignedDriver: 'Sarah Johnson',
      assignedVehicle: 'TRK-002'
    },
    {
      id: 'SH-12347',
      customerName: 'Retail Solutions',
      origin: 'Seattle, WA',
      destination: 'Phoenix, AZ',
      status: 'Pending',
      currentLocation: 'Seattle, WA',
      progressPercentage: 0,
      estimatedDelivery: '2025-07-16 12:00',
      assignedDriver: 'Mike Wilson',
      assignedVehicle: 'TRK-003'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'In Transit':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'Delayed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'Pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'In Transit': return 'text-blue-600 bg-blue-100';
      case 'Delayed': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and track all shipments with real-time navigation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'In Transit').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Active Shipments ({shipments.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{shipment.origin}</div>
                    <div className="text-gray-500">→ {shipment.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(shipment.status)}
                      <span className="ml-2 text-sm text-gray-900">{shipment.status}</span>
                    </div>
                    {shipment.currentLocation && (
                      <div className="text-sm text-gray-500">📍 {shipment.currentLocation}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${shipment.progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{shipment.progressPercentage}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.estimatedDelivery}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setMapShipment(shipment);
                          setShowMapView(true);
                        }}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        Map
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map View Modal */}
      {showMapView && mapShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-2 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white h-[95vh]">
            <div className="mt-3 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  🗺️ Live Navigation - {mapShipment.id}
                </h3>
                <button
                  onClick={() => {
                    setShowMapView(false);
                    setMapShipment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Map Container */}
              <div className="flex-1 p-4">
                <MapView 
                  shipment={mapShipment} 
                  onClose={() => {
                    setShowMapView(false);
                    setMapShipment(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
