'use client';

import { useState } from 'react';
import { 
  TruckIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MapPinIcon,
  ClockIcon,
  BeakerIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  BeakerIcon as FuelIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ClockIcon as TimeIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import RouteOptimization from './RouteOptimization';
import DriverPerformance from './DriverPerformance';
import FleetManagement from './FleetManagement';

// Mock data for charts
const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, shipments: 120, fuelCost: 8500 },
  { month: 'Feb', revenue: 52000, shipments: 140, fuelCost: 9200 },
  { month: 'Mar', revenue: 48000, shipments: 125, fuelCost: 8800 },
  { month: 'Apr', revenue: 61000, shipments: 165, fuelCost: 10200 },
  { month: 'May', revenue: 55000, shipments: 150, fuelCost: 9500 },
  { month: 'Jun', revenue: 67000, shipments: 180, fuelCost: 11000 },
];

const vehicleStatus = [
  { name: 'Active', value: 45, color: '#10B981' },
  { name: 'Maintenance', value: 8, color: '#F59E0B' },
  { name: 'Inactive', value: 3, color: '#EF4444' },
];

const routeEfficiency = [
  { day: 'Mon', planned: 24, actual: 22, efficiency: 92 },
  { day: 'Tue', planned: 28, actual: 26, efficiency: 93 },
  { day: 'Wed', planned: 32, actual: 28, efficiency: 88 },
  { day: 'Thu', planned: 26, actual: 25, efficiency: 96 },
  { day: 'Fri', planned: 30, actual: 29, efficiency: 97 },
  { day: 'Sat', planned: 22, actual: 20, efficiency: 91 },
  { day: 'Sun', planned: 18, actual: 17, efficiency: 94 },
];

const fuelEfficiencyData = [
  { month: 'Jan', mpg: 8.2, cost: 3.45 },
  { month: 'Feb', mpg: 8.5, cost: 3.52 },
  { month: 'Mar', mpg: 8.1, cost: 3.48 },
  { month: 'Apr', mpg: 8.7, cost: 3.65 },
  { month: 'May', mpg: 8.3, cost: 3.58 },
  { month: 'Jun', mpg: 8.9, cost: 3.72 },
];

const shipmentStatus = [
  { status: 'Delivered', count: 142, color: '#10B981' },
  { status: 'In Transit', count: 23, color: '#3B82F6' },
  { status: 'Pending', count: 8, color: '#F59E0B' },
  { status: 'Delayed', count: 3, color: '#EF4444' },
];

