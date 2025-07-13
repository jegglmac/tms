'use client';

import React, { useState } from 'react';
import {
  TruckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CameraIcon,
  ClockIcon as DeliveryClockIcon,
  SignalIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  RadioIcon,
  ComputerDesktopIcon,
  CloudIcon,
  ShieldCheckIcon,
  BoltIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area
} from 'recharts';

// Mock data for fleet summary
const fleetOverview = {
  totalVehicles: 55,
  activeVehicles: 52,
  inMaintenanceVehicles: 3,
  totalMileage: 2847563,
  monthlyMileage: 185420,
  averageAge: 4.2,
  fleetValue: 2850000,
  utilizationRate: 87.3
};

const vehicleBreakdown = [
  { category: 'Heavy Trucks', count: 25, percentage: 45.5, avgMileage: 125000 },
  { category: 'Medium Trucks', count: 15, percentage: 27.3, avgMileage: 98000 },
  { category: 'Light Trucks', count: 8, percentage: 14.5, avgMileage: 75000 },
  { category: 'Vans', count: 7, percentage: 12.7, avgMileage: 85000 }
];

const performanceMetrics = [
  { metric: 'On-Time Deliveries', value: 94.2, target: 95.0, status: 'warning' },
  { metric: 'Fuel Efficiency', value: 8.4, target: 8.0, status: 'good', unit: 'mpg' },
  { metric: 'Fleet Utilization', value: 87.3, target: 85.0, status: 'good' },
  { metric: 'Maintenance Compliance', value: 96.8, target: 98.0, status: 'warning' },
  { metric: 'Safety Score', value: 98.1, target: 95.0, status: 'excellent' },
  { metric: 'Driver Satisfaction', value: 91.5, target: 90.0, status: 'good' }
];

const monthlyTrends = [
  { month: 'Jan', trips: 1200, revenue: 125000, costs: 95000, mileage: 175000, utilization: 85.2 },
  { month: 'Feb', trips: 1350, revenue: 142000, costs: 98000, mileage: 182000, utilization: 86.1 },
  { month: 'Mar', trips: 1450, revenue: 155000, costs: 102000, mileage: 189000, utilization: 87.4 },
  { month: 'Apr', trips: 1580, revenue: 168000, costs: 108000, mileage: 195000, utilization: 88.2 },
  { month: 'May', trips: 1620, revenue: 172000, costs: 112000, mileage: 188000, utilization: 87.8 },
  { month: 'Jun', trips: 1750, revenue: 185000, costs: 118000, mileage: 185420, utilization: 87.3 }
];

const topPerformers = [
  { vehicle: 'TMS-001', driver: 'John Smith', trips: 45, onTime: 98, efficiency: 8.9, revenue: 12500 },
  { vehicle: 'TMS-015', driver: 'Maria Garcia', trips: 52, onTime: 96, efficiency: 8.7, revenue: 14200 },
  { vehicle: 'TMS-023', driver: 'David Johnson', trips: 41, onTime: 94, efficiency: 8.5, revenue: 11800 },
  { vehicle: 'TMS-032', driver: 'Sarah Wilson', trips: 47, onTime: 97, efficiency: 8.8, revenue: 13100 },
  { vehicle: 'TMS-044', driver: 'Michael Brown', trips: 39, onTime: 95, efficiency: 8.6, revenue: 10900 }
];

const maintenanceAlerts = [
  { vehicle: 'TMS-012', type: 'Oil Change', dueDate: '2025-07-15', priority: 'medium' },
  { vehicle: 'TMS-027', type: 'Brake Inspection', dueDate: '2025-07-18', priority: 'high' },
  { vehicle: 'TMS-035', type: 'DOT Inspection', dueDate: '2025-07-20', priority: 'critical' },
  { vehicle: 'TMS-041', type: 'Tire Rotation', dueDate: '2025-07-22', priority: 'low' },
  { vehicle: 'TMS-048', type: 'Transmission Service', dueDate: '2025-07-25', priority: 'high' }
];

const costAnalysis = [
  { category: 'Fuel', amount: 52000, percentage: 44.1, trend: 'up' },
  { category: 'Maintenance', amount: 29000, percentage: 24.6, trend: 'down' },
  { category: 'Insurance', amount: 17500, percentage: 14.8, trend: 'stable' },
  { category: 'Driver Wages', amount: 11600, percentage: 9.8, trend: 'up' },
  { category: 'Licensing & Permits', amount: 4200, percentage: 3.6, trend: 'stable' },
  { category: 'Other', amount: 3700, percentage: 3.1, trend: 'down' }
];

