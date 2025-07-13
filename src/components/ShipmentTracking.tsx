'use client';

import { useState } from 'react';
import { 
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  BellIcon,
  MapIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
  PrinterIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapView from './MapViewInstant';

interface TrackingEvent {
  timestamp: string;
  event: string;
  location: string;
  details?: string;
  status: 'completed' | 'current' | 'pending' | 'delayed';
}

interface Notification {
  id: string;
  shipmentId: string;
  type: 'delay' | 'delivered' | 'exception' | 'update';
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface ShipmentDocument {
  id: string;
  name: string;
  type: 'invoice' | 'pod' | 'manifest' | 'insurance';
  url: string;
  uploadDate: string;
}

interface Shipment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Cancelled';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  origin: string;
  destination: string;
  distance: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  cargo: string;
  weight: string;
  dimensions: string;
  value: string;
  specialInstructions?: string;
  pickupTime: string;
  deliveryWindow: string;
  trackingEvents: TrackingEvent[];
  currentLocation?: string;
  progressPercentage: number;
  // Enhanced tracking features
  temperature?: number;
  humidity?: number;
  lastUpdateTime?: string;
  riskScore?: number;
  predictedDelay?: number;
  documents?: ShipmentDocument[];
  notifications?: Notification[];
  gpsCoordinates?: { lat: number; lng: number };
  routeOptimized?: boolean;
  carbonFootprint?: number;
}

const mockShipments: Shipment[] = [
  {
    id: 'SH-12345',
    customerName: 'ABC Manufacturing',
    customerEmail: 'orders@abcmanufacturing.com',
    customerPhone: '+1 (555) 123-4567',
    status: 'In Transit',
    priority: 'High',
    origin: '123 Warehouse St, Los Angeles, CA',
    destination: '456 Factory Ave, Phoenix, AZ',
    distance: '372 miles',
    estimatedDelivery: '2025-07-14 14:00',
    assignedVehicle: 'TMS-001',
    assignedDriver: 'John Smith',
    cargo: 'Electronic Components',
    weight: '2,450 lbs',
    dimensions: '8x6x4 ft',
    value: '$45,000',
    specialInstructions: 'Fragile - Handle with care',
    pickupTime: '2025-07-13 08:00',
    deliveryWindow: '2025-07-14 12:00 - 16:00',
    currentLocation: 'Bakersfield, CA',
    progressPercentage: 65,
    // Enhanced features
    temperature: 22,
    humidity: 45,
    lastUpdateTime: '2025-07-13 14:30',
    riskScore: 2,
    predictedDelay: 0,
    gpsCoordinates: { lat: 35.3733, lng: -119.0187 },
    routeOptimized: true,
    carbonFootprint: 45.2,
    documents: [
      { id: 'DOC-1', name: 'Invoice_SH12345.pdf', type: 'invoice', url: '/docs/invoice_sh12345.pdf', uploadDate: '2025-07-12 10:00' },
      { id: 'DOC-2', name: 'Manifest_SH12345.pdf', type: 'manifest', url: '/docs/manifest_sh12345.pdf', uploadDate: '2025-07-12 10:15' }
    ],
    notifications: [
      { id: 'N1', shipmentId: 'SH-12345', type: 'update', message: 'Shipment departed checkpoint - on schedule', timestamp: '2025-07-13 14:30', read: false, severity: 'info' }
    ],
    trackingEvents: [
      { timestamp: '2025-07-12 09:00', event: 'Shipment created', location: 'Los Angeles, CA', status: 'completed' },
      { timestamp: '2025-07-12 14:30', event: 'Vehicle assigned', location: 'Los Angeles, CA', status: 'completed' },
      { timestamp: '2025-07-13 08:00', event: 'Pickup completed', location: 'Los Angeles, CA', status: 'completed' },
      { timestamp: '2025-07-13 12:30', event: 'In transit checkpoint', location: 'Bakersfield, CA', status: 'current' },
      { timestamp: '2025-07-13 18:00', event: 'Expected checkpoint', location: 'Flagstaff, AZ', status: 'pending' },
      { timestamp: '2025-07-14 14:00', event: 'Delivery scheduled', location: 'Phoenix, AZ', status: 'pending' }
    ]
  },
  {
    id: 'SH-12346',
    customerName: 'Tech Solutions Inc',
    customerEmail: 'shipping@techsolutions.com',
    customerPhone: '+1 (555) 234-5678',
    status: 'Delivered',
    priority: 'Medium',
    origin: '789 Tech Park, San Francisco, CA',
    destination: '321 Business Blvd, Seattle, WA',
    distance: '808 miles',
    estimatedDelivery: '2025-07-12 10:00',
    actualDelivery: '2025-07-12 09:45',
    assignedVehicle: 'TMS-002',
    assignedDriver: 'Sarah Johnson',
    cargo: 'Server Equipment',
    weight: '3,200 lbs',
    dimensions: '10x8x6 ft',
    value: '$78,000',
    specialInstructions: 'Requires signature upon delivery',
    pickupTime: '2025-07-10 10:00',
    deliveryWindow: '2025-07-12 09:00 - 12:00',
    progressPercentage: 100,
    trackingEvents: [
      { timestamp: '2025-07-10 08:00', event: 'Shipment created', location: 'San Francisco, CA', status: 'completed' },
      { timestamp: '2025-07-10 10:00', event: 'Picked up', location: 'San Francisco, CA', status: 'completed' },
      { timestamp: '2025-07-10 16:30', event: 'In transit', location: 'Sacramento, CA', status: 'completed' },
      { timestamp: '2025-07-11 11:00', event: 'Rest stop', location: 'Portland, OR', status: 'completed' },
      { timestamp: '2025-07-12 09:45', event: 'Delivered successfully', location: 'Seattle, WA', status: 'completed' }
    ]
  },
  {
    id: 'SH-12347',
    customerName: 'Global Retail Corp',
    customerEmail: 'logistics@globalretail.com',
    customerPhone: '+1 (555) 345-6789',
    status: 'Pending',
    priority: 'Low',
    origin: '555 Distribution Center, Dallas, TX',
    destination: '777 Store Plaza, Miami, FL',
    distance: '1,285 miles',
    estimatedDelivery: '2025-07-16 15:00',
    cargo: 'Consumer Electronics',
    weight: '1,800 lbs',
    dimensions: '6x4x3 ft',
    value: '$32,000',
    specialInstructions: 'Temperature controlled required',
    pickupTime: '2025-07-14 07:00',
    deliveryWindow: '2025-07-16 14:00 - 18:00',
    progressPercentage: 0,
    trackingEvents: [
      { timestamp: '2025-07-12 11:00', event: 'Shipment created', location: 'Dallas, TX', status: 'completed' },
      { timestamp: '2025-07-12 15:00', event: 'Awaiting assignment', location: 'Dallas, TX', status: 'current' },
      { timestamp: '2025-07-14 07:00', event: 'Pickup scheduled', location: 'Dallas, TX', status: 'pending' }
    ]
  },
  {
    id: 'SH-12348',
    customerName: 'Construction Pro',
    customerEmail: 'delivery@constructionpro.com',
    customerPhone: '+1 (555) 567-8901',
    status: 'Delayed',
    priority: 'Medium',
    origin: '444 Industrial Park, Denver, CO',
    destination: '888 Construction Site, Las Vegas, NV',
    distance: '768 miles',
    estimatedDelivery: '2025-07-14 09:00',
    assignedVehicle: 'TMS-008',
    assignedDriver: 'Mike Wilson',
    cargo: 'Construction Materials',
    weight: '4,500 lbs',
    dimensions: '12x8x6 ft',
    value: '$18,000',
    specialInstructions: 'Heavy machinery - requires crane for unloading',
    pickupTime: '2025-07-12 06:00',
    deliveryWindow: '2025-07-14 08:00 - 12:00',
    currentLocation: 'Route 66, AZ',
    progressPercentage: 45,
    trackingEvents: [
      { timestamp: '2025-07-11 14:00', event: 'Shipment created', location: 'Denver, CO', status: 'completed' },
      { timestamp: '2025-07-12 06:00', event: 'Picked up', location: 'Denver, CO', status: 'completed' },
      { timestamp: '2025-07-12 18:00', event: 'Delayed due to traffic', location: 'Route 66', status: 'delayed', details: 'Heavy traffic due to road construction' },
      { timestamp: '2025-07-13 10:00', event: 'Resumed journey', location: 'Flagstaff, AZ', status: 'current' }
    ]
  }
];

const statusDistribution = [
  { name: 'Delivered', value: 45, color: '#10B981' },
  { name: 'In Transit', value: 28, color: '#3B82F6' },
  { name: 'Pending', value: 20, color: '#F59E0B' },
  { name: 'Delayed', value: 7, color: '#EF4444' },
];

const deliveryTrends = [
  { day: 'Mon', onTime: 95, delayed: 5 },
  { day: 'Tue', onTime: 92, delayed: 8 },
  { day: 'Wed', onTime: 97, delayed: 3 },
  { day: 'Thu', onTime: 94, delayed: 6 },
  { day: 'Fri', onTime: 96, delayed: 4 },
  { day: 'Sat', onTime: 98, delayed: 2 },
  { day: 'Sun', onTime: 93, delayed: 7 },
];

export default function ShipmentTracking() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enhanced state management
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'analytics' | 'notifications' | 'documents'>('overview');
  const [showMapView, setShowMapView] = useState(false);
  const [mapShipment, setMapShipment] = useState<Shipment | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'N1', shipmentId: 'SH-12345', type: 'update', message: 'Shipment SH-12345 departed checkpoint - on schedule', timestamp: '2025-07-13 14:30', read: false, severity: 'info' },
    { id: 'N2', shipmentId: 'SH-12348', type: 'delay', message: 'Shipment SH-12348 experiencing delays due to traffic', timestamp: '2025-07-13 12:15', read: false, severity: 'warning' },
    { id: 'N3', shipmentId: 'SH-12346', type: 'delivered', message: 'Shipment SH-12346 delivered successfully', timestamp: '2025-07-12 09:45', read: true, severity: 'success' }
  ]);

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || shipment.priority === priorityFilter;
    const matchesSearch = searchTerm === '' || 
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'Delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'In Transit':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Delayed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (priority) {
      case 'Critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'High':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getEventIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'current':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'delayed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskScoreBadge = (riskScore: number = 0) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    if (riskScore >= 7) return `${baseClasses} bg-red-100 text-red-800`;
    if (riskScore >= 4) return `${baseClasses} bg-yellow-100 text-yellow-800`;
    return `${baseClasses} bg-green-100 text-green-800`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delay': return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'delivered': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'exception': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default: return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Tabs and Notifications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">
                Advanced real-time tracking and management of all shipments
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <BellIcon className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Advanced Analytics Toggle */}
              <button
                onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: ClipboardDocumentListIcon },
                { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
                { id: 'notifications', label: 'Notifications', icon: BellIcon },
                { id: 'documents', label: 'Documents', icon: DocumentDuplicateIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters - only show on overview tab */}
        {selectedTab === 'overview' && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Delayed">Delayed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className={`px-6 py-4 border-b border-gray-200 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <>
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Delivery Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={deliveryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="onTime" stroke="#10B981" strokeWidth={2} name="On Time %" />
              <Line type="monotone" dataKey="delayed" stroke="#EF4444" strokeWidth={2} name="Delayed %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Active Shipments</h3>
            <span className="text-sm text-gray-500">{filteredShipments.length} shipments</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{shipment.id}</div>
                        <div className="text-sm text-gray-500">{shipment.cargo}</div>
                        <div className="mt-1">
                          <span className={getPriorityBadge(shipment.priority)}>
                            {shipment.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{shipment.customerName}</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <PhoneIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{shipment.customerPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(shipment.status)}>
                      {shipment.status}
                    </span>
                    {shipment.currentLocation && (
                      <div className="text-xs text-gray-500 mt-1">
                        📍 {shipment.currentLocation}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs">From: {shipment.origin.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <MapPinIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs">To: {shipment.destination.split(',')[0]}</span>
                      </div>
                      <div className="text-xs text-blue-600">{shipment.distance}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            shipment.progressPercentage === 100 ? 'bg-green-500' : 
                            shipment.progressPercentage >= 75 ? 'bg-blue-500' : 
                            shipment.progressPercentage >= 50 ? 'bg-yellow-500' : 
                            shipment.progressPercentage >= 25 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${shipment.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{shipment.progressPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={getRiskScoreBadge(shipment.riskScore)}>
                        Risk {shipment.riskScore || 0}
                      </span>
                      {shipment.temperature && (
                        <span className="text-xs text-gray-500">
                          🌡️ {shipment.temperature}°C
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="text-gray-900 font-medium">
                        {shipment.actualDelivery || shipment.estimatedDelivery}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shipment.actualDelivery ? 'Delivered' : 'Estimated'}
                        {shipment.predictedDelay && shipment.predictedDelay > 0 && (
                          <span className="text-orange-600 ml-1">
                            (+{shipment.predictedDelay}h delay)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => setSelectedShipment(shipment)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
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

      {/* Detailed Tracking Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Shipment Details - {selectedShipment.id}
              </h3>
              <button
                onClick={() => setSelectedShipment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipment Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Shipment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={getStatusBadge(selectedShipment.status)}>
                        {selectedShipment.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={getPriorityBadge(selectedShipment.priority)}>
                        {selectedShipment.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cargo:</span>
                      <span className="font-medium">{selectedShipment.cargo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span>{selectedShipment.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span>{selectedShipment.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium text-green-600">{selectedShipment.value}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedShipment.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedShipment.customerPhone}</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedShipment.customerEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Assignment</h4>
                  <div className="space-y-2 text-sm">
                    {selectedShipment.assignedVehicle ? (
                      <>
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedShipment.assignedVehicle}</span>
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedShipment.assignedDriver}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-red-600 font-medium">Unassigned</div>
                    )}
                  </div>
                </div>

                {/* Environmental Monitoring */}
                {(selectedShipment.temperature || selectedShipment.humidity) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-blue-900 mb-3">Environmental Monitoring</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedShipment.temperature && (
                        <div className="flex justify-between">
                          <span className="text-blue-600">Temperature:</span>
                          <span className="font-medium">{selectedShipment.temperature}°C</span>
                        </div>
                      )}
                      {selectedShipment.humidity && (
                        <div className="flex justify-between">
                          <span className="text-blue-600">Humidity:</span>
                          <span className="font-medium">{selectedShipment.humidity}%</span>
                        </div>
                      )}
                      {selectedShipment.lastUpdateTime && (
                        <div className="flex justify-between col-span-2">
                          <span className="text-blue-600">Last Update:</span>
                          <span className="font-medium">{selectedShipment.lastUpdateTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {selectedShipment.riskScore !== undefined && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-yellow-900 mb-3">Risk Assessment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Risk Score:</span>
                        <span className={getRiskScoreBadge(selectedShipment.riskScore)}>
                          {selectedShipment.riskScore}/10
                        </span>
                      </div>
                      {selectedShipment.predictedDelay && selectedShipment.predictedDelay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-yellow-600">Predicted Delay:</span>
                          <span className="font-medium text-orange-600">+{selectedShipment.predictedDelay} hours</span>
                        </div>
                      )}
                      {selectedShipment.carbonFootprint && (
                        <div className="flex justify-between">
                          <span className="text-yellow-600">Carbon Footprint:</span>
                          <span className="font-medium">{selectedShipment.carbonFootprint} kg CO₂</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Tracking Timeline</h4>
                  <div className="space-y-4">
                    {selectedShipment.trackingEvents.map((event, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getEventIcon(event.status)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{event.event}</div>
                          <div className="text-xs text-gray-500">
                            {event.timestamp} • {event.location}
                          </div>
                          {event.details && (
                            <div className="text-xs text-orange-600 mt-1">{event.details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Route Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Origin:</span>
                      <div className="font-medium">{selectedShipment.origin}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Destination:</span>
                      <div className="font-medium">{selectedShipment.destination}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span>{selectedShipment.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Time:</span>
                      <span>{selectedShipment.pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Window:</span>
                      <span>{selectedShipment.deliveryWindow}</span>
                    </div>
                  </div>
                </div>

                {selectedShipment.specialInstructions && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-orange-900 mb-2">Special Instructions</h4>
                    <div className="text-sm text-orange-800">
                      {selectedShipment.specialInstructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex space-x-3">
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Update
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <MapIcon className="h-4 w-4 mr-2" />
                  View Map
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Advanced Analytics Tab */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Average Transit Time</p>
                    <p className="text-2xl font-bold text-blue-900">2.3 days</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MapIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Route Efficiency</p>
                    <p className="text-2xl font-bold text-green-900">94.2%</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Cost per Mile</p>
                    <p className="text-2xl font-bold text-purple-900">$2.34</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {selectedTab === 'notifications' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                        notification.severity === 'error' ? 'bg-red-100 text-red-800' :
                        notification.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        notification.severity === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.severity}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => {
                        const updatedNotifications = notifications.map(n =>
                          n.id === notification.id ? { ...n, read: true } : n
                        );
                        setNotifications(updatedNotifications);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {selectedTab === 'documents' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Shipment Documents</h3>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                Upload Document
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShipments.flatMap(shipment => 
                shipment.documents?.map(doc => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <ShareIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) || []
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapView && mapShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-2 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white h-[95vh]">
            <div className="mt-3 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Live Navigation - {mapShipment.id}
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