const stats = [
  {
    name: 'Total Vehicles',
    stat: '56',
    previousStat: '52',
    change: '7.7%',
    changeType: 'increase',
    icon: TruckIcon,
  },
  {
    name: 'Active Drivers',
    stat: '42',
    previousStat: '45',
    change: '6.7%',
    changeType: 'decrease',
    icon: UserIcon,
  },
  {
    name: 'Pending Shipments',
    stat: '23',
    previousStat: '18',
    change: '27.8%',
    changeType: 'increase',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Monthly Revenue',
    stat: '$67,000',
    previousStat: '$55,000',
    change: '21.8%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Avg Fuel Efficiency',
    stat: '8.9 MPG',
    previousStat: '8.3 MPG',
    change: '7.2%',
    changeType: 'increase',
    icon: BeakerIcon,
  },
  {
    name: 'Route Efficiency',
    stat: '94%',
    previousStat: '89%',
    change: '5.6%',
    changeType: 'increase',
    icon: MapPinIcon,
  },
  {
    name: 'On-Time Delivery',
    stat: '96.5%',
    previousStat: '94.2%',
    change: '2.4%',
    changeType: 'increase',
    icon: ClockIcon,
  },
  {
    name: 'Fleet Utilization',
    stat: '87%',
    previousStat: '83%',
    change: '4.8%',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
];

const liveFleetData = [
  { id: 'TRK-001', driver: 'John Doe', status: 'En Route', location: 'Highway 101', eta: '2:30 PM', progress: 75 },
  { id: 'TRK-015', driver: 'Jane Smith', status: 'Loading', location: 'Warehouse A', eta: '3:15 PM', progress: 25 },
  { id: 'TRK-023', driver: 'Mike Johnson', status: 'Delivered', location: 'Downtown', eta: 'Completed', progress: 100 },
  { id: 'TRK-008', driver: 'Sarah Wilson', status: 'Delayed', location: 'Route 66', eta: '4:45 PM', progress: 60 },
];

const recentAlerts = [
  { id: 1, type: 'warning', message: 'Vehicle TRK-008 experiencing delays due to traffic', time: '5 min ago', severity: 'medium' },
  { id: 2, type: 'success', message: 'Shipment SH-12345 delivered successfully', time: '15 min ago', severity: 'low' },
  { id: 3, type: 'error', message: 'Vehicle TRK-019 requires immediate maintenance', time: '1 hour ago', severity: 'high' },
  { id: 4, type: 'info', message: 'New route optimization available for tomorrow', time: '2 hours ago', severity: 'low' },
];

// Mock vehicle details data
const vehicleDetails = [
  {
    id: 'V001',
    plateNumber: 'TMS-001',
    type: 'Box Truck',
    model: 'Ford Transit 350',
    year: 2022,
    status: 'Active',
    driver: 'John Smith',
    location: 'Route A - Downtown',
    mileage: 45230,
    fuelLevel: 75,
    lastMaintenance: '2024-06-15',
    nextMaintenance: '2024-08-15',
    deliveries: 8,
    revenue: '$2,400'
  },
  {
    id: 'V002',
    plateNumber: 'TMS-002',
    type: 'Semi Truck',
    model: 'Volvo VNL 760',
    year: 2023,
    status: 'Active',
    driver: 'Sarah Johnson',
    location: 'Route B - Highway 101',
    mileage: 78450,
    fuelLevel: 60,
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-09-20',
    deliveries: 12,
    revenue: '$4,200'
  },
  {
    id: 'V003',
    plateNumber: 'TMS-003',
    type: 'Van',
    model: 'Mercedes Sprinter',
    year: 2021,
    status: 'Maintenance',
    driver: 'Mike Wilson',
    location: 'Maintenance Bay 2',
    mileage: 62100,
    fuelLevel: 30,
    lastMaintenance: '2024-07-10',
    nextMaintenance: '2024-07-15',
    deliveries: 0,
    revenue: '$0'
  },
  {
    id: 'V004',
    plateNumber: 'TMS-004',
    type: 'Pickup Truck',
    model: 'Ford F-150',
    year: 2023,
    status: 'Active',
    driver: 'Emma Davis',
    location: 'Route C - Suburban',
    mileage: 23450,
    fuelLevel: 85,
    lastMaintenance: '2024-05-30',
    nextMaintenance: '2024-08-30',
    deliveries: 5,
    revenue: '$1,200'
  },
  {
    id: 'V005',
    plateNumber: 'TMS-005',
    type: 'Box Truck',
    model: 'Isuzu NPR',
    year: 2022,
    status: 'Active',
    driver: 'David Brown',
    location: 'Route D - Industrial',
    mileage: 56780,
    fuelLevel: 45,
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-09-01',
    deliveries: 9,
    revenue: '$2,800'
  }
];

// Mock driver details data
const driverDetails = [
  {
    id: 'D001',
    name: 'John Smith',
    licenseNumber: 'CDL-123456',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@tms.com',
    status: 'Active',
    currentVehicle: 'TMS-001',
    currentRoute: 'Route A - Downtown',
    hoursThisWeek: 38,
    maxHours: 60,
    experience: '8 years',
    rating: 4.8,
    completedDeliveries: 156,
    onTimeRate: 98.5,
    fuelEfficiency: 95.2,
    safetyScore: 100,
    lastActive: '2 hours ago',
    nextShift: 'Tomorrow 6:00 AM',
    violations: 0,
    revenue: '$12,400'
  },
  {
    id: 'D002',
    name: 'Sarah Johnson',
    licenseNumber: 'CDL-234567',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@tms.com',
    status: 'Active',
    currentVehicle: 'TMS-002',
    currentRoute: 'Route B - Highway 101',
    hoursThisWeek: 42,
    maxHours: 60,
    experience: '12 years',
    rating: 4.9,
    completedDeliveries: 203,
    onTimeRate: 99.1,
    fuelEfficiency: 97.8,
    safetyScore: 100,
    lastActive: '1 hour ago',
    nextShift: 'Today 2:00 PM',
    violations: 0,
    revenue: '$18,700'
  },
  {
    id: 'D003',
    name: 'Mike Wilson',
    licenseNumber: 'CDL-345678',
    phone: '+1 (555) 345-6789',
    email: 'mike.wilson@tms.com',
    status: 'Off Duty',
    currentVehicle: 'TMS-003',
    currentRoute: 'Maintenance Bay 2',
    hoursThisWeek: 45,
    maxHours: 60,
    experience: '5 years',
    rating: 4.6,
    completedDeliveries: 89,
    onTimeRate: 96.8,
    fuelEfficiency: 92.1,
    safetyScore: 98,
    lastActive: '8 hours ago',
    nextShift: 'Monday 7:00 AM',
    violations: 1,
    revenue: '$8,900'
  },
  {
    id: 'D004',
    name: 'Emma Davis',
    licenseNumber: 'CDL-456789',
    phone: '+1 (555) 456-7890',
    email: 'emma.davis@tms.com',
    status: 'Active',
    currentVehicle: 'TMS-004',
    currentRoute: 'Route C - Suburban',
    hoursThisWeek: 35,
    maxHours: 60,
    experience: '3 years',
    rating: 4.7,
    completedDeliveries: 67,
    onTimeRate: 97.3,
    fuelEfficiency: 94.5,
    safetyScore: 99,
    lastActive: '30 minutes ago',
    nextShift: 'Today 4:00 PM',
    violations: 0,
    revenue: '$6,700'
  },
  {
    id: 'D005',
    name: 'David Brown',
    licenseNumber: 'CDL-567890',
    phone: '+1 (555) 567-8901',
    email: 'david.brown@tms.com',
    status: 'Active',
    currentVehicle: 'TMS-005',
    currentRoute: 'Route D - Industrial',
    hoursThisWeek: 40,
    maxHours: 60,
    experience: '15 years',
    rating: 4.9,
    completedDeliveries: 234,
    onTimeRate: 99.6,
    fuelEfficiency: 98.1,
    safetyScore: 100,
    lastActive: '45 minutes ago',
    nextShift: 'Tomorrow 5:00 AM',
    violations: 0,
    revenue: '$21,300'
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [activeTab, setActiveTab] = useState('overview');
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartPieIcon },
    { id: 'fleet', name: 'Fleet Management', icon: TruckIcon },
    { id: 'routes', name: 'Route Optimization', icon: MapPinIcon },
    { id: 'drivers', name: 'Driver Analytics', icon: UserIcon },
    { id: 'operations', name: 'Operations', icon: Cog6ToothIcon },
  ];

  const handleStatsCardClick = (cardName: string) => {
    if (cardName === 'Total Vehicles') {
      setShowVehicleModal(true);
    } else if (cardName === 'Active Drivers') {
      setShowDriverModal(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En Route':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'Loading':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Delayed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <TruckIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time overview of your transport management system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleStatsCardClick(item.name)}
              >
                <dt>
                  <div className="absolute bg-gradient-to-r from-blue-500 to-blue-600 rounded-md p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                  <p
                    className={classNames(
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                      'ml-2 flex items-baseline text-sm font-semibold'
                    )}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />
                    )}
                    <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                    {item.change}
                  </p>
                  <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <span className="text-gray-600">from </span>
                      <span className="font-medium text-gray-900">{item.previousStat}</span>
                    </div>
                  </div>
                </dd>
              </div>
            ))}
          </div>

          {/* Live Fleet Tracking */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Live Fleet Tracking</h3>
                <span className="flex items-center text-sm text-green-600">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {liveFleetData.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.driver}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(vehicle.status)}
                            <span className="ml-2 text-sm text-gray-900">{vehicle.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.eta}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  vehicle.progress === 100 ? 'bg-green-500' : 
                                  vehicle.progress >= 75 ? 'bg-blue-500' : 
                                  vehicle.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${vehicle.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{vehicle.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Enhanced Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Fuel Cost Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Fuel Costs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : 'Fuel Cost'
                  ]} />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="fuelCost" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Route Efficiency Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Route Efficiency</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={routeEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Shipment Status Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={shipmentStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percent }) => `${status} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {shipmentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Fuel Efficiency Trends */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fuel Efficiency Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fuelEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'mpg' ? `${value} MPG` : `$${value}/gal`,
                    name === 'mpg' ? 'Miles per Gallon' : 'Cost per Gallon'
                  ]} />
                  <Bar dataKey="mpg" fill="#10B981" name="mpg" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Real-time Alerts</h3>
                  <span className="text-sm text-gray-500">{recentAlerts.length} active</span>
                </div>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <TruckIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Vehicle TRK-001 completed delivery
                          </p>
                          <p className="text-sm text-gray-500">Shipment #SH-12345 delivered successfully</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">2 minutes ago</div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <UserIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            New driver registered
                          </p>
                          <p className="text-sm text-gray-500">John Smith joined the fleet</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">1 hour ago</div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Route optimization completed
                          </p>
                          <p className="text-sm text-gray-500">New optimal routes generated for tomorrow</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">3 hours ago</div>
                      </div>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <BeakerIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Fuel efficiency improved
                          </p>
                          <p className="text-sm text-gray-500">Fleet average MPG increased to 8.9</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">5 hours ago</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'routes' && (
        <RouteOptimization onOptimize={() => console.log('Optimizing routes...')} />
      )}

      {activeTab === 'fleet' && (
        <FleetManagement />
      )}

      {activeTab === 'drivers' && (
        <DriverPerformance />
      )}

      {activeTab === 'operations' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Operations Management</h3>
          <p className="text-gray-600">Advanced operations features coming soon...</p>
          <div className="mt-4 space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Maintenance Scheduling</h4>
              <p className="text-sm text-gray-600 mt-1">Automated vehicle maintenance scheduling and tracking</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Inventory Management</h4>
              <p className="text-sm text-gray-600 mt-1">Real-time tracking of parts and supplies</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Compliance Monitoring</h4>
              <p className="text-sm text-gray-600 mt-1">DOT regulations and safety compliance tracking</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Driver Management Dashboard</h3>
              <button
                onClick={() => setShowDriverModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Driver Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Drivers</p>
                    <p className="text-2xl font-bold text-blue-900">42</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-2xl font-bold text-green-900">38</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TimeIcon className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Off Duty</p>
                    <p className="text-2xl font-bold text-yellow-900">3</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <StarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-purple-900">4.8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver List */}
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h4 className="text-lg leading-6 font-medium text-gray-900">Driver Roster</h4>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Comprehensive driver information and performance metrics</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Assignment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {driverDetails.map((driver) => (
                        <tr key={driver.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {driver.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                <div className="text-sm text-gray-500">CDL: {driver.licenseNumber}</div>
                                <div className="text-xs text-gray-400">{driver.experience} experience</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{driver.phone}</span>
                              </div>
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-xs">{driver.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
                                driver.status === 'Active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {driver.status}
                              </span>
                              <div className="text-xs text-gray-500">
                                Last: {driver.lastActive}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center mb-1">
                                <TruckIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{driver.currentVehicle}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPinIcon className="h-3 w-3 text-gray-400 mr-1" />
                                <span>{driver.currentRoute}</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Next: {driver.nextShift}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="flex items-center mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      (driver.hoursThisWeek / driver.maxHours) > 0.8 ? 'bg-red-600' :
                                      (driver.hoursThisWeek / driver.maxHours) > 0.6 ? 'bg-yellow-600' : 'bg-green-600'
                                    }`}
                                    style={{ width: `${(driver.hoursThisWeek / driver.maxHours) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {driver.hoursThisWeek}/{driver.maxHours} hrs
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="flex items-center mb-1">
                                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="font-medium">{driver.rating}</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                <div>{driver.completedDeliveries} deliveries</div>
                                <div>{driver.onTimeRate}% on-time</div>
                                <div>{driver.fuelEfficiency}% fuel eff.</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className={`font-medium mb-1 ${
                                driver.safetyScore === 100 ? 'text-green-600' :
                                driver.safetyScore >= 95 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {driver.safetyScore}%
                              </div>
                              <div className="text-xs">
                                <div className={driver.violations === 0 ? 'text-green-600' : 'text-red-600'}>
                                  {driver.violations} violations
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {driver.revenue}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDriverModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDriverModal(false);
                  setActiveTab('drivers');
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Drivers
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vehicle Details Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Vehicle Fleet Details</h3>
            <button
              onClick={() => setShowVehicleModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Fleet Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-blue-900">56</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Active</p>
                  <p className="text-2xl font-bold text-green-900">52</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Maintenance</p>
                  <p className="text-2xl font-bold text-yellow-900">3</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-600">Out of Service</p>
                  <p className="text-2xl font-bold text-red-900">1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="bg-white shadow overflow-hidden rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-lg leading-6 font-medium text-gray-900">Vehicle Inventory</h4>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about each vehicle in your fleet</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicleDetails.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TruckIcon className="h-8 w-8 text-gray-400" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{vehicle.plateNumber}</div>
                              <div className="text-sm text-gray-500">{vehicle.model} ({vehicle.year})</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{vehicle.driver}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.status === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : vehicle.status === 'Maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <div className="text-sm text-gray-900">{vehicle.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FuelIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-16">
                              <div 
                                className={`h-2 rounded-full ${
                                  vehicle.fuelLevel > 60 ? 'bg-green-600' :
                                  vehicle.fuelLevel > 30 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${vehicle.fuelLevel}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{vehicle.fuelLevel}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.mileage.toLocaleString()} mi
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Next: {vehicle.nextMaintenance}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900">{vehicle.deliveries} deliveries</div>
                            <div className="text-gray-500">{vehicle.revenue} revenue</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowVehicleModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowVehicleModal(false);
                setActiveTab('fleet');
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Fleet
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