// Shippers/Customers Data - Starting point of TMS data flow
const topShippers = [
  { 
    id: 'SHP001', 
    name: 'Global Manufacturing Corp', 
    type: 'Shipper',
    totalLoads: 1250, 
    revenue: 485000, 
    avgLoadValue: 388,
    rating: 4.8,
    priority: 'Premium',
    contact: 'sarah.johnson@globalmanuf.com',
    phone: '+1 (555) 123-4567',
    activeLoads: 45,
    onTimePickup: 96.2
  },
  { 
    id: 'CUS002', 
    name: 'Regional Retail Chain', 
    type: 'Customer',
    totalLoads: 890, 
    revenue: 325000, 
    avgLoadValue: 365,
    rating: 4.6,
    priority: 'Standard',
    contact: 'mike.rodriguez@retailchain.com',
    phone: '+1 (555) 234-5678',
    activeLoads: 32,
    onTimePickup: 94.5
  },
  { 
    id: 'SHP003', 
    name: 'Tech Distribution LLC', 
    type: 'Shipper',
    totalLoads: 675, 
    revenue: 298000, 
    avgLoadValue: 441,
    rating: 4.9,
    priority: 'Premium',
    contact: 'emma.davis@techdist.com',
    phone: '+1 (555) 345-6789',
    activeLoads: 28,
    onTimePickup: 98.1
  },
  { 
    id: 'CUS004', 
    name: 'Food & Beverage Co', 
    type: 'Customer',
    totalLoads: 1120, 
    revenue: 415000, 
    avgLoadValue: 370,
    rating: 4.7,
    priority: 'Standard',
    contact: 'david.wilson@foodbev.com',
    phone: '+1 (555) 456-7890',
    activeLoads: 52,
    onTimePickup: 95.8
  },
  { 
    id: 'SHP005', 
    name: 'Industrial Supplies Inc', 
    type: 'Shipper',
    totalLoads: 445, 
    revenue: 195000, 
    avgLoadValue: 438,
    rating: 4.5,
    priority: 'Standard',
    contact: 'lisa.brown@indsupplies.com',
    phone: '+1 (555) 567-8901',
    activeLoads: 18,
    onTimePickup: 92.3
  }
];

const shipperMetrics = [
  { metric: 'Total Active Shippers', value: 127, change: '+8.5%', trend: 'up' },
  { metric: 'Average Load Value', value: '$392', change: '+12.3%', trend: 'up' },
  { metric: 'Customer Retention Rate', value: '94.8%', change: '+2.1%', trend: 'up' },
  { metric: 'New Customer Acquisition', value: 15, change: '+25.0%', trend: 'up' },
  { metric: 'Average Response Time', value: '1.2 hrs', change: '-15.0%', trend: 'down' },
  { metric: 'Load Acceptance Rate', value: '96.3%', change: '+1.8%', trend: 'up' }
];

const loadsByRegion = [
  { region: 'Northeast', loads: 1850, revenue: 485000, shippers: 32 },
  { region: 'Southeast', loads: 1650, revenue: 425000, shippers: 28 },
  { region: 'Midwest', loads: 1420, revenue: 385000, shippers: 25 },
  { region: 'Southwest', loads: 1280, revenue: 325000, shippers: 22 },
  { region: 'West Coast', loads: 1100, revenue: 295000, shippers: 20 }
];

// Final Delivery Data - Completion stage of TMS data flow
const recentDeliveries = [
  {
    id: 'DEL001',
    loadId: 'LD-2025-1235',
    customer: 'Global Manufacturing Corp',
    driver: 'John Smith',
    vehicle: 'TMS-001',
    destination: 'Chicago, IL',
    deliveryDate: '2025-07-12',
    deliveryTime: '14:30',
    status: 'Completed',
    podReceived: true,
    customerRating: 5,
    customerFeedback: 'Excellent service, on-time delivery',
    signedBy: 'Mike Johnson',
    photos: 3,
    damages: false,
    invoiceAmount: 2850
  },
  {
    id: 'DEL002',
    loadId: 'LD-2025-1236',
    customer: 'Tech Distribution LLC',
    driver: 'Maria Garcia',
    vehicle: 'TMS-015',
    destination: 'Austin, TX',
    deliveryDate: '2025-07-12',
    deliveryTime: '11:15',
    status: 'Completed',
    podReceived: true,
    customerRating: 5,
    customerFeedback: 'Professional driver, cargo in perfect condition',
    signedBy: 'Sarah Davis',
    photos: 2,
    damages: false,
    invoiceAmount: 3200
  },
  {
    id: 'DEL003',
    loadId: 'LD-2025-1237',
    customer: 'Regional Retail Chain',
    driver: 'David Johnson',
    vehicle: 'TMS-023',
    destination: 'Miami, FL',
    deliveryDate: '2025-07-11',
    deliveryTime: '16:45',
    status: 'Completed',
    podReceived: true,
    customerRating: 4,
    customerFeedback: 'Good service, minor delay but communicated well',
    signedBy: 'Carlos Rodriguez',
    photos: 1,
    damages: false,
    invoiceAmount: 1950
  },
  {
    id: 'DEL004',
    loadId: 'LD-2025-1238',
    customer: 'Food & Beverage Co',
    driver: 'Sarah Wilson',
    vehicle: 'TMS-032',
    destination: 'Denver, CO',
    deliveryDate: '2025-07-11',
    deliveryTime: '09:20',
    status: 'Issue Reported',
    podReceived: true,
    customerRating: 3,
    customerFeedback: 'Package had minor damage, but driver handled professionally',
    signedBy: 'Jennifer Lee',
    photos: 4,
    damages: true,
    invoiceAmount: 2400
  },
  {
    id: 'DEL005',
    loadId: 'LD-2025-1239',
    customer: 'Industrial Supplies Inc',
    driver: 'Michael Brown',
    vehicle: 'TMS-044',
    destination: 'Seattle, WA',
    deliveryDate: '2025-07-10',
    deliveryTime: '13:10',
    status: 'Completed',
    podReceived: true,
    customerRating: 5,
    customerFeedback: 'Outstanding service, early delivery',
    signedBy: 'Robert Kim',
    photos: 2,
    damages: false,
    invoiceAmount: 4100
  }
];

