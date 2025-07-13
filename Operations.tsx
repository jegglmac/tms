'use client';

import React, { useState } from 'react';
import {
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  BeakerIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data for operations
const maintenanceSchedule = [
  {
    id: 'MNT-001',
    vehicleId: 'TMS-001',
    vehicleName: 'Truck Alpha',
    type: 'Preventive Maintenance',
    priority: 'High',
    scheduledDate: '2025-07-15',
    estimatedDuration: '4 hours',
    description: 'Oil change, brake inspection, tire rotation',
    assignedTechnician: 'Mike Rodriguez',
    cost: 450,
    status: 'Scheduled',
    mileage: 85000,
    lastService: '2025-04-15'
  },
  {
    id: 'MNT-002',
    vehicleId: 'TMS-003',
    vehicleName: 'Van Beta',
    type: 'Repair',
    priority: 'Critical',
    scheduledDate: '2025-07-13',
    estimatedDuration: '8 hours',
    description: 'Engine diagnostic and transmission repair',
    assignedTechnician: 'Sarah Chen',
    cost: 1200,
    status: 'In Progress',
    mileage: 120000,
    lastService: '2025-06-01'
  },
  {
    id: 'MNT-003',
    vehicleId: 'TMS-005',
    vehicleName: 'Truck Gamma',
    type: 'Inspection',
    priority: 'Medium',
    scheduledDate: '2025-07-18',
    estimatedDuration: '2 hours',
    description: 'DOT annual inspection',
    assignedTechnician: 'Alex Johnson',
    cost: 200,
    status: 'Pending',
    mileage: 65000,
    lastService: '2025-05-20'
  }
];

const inventoryItems = [
  {
    id: 'INV-001',
    name: 'Engine Oil (5W-30)',
    category: 'Fluids',
    currentStock: 24,
    minStock: 10,
    maxStock: 50,
    unit: 'Quarts',
    costPerUnit: 8.50,
    supplier: 'AutoParts Plus',
    lastOrdered: '2025-07-01',
    status: 'In Stock'
  },
  {
    id: 'INV-002',
    name: 'Brake Pads (Heavy Duty)',
    category: 'Brake System',
    currentStock: 6,
    minStock: 8,
    maxStock: 20,
    unit: 'Sets',
    costPerUnit: 120.00,
    supplier: 'Commercial Brake Co.',
    lastOrdered: '2025-06-15',
    status: 'Low Stock'
  },
  {
    id: 'INV-003',
    name: 'Air Filters',
    category: 'Engine',
    currentStock: 15,
    minStock: 5,
    maxStock: 25,
    unit: 'Units',
    costPerUnit: 25.00,
    supplier: 'FilterMax',
    lastOrdered: '2025-06-28',
    status: 'In Stock'
  }
];

const workOrders = [
  {
    id: 'WO-001',
    vehicleId: 'TMS-001',
    type: 'Maintenance',
    priority: 'High',
    description: 'Replace worn brake pads and rotors',
    assignedTo: 'Mike Rodriguez',
    createdDate: '2025-07-12',
    dueDate: '2025-07-15',
    status: 'Open',
    estimatedHours: 4,
    parts: ['Brake Pads', 'Brake Rotors'],
    labor: 240,
    partsCost: 180
  },
  {
    id: 'WO-002',
    vehicleId: 'TMS-003',
    type: 'Repair',
    priority: 'Critical',
    description: 'Engine overheating - coolant system repair',
    assignedTo: 'Sarah Chen',
    createdDate: '2025-07-11',
    dueDate: '2025-07-13',
    status: 'In Progress',
    estimatedHours: 8,
    parts: ['Radiator', 'Thermostat', 'Coolant'],
    labor: 480,
    partsCost: 320
  }
];

const complianceItems = [
  {
    id: 'COMP-001',
    type: 'DOT Inspection',
    vehicleId: 'TMS-001',
    dueDate: '2025-08-15',
    status: 'Upcoming',
    description: 'Annual DOT safety inspection required',
    priority: 'High'
  },
  {
    id: 'COMP-002',
    type: 'Driver License Renewal',
    driverId: 'DRV-001',
    dueDate: '2025-09-30',
    status: 'Current',
    description: 'CDL license renewal for John Smith',
    priority: 'Medium'
  },
  {
    id: 'COMP-003',
    type: 'Insurance Review',
    vehicleId: 'Fleet',
    dueDate: '2025-07-30',
    status: 'Overdue',
    description: 'Fleet insurance policy review',
    priority: 'Critical'
  }
];

const chartData = {
  maintenanceCosts: [
    { month: 'Jan', cost: 12500, vehicles: 8 },
    { month: 'Feb', cost: 15200, vehicles: 12 },
    { month: 'Mar', cost: 9800, vehicles: 6 },
    { month: 'Apr', cost: 18600, vehicles: 15 },
    { month: 'May', cost: 14300, vehicles: 10 },
    { month: 'Jun', cost: 16750, vehicles: 13 }
  ],
  maintenanceTypes: [
    { name: 'Preventive', value: 45, color: '#10B981' },
    { name: 'Repair', value: 35, color: '#F59E0B' },
    { name: 'Emergency', value: 12, color: '#EF4444' },
    { name: 'Inspection', value: 8, color: '#3B82F6' }
  ]
};

interface OperationsProps {}

export default function Operations({}: OperationsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
    { id: 'inventory', name: 'Inventory', icon: ClipboardDocumentListIcon },
    { id: 'workorders', name: 'Work Orders', icon: DocumentTextIcon },
    { id: 'compliance', name: 'Compliance', icon: ShieldCheckIcon },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'low stock':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
            <p className="text-gray-600 mt-1">Manage fleet operations, maintenance, and compliance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowWorkOrderModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Work Order
            </button>
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Scheduled Maintenance</p>
                      <p className="text-2xl font-bold text-blue-900">12</p>
                      <p className="text-xs text-blue-700">Next 30 days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Completed Work Orders</p>
                      <p className="text-2xl font-bold text-green-900">28</p>
                      <p className="text-xs text-green-700">This month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-yellow-900">5</p>
                      <p className="text-xs text-yellow-700">Need reorder</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Monthly Costs</p>
                      <p className="text-2xl font-bold text-purple-900">$16.7K</p>
                      <p className="text-xs text-purple-700">-8% vs last month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Costs Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.maintenanceCosts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                      <Line type="monotone" dataKey="cost" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Types Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.maintenanceTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {chartData.maintenanceTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Operations Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Maintenance completed on TMS-001</p>
                      <p className="text-sm text-gray-500">Oil change and brake inspection - 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Low stock alert: Brake Pads</p>
                      <p className="text-sm text-gray-500">Only 6 sets remaining - reorder recommended</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Maintenance scheduled for TMS-005</p>
                      <p className="text-sm text-gray-500">DOT inspection scheduled for July 18th</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Maintenance Schedule</h3>
                <div className="flex space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border-gray-300 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table Container */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                          Vehicle
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                          Type & Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                          Scheduled Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                          Technician
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenanceSchedule.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center min-w-[180px]">
                              <TruckIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{item.vehicleName}</div>
                                <div className="text-sm text-gray-500">{item.vehicleId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="min-w-[160px]">
                              <div className="text-sm font-medium text-gray-900">{item.type}</div>
                              <div className="text-sm text-gray-500 truncate">{item.description}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center min-w-[100px]">
                              {getPriorityIcon(item.priority)}
                              <span className="ml-2 text-sm text-gray-900">{item.priority}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900 min-w-[110px]">
                              {new Date(item.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.estimatedDuration}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="min-w-[130px]">
                              <div className="text-sm font-medium text-gray-900">{item.assignedTechnician}</div>
                              <div className="text-xs text-gray-500">Mileage: {item.mileage.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="min-w-[100px]">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900 min-w-[80px]">
                              ${item.cost}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile-friendly cards for smaller screens */}
                <div className="block lg:hidden">
                  <div className="space-y-4 p-4">
                    {maintenanceSchedule.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <TruckIcon className="h-6 w-6 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{item.vehicleName}</div>
                              <div className="text-sm text-gray-500">{item.vehicleId}</div>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Type:</span>
                            <div className="text-gray-900">{item.type}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Priority:</span>
                            <div className="flex items-center">
                              {getPriorityIcon(item.priority)}
                              <span className="ml-1 text-gray-900">{item.priority}</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Scheduled:</span>
                            <div className="text-gray-900">{new Date(item.scheduledDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Cost:</span>
                            <div className="text-gray-900 font-medium">${item.cost}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-500">Technician:</span>
                            <div className="text-gray-900">{item.assignedTechnician}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-500">Description:</span>
                            <div className="text-gray-900 text-sm">{item.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
                <button 
                  onClick={() => setShowInventoryModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40">
                          Stock Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24">
                          Unit Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-36">
                          Supplier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-28">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventoryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap min-w-48">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-32">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap min-w-40">
                            <div className="text-sm text-gray-900">
                              {item.currentStock} / {item.maxStock} {item.unit}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  item.currentStock <= item.minStock ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-24">
                            ${item.costPerUnit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-36">
                            {item.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap min-w-28">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.id}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{item.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Unit Cost:</span>
                        <p className="font-medium">${item.costPerUnit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <p className="font-medium">{item.currentStock} / {item.maxStock} {item.unit}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              item.currentStock <= item.minStock ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(item.currentStock / item.maxStock) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Supplier:</span>
                        <p className="font-medium">{item.supplier}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Orders Tab */}
          {activeTab === 'workorders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Work Orders</h3>
                <button
                  onClick={() => setShowWorkOrderModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Work Order
                </button>
              </div>

              <div className="grid gap-6">
                {workOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h4 className="text-lg font-medium text-gray-900">{order.id}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <div className="flex items-center">
                            {getPriorityIcon(order.priority)}
                            <span className="ml-1 text-sm text-gray-600">{order.priority}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{order.description}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Vehicle</p>
                            <p className="text-sm text-gray-900">{order.vehicleId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Assigned To</p>
                            <p className="text-sm text-gray-900">{order.assignedTo}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Due Date</p>
                            <p className="text-sm text-gray-900">{new Date(order.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Cost</p>
                            <p className="text-sm text-gray-900">${order.labor + order.partsCost}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Parts:</span> {order.parts.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Compliance Management</h3>
                <button 
                  onClick={() => setShowComplianceModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Compliance Item
                </button>
              </div>

              <div className="grid gap-4">
                {complianceItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h4 className="text-lg font-medium text-gray-900">{item.type}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <div className="flex items-center">
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1 text-sm text-gray-600">{item.priority}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{item.description}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Due Date</p>
                            <p className="text-sm text-gray-900">{new Date(item.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Applies To</p>
                            <p className="text-sm text-gray-900">{item.vehicleId || item.driverId || 'Fleet'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                            <p className="text-sm text-gray-900">
                              {Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Inventory Item Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Add New Inventory Item</h3>
                <button
                  onClick={() => setShowInventoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Item Name */}
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      name="itemName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter item name"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="Fluids">Fluids</option>
                      <option value="Brake System">Brake System</option>
                      <option value="Engine">Engine</option>
                      <option value="Transmission">Transmission</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Tires">Tires</option>
                      <option value="Tools">Tools</option>
                      <option value="Body Parts">Body Parts</option>
                      <option value="Safety Equipment">Safety Equipment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Current Stock */}
                  <div>
                    <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
                      Current Stock *
                    </label>
                    <input
                      type="number"
                      id="currentStock"
                      name="currentStock"
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Maximum Stock */}
                  <div>
                    <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700">
                      Maximum Stock *
                    </label>
                    <input
                      type="number"
                      id="maxStock"
                      name="maxStock"
                      required
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>

                  {/* Minimum Stock */}
                  <div>
                    <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
                      Minimum Stock *
                    </label>
                    <input
                      type="number"
                      id="minStock"
                      name="minStock"
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                      Unit *
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select unit</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Quarts">Quarts</option>
                      <option value="Gallons">Gallons</option>
                      <option value="Liters">Liters</option>
                      <option value="Sets">Sets</option>
                      <option value="Pairs">Pairs</option>
                      <option value="Kits">Kits</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Feet">Feet</option>
                      <option value="Meters">Meters</option>
                    </select>
                  </div>

                  {/* Cost Per Unit */}
                  <div>
                    <label htmlFor="costPerUnit" className="block text-sm font-medium text-gray-700">
                      Cost Per Unit ($) *
                    </label>
                    <input
                      type="number"
                      id="costPerUnit"
                      name="costPerUnit"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Supplier */}
                  <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                      Supplier *
                    </label>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  {/* Supplier Contact */}
                  <div>
                    <label htmlFor="supplierContact" className="block text-sm font-medium text-gray-700">
                      Supplier Contact
                    </label>
                    <input
                      type="text"
                      id="supplierContact"
                      name="supplierContact"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phone or email"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Storage Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Warehouse location/shelf"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="On Order">On Order</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes or specifications"
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowInventoryModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Work Order Modal */}
      {showWorkOrderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Work Order</h3>
                <button
                  onClick={() => setShowWorkOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Work Order Type */}
                    <div>
                      <label htmlFor="workOrderType" className="block text-sm font-medium text-gray-700">
                        Work Order Type *
                      </label>
                      <select
                        id="workOrderType"
                        name="workOrderType"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select type</option>
                        <option value="Preventive Maintenance">Preventive Maintenance</option>
                        <option value="Corrective Maintenance">Corrective Maintenance</option>
                        <option value="Emergency Repair">Emergency Repair</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Modification">Modification</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Safety Check">Safety Check</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority *
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Vehicle and Assignment Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle & Assignment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Vehicle Selection */}
                    <div>
                      <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
                        Vehicle *
                      </label>
                      <select
                        id="vehicleId"
                        name="vehicleId"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select vehicle</option>
                        <option value="TMS-001">TMS-001 - Truck Alpha</option>
                        <option value="TMS-002">TMS-002 - Van Charlie</option>
                        <option value="TMS-003">TMS-003 - Van Beta</option>
                        <option value="TMS-004">TMS-004 - Truck Delta</option>
                        <option value="TMS-005">TMS-005 - Truck Gamma</option>
                      </select>
                    </div>

                    {/* Assigned Technician */}
                    <div>
                      <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                        Assigned Technician *
                      </label>
                      <select
                        id="assignedTo"
                        name="assignedTo"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select technician</option>
                        <option value="Mike Rodriguez">Mike Rodriguez</option>
                        <option value="Sarah Chen">Sarah Chen</option>
                        <option value="Alex Johnson">Alex Johnson</option>
                        <option value="David Wilson">David Wilson</option>
                        <option value="Lisa Martinez">Lisa Martinez</option>
                      </select>
                    </div>

                    {/* Current Mileage */}
                    <div>
                      <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-700">
                        Current Mileage
                      </label>
                      <input
                        type="number"
                        id="currentMileage"
                        name="currentMileage"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter current mileage"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Scheduling</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Start Date */}
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Estimated Hours */}
                    <div>
                      <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                        Estimated Hours *
                      </label>
                      <input
                        type="number"
                        id="estimatedHours"
                        name="estimatedHours"
                        required
                        min="0.5"
                        step="0.5"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Hours"
                      />
                    </div>

                    {/* Estimated Labor Cost */}
                    <div>
                      <label htmlFor="estimatedLaborCost" className="block text-sm font-medium text-gray-700">
                        Est. Labor Cost ($)
                      </label>
                      <input
                        type="number"
                        id="estimatedLaborCost"
                        name="estimatedLaborCost"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Description */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Work Description</h4>
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Work Order Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the work"
                      />
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Detailed Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed description of work to be performed, including specific tasks, procedures, and any special requirements..."
                      ></textarea>
                    </div>

                    {/* Safety Requirements */}
                    <div>
                      <label htmlFor="safetyRequirements" className="block text-sm font-medium text-gray-700">
                        Safety Requirements
                      </label>
                      <textarea
                        id="safetyRequirements"
                        name="safetyRequirements"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Special safety precautions, required PPE, lockout/tagout procedures..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Parts and Materials */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Parts & Materials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Required Parts */}
                    <div>
                      <label htmlFor="requiredParts" className="block text-sm font-medium text-gray-700">
                        Required Parts/Materials
                      </label>
                      <textarea
                        id="requiredParts"
                        name="requiredParts"
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="List required parts, quantities, part numbers..."
                      ></textarea>
                    </div>

                    {/* Estimated Parts Cost */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="estimatedPartsCost" className="block text-sm font-medium text-gray-700">
                          Est. Parts Cost ($)
                        </label>
                        <input
                          type="number"
                          id="estimatedPartsCost"
                          name="estimatedPartsCost"
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Parts Availability */}
                      <div>
                        <label htmlFor="partsAvailability" className="block text-sm font-medium text-gray-700">
                          Parts Availability
                        </label>
                        <select
                          id="partsAvailability"
                          name="partsAvailability"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Order Required">Order Required</option>
                          <option value="Backorder">Backorder</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      </div>

                      {/* Special Tools */}
                      <div>
                        <label htmlFor="specialTools" className="block text-sm font-medium text-gray-700">
                          Special Tools Required
                        </label>
                        <input
                          type="text"
                          id="specialTools"
                          name="specialTools"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Diagnostic equipment, special tools..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer/Requestor */}
                    <div>
                      <label htmlFor="requestor" className="block text-sm font-medium text-gray-700">
                        Requested By
                      </label>
                      <input
                        type="text"
                        id="requestor"
                        name="requestor"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Name of person requesting work"
                      />
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                        Contact Information
                      </label>
                      <input
                        type="text"
                        id="contactInfo"
                        name="contactInfo"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Phone number or email"
                      />
                    </div>

                    {/* Work Location */}
                    <div>
                      <label htmlFor="workLocation" className="block text-sm font-medium text-gray-700">
                        Work Location
                      </label>
                      <select
                        id="workLocation"
                        name="workLocation"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Main Shop">Main Shop</option>
                        <option value="Field Service">Field Service</option>
                        <option value="Customer Location">Customer Location</option>
                        <option value="Vendor Facility">Vendor Facility</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Reference Number */}
                    <div>
                      <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
                        Reference/PO Number
                      </label>
                      <input
                        type="text"
                        id="referenceNumber"
                        name="referenceNumber"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Purchase order or reference number"
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="mt-6">
                    <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any additional information, special instructions, or notes..."
                    ></textarea>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowWorkOrderModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Create Work Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Compliance Item Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-3/5 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Compliance Item</h3>
                <button
                  onClick={() => setShowComplianceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Compliance Type */}
                    <div>
                      <label htmlFor="complianceType" className="block text-sm font-medium text-gray-700">
                        Compliance Type *
                      </label>
                      <select
                        id="complianceType"
                        name="complianceType"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select compliance type</option>
                        <option value="DOT Inspection">DOT Inspection</option>
                        <option value="Vehicle Registration">Vehicle Registration</option>
                        <option value="Insurance Certificate">Insurance Certificate</option>
                        <option value="Driver License">Driver License</option>
                        <option value="CDL Medical Certificate">CDL Medical Certificate</option>
                        <option value="Drug & Alcohol Testing">Drug & Alcohol Testing</option>
                        <option value="Safety Training">Safety Training</option>
                        <option value="Emissions Testing">Emissions Testing</option>
                        <option value="Weight Station Permit">Weight Station Permit</option>
                        <option value="Hazmat Certification">Hazmat Certification</option>
                        <option value="Fleet Safety Audit">Fleet Safety Audit</option>
                        <option value="Operating Authority">Operating Authority</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority *
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                        <option value="Mandatory">Mandatory</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Not Applicable">Not Applicable</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Applicability Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Applicability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Applies To */}
                    <div>
                      <label htmlFor="appliesTo" className="block text-sm font-medium text-gray-700">
                        Applies To *
                      </label>
                      <select
                        id="appliesTo"
                        name="appliesTo"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select scope</option>
                        <option value="Entire Fleet">Entire Fleet</option>
                        <option value="Specific Vehicle">Specific Vehicle</option>
                        <option value="Specific Driver">Specific Driver</option>
                        <option value="Vehicle Class">Vehicle Class</option>
                        <option value="Department">Department</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>

                    {/* Vehicle Selection (if applicable) */}
                    <div>
                      <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
                        Vehicle (if applicable)
                      </label>
                      <select
                        id="vehicleId"
                        name="vehicleId"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select vehicle</option>
                        <option value="TMS-001">TMS-001 - Truck Alpha</option>
                        <option value="TMS-002">TMS-002 - Van Charlie</option>
                        <option value="TMS-003">TMS-003 - Van Beta</option>
                        <option value="TMS-004">TMS-004 - Truck Delta</option>
                        <option value="TMS-005">TMS-005 - Truck Gamma</option>
                      </select>
                    </div>

                    {/* Driver Selection (if applicable) */}
                    <div>
                      <label htmlFor="driverId" className="block text-sm font-medium text-gray-700">
                        Driver (if applicable)
                      </label>
                      <select
                        id="driverId"
                        name="driverId"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select driver</option>
                        <option value="DRV-001">John Smith (DRV-001)</option>
                        <option value="DRV-002">Maria Garcia (DRV-002)</option>
                        <option value="DRV-003">David Johnson (DRV-003)</option>
                        <option value="DRV-004">Sarah Wilson (DRV-004)</option>
                        <option value="DRV-005">Michael Brown (DRV-005)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Timeline & Scheduling</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Issue Date */}
                    <div>
                      <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        id="issueDate"
                        name="issueDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Renewal Date */}
                    <div>
                      <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700">
                        Renewal Date
                      </label>
                      <input
                        type="date"
                        id="renewalDate"
                        name="renewalDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Reminder Days */}
                    <div>
                      <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700">
                        Reminder (Days Before)
                      </label>
                      <input
                        type="number"
                        id="reminderDays"
                        name="reminderDays"
                        min="1"
                        max="365"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Compliance Details</h4>
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Compliance Item Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of compliance requirement"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Detailed Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed description of compliance requirements, procedures, and any special instructions..."
                      ></textarea>
                    </div>

                    {/* Regulatory Authority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="regulatoryAuthority" className="block text-sm font-medium text-gray-700">
                          Regulatory Authority
                        </label>
                        <select
                          id="regulatoryAuthority"
                          name="regulatoryAuthority"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select authority</option>
                          <option value="DOT">Department of Transportation (DOT)</option>
                          <option value="FMCSA">Federal Motor Carrier Safety Administration (FMCSA)</option>
                          <option value="EPA">Environmental Protection Agency (EPA)</option>
                          <option value="OSHA">Occupational Safety and Health Administration (OSHA)</option>
                          <option value="State DMV">State Department of Motor Vehicles</option>
                          <option value="Local Authority">Local Authority</option>
                          <option value="Insurance Company">Insurance Company</option>
                          <option value="Internal">Internal Company Policy</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="regulationNumber" className="block text-sm font-medium text-gray-700">
                          Regulation/Policy Number
                        </label>
                        <input
                          type="text"
                          id="regulationNumber"
                          name="regulationNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="CFR 49, DOT regulation number, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentation Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Documentation & Costs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Required Documents */}
                    <div>
                      <label htmlFor="requiredDocuments" className="block text-sm font-medium text-gray-700">
                        Required Documents
                      </label>
                      <textarea
                        id="requiredDocuments"
                        name="requiredDocuments"
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="List of required documents, certifications, forms to be completed..."
                      ></textarea>
                    </div>

                    <div className="space-y-4">
                      {/* Estimated Cost */}
                      <div>
                        <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
                          Estimated Cost ($)
                        </label>
                        <input
                          type="number"
                          id="estimatedCost"
                          name="estimatedCost"
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Compliance Officer */}
                      <div>
                        <label htmlFor="complianceOfficer" className="block text-sm font-medium text-gray-700">
                          Responsible Officer
                        </label>
                        <input
                          type="text"
                          id="complianceOfficer"
                          name="complianceOfficer"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Name of responsible compliance officer"
                        />
                      </div>

                      {/* Contact Information */}
                      <div>
                        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                          Contact Information
                        </label>
                        <input
                          type="text"
                          id="contactInfo"
                          name="contactInfo"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Phone number or email for compliance issues"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recurring & Notifications */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recurring & Notifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Recurring */}
                    <div>
                      <label htmlFor="isRecurring" className="block text-sm font-medium text-gray-700">
                        Recurring Requirement
                      </label>
                      <select
                        id="isRecurring"
                        name="isRecurring"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="false">One-time</option>
                        <option value="true">Recurring</option>
                      </select>
                    </div>

                    {/* Frequency */}
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                        Frequency (if recurring)
                      </label>
                      <select
                        id="frequency"
                        name="frequency"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select frequency</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Semi-annually">Semi-annually</option>
                        <option value="Annually">Annually</option>
                        <option value="Bi-annually">Bi-annually</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    {/* Auto-create Next */}
                    <div>
                      <label htmlFor="autoCreateNext" className="block text-sm font-medium text-gray-700">
                        Auto-create Next Item
                      </label>
                      <select
                        id="autoCreateNext"
                        name="autoCreateNext"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information, special circumstances, or notes about this compliance requirement..."
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowComplianceModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Compliance Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
