'use client';

import { 
  UserIcon,
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  completedDeliveries: number;
  onTimeRate: number;
  fuelEfficiency: number;
  safetyScore: number;
  weeklyHours: number;
  earnings: number;
  status: 'active' | 'inactive' | 'on-break';
  // Enhanced shipment tracking metrics
  currentShipment?: string;
  shipmentsThisWeek: number;
  averageDeliveryTime: number;
  customerRating: number;
  specialCargoDeliveries: number;
}

const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'John Doe',
    rating: 4.8,
    completedDeliveries: 156,
    onTimeRate: 94,
    fuelEfficiency: 8.9,
    safetyScore: 98,
    weeklyHours: 42,
    earnings: 2850,
    status: 'active',
    shipmentsThisWeek: 10,
    averageDeliveryTime: 30,
    customerRating: 4.7,
    specialCargoDeliveries: 2
  },
  {
    id: 'D002',
    name: 'Jane Smith',
    rating: 4.9,
    completedDeliveries: 189,
    onTimeRate: 97,
    fuelEfficiency: 9.2,
    safetyScore: 100,
    weeklyHours: 38,
    earnings: 3120,
    status: 'active',
    shipmentsThisWeek: 12,
    averageDeliveryTime: 28,
    customerRating: 4.8,
    specialCargoDeliveries: 3
  },
  {
    id: 'D003',
    name: 'Mike Johnson',
    rating: 4.6,
    completedDeliveries: 142,
    onTimeRate: 89,
    fuelEfficiency: 8.1,
    safetyScore: 92,
    weeklyHours: 45,
    earnings: 2680,
    status: 'on-break',
    shipmentsThisWeek: 8,
    averageDeliveryTime: 35,
    customerRating: 4.5,
    specialCargoDeliveries: 1
  },
  {
    id: 'D004',
    name: 'Sarah Wilson',
    rating: 4.7,
    completedDeliveries: 167,
    onTimeRate: 92,
    fuelEfficiency: 8.7,
    safetyScore: 96,
    weeklyHours: 40,
    earnings: 2950,
    status: 'active',
    shipmentsThisWeek: 11,
    averageDeliveryTime: 32,
    customerRating: 4.6,
    specialCargoDeliveries: 2
  }
];

const performanceData = [
  { driver: 'John', onTime: 94, safety: 98, efficiency: 89 },
  { driver: 'Jane', onTime: 97, safety: 100, efficiency: 92 },
  { driver: 'Mike', onTime: 89, safety: 92, efficiency: 81 },
  { driver: 'Sarah', onTime: 92, safety: 96, efficiency: 87 },
];

export default function DriverPerformance() {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'on-break':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Driver Performance Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="driver" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="onTime" fill="#3B82F6" name="On-Time %" />
            <Bar dataKey="safety" fill="#10B981" name="Safety Score" />
            <Bar dataKey="efficiency" fill="#F59E0B" name="Fuel Efficiency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Driver Rankings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Driver Rankings</h3>
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Top Performers</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Safety Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDrivers
                .sort((a, b) => b.rating - a.rating)
                .map((driver, index) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {index === 0 && <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />}
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(driver.rating)}
                        </div>
                        <span className="text-sm text-gray-900">{driver.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.completedDeliveries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPerformanceColor(driver.onTimeRate)}`}>
                        {driver.onTimeRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPerformanceColor(driver.safetyScore)}`}>
                        {driver.safetyScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(driver.status)}>
                        {driver.status === 'on-break' ? 'On Break' : driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${driver.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Top Performer</p>
              <p className="text-lg font-semibold text-gray-900">Jane Smith</p>
              <p className="text-sm text-gray-600">4.9/5.0 rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg On-Time Rate</p>
              <p className="text-lg font-semibold text-gray-900">93%</p>
              <p className="text-sm text-green-600">+2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Safety Incidents</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Shipment Tracking Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Shipment Tracking Performance</h3>
            <div className="flex items-center space-x-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Weekly Summary</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Shipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly Shipments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Delivery Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Special Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDrivers
                .filter(driver => driver.status === 'active')
                .sort((a, b) => b.shipmentsThisWeek - a.shipmentsThisWeek)
                .map((driver) => {
                  const performanceScore = Math.round(
                    (driver.onTimeRate + driver.safetyScore + driver.customerRating * 20) / 3
                  );
                  return (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            <div className="text-sm text-gray-500">{driver.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {driver.currentShipment ? (
                          <div className="text-sm">
                            <div className="font-medium text-blue-600">{driver.currentShipment}</div>
                            <div className="text-xs text-gray-500">In progress</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No active shipment</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{driver.shipmentsThisWeek}</div>
                        <div className="text-xs text-gray-500">shipments</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{driver.averageDeliveryTime}h</div>
                        <div className={`text-xs ${
                          driver.averageDeliveryTime <= 4 ? 'text-green-600' :
                          driver.averageDeliveryTime <= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {driver.averageDeliveryTime <= 4 ? 'Excellent' :
                           driver.averageDeliveryTime <= 6 ? 'Good' : 'Needs improvement'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(driver.customerRating)}
                          </div>
                          <span className="text-sm text-gray-900">{driver.customerRating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{driver.specialCargoDeliveries}</div>
                        <div className="text-xs text-gray-500">special deliveries</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                performanceScore >= 95 ? 'bg-green-500' :
                                performanceScore >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${performanceScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{performanceScore}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