const deliveryMetrics = [
  { metric: 'Total Deliveries (30 days)', value: 1847, change: '+5.2%', trend: 'up' },
  { metric: 'On-Time Delivery Rate', value: '94.2%', change: '+1.8%', trend: 'up' },
  { metric: 'Average Delivery Rating', value: '4.7/5', change: '+0.2', trend: 'up' },
  { metric: 'POD Collection Rate', value: '98.5%', change: '+2.1%', trend: 'up' },
  { metric: 'Damage Claims', value: '0.8%', change: '-0.3%', trend: 'down' },
  { metric: 'Customer Satisfaction', value: '96.1%', change: '+1.5%', trend: 'up' }
];

const deliveryStatusBreakdown = [
  { status: 'Completed', count: 1742, percentage: 94.3, color: '#10B981' },
  { status: 'In Transit', count: 78, percentage: 4.2, color: '#3B82F6' },
  { status: 'Issue Reported', count: 15, percentage: 0.8, color: '#F59E0B' },
  { status: 'Failed Delivery', count: 12, percentage: 0.7, color: '#EF4444' }
];

const customerFeedbackSummary = [
  { rating: 5, count: 1254, percentage: 72.0 },
  { rating: 4, count: 312, percentage: 17.9 },
  { rating: 3, count: 98, percentage: 5.6 },
  { rating: 2, count: 45, percentage: 2.6 },
  { rating: 1, count: 33, percentage: 1.9 }
];

// Carrier/Driver Systems Integration - TMS middleware layer
const carrierSystems = [
  {
    id: 'CS001',
    name: 'PrimeTrucking Fleet',
    type: 'Third-Party Carrier',
    vehicles: 125,
    activeDrivers: 98,
    integrationStatus: 'Connected',
    apiVersion: 'v2.1',
    lastSync: '2025-07-12T14:25:00Z',
    trackingAccuracy: 98.5,
    dataUptime: 99.2,
    monthlyLoads: 485,
    onTimePerformance: 94.8,
    communicationMethod: 'API + Mobile App'
  },
  {
    id: 'CS002', 
    name: 'LogiTrans Network',
    type: 'Partner Carrier',
    vehicles: 89,
    activeDrivers: 76,
    integrationStatus: 'Connected',
    apiVersion: 'v1.8',
    lastSync: '2025-07-12T14:20:00Z',
    trackingAccuracy: 96.2,
    dataUptime: 97.8,
    monthlyLoads: 312,
    onTimePerformance: 92.1,
    communicationMethod: 'EDI + GPS Tracking'
  },
  {
    id: 'CS003',
    name: 'SwiftMove Express',
    type: 'Contracted Carrier',
    vehicles: 67,
    activeDrivers: 58,
    integrationStatus: 'Limited',
    apiVersion: 'v1.5',
    lastSync: '2025-07-12T13:45:00Z',
    trackingAccuracy: 89.7,
    dataUptime: 95.1,
    monthlyLoads: 198,
    onTimePerformance: 89.3,
    communicationMethod: 'Manual Updates + Calls'
  },
  {
    id: 'CS004',
    name: 'Regional Freight Co',
    type: 'Spot Market Carrier', 
    vehicles: 45,
    activeDrivers: 42,
    integrationStatus: 'Pending',
    apiVersion: 'N/A',
    lastSync: '2025-07-11T16:30:00Z',
    trackingAccuracy: 75.0,
    dataUptime: 87.5,
    monthlyLoads: 89,
    onTimePerformance: 85.7,
    communicationMethod: 'Phone + Email'
  }
];

const driverSystems = [
  {
    driverId: 'DRV001',
    name: 'John Smith',
    carrier: 'PrimeTrucking Fleet',
    vehicle: 'TMS-001',
    mobileDevice: 'iPhone 14 Pro',
    appVersion: 'TMS Driver v3.2.1',
    gpsAccuracy: 99.1,
    connectionStatus: 'Online',
    lastUpdate: '2025-07-12T14:28:00Z',
    currentLocation: 'Chicago, IL',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    speed: 65, // mph
    heading: 'Northeast',
    cellTower: 'CHI-NW-001',
    signalStrength: 'Excellent (-65 dBm)',
    batteryLevel: 78,
    dataUsage: '2.4 MB today',
    trackingMethod: 'GPS + Cell + WiFi',
    hoursOfService: '8.5/11',
    nextBreakRequired: '2.5 hrs',
    documentsCompliance: 98.5,
    safetyScore: 96.8,
    geofenceStatus: 'Inside delivery zone',
    emergencyContactEnabled: true
  },
  {
    driverId: 'DRV002',
    name: 'Maria Garcia',
    carrier: 'PrimeTrucking Fleet',
    vehicle: 'TMS-015',
    mobileDevice: 'Samsung Galaxy S23',
    appVersion: 'TMS Driver v3.2.1',
    gpsAccuracy: 97.8,
    connectionStatus: 'Online',
    lastUpdate: '2025-07-12T14:27:00Z',
    currentLocation: 'Austin, TX',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    speed: 0, // Stopped for delivery
    heading: 'Stationary',
    cellTower: 'AUS-CTR-005',
    signalStrength: 'Good (-75 dBm)',
    batteryLevel: 45,
    dataUsage: '1.8 MB today',
    trackingMethod: 'GPS + Cell',
    hoursOfService: '6.2/11',
    nextBreakRequired: '4.8 hrs',
    documentsCompliance: 99.2,
    safetyScore: 98.1,
    geofenceStatus: 'At customer location',
    emergencyContactEnabled: true
  },
  {
    driverId: 'DRV003',
    name: 'David Johnson',
    carrier: 'LogiTrans Network',
    vehicle: 'LTN-032',
    mobileDevice: 'iPhone 13',
    appVersion: 'LogiDriver v2.8.5',
    gpsAccuracy: 95.4,
    connectionStatus: 'Online',
    lastUpdate: '2025-07-12T14:25:00Z',
    currentLocation: 'Miami, FL',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    speed: 55, // mph
    heading: 'South',
    cellTower: 'MIA-SE-012',
    signalStrength: 'Fair (-85 dBm)',
    batteryLevel: 62,
    dataUsage: '3.1 MB today',
    trackingMethod: 'GPS + Cell',
    hoursOfService: '10.1/11',
    nextBreakRequired: '0.9 hrs',
    documentsCompliance: 94.7,
    safetyScore: 92.5,
    geofenceStatus: 'On route',
    emergencyContactEnabled: true
  },
  {
    driverId: 'DRV004',
    name: 'Sarah Wilson',
    carrier: 'SwiftMove Express',
    vehicle: 'SME-018',
    mobileDevice: 'iPad Mini',
    appVersion: 'SwiftTracker v1.9.2',
    gpsAccuracy: 88.9,
    connectionStatus: 'Intermittent',
    lastUpdate: '2025-07-12T14:15:00Z',
    currentLocation: 'Denver, CO',
    coordinates: { lat: 39.7392, lng: -104.9903 },
    speed: 0, // Stopped
    heading: 'Stationary',
    cellTower: 'DEN-W-008',
    signalStrength: 'Weak (-95 dBm)',
    batteryLevel: 23,
    dataUsage: '0.9 MB today',
    trackingMethod: 'Cell only (GPS unavailable)',
    hoursOfService: '7.8/11',
    nextBreakRequired: '3.2 hrs',
    documentsCompliance: 89.3,
    safetyScore: 90.2,
    geofenceStatus: 'Outside designated area',
    emergencyContactEnabled: false
  }
];

const integrationMetrics = [
  { metric: 'System Uptime', value: '99.1%', change: '+0.3%', trend: 'up' },
  { metric: 'Real-time Data Accuracy', value: '96.8%', change: '+2.1%', trend: 'up' },
  { metric: 'API Response Time', value: '145ms', change: '-12ms', trend: 'down' },
  { metric: 'Driver App Adoption', value: '94.5%', change: '+5.8%', trend: 'up' },
  { metric: 'Data Sync Success Rate', value: '98.2%', change: '+1.4%', trend: 'up' },
  { metric: 'Communication Efficiency', value: '92.7%', change: '+3.2%', trend: 'up' }
];

const systemAlerts = [
  {
    id: 'ALT001',
    type: 'Connection Issue',
    severity: 'Medium',
    system: 'SwiftMove Express',
    message: 'Intermittent GPS tracking for 3 vehicles',
    timestamp: '2025-07-12T14:15:00Z',
    status: 'Investigating'
  },
  {
    id: 'ALT002',
    type: 'API Limit',
    severity: 'Low',
    system: 'LogiTrans Network',
    message: 'Approaching daily API call limit (85%)',
    timestamp: '2025-07-12T13:30:00Z',
    status: 'Monitoring'
  },
  {
    id: 'ALT003',
    type: 'Driver Offline',
    severity: 'High',
    system: 'Regional Freight Co',
    message: 'Driver DRV-RF-045 offline for 2+ hours',
    timestamp: '2025-07-12T12:20:00Z',
    status: 'Escalated'
  },
  {
    id: 'ALT004',
    type: 'System Update',
    severity: 'Info',
    system: 'TMS Core',
    message: 'Scheduled maintenance window tonight 23:00-01:00',
    timestamp: '2025-07-12T09:00:00Z',
    status: 'Scheduled'
  }
];

const communicationChannels = [
  { channel: 'Mobile App', usage: 68.5, reliability: 98.2, responseTime: '< 1 min' },
  { channel: 'GPS/ELD Integration', usage: 89.2, reliability: 96.8, responseTime: '< 30 sec' },
  { channel: 'API Webhooks', usage: 78.9, reliability: 99.1, responseTime: '< 5 sec' },
  { channel: 'SMS/Text', usage: 45.3, reliability: 94.5, responseTime: '< 2 min' },
  { channel: 'Voice Calls', usage: 23.7, reliability: 87.3, responseTime: '< 30 sec' },
  { channel: 'Email Updates', usage: 34.8, reliability: 92.1, responseTime: '< 5 min' }
];

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface FleetSummaryReportProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function FleetSummaryReport({ isModal = false, onClose }: FleetSummaryReportProps) {
  const [dateRange, setDateRange] = useState('30');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      case 'Premium': return 'text-purple-600 bg-purple-100';
      case 'Standard': return 'text-blue-600 bg-blue-100';
      case 'Basic': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Transit': return 'text-blue-600 bg-blue-100';
      case 'Issue Reported': return 'text-yellow-600 bg-yellow-100';
      case 'Failed Delivery': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getIntegrationStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'text-green-600 bg-green-100';
      case 'Limited': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'text-green-600 bg-green-100';
      case 'Intermittent': return 'text-yellow-600 bg-yellow-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      case 'Info': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
      case 'down': return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const handleExport = () => {
    console.log(`Exporting fleet summary report as ${exportFormat}`);
    // Implementation for actual export functionality
  };

  const handlePrint = () => {
    window.print();
    showNotification('Print dialog opened');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Fleet Summary Report - TMS',
      text: 'Comprehensive fleet operations and performance overview report.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification('Report shared successfully');
      } catch (err) {
        console.log('Error sharing:', err);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Report link copied to clipboard');
  };

  const exportToPDF = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotification('PDF export completed');
    }, 2000);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Fleet Summary Report'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Report Period:', `Last ${dateRange} days`],
      [''],
      ['Fleet Overview'],
      ['Metric', 'Value'],
      ['Total Vehicles', fleetOverview.totalVehicles],
      ['Active Vehicles', fleetOverview.activeVehicles],
      ['In Maintenance', fleetOverview.inMaintenanceVehicles],
      ['Total Mileage', fleetOverview.totalMileage],
      ['Monthly Mileage', fleetOverview.monthlyMileage],
      ['Average Age', fleetOverview.averageAge],
      ['Fleet Value', fleetOverview.fleetValue],
      ['Utilization Rate', fleetOverview.utilizationRate],
      [''],
      ['Shippers & Customers'],
      ['Company', 'Type', 'Total Loads', 'Revenue', 'Active Loads', 'Rating', 'Priority'],        ...topShippers.map(shipper => [
          shipper.name, shipper.type, shipper.totalLoads, shipper.revenue, 
          shipper.activeLoads, shipper.rating, shipper.priority
        ]),
        [''],
        ['Final Delivery Data'],
        ['Delivery ID', 'Customer', 'Status', 'Rating', 'POD Received', 'Invoice Amount'],
        ...recentDeliveries.map(delivery => [
          delivery.id, delivery.customer, delivery.status, delivery.customerRating, 
          delivery.podReceived ? 'Yes' : 'No', delivery.invoiceAmount
        ]),
        [''],
        ['Carrier/Driver Systems Integration'],
        ['System ID', 'Name', 'Type', 'Vehicles', 'Status', 'Uptime', 'Performance'],
        ...carrierSystems.map(system => [
          system.id, system.name, system.type, system.vehicles, 
          system.integrationStatus, system.dataUptime + '%', system.onTimePerformance + '%'
        ]),
        [''],
      ['Vehicle Breakdown'],
      ['Category', 'Count', 'Percentage'],
      ...vehicleBreakdown.map(item => [item.category, item.count, item.percentage]),
      [''],
      ['Load Distribution by Region'],
      ['Region', 'Loads', 'Revenue', 'Shippers'],
      ...loadsByRegion.map(region => [region.region, region.loads, region.revenue, region.shippers]),
      [''],
      ['Cost Analysis'],
      ['Category', 'Amount', 'Percentage', 'Trend'],
      ...costAnalysis.map(item => [item.category, item.amount, item.percentage, item.trend])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-summary-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV export completed');
  };

  const exportToJSON = () => {
    const jsonData = {
      reportTitle: 'Fleet Summary Report',
      generatedDate: new Date().toISOString(),
      reportPeriod: `Last ${dateRange} days`,
      fleetOverview,
      shippersCustomers: {
        topShippers,
        shipperMetrics,
        loadsByRegion
      },
      finalDeliveryData: {
        recentDeliveries,
        deliveryMetrics,
        deliveryStatusBreakdown,
        customerFeedbackSummary
      },
      carrierDriverSystems: {
        carrierSystems,
        driverSystems,
        integrationMetrics,
        systemAlerts,
        communicationChannels
      },
      vehicleBreakdown,
      monthlyTrends,
      maintenanceAlerts,
      costAnalysis,
      topPerformers,
      insights: [
        `Fleet utilization rate at ${fleetOverview.utilizationRate}%`,
        `${fleetOverview.activeVehicles} vehicles currently active`,
        `${fleetOverview.inMaintenanceVehicles} vehicles in maintenance`,
        `${topShippers.length} active shipper/customer partnerships`,
        `${recentDeliveries.length} recent deliveries completed`,
        `${deliveryMetrics[1].value} on-time delivery rate`,
        `${carrierSystems.length} integrated carrier systems`,
        `${driverSystems.length} active driver connections`,
        `Total fleet value: $${fleetOverview.fleetValue.toLocaleString()}`
      ]
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-summary-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('JSON export completed');
  };

  const reportContent = (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <TruckIcon className="w-8 h-8 mr-3 text-blue-600" />
              Fleet Summary Report
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of fleet operations and performance</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarDaysIcon className="w-4 h-4 mr-1" />
              Period: Last {dateRange} days
              <ClockIcon className="w-4 h-4 ml-4 mr-1" />
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                ) : (
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                )}
                Download
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        exportToPDF();
                        setShowDownloadMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={() => {
                        exportToCSV();
                        setShowDownloadMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as CSV
                    </button>
                    <button
                      onClick={() => {
                        exportToJSON();
                        setShowDownloadMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <TruckIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{fleetOverview.totalVehicles}</p>
              <p className="text-xs text-green-600">
                {fleetOverview.activeVehicles} active, {fleetOverview.inMaintenanceVehicles} in maintenance
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fleet Value</p>
              <p className="text-2xl font-bold text-gray-900">${(fleetOverview.fleetValue / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-gray-500">
                Average age: {fleetOverview.averageAge} years
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <MapPinIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Mileage</p>
              <p className="text-2xl font-bold text-gray-900">{(fleetOverview.totalMileage / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-gray-500">
                This month: {fleetOverview.monthlyMileage.toLocaleString()} mi
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900">{fleetOverview.utilizationRate}%</p>
              <p className="text-xs text-green-600">
                Above target (85%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shippers/Customers Overview - TMS Data Flow Starting Point */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BuildingOfficeIcon className="w-6 h-6 mr-2 text-blue-600" />
              Shippers & Customers
            </h2>
            <p className="text-sm text-gray-600 mt-1">Data flow origin: Customer requests → Load management → Fleet operations</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1" />
              {topShippers.length} Active Partners
            </div>
          </div>
        </div>

        {/* Shipper Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {shipperMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">{metric.metric}</h3>
                <span className={`text-xs font-medium ${getChangeColor(metric.change)}`}>
                  {metric.change}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                {metric.trend && getTrendIcon(metric.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Top Shippers/Customers Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Loads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topShippers.map((shipper, index) => (
                <tr key={shipper.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{shipper.name}</div>
                        <div className="text-sm text-gray-500">{shipper.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      shipper.type === 'Shipper' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {shipper.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipper.totalLoads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${shipper.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipper.activeLoads}</div>
                    <div className="text-xs text-gray-500">{shipper.onTimePickup}% on-time</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(shipper.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">{shipper.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(shipper.priority)}`}>
                      {shipper.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span className="truncate max-w-xs">{shipper.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{shipper.phone}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Delivery Data - TMS Data Flow Completion */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <DocumentCheckIcon className="w-6 h-6 mr-2 text-green-600" />
              Final Delivery Data
            </h2>
            <p className="text-sm text-gray-600 mt-1">TMS data flow completion: Proof of delivery → Customer feedback → Invoice processing</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="w-4 h-4 mr-1" />
              {recentDeliveries.length} Recent Completions
            </div>
          </div>
        </div>

        {/* Delivery Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {deliveryMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">{metric.metric}</h3>
                <span className={`text-xs font-medium ${getChangeColor(metric.change)}`}>
                  {metric.change}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                {metric.trend && getTrendIcon(metric.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Deliveries Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver & Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POD & Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDeliveries.map((delivery, index) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentCheckIcon className="w-5 h-5 text-green-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{delivery.id}</div>
                        <div className="text-sm text-gray-500">{delivery.loadId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{delivery.customer}</div>
                    <div className="text-sm text-gray-500">Signed by: {delivery.signedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{delivery.driver}</div>
                    <div className="text-sm text-gray-500">{delivery.vehicle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {delivery.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{delivery.deliveryDate}</div>
                    <div className="text-sm text-gray-500">{delivery.deliveryTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDeliveryStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                    {delivery.damages && (
                      <div className="text-xs text-red-600 mt-1">Damage reported</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRatingStars(delivery.customerRating)}
                      <span className="ml-1 text-sm text-gray-600">{delivery.customerRating}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                      {delivery.customerFeedback}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 mb-1">
                      <ClipboardDocumentCheckIcon className={`w-4 h-4 ${delivery.podReceived ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-xs text-gray-600">POD: {delivery.podReceived ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <CameraIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-600">{delivery.photos} photos</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      ${delivery.invoiceAmount.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery Status Breakdown and Customer Feedback Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Status Breakdown</h3>
            <div className="space-y-3">
              {deliveryStatusBreakdown.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{status.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{status.count.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{status.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Feedback Distribution</h3>
            <div className="space-y-3">
              {customerFeedbackSummary.map((feedback, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      {getRatingStars(feedback.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{feedback.rating} Star{feedback.rating !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{feedback.count.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{feedback.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carrier/Driver Systems Integration - TMS Middleware Layer */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <SignalIcon className="w-6 h-6 mr-2 text-blue-600" />
              Carrier/Driver Systems Integration
            </h2>
            <p className="text-sm text-gray-600 mt-1">TMS middleware: Fleet operations ↔ Real-time tracking ↔ Driver communication systems</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ComputerDesktopIcon className="w-4 h-4 mr-1" />
              {carrierSystems.length} Systems
            </div>
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="w-4 h-4 mr-1" />
              {driverSystems.length} Drivers
            </div>
          </div>
        </div>

        {/* Integration Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {integrationMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">{metric.metric}</h3>
                <span className={`text-xs font-medium ${getChangeColor(metric.change)}`}>
                  {metric.change}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-xl font-bold text-gray-900">{metric.value}</span>
                {metric.trend && getTrendIcon(metric.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Carrier Systems Table */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Integrated Carrier Systems</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fleet Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carrierSystems.map((system, index) => (
                  <tr key={system.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CloudIcon className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{system.name}</div>
                          <div className="text-sm text-gray-500">{system.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        system.type.includes('Third-Party') ? 'bg-purple-100 text-purple-800' :
                        system.type.includes('Partner') ? 'bg-blue-100 text-blue-800' :
                        system.type.includes('Contracted') ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {system.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.vehicles} vehicles</div>
                      <div className="text-sm text-gray-500">{system.activeDrivers} active drivers</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getIntegrationStatusColor(system.integrationStatus)}`}>
                        {system.integrationStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        API: {system.apiVersion || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.onTimePerformance}% on-time</div>
                      <div className="text-sm text-gray-500">{system.monthlyLoads} loads/month</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.dataUptime}% uptime</div>
                      <div className="text-sm text-gray-500">{system.trackingAccuracy}% GPS accuracy</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.communicationMethod}</div>
                      <div className="text-xs text-gray-500">
                        Last sync: {new Date(system.lastSync).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver Systems Table */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Driver Connections</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier & Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device & Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connection Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location & Movement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cell Tower & Signal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery & Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {driverSystems.map((driver, index) => (
                  <tr key={driver.driverId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-green-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.driverId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.carrier}</div>
                      <div className="text-sm text-gray-500">{driver.vehicle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.mobileDevice}</div>
                      <div className="text-sm text-gray-500">{driver.appVersion}</div>
                      <div className="text-xs text-blue-600">{driver.trackingMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConnectionStatusColor(driver.connectionStatus)}`}>
                        {driver.connectionStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        GPS: {driver.gpsAccuracy}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Emergency: {driver.emergencyContactEnabled ? '✓ Enabled' : '✗ Disabled'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.currentLocation}</div>
                      <div className="text-xs text-gray-500">
                        Speed: {driver.speed} mph {driver.heading}
                      </div>
                      <div className="text-xs text-blue-600">
                        {driver.geofenceStatus}
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {new Date(driver.lastUpdate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Tower: {driver.cellTower}</div>
                      <div className="text-xs text-gray-500">{driver.signalStrength}</div>
                      <div className="text-xs text-gray-600">
                        Lat: {driver.coordinates?.lat.toFixed(4)}, Lng: {driver.coordinates?.lng.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <BoltIcon className="w-4 h-4 text-green-500 mr-1" />
                          {driver.batteryLevel}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Data: {driver.dataUsage}</div>
                      <div className="text-xs text-gray-500">HOS: {driver.hoursOfService}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-1" />
                          {driver.safetyScore}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Docs: {driver.documentsCompliance}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts and Communication Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts & Status</h3>
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={alert.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAlertSeverityColor(alert.severity)} mr-2`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{alert.type}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="ml-7">
                    <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">System: {alert.system}</span>
                      <span className="text-xs font-medium text-blue-600">{alert.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Channels</h3>
            <div className="space-y-3">
              {communicationChannels.map((channel, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {channel.channel.includes('Mobile') && <DevicePhoneMobileIcon className="w-5 h-5 text-blue-500 mr-2" />}
                      {channel.channel.includes('GPS') && <RadioIcon className="w-5 h-5 text-green-500 mr-2" />}
                      {channel.channel.includes('API') && <BoltIcon className="w-5 h-5 text-purple-500 mr-2" />}
                      {channel.channel.includes('SMS') && <ChatBubbleLeftRightIcon className="w-5 h-5 text-yellow-500 mr-2" />}
                      {channel.channel.includes('Voice') && <DevicePhoneMobileIcon className="w-5 h-5 text-red-500 mr-2" />}
                      {channel.channel.includes('Email') && <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2" />}
                      <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
                    </div>
                    <span className="text-xs text-gray-500">{channel.responseTime}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-medium">{channel.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${channel.usage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Reliability: {channel.reliability}%</span>
                      <span>Response: {channel.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Load Distribution by Region */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Load Distribution by Region</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {loadsByRegion.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: colors[index] }}></div>
                    <div>
                      <p className="font-medium text-gray-900">{region.region}</p>
                      <p className="text-sm text-gray-600">{region.shippers} shippers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{region.loads.toLocaleString()} loads</p>
                    <p className="text-sm text-green-600">${region.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loadsByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'loads' ? `${value.toLocaleString()} loads` : `$${value.toLocaleString()}`,
                  name === 'loads' ? 'Total Loads' : 'Revenue'
                ]} />
                <Bar dataKey="loads" fill="#3B82F6" />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vehicle Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Fleet Composition</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {vehicleBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: colors[index] }}></div>
                    <div>
                      <p className="font-medium text-gray-900">{category.category}</p>
                      <p className="text-sm text-gray-600">Avg: {category.avgMileage.toLocaleString()} miles</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{category.count}</p>
                    <p className="text-sm text-gray-600">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({category, percentage}) => `${category}: ${percentage}%`}
                >
                  {vehicleBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-700">{metric.metric}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  {metric.unit && <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>}
                  {!metric.unit && <span className="text-sm text-gray-600 ml-1">%</span>}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Target: {metric.target}{metric.unit || '%'}
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue & Utilization Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : `${value}%`,
                name === 'revenue' ? 'Revenue' : 'Utilization'
              ]} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="utilization" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trips & Mileage Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="#8B5CF6" strokeWidth={2} />
              <Line type="monotone" dataKey="mileage" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Vehicles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPerformers.map((performer, index) => (
                <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{performer.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performer.driver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performer.trips}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performer.onTime}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performer.efficiency} mpg</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${performer.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Analysis & Maintenance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Analysis</h2>
          <div className="space-y-3">
            {costAnalysis.map((cost, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{cost.category}</span>
                    {getTrendIcon(cost.trend)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${cost.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{cost.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Maintenance</h2>
          <div className="space-y-3">
            {maintenanceAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.vehicle}</p>
                  <p className="text-xs text-gray-600">{alert.type}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{alert.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary & Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Key Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Fleet utilization is above target at 87.3%
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Safety scores are excellent across all vehicle categories
              </li>
              <li className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                On-time delivery rate slightly below target (94.2% vs 95%)
              </li>
              <li className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                3 vehicles currently in maintenance
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Optimize routes to improve on-time delivery rates
              </li>
              <li className="flex items-start">
                <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Schedule preventive maintenance during low-demand periods
              </li>
              <li className="flex items-start">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Consider fuel efficiency training for drivers
              </li>
              <li className="flex items-start">
                <TruckIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Evaluate ROI for additional vehicles to meet demand
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Fleet Summary Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            {reportContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {reportContent}
      
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
    </div>
  );
}
